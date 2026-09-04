# Mobile Market — Android app

Play Store–ready **Trusted Web Activity** for the live marketplace:

https://market-place-six-chi.vercel.app/

This is **not** a WebView wrapper. Google Play often rejects “website in a WebView” apps, and **Google AdSense is not allowed inside a WebView**. This app opens the real website in Chrome Custom Tabs (TWA), which:

- uses the same listings, cities, post-ad, edit, sold and delete flow
- keeps AdSense valid on the website (the supported way to earn from ads)
- targets Android 16 (API 36), HTTPS-only, no extra permissions

Package name: `pk.mobilemarket.app`  
App name: **Mobile Market**

**Build stack:** Android Gradle Plugin 8.11.1, Gradle 8.13, Kotlin 2.1.10, `compileSdk` / `targetSdk` 36.

## 1. Open in Android Studio

1. Install [Android Studio](https://developer.android.com/studio) (SDK Platform 36).
2. **Open** this folder.
3. Let Gradle sync.
4. Run on a phone or emulator to preview.

## 2. Signing (upload key)

The previous key and password files were retired. Passwords are **not** stored in this project.

1. Place `mobile-market-upload.jks` in `keystore/` (do not commit it).
2. Copy `keystore.example.properties` → `keystore/keystore.properties` and fill the passwords **on your machine only**.
3. Alias is `upload`.

`keystore/password.txt` and `keystore/keystore.properties` are gitignored. Do not put them in a zip you share.

In Android Studio you can also skip the properties file and use **Build → Generate Signed App Bundle**, then pick the `.jks` and type the password there.

If you lose the upload key you cannot ship updates under the same Play listing.

## 3. Build the file Play Console wants

Play Console accepts an **Android App Bundle (.aab)**, not a raw APK.

**Build → Generate Signed App Bundle / APK → Android App Bundle.**

The file appears under `app/release/app-release.aab`.

## 4. Google Play Console (avoid common rejections)

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

## 5. Turn on AdSense (earn from ads)

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

## 6. Why this passes policy

- TWA / Digital Asset Links (verified via `https://market-place-six-chi.vercel.app/.well-known/assetlinks.json`)
- HTTPS only
- Internet permission only
- Privacy policy URL
- No AdSense-in-WebView
- minSdk 26, targetSdk 36, 64-bit, no compressed JNI (16 KB page-size ready)
