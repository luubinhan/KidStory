export const FEEDBACK_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdUrG4YCzchdWEcO483VBHxoq0DUP9okCckCJqNAPTHDKA5AQ/viewform?embedded=true";

export function isCourseFeedbackPage(pathname: string): boolean {
  if (pathname === "/course") return true;
  return /^\/course\/[^/]+$/.test(pathname);
}
