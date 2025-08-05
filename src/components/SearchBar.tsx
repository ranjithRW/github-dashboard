import React, { useState } from 'react';
import { Search, Github } from 'lucide-react';

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="bg-black rounded-xl p-8 shadow-xl border border-gray-800 mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Github className="w-10 h-10 text-white" />
          <h1 className="text-4xl font-bold text-white">GitHub Analytics Dashboard</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Discover detailed insights about any GitHub user's activity and contributions
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username (e.g., octocat)"
            className="w-full pl-12 pr-32 py-4 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none text-lg"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Searching...' : 'Analyze'}
          </button>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <span className="text-gray-400 text-sm">Try: </span>
        {['octocat', 'torvalds', 'gaearon', 'sindresorhus'].map(user => (
          <button
            key={user}
            onClick={() => onSearch(user)}
            className="text-gray-300 hover:text-white text-sm underline"
            disabled={loading}
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
};