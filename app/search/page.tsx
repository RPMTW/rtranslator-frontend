"use client";

import { CurseForgeIcon, ModrinthIcon, SearchIcon } from "@/components/icons";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Modal, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Progress } from "@nextui-org/progress";
import { useSearchParams } from "next/navigation";

import { DatabaseMod, searchMods } from "./api";
import { ResourceImage } from "./archive/resource";
import ArchiveDataModal from "./archive/modal";
import { Spinner } from "@nextui-org/spinner";

export default function SearchPage() {
  const [data, setData] = useState<{
    query?: string;
    total_pages: number;
    paged_mods: Record<number, DatabaseMod[]>;
  }>();
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    const skipFetch = data?.paged_mods[page] && data.query === query;
    if (skipFetch) {
      return;
    }

    let ignore = false;

    searchMods(page, query).then((result) => {
      if (ignore) {
        return;
      }

      setData((data) => {
        return {
          query,
          total_pages: result.total_pages,
          paged_mods: { ...data?.paged_mods, [page]: result.mods },
        };
      });
    });

    return () => {
      ignore = true;
    };
  }, [page, data, query]);

  function ModList() {
    const mods = data?.paged_mods[page];
    if (!data || !mods) {
      return <Spinner label="載入中" size="lg" />;
    }

    if (mods.length === 0) {
      return (
        <p className="text-center">
          找不到名為「{query}」的模組。
          <br />
          可能是因為該模組未收錄於 RTranslator
          的資料庫內，建議您可以嘗試建檔該模組。
        </p>
      );
    }

    return (
      <section className="w-full flex flex-col gap-2">
        {mods.map((mod) => (
          <Card
            key={mod.id}
            className="flex flex-row justify-between items-center p-4 mx-3"
            radius="lg"
          >
            <section className="flex flex-row gap-3">
              <ResourceImage
                url={mod.image_url}
                name={mod.name}
                size={70}
              ></ResourceImage>
              <div className="flex flex-col gap-2 text-start">
                <h1 className="text-2xl font-bold">{mod.name}</h1>
                <h2>{mod.description}</h2>
              </div>
            </section>
            <section className="flex flex-row gap-5 items-center">
              <div className="flex flex-col gap-2 items-center">
                <div className="flex flex-row">
                  <Button
                    isDisabled={!mod.page_url.modrinth}
                    as={Link}
                    href={mod.page_url.modrinth}
                    isExternal
                    variant="light"
                    size="sm"
                    isIconOnly
                  >
                    <ModrinthIcon fill="currentColor" />
                  </Button>
                  <Button
                    isDisabled={!mod.page_url.curseforge}
                    as={Link}
                    href={mod.page_url.curseforge}
                    isExternal
                    variant="light"
                    size="sm"
                    isIconOnly
                  >
                    <CurseForgeIcon fill="currentColor" />
                  </Button>
                </div>
                <Tooltip
                  showArrow
                  placement="left"
                  color="primary"
                  content="翻譯進度：64%"
                >
                  <Progress
                    className="w-[5rem]"
                    color="primary"
                    value={64}
                    aria-label="Translation progress"
                  ></Progress>
                </Tooltip>
              </div>
              <Button
                as={Link}
                color="secondary"
                variant="shadow"
                href={`/translate/${mod.id}`}
              >
                翻譯
              </Button>
            </section>
          </Card>
        ))}
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <SearchFilter
        onQueryChanged={(value) => {
          setPage(0);
          setQuery(value);
        }}
      />
      {data && data.total_pages > 0 && (
        <Pagination
          total={data.total_pages}
          initialPage={1}
          page={page + 1}
          size="lg"
          onChange={(page) => setPage(page - 1)}
        />
      )}
      <ModList />
    </div>
  );
}

function SearchFilter({
  onQueryChanged,
}: {
  onQueryChanged: (value: string) => void;
}): JSX.Element {
  let openModal = useSearchParams().get("modal") === "data-collection";
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    defaultOpen: openModal,
  });

  return (
    <Card fullWidth>
      <CardBody className="flex flex-col sm:flex-row gap-3 justify-center">
        <Input
          className="max-w-sm"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          placeholder="搜尋模組..."
          aria-label="Search"
          type="search"
          onValueChange={onQueryChanged}
        />
        <div className="w-full flex flex-row max-w-[12rem] items-center gap-2">
          <span className="whitespace-nowrap">排序方式</span>
          <Select
            aria-label="Sort by"
            labelPlacement="outside"
            selectedKeys={["created_at"]}
          >
            <SelectItem key="created_at">收錄時間</SelectItem>
            <SelectItem key="updated">最後更新</SelectItem>
            <SelectItem key="translation_progress">翻譯進度</SelectItem>
          </Select>
        </div>
        <div>
          <Tooltip
            showArrow
            placement="right"
            color="primary"
            content="從各大模組平臺匯入您想翻譯的模組資料"
          >
            <Button onPress={onOpen}>建檔更多資料</Button>
          </Tooltip>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="4xl"
            backdrop="blur"
            scrollBehavior="normal"
            hideCloseButton
            isDismissable={false}
          >
            <ArchiveDataModal />
          </Modal>
        </div>
      </CardBody>
    </Card>
  );
}
