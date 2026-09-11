import "server-only";

/** Dynamic lookup so Next.js cannot replace these with `undefined` at build time. */
export function readServerEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}
