import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

// Get GitHub token from environment variables
const getToken = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token || token === 'your_github_personal_access_token_here') {
    console.warn('GitHub token not found. Some features may be limited.');
    return null;
  }
  return token;
};

// Create axios instance with authentication
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    ...(getToken() && { 'Authorization': `token ${getToken()}` })
  }
});

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string;
  company: string;
  blog: string;
  twitter_username: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  size: number;
  open_issues_count: number;
  private: boolean;
  html_url: string;
}

export interface Activity {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: any;
  created_at: string;
}

export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

export class GitHubService {
  async getUser(username: string): Promise<GitHubUser> {
    const response = await githubApi.get(`/users/${username}`);
    return response.data;
  }

  async getUserRepositories(username: string, page = 1, per_page = 100): Promise<Repository[]> {
    const response = await githubApi.get(`/users/${username}/repos`, {
      params: { 
        page, 
        per_page, 
        sort: 'updated',
        direction: 'desc'
      }
    });
    return response.data;
  }

  async getUserActivity(username: string, page = 1, per_page = 30): Promise<Activity[]> {
    try {
      const response = await githubApi.get(`/users/${username}/events/public`, {
        params: { page, per_page }
      });
      return response.data;
    } catch (error) {
      console.warn('Could not fetch user activity:', error);
      return [];
    }
  }

  async getRepositoryCommits(owner: string, repo: string, since?: string): Promise<Commit[]> {
    try {
      const params: any = { per_page: 100 };
      if (since) params.since = since;
      
      const response = await githubApi.get(`/repos/${owner}/${repo}/commits`, {
        params
      });
      return response.data;
    } catch (error) {
      console.warn(`Could not fetch commits for ${owner}/${repo}:`, error);
      return [];
    }
  }

  async getUserCommits(username: string): Promise<Commit[]> {
    try {
      const repos = await this.getUserRepositories(username, 1, 10);
      const allCommits: Commit[] = [];
      
      for (const repo of repos) {
        if (!repo.private) { // Only fetch from public repos
          const commits = await this.getRepositoryCommits(username, repo.name);
          allCommits.push(...commits);
        }
      }
      
      return allCommits.sort((a, b) => 
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
      );
    } catch (error) {
      console.warn('Could not fetch user commits:', error);
      return [];
    }
  }

  async getIssuesAndPRs(username: string): Promise<{ issues: any[], pullRequests: any[] }> {
    try {
      const [issuesResponse, prsResponse] = await Promise.all([
        githubApi.get('/search/issues', {
          params: {
            q: `author:${username} type:issue`,
            sort: 'created',
            order: 'desc',
            per_page: 100
          }
        }),
        githubApi.get('/search/issues', {
          params: {
            q: `author:${username} type:pr`,
            sort: 'created', 
            order: 'desc',
            per_page: 100
          }
        })
      ]);
      
      return {
        issues: issuesResponse.data.items || [],
        pullRequests: prsResponse.data.items || []
      };
    } catch (error) {
      console.warn('Could not fetch issues and PRs:', error);
      return { issues: [], pullRequests: [] };
    }
  }
}

export const githubService = new GitHubService();