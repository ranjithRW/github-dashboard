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
    setSelectedRepo(null); // Reset repo selection on new user
    try {
      // ...existing code...
      const user = await githubService.getUser(username);
      const repositories = await githubService.getUserRepositories(username);
      const activities = await githubService.getUserActivity(username);
      const commits = await githubService.getUserCommits(username);
      const { issues, pullRequests } = await githubService.getIssuesAndPRs(username);
      setData({ user, repositories, activities, commits, issues, pullRequests });
    } catch (err: any) {
      // ...existing code...
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
    // Filter commits, issues, PRs for this repo
    const commits = (data.commits as (Commit & { repoName: string })[]).filter(c => c.repoName === selectedRepo);
    const issues = data.issues.filter((i: any) => i.repository?.name === selectedRepo);
    const pullRequests = data.pullRequests.filter((pr: any) => pr.repository?.name === selectedRepo);
    return { repo, commits, issues, pullRequests };
  }, [data, selectedRepo]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {tokenWarning && (
          // ...existing code...
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-1">GitHub Token Required</h3>
              <p className="text-gray-300 text-sm">
                To access full functionality and avoid rate limits, please add your GitHub Personal Access Token to the .env file.
                Get one from: <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">GitHub Settings</a>
              </p>
            </div>
          </div>
        )}

        <SearchBar onSearch={fetchUserData} loading={loading} />

        {data && !loading && (
          <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
            <label className="font-semibold text-gray-700">Select Repository:</label>
            <select
              className="border rounded px-3 py-2 min-w-[200px]"
              value={selectedRepo || ''}
              onChange={e => setSelectedRepo(e.target.value || null)}
            >
              <option value="">-- Overall Dashboard --</option>
              {data.repositories.map(repo => (
                <option key={repo.name} value={repo.name}>{repo.name}</option>
              ))}
            </select>
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Fetching GitHub data..." />
          </div>
        )}

        {error && (
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">Error</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        )}

        {/* Per-repo dashboard */}
        {repoData && !loading && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Repository: {repoData.repo.name}</h2>
            {/* You can customize which components to show for a repo */}
            <ContributionHeatmap commits={repoData.commits} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <CommitChart commits={repoData.commits} />
              <IssuesPRChart issues={repoData.issues} pullRequests={repoData.pullRequests} />
            </div>
            {/* Optionally, show repo details or activity timeline for this repo */}
          </div>
        )}

        {/* Overall dashboard (when no repo selected) */}
        {data && !selectedRepo && !loading && (
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
          <div className="text-center py-16">
            <Github className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Ready to Explore</h2>
            <p className="text-gray-500 text-lg">
              Enter a GitHub username above to start analyzing their activity and contributions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;