'use client';

import Script from 'next/script';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Analytics Component
 * ====================
 * Loads Google Analytics 4, Google Tag Manager, and Microsoft Clarity.
 * Only renders scripts when the respective IDs are configured via env vars.
 * 
 * To activate, set these environment variables:
 * - NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 * - NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 * - NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
 */
export function Analytics() {
  const { googleAnalyticsId, googleTagManagerId, microsoftClarityId } =
    SITE_CONFIG.analytics;

  return (
    <>
      {/* ─── Google Tag Manager ─────────────────────────── */}
      {googleTagManagerId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${googleTagManagerId}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {/* ─── Google Analytics 4 ─────────────────────────── */}
      {googleAnalyticsId && !googleTagManagerId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                });
              `,
            }}
          />
        </>
      )}

      {/* ─── Microsoft Clarity ──────────────────────────── */}
      {microsoftClarityId && (
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${microsoftClarityId}");
            `,
          }}
        />
      )}
    </>
  );
}
