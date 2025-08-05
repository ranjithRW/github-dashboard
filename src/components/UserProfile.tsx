import React from 'react';
import { GitHubUser } from '../services/githubApi';
import { MapPin, Building, Link, Calendar, Users, GitFork, Star } from 'lucide-react';
import { format } from 'date-fns';

interface UserProfileProps {
  user: GitHubUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
          </div>
        </div>
        
        <div className="text-center lg:text-left flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.name || user.login}
            </h1>
            <p className="text-xl text-gray-600 mb-3">@{user.login}</p>
            
            {user.bio && (
              <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mb-4">
                {user.bio}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                <GitFork className="w-5 h-5 text-gray-500" />
                <span className="text-2xl font-bold text-gray-900">{user.public_repos}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Repositories</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-2xl font-bold text-gray-900">{user.followers}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Followers</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-2xl font-bold text-gray-900">{user.following}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Following</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {format(new Date(user.created_at), 'yyyy')}
                </span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Joined</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {user.location && (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">{user.company}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Link className="w-4 h-4 text-gray-500" />
                <a 
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Website
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 font-medium">
                Member since {format(new Date(user.created_at), 'MMM yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};