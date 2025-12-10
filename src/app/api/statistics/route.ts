import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { handleApiError } from '@/lib/api-error-handler';
import { prisma } from '@/lib/prisma';
import { ProjectCard, Task } from '@prisma/client';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);

    const archivedTasks = await prisma.task.findMany({
      where: {
        userId,
        archivedAt: {
          not: null,
          gte: thirtyDaysAgo,
        },
      },
      select: {
        archivedAt: true,
      },
    });

    const projectCards = await prisma.projectCard.findMany({
      where: {
        project: {
          userId,
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const tasksByDate = new Map<string, number>();
    const cardsByDate = new Map<string, number>();

    for (let i = 0; i <= 7; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      tasksByDate.set(dateKey, 0);
      cardsByDate.set(dateKey, 0);
    }

    archivedTasks.forEach((task: Task) => {
      if (task.archivedAt) {
        const dateKey = task.archivedAt.toISOString().split('T')[0];
        const current = tasksByDate.get(dateKey) || 0;
        tasksByDate.set(dateKey, current + 1);
      }
    });

    projectCards.forEach((card: ProjectCard) => {
      const dateKey = card.createdAt.toISOString().split('T')[0];
      const current = cardsByDate.get(dateKey) || 0;
      cardsByDate.set(dateKey, current + 1);
    });

    const result = Array.from(tasksByDate.keys())
      .sort()
      .map((dateKey) => ({
        date: dateKey,
        tasksArchived: tasksByDate.get(dateKey) || 0,
        projectCardsCreated: cardsByDate.get(dateKey) || 0,
      }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
