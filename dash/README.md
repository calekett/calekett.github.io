# dash — the control plane

Two pieces:

| Path | What it is | Lives where |
|---|---|---|
| `gaylab.me/dash/` | terminal **login gate** (`index.html` + `auth.js`) | public Pages |
| `dash.gaylab.me` | the **control plane hub** (`console/`) | see "Hosting" below |

On success the login redirects to `https://dash.gaylab.me/`.

> **Note:** because `console/` lives in this repo, it's *also* reachable (as a
> `noindex` preview) at `gaylab.me/dash/console/`. That preview is safe — it holds
> only MagicDNS placeholder names, no IPs or secrets — but the **real** deploy of
> the hub belongs on `dash.gaylab.me` behind a gate (below). Keep `dash.data.js`
> scrubbed to MagicDNS names so the preview never leaks anything.

## ⚠️ What the login gate is (and isn't)

`auth.js` checks the password **in the browser** with PBKDF2. That's a *deterrent*,
not a security boundary — the salt + hash ship to every visitor, and anyone can
skip the page and hit `dash.gaylab.me` directly. **The real lock is at
`dash.gaylab.me`** (next section). Never commit anything secret here; treat the
gate as a nice front door, nothing more.

### Change the password
1. Open `dash/setpass.html` in your browser (double-click the file, or visit
   `gaylab.me/dash/setpass.html`).
2. Type a new login + password → **generate**. It runs 100% locally; the password
   is never uploaded or logged.
3. Paste the generated `CONFIG { … }` block over the one in `dash/auth.js`.
4. Commit & push. (Default is `admin` / `changeme` — change it.)

## Hosting `dash.gaylab.me` — pick one

The hub in `console/` is plain static HTML, so any of these work. Ranked by how
much real protection they give:

### A. Cloudflare Tunnel + Access  ← recommended
Real edge auth (Google/GitHub SSO or email OTP), home IP stays hidden, valid TLS.
1. `cloudflared tunnel create gaylab` on a box at home; route `dash.gaylab.me`
   to wherever you serve `console/` (or straight at the self-hosted dashboard).
2. DNS: `CNAME dash → <tunnel-id>.cfargotunnel.com` (Cloudflare proxied/orange).
3. Cloudflare **Zero Trust → Access → Application**: self-hosted, `dash.gaylab.me`,
   policy = allow *your* email(s) only. Now every hit must pass Access first.
4. (Optional) keep the `gaylab.me/dash/` login too — it's just a themed doormat
   in front of the real Access login.

### B. Tailscale-only (most private)
`dash.gaylab.me` resolves **only on the tailnet** — the public internet can't see
it at all.
- Split-horizon: add `dash.gaylab.me → 100.x.y.z` (the host's Tailscale IP) in
  your tailnet DNS, or use the MagicDNS name directly.
- The public `gaylab.me/dash/` login then just points people at "get on the
  tailnet first." Off-tailnet, the redirect goes nowhere — exactly right.

### C. Second GitHub Pages repo (static, weakest)
Fastest to stand up, but public — the login gate is then the *only* thing in
front of it, so **don't** put real internal detail in `console/dash.data.js`.
1. New public repo `gaylab-dash`; copy `console/`'s files to its root. (The hub
   pulls `style.css` + `favicon.svg` from `gaylab.me` automatically — no need to
   copy them.)
2. Add a `CNAME` file containing `dash.gaylab.me`.
3. DNS: `CNAME dash → calekett.github.io.`
4. Settings → Pages → deploy from `main` / root; set custom domain `dash.gaylab.me`.

> Best of both: serve `console/` behind **A** or **B**. Use **C** only as a
> stopgap, and keep `dash.data.js` scrubbed to MagicDNS names.

## Edit the hub
`console/dash.data.js` is the file you touch: set your `tailnet` MagicDNS suffix,
then add/adjust `services` (dashboards) and `nodes` (hardware). Links are built as
`http://<host>.<tailnet>:<port><path>`, or set `url` for a literal one. Flip a
`status` to `online` and it lights up. No IPs needed — MagicDNS names are enough.

## Files
```
dash/
├── index.html        login gate
├── auth.js           PBKDF2 check + lockout + redirect  ← set CONFIG here
├── setpass.html      in-browser password generator (never leaves your machine)
├── README.md         this file
└── console/          the control-plane hub → dash.gaylab.me
    ├── index.html
    ├── dash.data.js  ← you edit (surfaces + nodes)
    └── dash.app.js
```
