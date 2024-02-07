"use client";

import { siteConfig } from "@/config/site";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const hasFooter = siteConfig.navItems.some((item) => item.href === pathname);

  if (!hasFooter) {
    return null;
  }

  return (
    <>
      <Divider className="mt-4"></Divider>
      <footer className="w-[70vw] flex flex-col py-3 text-default-600 text-center">
        NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH
        MOJANG.
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
              Copyright © 2024 RPMTW TEAM. All rights reserved.
            </span>
          </Link>
        </div>
      </footer>
    </>
  );
}
