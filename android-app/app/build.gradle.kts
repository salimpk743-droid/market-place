import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val keystoreProps = Properties()
val keystorePropsFile = rootProject.file("keystore/keystore.properties")
if (keystorePropsFile.exists()) {
    keystorePropsFile.inputStream().use { keystoreProps.load(it) }
}

fun propOrEnv(key: String, env: String): String? =
    System.getenv(env)?.takeIf { it.isNotBlank() }
        ?: keystoreProps.getProperty(key)?.takeIf { it.isNotBlank() }

android {
    namespace = "pk.mobilemarket.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "pk.mobilemarket.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
        resourceConfigurations += listOf("en", "ur")
    }

    signingConfigs {
        val store = propOrEnv("storeFile", "MM_STORE_FILE")
        val storePassword = propOrEnv("storePassword", "MM_STORE_PASSWORD")
        val keyAlias = propOrEnv("keyAlias", "MM_KEY_ALIAS")
        val keyPassword = propOrEnv("keyPassword", "MM_KEY_PASSWORD")
        if (store != null && storePassword != null && keyAlias != null && keyPassword != null) {
            create("release") {
                storeFile = file(store)
                this.storePassword = storePassword
                this.keyAlias = keyAlias
                this.keyPassword = keyPassword
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.findByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    packaging {
        jniLibs {
            useLegacyPackaging = false
        }
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("androidx.browser:browser:1.8.0")
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.6.1")
    implementation("com.google.android.material:material:1.12.0")
}
