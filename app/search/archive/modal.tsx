"use client";

import { Button } from "@nextui-org/button";
import {
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@nextui-org/progress";
import { motion } from "framer-motion";
import { Link } from "@nextui-org/link";

import {
  ArchiveResourceInfo,
  ArchiveTask,
  ArchiveTaskStage,
  getArchiveTask,
} from "./api";
import SearchResources, { ResourceImage } from "./resource";
import { MinecraftMod, ModStatus } from "@/app/translate/api";

export default function ArchiveDataModal() {
  const [taskInfo, setTaskInfo] = useState<TaskInfo>();
  const [taskSuccess, setTaskSuccess] = useState<boolean>();
  const [mod, setMod] = useState<MinecraftMod>();

  function AchieveStatus({
    resource,
    id,
  }: {
    resource: ArchiveResourceInfo;
    id?: string;
  }) {
    function child() {
      if (taskSuccess === undefined) {
        return (
          <TaskProgress
            resource={resource}
            id={id}
            onFinished={(success, mod) => {
              setTaskSuccess(success);
              setMod(mod);
            }}
          />
        );
      }

      if (mod) {
        return (
          <ArchivedActions
            mod={mod}
            success={taskSuccess}
            returnToSearch={() => {
              setTaskInfo(undefined);
              setTaskSuccess(undefined);
              setMod(undefined);
            }}
          />
        );
      }
    }

    return (
      <div className="flex flex-col gap-2 items-center">
        <div className="w-4/5 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center">
          <ResourceImage
            url={resource.image_url}
            name={resource.name}
            size={100}
          ></ResourceImage>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span>{resource.name}</span>
              <span>{resource.description}</span>
            </div>
            {child()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>{taskSuccess ? "建檔成功" : "建檔模組"}</ModalHeader>
          <ModalBody>
            <SearchResources
              hidden={taskInfo !== undefined}
              setTaskInfo={(info) => {
                setTaskInfo(info);
              }}
            />
            {taskInfo && (
              <AchieveStatus
                resource={taskInfo.resource}
                id={taskInfo.id}
              ></AchieveStatus>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={onClose}
              isDisabled={taskSuccess === undefined && taskInfo !== undefined}
            >
              關閉
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
}

export interface TaskInfo {
  resource: ArchiveResourceInfo;
  id?: string;
}

function TaskProgress(
  props: TaskInfo & {
    onFinished: (success: boolean, mc_mod?: MinecraftMod) => void;
  }
) {
  const unMounted = useRef<boolean>();
  const [task, setTask] = useState<ArchiveTask>();

  useEffect(() => {
    async function startTracking() {
      if (!props.id) return;

      while (true) {
        if (unMounted.current) break;
        const task = await getArchiveTask(props.id);
        setTask(task);

        if (ArchiveTaskStage.isFinished(task.stage)) {
          props.onFinished(
            task.stage === ArchiveTaskStage.Completed,
            task.mc_mod
          );
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    startTracking();
    unMounted.current = false;

    return () => {
      unMounted.current = true;
    };
  }, [props, unMounted]);

  return (
    <motion.div layout className="sm:min-w-[25rem]">
      {!task && (
        <Progress
          aria-label="Archiving progress bar"
          isIndeterminate
        ></Progress>
      )}
      {task && (
        <Progress
          value={task.progress * 100}
          label={getStageText(task.stage)}
          showValueLabel
        ></Progress>
      )}
    </motion.div>
  );
}

function getStageText(stager: ArchiveTaskStage) {
  switch (stager) {
    case ArchiveTaskStage.Preparing:
      return "準備資料中";
    case ArchiveTaskStage.Downloading:
      return "下載資料中";
    case ArchiveTaskStage.Extracting:
      return "分析資料中";
    case ArchiveTaskStage.Saving:
      return "存放至資料庫中";
    case ArchiveTaskStage.Failed:
      return "建檔失敗";
    case ArchiveTaskStage.Completed:
      return "建檔成功";
  }
}

function ArchivedActions({
  mod,
  success,
  returnToSearch,
}: {
  mod: MinecraftMod;
  success: boolean;
  returnToSearch: () => void;
}) {
  if (!success) {
    return <span className="text-center">建檔失敗，請稍後再試。</span>;
  }

  if (mod.status === ModStatus.MissingEntries) {
    return (
      <span className="text-center">
        建檔成功，但由於本模組未提供可供翻譯之條目資訊，故無法翻譯本模組。
        <br />
        倘若造成您的不便，敬請見諒。
      </span>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <Button
        href={`/translate/${mod.id}`}
        as={Link}
        color="primary"
        variant="bordered"
      >
        立即翻譯
      </Button>
      <Button as={Link} onClick={returnToSearch} variant="bordered">
        繼續建檔
      </Button>
    </div>
  );
}
