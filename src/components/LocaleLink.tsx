'use client';

import Link from 'next/link';
import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { localizePath } from '../lib/i18n';

type Props = React.ComponentProps<typeof Link>;

/** Drop-in replacement for next/link that keeps the current language in internal URLs. */
export default function LocaleLink({ href, ...rest }: Props) {
  const { language } = useAdmin();
  const localized =
    typeof href === 'string' && href.startsWith('/') && !href.startsWith('/api')
      ? localizePath(href, language)
      : href;
  return <Link href={localized} {...rest} />;
}
