import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Commit } from '../services/githubApi';
import { format, subMonths, eachMonthOfInterval, startOfMonth } from 'date-fns';

interface CommitChartProps {
  commits: Commit[];
}

export const CommitChart: React.FC<CommitChartProps> = ({ commits }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 6);
    
    // Get all months in the last 6 months
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });
    
    // Count commits per month
    const commitCounts = new Map<string, number>();
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      if (date >= sixMonthsAgo) {
        const monthKey = format(startOfMonth(date), 'yyyy-MM');
        commitCounts.set(monthKey, (commitCounts.get(monthKey) || 0) + 1);
      }
    });
    
    return months.map(month => {
      const monthKey = format(month, 'yyyy-MM');
      return {
        month: format(month, 'MMM yyyy'),
        commits: commitCounts.get(monthKey) || 0
      };
    });
  }, [commits]);

  const option = {
    title: {
      text: 'Commits Over Time (Last 6 Months)',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.axisValue}<br/>Commits: ${data.value}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.month),
      axisLine: {
        lineStyle: { color: '#4b5563' }
      },
      axisLabel: {
        color: '#9ca3af',
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: '#4b5563' }
      },
      axisLabel: {
        color: '#9ca3af'
      },
      splitLine: {
        lineStyle: { color: '#374151' }
      }
    },
    series: [
      {
        name: 'Commits',
        type: 'line',
        smooth: true,
        data: chartData.map(d => d.commits),
        lineStyle: {
          color: '#ffffff',
          width: 3
        },
        itemStyle: {
          color: '#ffffff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 255, 255, 0.3)' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="bg-black rounded-xl p-6 shadow-xl border border-gray-800">
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        theme="dark"
      />
    </div>
  );
};