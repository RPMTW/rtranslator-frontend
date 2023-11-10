"use client";

import { Button } from "@nextui-org/button";
import {
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@nextui-org/progress";

import {
  ArchiveResourceInfo,
  ArchiveTask,
  ArchiveTaskStage,
  getArchiveTask,
} from "./api";
import SearchResources, { ResourceImage } from "./resource";

export default function ArchiveDataModal() {
  const [taskInfo, setTaskInfo] = useState<TaskInfo>();
  const [taskRunning, setTaskRunning] = useState(false);

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>建檔模組</ModalHeader>
          <ModalBody>
            <SearchResources
              hidden={taskInfo !== undefined}
              setTaskInfo={setTaskInfo}
            />
            {taskInfo && (
              <TaskProgress
                resource={taskInfo.resource}
                id={taskInfo.id}
                setTaskRunning={setTaskRunning}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={onClose}
              isDisabled={taskRunning}
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
  props: TaskInfo & { setTaskRunning: (value: boolean) => void }
) {
  const unMounted = useRef<boolean>();
  const [task, setTask] = useState<ArchiveTask>();

  async function startTracking(
    id: string,
    setTaskRunning: (value: boolean) => void
  ) {
    setTaskRunning(true);
    while (true) {
      if (unMounted.current) break;
      const task = await getArchiveTask(id);
      setTask(task);

      if (ArchiveTaskStage.isFinished(task.stage)) {
        setTaskRunning(false);
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  useEffect(() => {
    unMounted.current = false;
    if (props.id) startTracking(props.id, props.setTaskRunning);

    return () => {
      unMounted.current = true;
    };
  }, [props.id, props.setTaskRunning, unMounted]);

  return (
    <section>
      <div className="flex flex-col gap-2 items-center">
        {!task && (
          <>
            <h1>正在建檔中，請稍後...</h1>
            <Spinner className="mt-5" />
          </>
        )}
        {task && (
          <div className="w-3/4 flex flex-col sm:flex-row gap-2 items-center justify-center">
            <ResourceImage
              url={props.resource.image_url}
              name={props.resource.name}
              size={100}
            ></ResourceImage>
            <div className="flex flex-col">
              <span>{props.resource.name}</span>
              <span>{props.resource.description}</span>{" "}
              <Progress
                className="sm:min-w-[25rem] mt-2"
                value={task.progress * 100}
                label={getStageText(task.stage)}
                color={
                  task.stage === ArchiveTaskStage.Failed ? "danger" : "primary"
                }
                showValueLabel
              ></Progress>
            </div>
          </div>
        )}
      </div>
    </section>
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
