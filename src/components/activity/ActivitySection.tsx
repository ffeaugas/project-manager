'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartNoAxesColumn } from 'lucide-react';

interface StatisticsData {
  date: string;
  tasksArchived: number;
  projectCardsCreated: number;
}

const chartConfig = {
  tasksArchived: {
    label: 'Task activity',
    color: 'hsl(var(--color-custom1))',
  },
  projectCardsCreated: {
    label: 'Project activity',
    color: 'hsl(var(--color-custom2))',
  },
} satisfies ChartConfig;

const ActivitySection = () => {
  const [data, setData] = useState<StatisticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
            <ChartNoAxesColumn />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
          <ChartNoAxesColumn />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="tasksArchived"
              stackId="a"
              fill="var(--color-custom3)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="projectCardsCreated"
              stackId="a"
              fill="var(--color-custom4)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
