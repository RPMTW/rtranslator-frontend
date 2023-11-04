import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { Divider } from "@nextui-org/divider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col items-center">
            <Navbar />
            <main className="container mx-auto max-w-7xl px-6 flex-grow">
              {children}
            </main>
            <Divider className="mt-4"></Divider>
            <footer className="w-[70vw] flex flex-col text-default-600 text-center py-3">
              NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED
              WITH MOJANG.
              <br />
              All trademarks are the property of their respective owners.
              <br />
              <div className="flex flex-row justify-between px-6 py-5">
                <div className="flex flex-row gap-3 text-default-500">
                  <Link href="/legal/terms" className="text-current">
                    服務條款
                  </Link>
                  <Link href="/legal/privacy" className="text-current">
                    隱私權政策
                  </Link>
                  <Link href="/legal/translation-license" className="text-current">
                    翻譯內容之授權條款
                  </Link>
                </div>
                <Link
                  isExternal
                  href="https://rpmtw.com"
                  title="RPMTW Official Website"
                >
                  <span className="text-default-600 font-semibold">
                    Copyright © 2023 RPMTW TEAM. All rights reserved.
                  </span>
                </Link>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
