export type SiteConfig = typeof siteConfig;

const navItems = [
  {
    label: "首頁",
    href: "/",
  },
  {
    label: "翻譯",
    href: "/translate",
  },
  {
    label: "使用教學",
    href: "/tutorial",
  },
  {
    label: "銘謝",
    href: "/credits",
  },
  {
    label: "關於我們",
    href: "/about",
  },
];

export const siteConfig = {
  name: "RTranslator",
  description: "A modern and powerful translation tool for Minecraft mods.",
  navItems,
  navMenuItems: [
    ...navItems,
    {
      label: "個人檔案",
      href: "/profile",
    },
    {
      label: "設定",
      href: "/settings",
    },
    {
      label: "登出",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/RPMTW",
    discord: "https://discord.gg/5xApZtgV2u",
  },
};
