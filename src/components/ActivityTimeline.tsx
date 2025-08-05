import React from 'react';
import { Activity } from '../services/githubApi';
import { GitCommit, Star, GitPullRequest, GitFork, Eye, Calendar } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-4 h-4 text-white" />;
      case 'WatchEvent':
        return <Star className="w-4 h-4 text-white" />;
      case 'PullRequestEvent':
        return <GitPullRequest className="w-4 h-4 text-white" />;
      case 'ForkEvent':
        return <GitFork className="w-4 h-4 text-white" />;
      case 'CreateEvent':
        return <Eye className="w-4 h-4 text-white" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
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
    <div className="bg-black rounded-xl p-6 shadow-xl border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-white" />
        Recent Activity
      </h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.slice(0, 20).map((activity, index) => (
          <div key={`${activity.id}-${index}`} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-gray-300 text-sm">
                <span className="text-white font-medium">{activity.actor.login}</span>
                {' '}
                <span className="text-gray-400">{getActivityDescription(activity)}</span>
                {' '}
                <a
                  href={`https://github.com/${activity.repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 font-medium"
                >
                  {activity.repo.name}
                </a>
              </p>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(activity.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recent activity found.</p>
        </div>
      )}
    </div>
  );
};