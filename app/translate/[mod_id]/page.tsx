"use client";

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
import { Tab, Tabs } from "@nextui-org/tabs";
import {
  IconBulbFilled,
  IconDots,
  IconMessage,
  IconShare3,
} from "@tabler/icons-react";

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
      <Card className="w-1/4 h-full px-4 py-2" radius="none">
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
                      `${location.host}/translate/${mod_id}?selected=${selected?.key}`
                    )
                  }
                >
                  <IconShare3 />
                </Button>
              </Tooltip>
            </div>
          </Skeleton>
        </CardHeader>
        <div className="flex h-full flex-col justify-between overflow-y-auto">
          {isLoading ? (<div className="p-3 space-y-3"><Skeleton className="h-14 mb-5 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /></div>
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
        {selected ? <TranslateSpace selected={selected} /> : <div className="p-5"><div className="space-y-3"><Skeleton className="h-6 w-[10rem] rounded-lg" /><Skeleton className="h-10 w-[90%] rounded-lg" /><Skeleton className="h-6 w-[25rem] rounded-lg" /></div><div></div></div>}
      </div>
      <Divider orientation="vertical" />
      <div className="w-1/4 px-4 py-2">
        <Tabs size="lg" variant="bordered" fullWidth>
          <Tab
            key="comments"
            title={
              <div className="flex items-center space-x-2">
                <IconMessage />
                <span>討論</span>
              </div>
            }
          ></Tab>
          <Tab
            key="tools"
            title={
              <div className="flex items-center space-x-2">
                <IconBulbFilled />
                <span>輔助工具</span>
              </div>
            }
          ></Tab>
          <Tab
            key="more"
            title={
              <div className="flex items-center space-x-2">
                <IconDots />
                <span>更多</span>
              </div>
            }
          ></Tab>
        </Tabs>
      </div>
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

function TranslateSpace({ selected }: { selected: TextEntry }) {
  return (<>
    <div>
      <div className="p-5">
        <p className="text-md text-gray-400">文字條目翻譯</p>
        <h1 className="text-xl py-2">{selected.value}</h1>
        <p className="text-gray-400 bottom-4">識別碼：{selected.key}</p>
      </div>
      <Divider />
      <div className="relative h-[8rem]">
        <textarea
          className="h-full w-full resize-none bg-default-100 px-4 py-2 outline-none"
          placeholder="請輸入譯文"
        ></textarea>
        <Button
          className="absolute bottom-3 right-4"
          variant="bordered"
        >
          儲存
        </Button>
      </div>
    </div>
    <Divider />
    <div className="px-4 py-2">B Block</div></>)
}
