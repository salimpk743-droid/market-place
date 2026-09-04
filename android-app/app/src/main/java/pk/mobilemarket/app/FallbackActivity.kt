package pk.mobilemarket.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.androidbrowserhelper.trusted.LauncherActivity

/**
 * Used only if Chrome Custom Tabs cannot start.
 * Opens the live site in the default browser — never a WebView —
 * so Google AdSense policy stays valid.
 */
class FallbackActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val url = intent?.data
            ?: Uri.parse(getString(R.string.host_url))
        startActivity(Intent(Intent.ACTION_VIEW, url).addCategory(Intent.CATEGORY_BROWSABLE))
        finish()
    }
}

/** Keep a compile-time reference so R8 does not strip TWA launcher usage. */
@Suppress("unused")
private val launcher = LauncherActivity::class.java
