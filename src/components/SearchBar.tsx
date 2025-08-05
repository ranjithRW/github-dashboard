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
    if (username.trim() && !loading) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gray-900 rounded-lg">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">GitHub Analytics</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Analyze GitHub profiles with comprehensive insights into activity, contributions, and project metrics
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username (e.g., octocat, torvalds)"
            className="block w-full pl-12 pr-32 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 text-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Profile'
              )}
            </button>
          </div>
        </div>
      </form>
      
      {/* <div className="flex flex-wrap gap-3 justify-center mt-6">
        <span className="text-gray-500 text-sm">Popular examples: </span>
        {['octocat', 'torvalds', 'gaearon', 'sindresorhus'].map(user => (
          <button
            key={user}
            onClick={() => !loading && onSearch(user)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline-offset-2 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {user}
          </button>
        ))}
      </div> */}
    </div>
  );
};