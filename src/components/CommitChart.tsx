import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Commit } from '../services/githubApi';
import { format, subMonths, eachMonthOfInterval, startOfMonth } from 'date-fns';
import { TrendingUp } from 'lucide-react';

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

  const totalCommits = chartData.reduce((sum, data) => sum + data.commits, 0);
  const avgCommits = Math.round(totalCommits / chartData.length);

  const option = {
    title: {
      text: 'Commit Activity Trend',
      textStyle: {
        color: '#1f2937',
        fontSize: 18,
        fontWeight: 'bold'
      },
      left: 'center',
      top: 20
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      extraCssText: 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border-radius: 8px;',
      formatter: (params: any) => {
        const data = params[0];
        return `<div style="padding: 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${data.axisValue}</div>
          <div style="color: #6b7280;">${data.value} commits</div>
        </div>`;
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.month),
      axisLine: {
        lineStyle: { 
          color: '#e5e7eb',
          width: 1
        }
      },
      axisLabel: {
        color: '#6b7280',
        rotate: 45,
        fontSize: 12,
        fontWeight: 500
      },
      axisTick: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: 500
      },
      splitLine: {
        lineStyle: { 
          color: '#f3f4f6',
          width: 1
        }
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: 'Commits',
        type: 'line',
        smooth: true,
        data: chartData.map(d => d.commits),
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            color: '#1d4ed8',
            borderColor: '#ffffff',
            borderWidth: 3,
            shadowBlur: 8,
            shadowColor: 'rgba(59, 130, 246, 0.3)'
          }
        }
      }
    ]
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Commit Trends</h2>
            <p className="text-gray-600 text-sm">
              {totalCommits} commits over 6 months (avg: {avgCommits}/month)
            </p>
          </div>
        </div>
      </div>
      
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
      />
    </div>
  );
};