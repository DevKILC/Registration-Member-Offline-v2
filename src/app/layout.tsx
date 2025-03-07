import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Registrasi language Center",
  description: "Registrasi Language Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="google-ads"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-10992316400');`,
          }}
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-10992316400"></Script>

        <Script
          id="tiktok-pixel"
          dangerouslySetInnerHTML={{
            __html: `!(function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = (w[t] = w[t] || []);
            (ttq.methods = [
              "page",
              "track",
              "identify",
              "instances",
              "debug",
              "on",
              "off",
              "once",
              "ready",
              "alias",
              "group",
              "enableCookie",
              "disableCookie",
            ]),
              (ttq.setAndDefer = function (t, e) {
                t[e] = function () {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                };
              });
            for (var i = 0; i < ttq.methods.length; i++)
              ttq.setAndDefer(ttq, ttq.methods[i]);
            (ttq.instance = function (t) {
              for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
                ttq.setAndDefer(e, ttq.methods[n]);
              return e;
            }),
              (ttq.load = function (e, n) {
                var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
                (ttq._i = ttq._i || {}),
                  (ttq._i[e] = []),
                  (ttq._i[e]._u = i),
                  (ttq._t = ttq._t || {}),
                  (ttq._t[e] = +new Date()),
                  (ttq._o = ttq._o || {}),
                  (ttq._o[e] = n || {});
                n = document.createElement("script");
                (n.type = "text/javascript"),
                  (n.async = !0),
                  (n.src = i + "?sdkid=" + e + "&lib=" + t);
                e = document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n, e);
              });

            ttq.load("C36MVV3521OGTSUK8B5G");
            ttq.page();
          })(window, document, "ttq");`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PL8Q9N7" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        {children}
        <Script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-PL8Q9N7');`,
          }}
        />
        <Script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `(function (c, l, a, r, i, t, y) {
                c[a] =
                  c[a] ||
                  function () {
                    (c[a].q = c[a].q || []).push(arguments);
                  };
                t = l.createElement(r);
                t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
              })(window, document, "clarity", "script", "8nxr4oja1w")`,
          }}
        />
        <Script
          id="pixel-meta-initialCheckout"
          dangerouslySetInnerHTML={{
            __html: `!(function (f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function () {
                    n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = "2.0";
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
              })(
                window,
                document,
                "script",
                "https://connect.facebook.net/en_US/fbevents.js"
              );
              fbq("init", "1881998885434766");
              fbq("trackCustom", "initiateCheckout");`,
          }}
        />
      </body>
    </html>
  );
}
