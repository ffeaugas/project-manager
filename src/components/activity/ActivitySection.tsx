'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsData {
  date: string;
  tasksArchived: number;
  projectCardsCreated: number;
}

const chartConfig = {
  tasksArchived: {
    label: 'Task activity',
    color: 'hsl(var(--chart-1))',
  },
  projectCardsCreated: {
    label: 'Project activity',
    color: 'hsl(var(--chart-2))',
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
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{
              left: 0,
              right: 20,
              top: 20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend
              content={({ payload, verticalAlign }) => (
                <ChartLegendContent payload={payload} verticalAlign={verticalAlign} />
              )}
            />
            <Area
              dataKey="tasksArchived"
              type="monotone"
              fill="var(--color-tasksArchived)"
              fillOpacity={0.4}
              stroke="var(--color-tasksArchived)"
              strokeWidth={2}
            />
            <Area
              dataKey="projectCardsCreated"
              type="monotone"
              fill="var(--color-projectCardsCreated)"
              fillOpacity={0.4}
              stroke="var(--color-projectCardsCreated)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
