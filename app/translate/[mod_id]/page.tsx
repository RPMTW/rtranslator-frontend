"use client";

import "material-symbols";

import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Progress } from "@nextui-org/progress";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";

import { ResourceImage } from "@/app/search/archive/resource";
import { ModMetadata } from "@/types/minecraft_mod";
import { TextEntry } from "@/types/text_entry";
import { useModEntries } from "@/api/search";
import { getModMetadata } from "@/api/metadata";
import { Divider } from "@nextui-org/divider";
import { Textarea } from "@nextui-org/input";

export default function TranslatePage({
  params,
}: {
  params: { mod_id: string };
}) {
  const mod_id = parseInt(params.mod_id);
  const [metadata, setMetadata] = useState<ModMetadata>();
  const [selected, setSelected] = useState<TextEntry>();

  useEffect(() => {
    getModMetadata(mod_id).then((result) => {
      setMetadata(result);
    });

    return () => {
      setMetadata(undefined);
    };
  }, [mod_id]);

  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number>();
  const { data, isLoading } = useModEntries(mod_id, page, query);

  useEffect(() => {
    if (data) {
      setTotalPages(data.total_pages);

      if (!selected || !data.entries.includes(selected)) {
        setSelected(data.entries[0]);
      }
    }
  }, [data, selected]);

  function changePage(page: number) {
    if (!totalPages || page >= totalPages) return;
    if (page < 0) return;

    setPage(page);
  }

  return (
    <Card className="flex flex-row h-full">
      <Card className="w-1/4 h-full px-4 py-2">
        <CardHeader>
          <Skeleton isLoaded={metadata != null} className="rounded-lg w-full">
            <div className="flex flex-row justify-between gap-4">
              <ResourceImage
                url={metadata?.image_url}
                name="Mod Logo"
                size={50}
              ></ResourceImage>
              <Progress
                value={72}
                label={metadata?.name + " 翻譯進度"}
                showValueLabel
              ></Progress>
              <Tooltip content="分享連結">
                <Button
                  isIconOnly
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${location.host}/translate/${mod_id}`
                    )
                  }
                >
                  <span className="material-symbols-outlined">share</span>
                </Button>
              </Tooltip>
            </div>
          </Skeleton>
        </CardHeader>
        <div className="flex h-full flex-col justify-between overflow-y-auto">
          {isLoading ? (
            <Skeleton className="rounded-lg h-full" />
          ) : (
            <EntriesList
              entries={data!.entries}
              selected={selected}
              onSelect={setSelected}
            />
          )}
          <CardFooter className="flex justify-center mb-1">
            <ButtonGroup variant="ghost">
              <Button onPress={() => changePage(page - 1)}>上一頁</Button>
              <Button>
                {page + 1} / {totalPages || 1}
              </Button>
              <Button onPress={() => changePage(page + 1)}>下一頁</Button>
            </ButtonGroup>
          </CardFooter>
        </div>
      </Card>
      <Divider orientation="vertical" />
      <div className="w-2/4">
        {selected ? (
          <>
            <div className="h-1/3 px-4 py-2">
              <div className="h-1/2">
                <p className="text-md text-gray-400">文字條目翻譯</p>
                <h1 className="text-xl my-5">{selected.value}</h1>
                <p className="text-gray-400">識別碼：{selected.key}</p>
              </div>
              <div className="h-1/2">
                <p className="text-md text-gray-400">翻文</p>
                <Textarea size="lg" variant="faded"></Textarea>
              </div>
            </div>
          </>
        ) : (
          <Skeleton className="rounded-lg h-1/3" />
        )}
        <Divider />
        <div className="h-2/3 px-4 py-2">B Block</div>
      </div>
      <Divider orientation="vertical" />
      <div className="w-1/4 px-4 py-2">C</div>
    </Card>
  );
}

function EntriesList({
  entries,
  selected,
  onSelect,
}: {
  entries: TextEntry[];
  selected?: TextEntry;
  onSelect: (key: TextEntry) => void;
}) {
  return (
    <CardBody className="flex flex-col">
      {entries.map((item) => (
        <Button
          key={item.key}
          className="text-md"
          variant={item === selected ? "solid" : "light"}
          size="lg"
          radius="sm"
          startContent={
            <div className="bg-default-500 rounded-sm min-w-unit-3 h-3"></div>
          }
          onPress={() => onSelect(item)}
        >
          <p className="min-w-full overflow-hidden text-ellipsis text-left">
            {item.value}
          </p>
        </Button>
      ))}
    </CardBody>
  );
}
