import NextImage from "next/image";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";

import { CurseForgeIcon, ModrinthIcon, SearchIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useRef, useState } from "react";

import {
  ArchiveProvider,
  ArchiveResourceInfo,
  createArchiveTask,
  searchResources,
} from "./api";
import { TaskInfo } from "./modal";

interface SearchResourcesProps {
  hidden: boolean;
  setTaskInfo: (taskInfo: TaskInfo) => void;
}

export default function SearchResources(props: SearchResourcesProps) {
  const [data, setData] = useState<ArchiveResourceInfo[]>();
  const [query, setQuery] = useState<string>();
  const [provider, setProvider] = useState<ArchiveProvider>(
    ArchiveProvider.Modrinth
  );
  const page = useRef(0);

  async function onScrollBottom(event: React.UIEvent<HTMLDivElement, UIEvent>) {
    const target = event.target as HTMLDivElement;
    const hitBottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    const isEnd = data?.length && data.length % 10 !== 0;

    if (hitBottom && !isEnd) {
      page.current++;
      const result = await searchResources(provider, query, page.current);
      setData(data?.concat(result));
    }
  }

  useEffect(() => {
    searchResources(provider, query, page.current).then((result) => {
      setData(result);
    });
  }, [query, page, provider]);

  return (
    <section hidden={props.hidden}>
      <SearchFilter
        setQuery={(value) => {
          page.current = 0;
          setQuery(value);
        }}
      />
      <div
        className="h-[50vh] flex flex-col items-center overflow-scroll scrollbar-hide"
        onScrollCapture={onScrollBottom}
      >
        {data ? (
          <ResourcesList
            provider={provider}
            resources={data}
            setTaskInfo={props.setTaskInfo}
          ></ResourcesList>
        ) : (
          <Spinner className="mt-5" />
        )}
      </div>
    </section>
  );
}

interface SearchFilterProps {
  setQuery: (query: string) => void;
}

function SearchFilter(props: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-h-[4rem] mb-4">
      <Input
        className="h-full max-w-sm"
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
        onValueChange={(value) => {
          props.setQuery(value);
        }}
      />
      <div className="h-full w-full flex flex-row max-w-[15rem] items-center gap-2">
        <span className="whitespace-nowrap">模組平臺</span>
        <Select
          aria-label="Sort by"
          labelPlacement="outside"
          selectedKeys={["modrinth"]}
          startContent={<ModrinthIcon />}
        >
          <SelectItem key="curseforge" startContent={<CurseForgeIcon />}>
            CurseForge
          </SelectItem>
          <SelectItem key="modrinth" startContent={<ModrinthIcon />}>
            Modrinth
          </SelectItem>
        </Select>
      </div>
    </div>
  );
}

interface ResourcesListProps {
  provider: ArchiveProvider;
  resources: ArchiveResourceInfo[];
  setTaskInfo: ({ id, resource }: TaskInfo) => void;
}

function ResourcesList(props: ResourcesListProps) {
  return (
    <section className="w-full flex flex-col gap-2 p-2">
      <Card>
        {props.resources.map((res) => {
          return (
            <CardBody
              key={res.identifier}
              className="h-20 flex flex-row items-center justify-between"
            >
              <ResourceImage
                url={res.image_url}
                name={res.name}
                size={48}
              ></ResourceImage>
              <div className="w-2/5 md:w-3/4 flex flex-col mx-5 overflow-x-clip">
                <span className="truncate">{res.name}</span>
                <span className="truncate">{res.description}</span>
              </div>
              <Button
                isDisabled={res.included_in_database}
                onPress={async () => {
                  props.setTaskInfo({ resource: res });
                  const taskId = await createArchiveTask(
                    props.provider,
                    res.identifier
                  );

                  // In order to show the progress bar animation smoothly, we need to wait for a while.
                  await new Promise((resolve) => setTimeout(resolve, 300));
                  props.setTaskInfo({ id: taskId, resource: res });
                }}
              >
                {res.included_in_database ? "已建檔" : "立即建檔"}
              </Button>
            </CardBody>
          );
        })}
      </Card>
    </section>
  );
}

export function ResourceImage({
  url,
  name,
  size,
}: {
  url?: string;
  name: string;
  size: number;
}) {
  const needRenderImage = url && !url.endsWith(".gif");

  if (!needRenderImage) {
    return (
      <div
        className="bg-stone-500 rounded-xl"
        style={{ minWidth: size, minHeight: size }}
      ></div>
    );
  }

  return (
    <Image
      className="min-w-fit object-contain"
      as={NextImage}
      src={url}
      alt={`The logo of ${name} mod`}
      width={size}
      height={size}
      style={{ minWidth: size, minHeight: size }}
    ></Image>
  );
}
