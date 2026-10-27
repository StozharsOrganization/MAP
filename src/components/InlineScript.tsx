'use client';

/**
 * Inline <script> that runs during HTML parsing (before first paint) on full page loads,
 * without React's "Encountered a script tag" warning on client renders.
 * See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export function InlineScript({ html, id }: { html: string; id?: string }) {
  return (
    <script
      id={id}
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
