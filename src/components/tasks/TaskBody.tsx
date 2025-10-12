'use client';

import TaskColumn from './TaskColumn';
import TaskHeader from './TaskHeader';
import NewColumnDialog from './dialogs/NewColumnDialog';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { useTasks } from '@/hooks/use-tasks';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { SortableContext } from '@dnd-kit/sortable';

const TaskBody = ({ page }: { page: string }) => {
  const {
    taskColumns,
    isLoading,
    submitTask,
    submitColumn,
    deleteItem,
    handleDragStart,
    handleDragEnd,
    overlayTask,
    overlayColumn,
  } = useTasks(page);

  const columnIds = taskColumns.map((col) => col.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  if (isLoading) return <Spinner size="large" />;

  return (
    <div className="flex flex-col h-full max-h-screen">
      <TaskHeader submitTask={submitTask} pageName={page} />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-row gap-3 p-4 min-w-fit h-full">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={columnIds}>
              {taskColumns.map((col) => (
                <TaskColumn
                  key={col.id}
                  data={col}
                  submitTask={submitTask}
                  submitColumn={submitColumn}
                  deleteItem={deleteItem}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {overlayColumn ? (
                <TaskColumn
                  data={overlayColumn}
                  submitTask={submitTask}
                  submitColumn={submitColumn}
                  deleteItem={deleteItem}
                />
              ) : null}
            </DragOverlay>
            {/* <DragOverlay>
              {overlayTask ? (
                <TaskCard
                  data={overlayTask}
                  submitTask={submitTask}
                  deleteItem={deleteItem}
                />
              ) : null}
            </DragOverlay> */}
          </DndContext>
          <NewColumnDialog submitColumn={submitColumn}>
            <Button
              variant="outline"
              className="flex flex-col justify-center w-[300px] h-[500px] bg-transparent border-dashed border-2 border-zinc-700 p-4 text-zinc-600 text-xl m-1 mt-[3.25rem]"
            >
              Add Column
            </Button>
          </NewColumnDialog>
        </div>
      </div>
    </div>
  );
};

export default TaskBody;
