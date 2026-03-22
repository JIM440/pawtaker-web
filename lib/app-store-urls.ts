/**
 * Public App Store / Play Store URLs for marketing CTAs.
 * Set in `.env.local` (optional; defaults to `#` until published):
 *   NEXT_PUBLIC_IOS_APP_URL=https://apps.apple.com/app/id...
 *   NEXT_PUBLIC_ANDROID_APP_URL=https://play.google.com/store/apps/details?id=...
 */
export function getAppStoreUrls() {
  return {
    ios: process.env.NEXT_PUBLIC_IOS_APP_URL?.trim() || '#',
    android: process.env.NEXT_PUBLIC_ANDROID_APP_URL?.trim() || '#',
  };
}

export function externalLinkProps(href: string) {
  if (!href.startsWith('http')) {
    return {};
  }
  return {
    target: '_blank' as const,
    rel: 'noopener noreferrer',
  };
}
