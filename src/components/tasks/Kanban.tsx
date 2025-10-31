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
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { SortableContext } from '@dnd-kit/sortable';
import { TaskColumnWithTasks } from '../../app/api/columns/tasks/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Kanban = () => {
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

  const columnIds = columns.map((col: TaskColumnWithTasks) => col.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  if (isLoading) return <Spinner size="large" />;

  return (
    <div className="flex flex-col h-full flex-1 max-w-full md:max-w-[75%]">
      <TaskHeader />
      <div className="overflow-y-scroll overflow-x-auto">
        <div className="flex flex-row md:flex-row gap-3 p-2 md:p-4 min-w-fit">
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
          </DndContext>
          <NewColumnDialog submitColumn={submitColumn}>
            <Button
              variant="outline"
              className="flex flex-col justify-center w-[250px] md:w-[300px] h-[200px] md:h-[100px] bg-transparent border-dashed border-2 border-zinc-700 p-4 text-zinc-600 text-lg md:text-xl my-[1px]"
            >
              Add Column
            </Button>
          </NewColumnDialog>
        </div>
      </div>
    </div>
  );
};

export default Kanban;
