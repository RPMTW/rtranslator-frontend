import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { DiscordIcon, SearchIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 py-8 md:py-4">
      <section className="flex flex-row h-[80vh] items-center justify-center">
        <div className="text-center justify-center mr-5">
          <h1 className={title({ size: "lg", color: "violet" })}>R</h1>
          <h1 className={title({ size: "lg" })}>Translator</h1>
          <br />
          <h1 className={title({ size: "lg" })}>專為 Minecraft&nbsp;</h1>
          <h1 className={title({ size: "lg", color: "violet" })}>模組</h1>
          <br />
          <h1 className={title({ size: "lg", className: "mt-2" })}>
            設計的翻譯平臺
          </h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            簡潔有力、現代化且貼合模組譯者體驗的翻譯平臺。
          </h2>
        </div>

        <div className="flex flex-col gap-4 ml-5">
          <Link
            as={NextLink}
            href="/translate"
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
          >
            立即參與翻譯
          </Link>
          <div className="flex justify-center gap-3">
            <Link
              as={NextLink}
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href="/data-collection"
            >
              <SearchIcon size={20} />
              建檔更多模組資料
            </Link>
            <Link
              isExternal
              as={NextLink}
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.discord}
            >
              <DiscordIcon size={20} />
              加入譯者討論群
            </Link>
          </div>
        </div>
      </section>
      <Divider />
      <section className="flex flex-col mx-3 gap-5">
        <section>
          <h1 className={title({ size: "sm" })}>推薦模組</h1>
          <h2 className={subtitle()}>正在找有什麼模組可以協助翻譯嗎？</h2>
          <span>TODO</span>
        </section>
        <section>
          <h1 className={title({ size: "sm" })}>貢獻者</h1>
          <h2 className={subtitle()}>
            感激這些譯者不計報酬辛苦地完成這些模組翻譯，使大眾獲得更佳的遊戲體驗。
          </h2>
          <span>TODO</span>
        </section>
      </section>
    </div>
  );
}
