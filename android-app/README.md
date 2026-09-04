# Mobile Market — Android app

Play Store–ready **Trusted Web Activity** for the live marketplace:

https://market-place-six-chi.vercel.app/

This is **not** a WebView wrapper. Google Play often rejects “website in a WebView” apps, and **Google AdSense is not allowed inside a WebView**. This app opens the real website in Chrome Custom Tabs (TWA), which:

- uses the same listings, cities, post-ad, edit, sold and delete flow
- keeps AdSense valid on the website (the supported way to earn from ads)
- meets current Play target API (35), HTTPS-only, no extra permissions

Package name: `pk.mobilemarket.app`  
App name: **Mobile Market**

## 1. Open in Android Studio

1. Install [Android Studio](https://developer.android.com/studio).
2. **Open** this folder (`Mobile-Market-Android`).
3. Let Gradle sync.
4. Run on a phone or emulator to preview.

Signing key is already in `keystore/` (see `keystore/password.txt`). Keep that folder private — if you lose it you cannot update the Play listing.

## 2. Build the file Play Console wants

Play Console accepts an **Android App Bundle (.aab)**, not a raw APK.

In Android Studio: **Build → Generate Signed App Bundle / APK → Android App Bundle**.

Use:

- keystore: `keystore/mobile-market-upload.jks`
- alias: `upload`
- passwords: `keystore/password.txt`

The file appears under `app/release/app-release.aab`.

## 3. Google Play Console (avoid common rejections)

Create the app named **Mobile Market**, package `pk.mobilemarket.app`.

| Play form | What to choose |
|---|---|
| App category | Shopping |
| Contains ads | **Yes** once AdSense is live on the site (No until then) |
| Privacy policy | `https://market-place-six-chi.vercel.app/privacy.html` |
| Target audience | 18+ is safest for a marketplace with seller phone numbers |
| Data safety | No account required to browse. Ads you post stay on the device. No location / contacts / files permission |
| Photos | High-res icon `play/hi-res-icon-512.png`, feature graphic `play/feature-graphic.png` |
| App signing | Enrol in Play App Signing (default). After first upload, copy the **App signing key certificate SHA-256** from Play Console → Setup → App signing, and add it to the website `.well-known/assetlinks.json` next to the upload-key fingerprint already there |

Do **not** add AdSense JavaScript inside a WebView. Do **not** copy another brand’s store listing.

## 4. Turn on AdSense (earn from ads)

1. Apply at [google.com/adsense](https://www.google.com/adsense) with the live website URL.
2. After approval, edit `js/ads-config.js` on the website:

```js
window.MW_ADS = {
  enabled: true,
  client: "ca-pub-YOUR_ID",
  slots: { home: "YOUR_HOME_SLOT", list: "YOUR_LIST_SLOT" }
};
```

3. Rename `ads.txt.example` → `ads.txt` with the line AdSense gives you.
4. In Play Console, set **Contains ads = Yes**.

Ads then show on the website **and** in the Android app, because the app displays that same site.

## 5. Why this passes policy

- TWA / Digital Asset Links (verified via `https://market-place-six-chi.vercel.app/.well-known/assetlinks.json`)
- HTTPS only
- Internet permission only
- Privacy policy URL
- No AdSense-in-WebView
- minSdk 26, targetSdk 35, 64-bit, no compressed JNI (16 KB page-size ready)
