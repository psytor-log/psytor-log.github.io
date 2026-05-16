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
    return oauthResult("error", { error, error_description: url.searchParams.get("error_description") || "" });
  }

  if (!code) {
    return oauthResult("error", { error: "missing_code" });
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
      });
    }
  }

  return oauthResult("success", { token, provider: "github" });
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

function oauthResult(status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  return html(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>GitHub OAuth</title>
  </head>
  <body>
    <script>
      (function () {
        function receiveMessage(event) {
          window.opener.postMessage(${JSON.stringify(message)}, event.origin);
          window.close();
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
    <p>Authentication complete. You can close this window.</p>
  </body>
</html>`);
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
