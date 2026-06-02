const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (url.pathname === "/") {
      return html("Decap CMS OAuth bridge is running.");
    }

    if (url.pathname === "/auth") {
      return handleAuth(request, env);
    }

    if (url.pathname === "/callback") {
      return handleCallback(request, env);
    }

    if (url.pathname === "/hit") {
      return handleHit(request, env);
    }

    if (url.pathname === "/count") {
      return handleCount(env);
    }

    return new Response("Not found", { status: 404, headers: corsHeaders(env) });
  }
};

function handleAuth(request, env) {
  requireEnv(env, ["GITHUB_OAUTH_ID"]);

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/callback`;
  const state = encodeState({
    site: url.searchParams.get("site_id") || env.SITE_URL || "",
    at: Date.now()
  });

  const githubUrl = new URL(GITHUB_AUTHORIZE_URL);
  githubUrl.searchParams.set("client_id", env.GITHUB_OAUTH_ID);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", env.GITHUB_SCOPE || "public_repo");
  githubUrl.searchParams.set("state", state);

  return Response.redirect(githubUrl.toString(), 302);
}

async function handleCallback(request, env) {
  requireEnv(env, ["GITHUB_OAUTH_ID", "GITHUB_OAUTH_SECRET"]);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return oauthResult("error", { error, error_description: url.searchParams.get("error_description") || "" }, env);
  }

  if (!code) {
    return oauthResult("error", { error: "missing_code" }, env);
  }

  const token = await exchangeCodeForToken({
    code,
    clientId: env.GITHUB_OAUTH_ID,
    clientSecret: env.GITHUB_OAUTH_SECRET,
    redirectUri: `${url.origin}/callback`
  });

  if (env.ALLOWED_GITHUB_LOGIN) {
    const login = await fetchGitHubLogin(token);
    if (login.toLowerCase() !== env.ALLOWED_GITHUB_LOGIN.toLowerCase()) {
      return oauthResult("error", {
        error: "unauthorized_user",
        error_description: `GitHub user ${login} is not allowed to edit this site.`
      }, env);
    }
  }

  return oauthResult("success", { token, provider: "github" }, env);
}

async function exchangeCodeForToken({ code, clientId, clientSecret, redirectUri }) {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "psytor-log-decap-oauth"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  const result = await response.json();

  if (!response.ok || !result.access_token) {
    throw new Error(result.error_description || result.error || "GitHub token exchange failed");
  }

  return result.access_token;
}

async function fetchGitHubLogin(token) {
  const response = await fetch(GITHUB_USER_URL, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "user-agent": "psytor-log-decap-oauth"
    }
  });

  const result = await response.json();

  if (!response.ok || !result.login) {
    throw new Error("Unable to verify GitHub user.");
  }

  return result.login;
}

function oauthResult(status, content, env = {}) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const allowedOrigin = siteOrigin(env);
  return html(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>GitHub OAuth</title>
  </head>
  <body>
    <script>
      (function () {
        const allowedOrigin = ${JSON.stringify(allowedOrigin)};
        function receiveMessage(event) {
          if (!window.opener || event.source !== window.opener || event.origin !== allowedOrigin) {
            return;
          }
          window.opener.postMessage(${JSON.stringify(message)}, allowedOrigin);
          window.close();
        }
        window.addEventListener("message", receiveMessage, false);
        if (window.opener) {
          window.opener.postMessage("authorizing:github", allowedOrigin);
        }
      })();
    </script>
    <p>Authentication complete. You can close this window.</p>
  </body>
</html>`);
}

function siteOrigin(env = {}) {
  try {
    return new URL(env.SITE_URL || "https://psytor-log.github.io").origin;
  } catch {
    return "https://psytor-log.github.io";
  }
}

function encodeState(value) {
  return btoa(JSON.stringify(value));
}

function requireEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Worker secret: ${missing.join(", ")}`);
  }
}

function html(body) {
  return new Response(body, {
    headers: {
      ...corsHeaders(),
      "content-type": "text/html; charset=utf-8"
    }
  });
}

function corsHeaders(env = {}) {
  return {
    "access-control-allow-origin": env.SITE_URL || "https://psytor-log.github.io",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

function kstDateString() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function isBotUserAgent(ua = "") {
  return /bot|crawler|spider|crawling|preview|fetcher|monitor/i.test(ua);
}

async function readCounters(env) {
  if (!env.VISITOR) {
    throw new Error("Missing KV binding: VISITOR");
  }
  const todayKey = `today:${kstDateString()}`;
  const [todayRaw, totalRaw] = await Promise.all([
    env.VISITOR.get(todayKey),
    env.VISITOR.get("total")
  ]);
  return {
    todayKey,
    today: Number(todayRaw || 0),
    total: Number(totalRaw || 0)
  };
}

async function handleHit(request, env) {
  if (!env.VISITOR) {
    throw new Error("Missing KV binding: VISITOR");
  }

  const counters = await readCounters(env);
  const ua = request.headers.get("user-agent") || "";
  const noCount =
    new URL(request.url).searchParams.get("nocount") === "1" || isBotUserAgent(ua);

  if (noCount) {
    return jsonResponse({ today: counters.today, total: counters.total, counted: false }, env);
  }

  // Unique-visitor gate: count each visitor at most once per KST day.
  // We dedup on a SHA-256 hash of IP + User-Agent (raw IP is never stored),
  // so page reloads/refreshes by the same visitor no longer inflate the count.
  // The "seen" marker expires at KST midnight, in step with the daily counter,
  // so the same visitor is counted again the next day.
  const seenKey = `seen:${counters.todayKey.slice("today:".length)}:${await visitorHash(request)}`;
  const alreadyCounted = await env.VISITOR.get(seenKey);

  if (alreadyCounted) {
    return jsonResponse({ today: counters.today, total: counters.total, counted: false }, env);
  }

  const today = counters.today + 1;
  const total = counters.total + 1;
  await Promise.all([
    env.VISITOR.put(counters.todayKey, String(today), {
      expirationTtl: 60 * 60 * 24 * 7
    }),
    env.VISITOR.put("total", String(total)),
    env.VISITOR.put(seenKey, "1", {
      expirationTtl: secondsUntilKstMidnight()
    })
  ]);

  return jsonResponse({ today, total, counted: true }, env);
}

// Stable per-visitor identifier for daily dedup. Hashes IP + User-Agent with
// SHA-256 and keeps 32 hex chars — enough to avoid collisions for a personal
// site while never persisting the raw IP address.
async function visitorHash(request) {
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";
  const ua = request.headers.get("user-agent") || "";
  const data = new TextEncoder().encode(`${ip}|${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex.slice(0, 32);
}

// Seconds remaining until the next KST midnight (>= 60, the KV minimum TTL).
// Aligns the "seen" marker expiry with the daily counter rollover.
function secondsUntilKstMidnight() {
  const dayMs = 24 * 60 * 60 * 1000;
  const kstNowMs = Date.now() + 9 * 60 * 60 * 1000;
  const msUntilEnd = dayMs - (kstNowMs % dayMs);
  return Math.max(60, Math.ceil(msUntilEnd / 1000));
}

async function handleCount(env) {
  const counters = await readCounters(env);
  return jsonResponse({ today: counters.today, total: counters.total }, env);
}

function jsonResponse(data, env) {
  return new Response(JSON.stringify(data), {
    headers: {
      ...corsHeaders(env),
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
