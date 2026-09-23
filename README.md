# Gift Tracker — Dept. of Birthday Affairs

One GitHub Pages site. Each lab member gets a unique passcode. Their page is AES-GCM encrypted with a key derived from that passcode, so a public repo cannot leak the message.

Live: https://thejoshbq.github.io/gift-tracker/

## How you use it

1. Add a person (creates `content/<slug>.json` with a generated passcode):

       python3 tools/build.py --new "Bella"

2. Edit that file. Pick an `act`, write the copy, optionally drop in a YouTube id.

3. Encrypt and write `vault.json`:

       python3 tools/build.py

4. Commit **only** the public files (`index.html`, `acts/`, `vault.json`, this README). `content/` is gitignored on purpose.

5. Hand them:
   - URL: `https://thejoshbq.github.io/gift-tracker/`
   - Passcode: whatever you set in their content file
   - Or a one-shot link: `https://thejoshbq.github.io/gift-tracker/#code=their-passcode`

Preview locally (modules will not load from `file://`):

    python3 -m http.server 8080
    # open http://127.0.0.1:8080/

## Content file shape

```json
{
  "name": "Bella",
  "passcode": "three-word-phrase",
  "act": "form-rr87",
  "headline": "HAPPY BIRTHDAY BELLA!",
  "subline": "Your gift: you just got rickrolled.",
  "message": ["Paragraph one.", "Paragraph two."],
  "media": { "type": "youtube", "id": "dQw4w9WgXcQ" },
  "footer": "Filed under Form RR-87",
  "processing": ["optional custom status lines for form-rr87"]
}
```

`passcode` never leaves your machine. The build strips it before encrypting.

Acts shipped:

- `form-rr87` — the original bureaucratic claim form → processing bar → reveal
- `broadcast` — fake live news bulletin

To add a look, drop a new `acts/<slug>.js` that `export default { css, render }` where `render(root, payload)` paints the page.

## Why encryption (not `if (password === ...)`)

This repo is public. A client-side string compare is just "view source." Each entry in `vault.json` is ciphertext. A wrong passcode fails every GCM tag, so the site cannot even tell you whose page you almost opened.

That is **not** a login system. Anyone who has the passcode can decrypt that one page. Treat passcodes like gift-card PINs: unique, not the person's name, not reused.

## Safety rails in `tools/build.py`

- Refuses to build if `content/` is not gitignored
- Refuses to build if git is already tracking a plaintext content file
- Rejects colliding / too-short / name-as-passcode codes
- Rejects unknown acts
