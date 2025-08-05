import React from 'react';
import { Activity } from '../services/githubApi';
import { GitCommit, Star, GitPullRequest, GitFork, Eye, Calendar, Plus, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'PushEvent':
        return <GitCommit className={`${iconClass} text-green-600`} />;
      case 'WatchEvent':
        return <Star className={`${iconClass} text-yellow-600`} />;
      case 'PullRequestEvent':
        return <GitPullRequest className={`${iconClass} text-blue-600`} />;
      case 'ForkEvent':
        return <GitFork className={`${iconClass} text-purple-600`} />;
      case 'CreateEvent':
        return <Plus className={`${iconClass} text-emerald-600`} />;
      case 'IssuesEvent':
        return <AlertCircle className={`${iconClass} text-orange-600`} />;
      default:
        return <Calendar className={`${iconClass} text-gray-500`} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return 'border-green-200 bg-green-50';
      case 'WatchEvent':
        return 'border-yellow-200 bg-yellow-50';
      case 'PullRequestEvent':
        return 'border-blue-200 bg-blue-50';
      case 'ForkEvent':
        return 'border-purple-200 bg-purple-50';
      case 'CreateEvent':
        return 'border-emerald-200 bg-emerald-50';
      case 'IssuesEvent':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'PushEvent':
        const commitCount = activity.payload.commits?.length || 0;
        return `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''} to`;
      case 'WatchEvent':
        return 'Starred';
      case 'PullRequestEvent':
        return `${activity.payload.action} pull request in`;
      case 'ForkEvent':
        return 'Forked';
      case 'CreateEvent':
        return `Created ${activity.payload.ref_type} in`;
      case 'IssuesEvent':
        return `${activity.payload.action} issue in`;
      default:
        return `${activity.type.replace('Event', '')} in`;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.slice(0, 20).map((activity, index) => (
          <div 
            key={`${activity.id}-${index}`} 
            className={`border rounded-lg p-4 ${getActivityColor(activity.type)} hover:shadow-sm transition-shadow duration-200`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1 p-2 bg-white rounded-lg shadow-sm">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-medium">
                  <span className="font-semibold">{activity.actor.login}</span>
                  {' '}
                  <span className="text-gray-600">{getActivityDescription(activity)}</span>
                  {' '}
                  <a
                    href={`https://github.com/${activity.repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                  >
                    {activity.repo.name}
                  </a>
                </p>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                  <span>•</span>
                  <span>
                    {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium">No recent activity found</p>
          <p className="text-gray-500 text-sm mt-1">Activity will appear here when the user makes contributions</p>
        </div>
      )}
    </div>
  );
};