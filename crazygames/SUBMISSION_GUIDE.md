# Pixel Battle — CrazyGames Submission Package

Everything you need to package and publish **Pixel Battle** on the CrazyGames developer portal.

## Repo
- GitHub: https://github.com/gunungbatuijo/pixel-battle (branch: `main`)
- Metadata: `crazygames/metadata.json`

---

## PART 1 — Build the game files

The game is a Vite + React SPA. The build outputs static files to `dist/`.

```bash
git clone https://github.com/gunungbatuijo/pixel-battle.git
cd pixel-battle
npm install
npm run build
```
This creates a `dist/` folder containing `index.html` + `assets/`.

---

## PART 2 — Test the build before zipping

Verify the production build loads with no login wall:
```bash
npm run build
npx serve dist      # or: npx http-server dist -p 3000
```
Open `http://localhost:3000`. You should land on the **Arcade** page and be able to play **Vs Bot** with no account. Confirm it works on a mobile-width window too.

---

## PART 3 — Create the ZIP

CrazyGames wants a ZIP whose **root contains `index.html`** (not a folder containing it).

### macOS
```bash
cd dist
zip -r ../pixel-battle.zip .
```
### Windows
1. Open the `dist` folder.
2. Select **all files inside it** (not the `dist` folder itself).
3. Right-click → *Compress to ZIP file* → rename to `pixel-battle.zip`.

### Verify
Unzip `pixel-battle.zip` to a temp folder. You should see `index.html` immediately — **not** `pixel-battle/index.html`. If you see a wrapper folder, re-zip the *contents* of `dist`, not the folder.

---

## PART 4 — Prepare portal assets

| Asset | Spec | Notes |
|------|------|-------|
| Cover image | 512×384 PNG | Key art |
| Thumbnails | 256×256 PNG | At least 1 |
| Screenshots | 1280×720 PNG | At least 2 (in-game action) |
| Gameplay video | MP4, <100MB, 15-60s | Shows a full fight / gauntlet |

Cover art (generated): https://media.base44.com/images/public/6a894c10a93a96a97b229b0e/23ce3da82_generated_image.png

To capture screenshots: run the game, enter a Vs Bot match, full-screen, and screenshot at the title, character select, mid-fight, and a victory/execute moment.

---

## PART 5 — Submit on the portal

1. Go to **https://developer.crazygames.com** and create a developer account.
2. Click **“Submit a game”**.
3. Upload `pixel-battle.zip`.
4. Fill in the form using the values from `crazygames/metadata.json`:
   - **Title:** Pixel Battle
   - **Slug:** pixel-battle
   - **Category:** Fighting
   - **Description:** (copy from metadata.json `description`)
   - **Controls:** keyboard (copy from `metadata.json → controls`)
   - **Orientation:** Landscape
   - **Players:** 1-2
   - **Content rating:** Teen (stylized pixel violence, blood, finishers)
5. Upload the cover, thumbnails, screenshots, and gameplay video.
6. Use the portal’s **preview/QA tool** to confirm the game loads and plays.
7. Choose **Basic Launch** (no SDK, no ads). Submit for review.
8. If selected for **Full Launch**, integrate the CrazyGames HTML5 SDK for ad revenue — do that only when invited.

---

## PART 6 — Common issues & fixes

- **Blank page / 404 on reload:** ensure the zip root has `index.html` and assets are relative. Vite produces relative paths by default — no `base` change needed.
- **Login page appears:** you zipped the wrong build, or the root route isn’t the Arcade. Re-run `npm run build` and confirm `dist/index.html` is the latest.
- **Backend errors in console:** harmless for arcade players (leaderboard/auth calls fail silently). Local play is unaffected.
- **File too large:** the bundle is well under CrazyGames’ limits; no action needed.
- **Mobile controls:** the game is keyboard-first; for touch support, add on-screen controls later (not required for Basic Launch approval).

---

## Quick reference — the one-liner build + zip
```bash
git clone https://github.com/gunungbatuijo/pixel-battle.git && cd pixel-battle && npm install && npm run build && cd dist && zip -r ../pixel-battle.zip . && cd ..
```
Then upload `pixel-battle.zip` to the CrazyGames developer portal.