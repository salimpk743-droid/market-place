export const YOUTUBE_URL = "https://www.youtube.com/@buildskillpk";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61595362311531";

/** Follow block shown on every page, just above the footer. */
export function FollowBlock() {
  return (
    <section aria-labelledby="follow-heading" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:py-12">
        <h2 id="follow-heading" className="text-xl font-semibold text-ink sm:text-2xl">
          Follow us on YouTube and Facebook for mobile tips and updates
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-brand px-8 text-lg font-semibold !text-white !no-underline hover:opacity-90 sm:w-auto"
          >
            Subscribe on YouTube
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full border-2 border-brand bg-surface px-8 text-lg font-semibold !text-brand-ink !no-underline hover:bg-brand-soft sm:w-auto"
          >
            Follow us on Facebook
          </a>
        </div>
      </div>
    </section>
  );
}
