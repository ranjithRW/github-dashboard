import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Commit } from '../services/githubApi';
import { format, eachDayOfInterval, startOfYear, endOfYear, isAfter, isBefore } from 'date-fns';

interface ContributionHeatmapProps {
  commits: Commit[];
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ commits }) => {
  const heatmapData = useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    
    // Get all days of the current year
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    // Count commits per day
    const commitCounts = new Map<string, number>();
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      if (isAfter(date, yearStart) && isBefore(date, yearEnd)) {
        const dateKey = format(date, 'yyyy-MM-dd');
        commitCounts.set(dateKey, (commitCounts.get(dateKey) || 0) + 1);
      }
    });
    
    // Create data array for heatmap
    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const count = commitCounts.get(dateKey) || 0;
      return [dateKey, count];
    });
  }, [commits]);

  const maxCommits = Math.max(...heatmapData.map(([_, count]) => count as number));

  const option = {
    title: {
      text: `${format(new Date(), 'yyyy')} Contribution Activity`,
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
      },
      left: 'center',
      top: 20
    },
    tooltip: {
      formatter: (params: any) => {
        const [date, count] = params.data;
        return `${format(new Date(date), 'MMM d, yyyy')}<br/>Commits: ${count}`;
      },
      backgroundColor: 'red',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      }
    },
    calendar: {
      top: 80,
      left: 50,
      right: 50,
      cellSize: ['auto', 13],
      range: format(new Date(), 'yyyy'),
      itemStyle: {
        borderWidth: 0.5,
        borderColor: '#333'
      },
      yearLabel: { show: false },
      dayLabel: {
        color: '#9ca3af'
      },
      monthLabel: {
        color: '#9ca3af'
      }
    },
    visualMap: {
      min: 0,
      max: maxCommits,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      pieces: [
        { min: 0, max: 0, color: '#000000' },
        { min: 1, max: Math.ceil(maxCommits * 0.25), color: 'blue' },
        { min: Math.ceil(maxCommits * 0.25) + 1, max: Math.ceil(maxCommits * 0.5), color: 'yellow' },
        { min: Math.ceil(maxCommits * 0.5) + 1, max: Math.ceil(maxCommits * 0.75), color: 'green' },
        { min: Math.ceil(maxCommits * 0.75) + 1, max: maxCommits, color: 'pink' }
      ],
      textStyle: {
        color: '#9ca3af'
      }
    },
    series: [
      {
        name: 'Contributions',
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: heatmapData
      }
    ]
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-800">
      <ReactECharts
        option={option}
        style={{ height: '250px', width: '100%' }}
        theme="dark"
      />
    </div>
  );  
};