import React, { useState, useMemo } from 'react';
import { Repository } from '../services/githubApi';
import { Star, GitFork, Eye, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface RepositoryListProps {
  repositories: Repository[];
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('stars');

  const languages = useMemo(() => {
    const langs = new Set(repositories.map(repo => repo.language).filter(Boolean));
    return Array.from(langs).sort();
  }, [repositories]);

  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (repo.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = !languageFilter || repo.language === languageFilter;
      return matchesSearch && matchesLanguage;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });
  }, [repositories, searchTerm, languageFilter, sortBy]);

  const getLanguageColor = (language: string | null) => {
    return 'bg-white';
  };

  return (
    <div className="bg-black rounded-xl p-6 shadow-xl border border-gray-800">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GitFork className="w-6 h-6 text-white" />
          Repositories ({repositories.length})
        </h2>
        
        <div className="flex-1 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none"
            />
          </div>
          
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-white focus:outline-none"
          >
            <option value="stars">Sort by Stars</option>
            <option value="forks">Sort by Forks</option>
            <option value="updated">Sort by Updated</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {filteredAndSortedRepos.map(repo => (
          <div
            key={repo.id}
            className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-white transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 font-semibold text-lg transition-colors"
              >
                {repo.name}
              </a>
              {repo.private && (
                <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                  Private
                </span>
              )}
            </div>
            
            {repo.description && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{repo.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                    {repo.language}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {repo.stargazers_count}
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {repo.forks_count}
                </div>
                {repo.open_issues_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {repo.open_issues_count}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Updated {format(new Date(repo.updated_at), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAndSortedRepos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No repositories found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};