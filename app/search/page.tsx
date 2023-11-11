"use client";

import { SearchIcon } from "@/components/icons";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Pagination } from "@nextui-org/pagination";
import { Skeleton } from "@nextui-org/skeleton";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Modal, useDisclosure } from "@nextui-org/modal";
import ArchiveDataModal from "./archive/modal";

export default function SearchPage() {
  const testCard = (
    <Card
      className="flex flex-row justify-between items-center p-4 mx-4"
      radius="lg"
    >
      <Skeleton className="rounded-lg">
        <div className="w-24 h-20 rounded-lg bg-default-300"></div>
      </Skeleton>
      <Skeleton className="rounded-lg">
        <div className="w-[46rem] h-20 rounded-lg bg-default-300"></div>
      </Skeleton>
      <Skeleton className="rounded-lg h-10">
        <div className="w-24 rounded-lg bg-default-300"></div>
      </Skeleton>
    </Card>
  );

  return (
    <div className="flex flex-col gap-3 items-center mx-3">
      <SearchFilter />
      <Pagination total={10} initialPage={1} size="lg" />
      <section className="w-full flex flex-col gap-2">
        {testCard}
        {testCard}
        {testCard}
        {testCard}
        {testCard}
      </section>
    </div>
  );
}

function SearchFilter(): JSX.Element {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card fullWidth>
      <CardBody className="flex flex-row gap-3 justify-center">
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
        />
        <div className="w-full flex flex-row max-w-[12rem] items-center gap-2">
          <span className="whitespace-nowrap">排序方式</span>
          <Select
            aria-label="Sort by"
            labelPlacement="outside"
            selectedKeys={["name"]}
          >
            <SelectItem key="name">名稱</SelectItem>
            <SelectItem key="time">最後更新</SelectItem>
            <SelectItem key="c">翻譯進度</SelectItem>
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
