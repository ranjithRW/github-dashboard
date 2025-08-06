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
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 mb-8 w-full">
      <div className="text-center mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gray-900 rounded-lg">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            GitHub Analytics
          </h1>
        </div>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
          Analyze GitHub profiles with comprehensive insights into activity, contributions, and project metrics
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 w-full">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              'Analyze Profile'
            )}
          </button>
        </div>
      </form>
    </div>

  );
};