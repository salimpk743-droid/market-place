"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { safeInternalPath } from "@/lib/market/site";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.4-1.1 2.6-2.4 3.4v2.8h3.8c2.3-2.1 3.6-5.2 3.6-8.3z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.8c-1.1.7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3c2 4 6.1 6.5 10.7 6.5z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.5c-.2-.7-.4-1.4-.4-2.1s.1-1.5.4-2.1V7.2H1.3C.5 8.8 0 10.4 0 12.4s.5 3.6 1.3 5.2l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.3 2.5 1.3 6.5l4 3.1C6.2 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
  );
}

function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function publicOrigin() {
  const host = window.location.hostname;
  if (host === "mobilemarket.pk" || host === "www.mobilemarket.pk") return "https://mobilemarket.pk";
  return window.location.origin;
}

function oauthRedirect(next: string) {
  const dest = safeInternalPath(next, "/my-ads");
  return `${publicOrigin()}/auth/callback?next=${encodeURIComponent(dest)}`;
}

export function GoogleButton({
  next = "/my-ads",
  label = "Continue with Gmail",
}: {
  next?: string;
  label?: string;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function startGoogle() {
    setError("");
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Accounts are not connected yet.");
      return;
    }
    setBusy(true);
    const { data, error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: oauthRedirect(next),
        skipBrowserRedirect: true,
        queryParams: { prompt: "select_account", access_type: "online" },
      },
    });
    if (err || !data?.url) {
      setBusy(false);
      setError(err?.message || "Could not start Google sign-in.");
      return;
    }
    const target = window.top ?? window;
    target.location.assign(data.url);
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={startGoogle} disabled={busy} className="btn btn-ghost w-full gap-2">
        <GoogleMark />
        {busy ? "Opening Google…" : label}
      </button>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function RegisterForm({ next = "/my-ads" }: { next?: string }) {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const dest = safeInternalPath(next, "/my-ads");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const displayName = String(form.get("name") || "");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Accounts are not connected yet.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: oauthRedirect(dest),
      },
    });
    setBusy(false);
    if (err) setError(err.message);
    else setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-md border border-line bg-brand-soft p-4 text-sm text-brand-ink">
        Check your email to confirm your account, then sign in. If you do not see it, look in spam. You can also use
        Gmail next time without a password.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleButton next={dest} label="Continue with Gmail" />
      <AuthDivider />
      <form onSubmit={onSubmit} method="post" className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? "Creating…" : "Create account with email"}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link className="link" href={`/login?next=${encodeURIComponent(dest)}`}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export function LoginForm({ next = "/my-ads" }: { next?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dest = safeInternalPath(next, "/my-ads");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Accounts are not connected yet.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    });
    setBusy(false);
    if (err) setError(err.message);
    else {
      router.push(dest);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <GoogleButton next={dest} label="Continue with Gmail" />
      <AuthDivider />
      <form onSubmit={onSubmit} method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? "Signing in…" : "Sign in with email"}
        </button>
        <p className="text-center text-sm text-muted">
          <Link className="link" href="/forgot-password">
            Forgot password
          </Link>
          {" · "}
          <Link className="link" href={`/register?next=${encodeURIComponent(dest)}`}>
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export function ForgotForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Accounts are not connected yet.");
      return;
    }
    const email = String(new FormData(e.currentTarget).get("email") || "");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${publicOrigin()}/auth/update-password`,
    });
    if (err) setError(err.message);
    else setDone(true);
  }
  if (done) {
    return (
      <p className="rounded-md border border-line bg-brand-soft p-4 text-sm text-brand-ink">
        If that email exists, a reset link is on its way.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} method="post" className="space-y-4">
      <label htmlFor="email" className="label">
        Email
      </label>
      <input id="email" name="email" type="email" required className="input" />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button className="btn btn-primary w-full">Send reset link</button>
    </form>
  );
}

export function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const supabase = createBrowserSupabase();
    if (!supabase) return;
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) setError(err.message);
    else router.push("/account");
  }
  return (
    <form onSubmit={onSubmit} method="post" className="space-y-4">
      <label htmlFor="password" className="label">
        New password
      </label>
      <input id="password" name="password" type="password" minLength={8} required className="input" />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button className="btn btn-primary w-full">Update password</button>
    </form>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={async () => {
        const supabase = createBrowserSupabase();
        await supabase?.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
