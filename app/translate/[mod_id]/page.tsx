"use client";

import { useEffect, useState } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

import { TextEntry, searchModEntries } from "../api";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { ResourceImage } from "@/app/search/archive/resource";
import { Progress } from "@nextui-org/progress";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";

export default function TranslatePage({
  params,
}: {
  params: { mod_id: string };
}) {
  const mod_id = parseInt(params.mod_id);
  const [data, setData] = useState<{
    query?: string;
    total_pages: number;
    paged_entries: Record<number, TextEntry[]>;
  }>();
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(0);

  function changePage(page: number) {
    if (!data) return;
    if (page < 0) return;
    if (page >= data.total_pages) return;

    setPage(page);
  }

  useEffect(() => {
    const skipFetch = data?.paged_entries[page] && data.query === query;
    if (skipFetch) {
      return;
    }

    let ignore = false;

    searchModEntries(mod_id, page, query).then((result) => {
      if (ignore) {
        return;
      }

      setData((data) => {
        return {
          query,
          total_pages: result.total_pages,
          paged_entries: { ...data?.paged_entries, [page]: result.entries },
        };
      });
    });

    return () => {
      ignore = true;
    };
  }, [mod_id, page, data, query]);

  const isLoaded = data?.paged_entries[page] !== undefined;

  return (
    <section className="h-full flex flex-row">
      <Card className="w-1/4" radius="none">
        <CardHeader>
          <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
            <div className="flex flex-row gap-2 justify-between">
              <ResourceImage
                url="https://cdn.modrinth.com/data/Xbc0uyRg/f9d7c09397588b690cf3c09303d7812837b2caab.png"
                name="Mod Logo"
                size={50}
              ></ResourceImage>
              <p className="text-lg font-bold">Create Fabric</p>
              <Progress
                className="w-[10rem]"
                value={72}
                label="翻譯進度"
                showValueLabel
              ></Progress>
            </div>
          </Skeleton>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {isLoaded && <EntriesList items={data.paged_entries[page]} />}
          {!isLoaded && <Skeleton className="h-full rounded-lg" />}
        </CardBody>
        <CardFooter className="flex justify-center mb-1">
          <ButtonGroup variant="ghost">
            <Button onPress={() => changePage(page - 1)}>上一頁</Button>
            <Button>
              {page + 1} / {data?.total_pages || 1}
            </Button>
            <Button onPress={() => changePage(page + 1)}>下一頁</Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
      <Card className="w-2/4" radius="none"></Card>
      <Card className="w-1/4" radius="none"></Card>
    </section>
  );
}

function EntriesList({ items }: { items: TextEntry[] }) {
  return (
    <Listbox
      hideSelectedIcon
      aria-label="Text Entries"
      items={items}
      selectionMode="single"
      itemClasses={{
        base: "data-[selected=true]:bg-default p-2",
        title: "text-md",
      }}
      defaultSelectedKeys={[items[0].key]}
    >
      {(item) => (
        <ListboxItem
          key={item.key}
          startContent={
            <div className="bg-default-500 h-3 w-3 rounded-sm"></div>
          }
        >
          {item.value}
        </ListboxItem>
      )}
    </Listbox>
  );
}
