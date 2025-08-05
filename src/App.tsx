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

  const fetchUserData = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching data for user: ${username}`);
      
      // Fetch user profile
      const user = await githubService.getUser(username);
      console.log('User data fetched:', user);
      
      // Fetch repositories
      const repositories = await githubService.getUserRepositories(username);
      console.log(`Fetched ${repositories.length} repositories`);
      
      // Fetch recent activities
      const activities = await githubService.getUserActivity(username);
      console.log(`Fetched ${activities.length} activities`);
      
      // Fetch commits (from recent repositories)
      const commits = await githubService.getUserCommits(username);
      console.log(`Fetched ${commits.length} commits`);
      
      // Fetch issues and PRs
      const { issues, pullRequests } = await githubService.getIssuesAndPRs(username);
      console.log(`Fetched ${issues.length} issues and ${pullRequests.length} PRs`);
      
      setData({
        user,
        repositories,
        activities,
        commits,
        issues,
        pullRequests
      });
    } catch (err: any) {
      console.error('Error fetching user data:', err);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {tokenWarning && (
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
        
        {data && !loading && (
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