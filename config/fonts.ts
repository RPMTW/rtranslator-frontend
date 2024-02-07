import {
  Fira_Code as FontMono,
  Noto_Sans_TC as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
