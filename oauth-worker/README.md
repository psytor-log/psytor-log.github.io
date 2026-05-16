# Decap CMS OAuth Worker

This Cloudflare Worker is the OAuth bridge for `/admin/`.

It keeps the GitHub OAuth client secret out of the public GitHub Pages site and sends a short-lived OAuth result back to Decap CMS.

## Required GitHub OAuth App

Create a GitHub OAuth App from:

```text
GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
```

Use these values after the Worker is deployed:

```text
Application name: What I Think CMS
Homepage URL: https://psytor-log-decap-oauth.<your-cloudflare-subdomain>.workers.dev
Authorization callback URL: https://psytor-log-decap-oauth.<your-cloudflare-subdomain>.workers.dev/callback
```

If you later use a custom domain for the OAuth bridge, change both URLs to that domain.

## Cloudflare deployment

Install/deploy with Wrangler:

```bash
npx wrangler login
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler secret put ALLOWED_GITHUB_LOGIN
npx wrangler deploy
```

`ALLOWED_GITHUB_LOGIN` should be your GitHub username. The Worker checks it after OAuth and rejects any other GitHub account.

After deployment, update `public/admin/config.yml`:

```yaml
backend:
  base_url: https://psytor-log-decap-oauth.<your-cloudflare-subdomain>.workers.dev
  auth_endpoint: auth
```

Then commit and push the config change.
