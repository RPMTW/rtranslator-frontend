"use client";

import { CurseForgeIcon, ModrinthIcon, SearchIcon } from "@/components/icons";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { ArchiveSource, MinecraftModInfo, searchMods } from "./api";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";

export default function ArchiveDataModal() {
  const [data, setData] = useState<MinecraftModInfo[] | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    searchMods(ArchiveSource.Modrinth, query).then((result) => {
      setData(result);
    });
  }, [query]);

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>建檔模組</ModalHeader>
          <ModalBody>
            <SearchFilter setQuery={setQuery} />
            <div className="h-[50vh] flex flex-col overflow-scroll items-center">
              {data ? <ModList mods={data}></ModList> : <Spinner />}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              關閉
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
}

interface SearchFilterProps {
  setQuery: (query: string) => void;
}

function SearchFilter(props: SearchFilterProps) {
  return (
    <div className="flex flex-row gap-3 justify-center max-h-[4rem]">
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
        onChange={(e) => {
          props.setQuery(e.target.value);
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

interface ModListProps {
  mods: MinecraftModInfo[];
}

function ModList(props: ModListProps) {
  function renderImage(url: string, name: string) {
    return (
      <Image
        className="min-w-fit"
        as={NextImage}
        src={url}
        alt={`The logo of ${name} mod`}
        width={48}
        height={48}
      ></Image>
    );
  }

  return (
    <section className="w-full flex flex-col gap-2 p-2">
      <Card>
        {props.mods.map((mod) => (
          <CardBody
            key={mod.page_url}
            className="h-20 flex flex-row items-center justify-between"
          >
            {mod.image_url ? (
              renderImage(mod.image_url, mod.name)
            ) : (
              <div className="w-[48px] h-[48px] bg-red-300 rounded-xl"></div>
            )}
            <div className="w-2/5 md:w-3/4 flex flex-col mx-5 overflow-x-clip">
              <span className="truncate">{mod.name}</span>
              <span className="truncate">{mod.description}</span>
            </div>
            <Button disabled={mod.included_in_database}>
              {mod.included_in_database ? "已建檔" : "立即建檔"}
            </Button>
          </CardBody>
        ))}
      </Card>
    </section>
  );
}
