import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://api.baserow.io" />
        <link rel="dns-prefetch" href="https://api.baserow.io" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

