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
import SearchResources from "./resource";

export default function ArchiveDataModal() {
  const [taskInfo, setTaskInfo] = useState<TaskInfo>();

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
              <TaskProgress resource={taskInfo.resource} id={taskInfo.id} />
            )}
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

export interface TaskInfo {
  resource: ArchiveResourceInfo;
  id?: string;
}

function TaskProgress(props: TaskInfo) {
  const unMounted = useRef<boolean>();
  const [task, setTask] = useState<ArchiveTask>();

  async function startTracking(id: string) {
    while (true) {
      if (unMounted.current) break;
      const task = await getArchiveTask(id);
      setTask(task);

      const taskEnd =
        task.stage === ArchiveTaskStage.Completed ||
        task.stage === ArchiveTaskStage.Failed;
      if (taskEnd) break;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  useEffect(() => {
    unMounted.current = false;
    if (props.id) startTracking(props.id);

    return () => {
      unMounted.current = true;
    };
  }, [props.id, unMounted]);

  return (
    <section>
      <div className="flex flex-col gap-2 items-center">
        <h1>正在建檔中，請稍後...</h1>
        {task ? (
          <Progress
            value={task.progress * 100}
            label={task.stage}
            showValueLabel
          ></Progress>
        ) : (
          <Spinner className="mt-5" />
        )}
      </div>
    </section>
  );
}
