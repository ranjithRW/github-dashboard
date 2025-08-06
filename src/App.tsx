import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { UserProfile } from './components/UserProfile';
import { RepositoryList } from './components/RepositoryList';
import { ContributionHeatmap } from './components/ContributionHeatmap';
import { CommitChart } from './components/CommitChart';
import { IssuesPRChart } from './components/IssuesPRChart';
import { ActivityTimeline } from './components/ActivityTimeline';
import { LoadingSpinner } from './components/LoadingSpinner';
import { githubService, GitHubUser, Repository, Activity, Commit } from './services/githubApi';
import { AlertTriangle, Github } from 'lucide-react';

interface DashboardData {
  user: GitHubUser;
  repositories: Repository[];
  activities: Activity[];
  commits: Commit[];
  issues: any[];
  pullRequests: any[];
}

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const fetchUserData = async (username: string) => {
    setLoading(true);
    setError(null);
    setSelectedRepo(null);
    try {
      const user = await githubService.getUser(username);
      const repositories = await githubService.getUserRepositories(username);
      const activities = await githubService.getUserActivity(username);
      const commits = await githubService.getUserCommits(username);
      const { issues, pullRequests } = await githubService.getIssuesAndPRs(username);
      setData({ user, repositories, activities, commits, issues, pullRequests });
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? `User "${username}" not found on GitHub`
          : err.response?.status === 403
            ? 'API rate limit exceeded. Please add your GitHub token in .env file.'
            : 'Failed to fetch user data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const tokenWarning = !import.meta.env.VITE_GITHUB_TOKEN ||
    import.meta.env.VITE_GITHUB_TOKEN === 'your_github_personal_access_token_here';

  // Filter data for selected repo
  const repoData = React.useMemo(() => {
    if (!data || !selectedRepo) return null;
    const repo = data.repositories.find(r => r.name === selectedRepo);
    if (!repo) return null;
    const commits = (data.commits as (Commit & { repoName: string })[]).filter(c => c.repoName === selectedRepo);
    const issues = data.issues.filter((i: any) => i.repository?.name === selectedRepo);
    const pullRequests = data.pullRequests.filter((pr: any) => pr.repository?.name === selectedRepo);
    return { repo, commits, issues, pullRequests };
  }, [data, selectedRepo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {tokenWarning && (
          <div className="bg-white border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-gray-900 font-semibold mb-1">GitHub Token Recommended</h3>
              <p className="text-gray-600 text-sm">
                Add your GitHub Personal Access Token to avoid rate limits.
                <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1">
                  Get token here
                </a>
              </p>
            </div>
          </div>
        )}

        <SearchBar onSearch={fetchUserData} loading={loading} />

        {data && !loading && !error &&(
          <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Repository Filter:
              </label>
              <select
                className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[250px] "
                value={selectedRepo || ''}
                onChange={e => setSelectedRepo(e.target.value || null)}
              >
                <option value="">All Repositories - Overview</option>
                  {data.repositories.map(repo => (
                    <option key={repo.name} value={repo.name}>{repo.name}</option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="lg" text="Fetching GitHub data..." />
          </div>
        )}

        {error && (
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center shadow-sm">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-gray-900 font-semibold text-lg mb-2">Unable to Load Data</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Repository-specific dashboard */}
        {repoData && !loading && !error &&(
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Repository Analysis: {repoData.repo.name}
              </h2>
              <p className="text-gray-600">Detailed metrics for the selected repository</p>
            </div>

            <ContributionHeatmap commits={repoData.commits} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <CommitChart commits={repoData.commits} />
              <IssuesPRChart issues={repoData.issues} pullRequests={repoData.pullRequests} />
            </div>
          </div>
        )}

        {/* Overall dashboard */}
        {data && !selectedRepo && !loading && !error &&(
          <div className="space-y-8">
            <UserProfile user={data.user} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <RepositoryList repositories={data.repositories} />
              <ActivityTimeline activities={data.activities} />
            </div>
            <ContributionHeatmap commits={data.commits} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <CommitChart commits={data.commits} />
              <IssuesPRChart issues={data.issues} pullRequests={data.pullRequests} />
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="text-center py-4">
            <Github className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">GitHub Analytics Dashboard</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Enter a GitHub username above to start exploring detailed analytics and insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;