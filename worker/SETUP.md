# Publishing to X from Philosophia — setup

One-tap posting of a symposium/conversation broadsheet to the project's X
account. The static site can't call X's API directly (no CORS, server-held
credentials required), so this tiny Cloudflare Worker does it. Everything here
is free unless X's media (image) upload turns out to need a paid tier — see the
last section. If you skip all of this, the app just keeps using the phone's
native share sheet.

## 1. Register an X developer app (free)

1. Go to the X Developer Portal → sign in **as @AtlasOfThought** → create a
   Project + App (Free tier).
2. In the app's **User authentication settings**, set app permissions to
   **Read and Write** (required to post). Type: "Web App / Automated App or Bot"
   is fine; callback URL can be `https://adamabu1.github.io/philosophia/`.
3. Open **Keys and tokens** and generate/copy all four:
   - **API Key** and **API Key Secret** (the "Consumer Keys")
   - **Access Token** and **Access Token Secret** — make sure these are
     generated **after** permissions are Read+Write, or the token will be
     read-only and posting 403s.

## 2. Deploy the Worker (free)

From `worker/`:

```bash
npx wrangler login          # opens a browser to authorize Cloudflare
npx wrangler deploy         # publishes the Worker, prints its URL
```

Then set the five secrets (each prompts for the value; nothing is written to
disk or git):

```bash
npx wrangler secret put X_CONSUMER_KEY
npx wrangler secret put X_CONSUMER_SECRET
npx wrangler secret put X_ACCESS_TOKEN
npx wrangler secret put X_ACCESS_SECRET
npx wrangler secret put PUBLISH_TOKEN     # invent a long random string
```

`PUBLISH_TOKEN` is the shared secret that stops the public site URL from posting
as you — pick something long and random (e.g. `openssl rand -hex 24`). Optional:
uncomment `X_HANDLE = "AtlasOfThought"` in `wrangler.toml` for canonical post
links, then `npx wrangler deploy` again.

## 3. Point the app at it

In Philosophia → the "Ask Philosophia" panel → **keys**:
- **Publish endpoint** = the Worker URL from step 2 (e.g.
  `https://philosophia-publish.<you>.workers.dev`)
- **Publish token** = the same `PUBLISH_TOKEN` string

Both are stored only in that browser, like the other keys. Now the **publish**
link in any conversation posts straight to X and returns the link. Unset either
field and it falls back to the share sheet.

## The one cost caveat

Posting **text** is free-tier. Posting the **image** (the whole point) uses
media upload, which on some current X tiers requires **Basic (~$100/mo)**. If
the free tier rejects it, the app shows the exact X error and automatically
falls back to the share sheet (which still carries the image). So you can deploy
this, try one real post for $0, and find out — with no commitment. If media is
gated, either pay for Basic or keep using the share sheet; the daily-line
text card would still post free.
