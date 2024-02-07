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
import { searchModEntries } from "@/api/search";
import { getModMetadata } from "@/api/metadata";

export default function TranslatePage({
  params,
}: {
  params: { mod_id: string };
}) {
  const mod_id = parseInt(params.mod_id);
  const [metadata, setMetadata] = useState<ModMetadata>();

  useEffect(() => {
    getModMetadata(mod_id).then((result) => {
      setMetadata(result);
    });

    return () => {
      setMetadata(undefined);
    };
  }, [mod_id]);

  return (
    <section className="flex flex-row h-full">
      <Card className="w-1/4 h-full" radius="none">
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
        <EntriesList mod_id={mod_id} />
      </Card>
      <Card className="w-2/4" radius="none">
        B
      </Card>
      <Card className="w-1/4" radius="none">
        C
      </Card>
    </section>
  );
}

function EntriesList({ mod_id }: { mod_id: number }) {
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
  const items = data?.paged_entries[page] || [];

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      <CardBody className="flex flex-col">
        {isLoaded &&
          items.map((item) => (
            <Button
              key={item.key}
              className="text-md"
              variant="light"
              size="lg"
              radius="sm"
              startContent={
                <div className="bg-default-500 rounded-sm min-w-unit-3 h-3"></div>
              }
            >
              <p className="min-w-full overflow-hidden text-ellipsis text-left">
                {item.value}
              </p>
            </Button>
          ))}
        {!isLoaded && <Skeleton className="rounded-lg h-full" />}
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
    </div>
  );
}
