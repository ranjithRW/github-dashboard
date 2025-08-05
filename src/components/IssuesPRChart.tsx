import React from 'react';
import ReactECharts from 'echarts-for-react';

interface IssuesPRChartProps {
  issues: any[];
  pullRequests: any[];
}

export const IssuesPRChart: React.FC<IssuesPRChartProps> = ({ issues, pullRequests }) => {
  const openIssues = issues.filter(issue => issue.state === 'open').length;
  const closedIssues = issues.filter(issue => issue.state === 'closed').length;
  const openPRs = pullRequests.filter(pr => pr.state === 'open').length;
  const closedPRs = pullRequests.filter(pr => pr.state === 'closed').length;
  const mergedPRs = pullRequests.filter(pr => pr.merged_at).length;

  const option = {
    title: {
      text: 'Issues & Pull Requests',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      textStyle: {
        color: '#9ca3af'
      }
    },
    series: [
      {
        name: 'Issues',
        type: 'pie',
        radius: ['20%', '35%'],
        center: ['25%', '45%'],
        data: [
          { value: openIssues, name: 'Open Issues', itemStyle: { color: '#ffffff' } },
          { value: closedIssues, name: 'Closed Issues', itemStyle: { color: '#808080' } }
        ],
        label: {
          color: '#9ca3af'
        }
      },
      {
        name: 'Pull Requests',
        type: 'pie',
        radius: ['20%', '35%'],
        center: ['75%', '45%'],
        data: [
          { value: openPRs, name: 'Open PRs', itemStyle: { color: '#ffffff' } },
          { value: mergedPRs, name: 'Merged PRs', itemStyle: { color: '#c0c0c0' } },
          { value: closedPRs - mergedPRs, name: 'Closed PRs', itemStyle: { color: '#404040' } }
        ],
        label: {
          color: '#9ca3af'
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