"use client";

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

import { CurseForgeIcon, ModrinthIcon, SearchIcon } from "@/components/icons";
import { ResourceImage } from "./archive/resource";
import ArchiveDataModal from "./archive/modal";
import { Spinner } from "@nextui-org/spinner";
import { useSearchMods } from "@/api/search";

export default function SearchPage() {
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { data, error, isLoading, mutate } = useSearchMods(page, query);

  let openModal = useSearchParams().get("modal") === "data-collection";
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure({
    defaultOpen: openModal,
    onClose: () => mutate(),
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.total_pages);
    }
  }, [data]);

  function ModList() {
    if (isLoading || !data || error) {
      return <Spinner className="w-full" label="載入中" size="lg" />;
    }

    if (data.mods.length === 0) {
      return (
        <p className="text-center">
          找不到名為「{query}」的模組。
          <br />
          可能是因為該模組未收錄於本平臺的資料庫內，建議您可以
          <Link className="cursor-pointer" onPress={onOpen}>
            嘗試建檔
          </Link>
          該模組。
        </p>
      );
    }

    return (
      <section className="w-full flex flex-col gap-2">
        {data.mods.map((mod) => (
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
        openModal={onOpen}
      />
      {totalPages > 0 && (
        <Pagination
          total={totalPages}
          initialPage={1}
          page={page + 1}
          size="lg"
          onChange={(page) => setPage(page - 1)}
        />
      )}
      <ModList />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        size="4xl"
        backdrop="blur"
        scrollBehavior="normal"
        hideCloseButton
        isDismissable={false}
      >
        <ArchiveDataModal />
      </Modal>
    </div>
  );
}

function SearchFilter({
  onQueryChanged,
  openModal,
}: {
  onQueryChanged: (value: string) => void;
  openModal: () => void;
}): JSX.Element {
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
            <Button onPress={openModal}>建檔更多資料</Button>
          </Tooltip>
        </div>
      </CardBody>
    </Card>
  );
}
