"use client";

import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";

export default function Logo({ size = 36 }) {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  const image =
    theme === "dark" || isSSR
      ? "/rpmtw-logo-white.png"
      : "/rpmtw-logo-black.png";

  return (
    <Image
      as={NextImage}
      src={image}
      width={size}
      height={size}
      alt="Logo"
    ></Image>
  );
}
