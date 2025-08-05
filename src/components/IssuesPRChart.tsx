import React from 'react';
import ReactECharts from 'echarts-for-react';
import { GitPullRequest, AlertCircle } from 'lucide-react';

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

  const totalIssues = openIssues + closedIssues;
  const totalPRs = openPRs + closedPRs;

  const option = {
    title: {
      text: 'Issues & Pull Requests Overview',
      textStyle: {
        color: '#1f2937',
        fontSize: 18,
        fontWeight: 'bold'
      },
      left: 'center',
      top: 20
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      extraCssText: 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border-radius: 8px;',
      formatter: (params: any) => {
        const percentage = ((params.value / (params.seriesName === 'Issues' ? totalIssues : totalPRs)) * 100).toFixed(1);
        return `<div style="padding: 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
          <div style="color: #6b7280;">${params.value} (${percentage}%)</div>
        </div>`;
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '8%',
      textStyle: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: 500
      },
      itemWidth: 14,
      itemHeight: 14
    },
    series: [
      {
        name: 'Issues',
        type: 'pie',
        radius: ['25%', '45%'],
        center: ['30%', '50%'],
        data: [
          { 
            value: openIssues, 
            name: 'Open Issues', 
            itemStyle: { 
              color: '#ef4444',
              borderColor: '#ffffff',
              borderWidth: 2
            } 
          },
          { 
            value: closedIssues, 
            name: 'Closed Issues', 
            itemStyle: { 
              color: '#22c55e',
              borderColor: '#ffffff',
              borderWidth: 2
            } 
          }
        ],
        label: {
          show: true,
          position: 'outside',
          color: '#374151',
          fontSize: 12,
          fontWeight: 600,
          formatter: '{b}\n{c}'
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#d1d5db'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      },
      {
        name: 'Pull Requests',
        type: 'pie',
        radius: ['25%', '45%'],
        center: ['70%', '50%'],
        data: [
          { 
            value: openPRs, 
            name: 'Open PRs', 
            itemStyle: { 
              color: '#3b82f6',
              borderColor: '#ffffff',
              borderWidth: 2
            } 
          },
          { 
            value: mergedPRs, 
            name: 'Merged PRs', 
            itemStyle: { 
              color: '#8b5cf6',
              borderColor: '#ffffff',
              borderWidth: 2
            } 
          },
          { 
            value: closedPRs - mergedPRs, 
            name: 'Closed PRs', 
            itemStyle: { 
              color: '#6b7280',
              borderColor: '#ffffff',
              borderWidth: 2
            } 
          }
        ],
        label: {
          show: true,
          position: 'outside',
          color: '#374151',
          fontSize: 12,
          fontWeight: 600,
          formatter: '{b}\n{c}'
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#d1d5db'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
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
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-gray-700" />
              <GitPullRequest className="w-3 h-3 text-gray-700" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Issues & Pull Requests</h2>
            <p className="text-gray-600 text-sm">
              {totalIssues} issues • {totalPRs} pull requests
            </p>
          </div>
        </div>
      </div>
      
      {totalIssues === 0 && totalPRs === 0 ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-12 h-12 text-gray-400" />
            <GitPullRequest className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No issues or pull requests found</p>
          <p className="text-gray-500 text-sm mt-1">Data will appear here when issues or PRs are created</p>
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: '350px', width: '100%' }}
        />
      )}
    </div>
  );
};