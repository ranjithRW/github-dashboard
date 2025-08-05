import React from 'react';
import { GitHubUser } from '../services/githubApi';
import { MapPin, Building, Link, Calendar, Users, GitFork } from 'lucide-react';
import { format } from 'date-fns';

interface UserProfileProps {
  user: GitHubUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="bg-black rounded-xl p-6 text-white shadow-xl border border-gray-800">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={user.name || user.login}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold mb-2">{user.name || user.login}</h1>
          <p className="text-gray-300 text-lg mb-3">@{user.login}</p>
          
          {user.bio && (
            <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.public_repos}</div>
              <div className="text-sm text-gray-400">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.followers}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.following}</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {format(new Date(user.created_at), 'yyyy')}
              </div>
              <div className="text-sm text-gray-400">Joined</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {user.company}
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-1">
                <Link className="w-4 h-4" />
                <a 
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white hover:underline"
                >
                  {user.blog}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {format(new Date(user.created_at), 'MMM yyyy')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};