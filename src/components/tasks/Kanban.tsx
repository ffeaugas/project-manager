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
  KeyboardSensor,
  PointerSensor,
  // TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { SortableContext } from '@dnd-kit/sortable';
import { TaskColumnWithTasks } from '../../app/api/columns/tasks/types';
import { NewColumnType } from '@/app/api/columns/types';
import { useMemo, ReactNode } from 'react';

interface KanbanProps {
  openSidebar?: () => void;
  breadcrumbs?: ReactNode;
}

const Kanban = ({ openSidebar, breadcrumbs }: KanbanProps) => {
  const {
    columns,
    tasks,
    isLoading,
    createTask,
    updateTask,
    submitColumn,
    deleteItem,
    archiveItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    activeTask,
    activeColumn,
  } = useTasks();

  const columnIds = useMemo(
    () => columns.map((col: TaskColumnWithTasks) => col.id),
    [columns],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    // useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  if (isLoading) return <Spinner size="large" />;
  return (
    <div className="flex flex-col flex-1 w-full">
      <TaskHeader openSidebar={openSidebar} breadcrumbs={breadcrumbs} />
      <div className="overflow-y-scroll overflow-x-auto">
        <div className="flex flex-row md:flex-row gap-3 p-2 md:p-4 min-w-fit md:h-auto h-dvh">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <SortableContext items={columnIds}>
              {columns.map((col) => (
                <TaskColumn
                  key={col.id}
                  data={col}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  createTask={createTask}
                  updateTask={updateTask}
                  submitColumn={submitColumn}
                  deleteItem={deleteItem}
                  archiveItem={archiveItem}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeColumn ? (
                <TaskColumn
                  data={activeColumn}
                  tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                  createTask={createTask}
                  updateTask={updateTask}
                  submitColumn={submitColumn}
                  deleteItem={deleteItem}
                  archiveItem={archiveItem}
                />
              ) : null}
              {activeTask ? (
                <TaskCard
                  data={activeTask}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteItem={deleteItem}
                  archiveItem={archiveItem}
                />
              ) : null}
            </DragOverlay>
            <EmptyColumn submitColumn={submitColumn} />
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Kanban;

const EmptyColumn = ({
  submitColumn,
}: {
  submitColumn: (
    bodyData: NewColumnType,
    options?: { columnId?: string },
  ) => Promise<boolean>;
}) => {
  return (
    <NewColumnDialog submitColumn={submitColumn}>
      <Button
        variant="dashed"
        className="flex flex-col justify-center w-[150px] h-[200px] text-lg md:text-md my-px mt-[.6rem] border-secondary font-semibold"
      >
        Add Column
      </Button>
    </NewColumnDialog>
  );
};
