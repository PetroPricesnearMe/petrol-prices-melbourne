import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { githubAPI } from '../config';
import './GitHubInfo.css';

const GitHubInfo = () => {
  const [repoInfo, setRepoInfo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test GitHub connection first
        const connectionTest = await githubAPI.testConnection();
        setConnectionStatus(connectionTest);

        if (connectionTest.success) {
          // Fetch repository information
          const repoData = await githubAPI.getRepoInfo();
          setRepoInfo(repoData);

          // Fetch latest commits
          const commitsData = await githubAPI.getLatestCommits(5);
          setCommits(commitsData);
        } else {
          setError(connectionTest.error);
        }
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return (
      <div className="github-info">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading GitHub Information...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-info">
        <div className="error-container">
          <h3>⚠️ GitHub Connection Error</h3>
          <p>{error}</p>
          <p className="error-details">
            This could be due to:
            <br />• Invalid or expired GitHub token
            <br />• Network connectivity issues
            <br />• GitHub API rate limiting
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="github-info"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="github-header">
        <h2>📊 GitHub Repository Status</h2>
        {connectionStatus && (
          <div className={`connection-status ${connectionStatus.success ? 'success' : 'error'}`}>
            {connectionStatus.success ? '✅' : '❌'} {connectionStatus.message}
            {connectionStatus.user && <span> (User: {connectionStatus.user})</span>}
          </div>
        )}
      </div>

      {repoInfo && (
        <motion.div 
          className="repo-info"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>📁 Repository Information</h3>
          <div className="repo-details">
            <div className="detail-item">
              <strong>Name:</strong> {repoInfo.name}
            </div>
            <div className="detail-item">
              <strong>Full Name:</strong> {repoInfo.full_name}
            </div>
            <div className="detail-item">
              <strong>Description:</strong> {repoInfo.description || 'No description'}
            </div>
            <div className="detail-item">
              <strong>Language:</strong> {repoInfo.language || 'Not specified'}
            </div>
            <div className="detail-item">
              <strong>Stars:</strong> ⭐ {repoInfo.stargazers_count}
            </div>
            <div className="detail-item">
              <strong>Forks:</strong> 🍴 {repoInfo.forks_count}
            </div>
            <div className="detail-item">
              <strong>Last Updated:</strong> {new Date(repoInfo.updated_at).toLocaleDateString()}
            </div>
            <div className="detail-item">
              <strong>Clone URL:</strong> 
              <a href={repoInfo.clone_url} target="_blank" rel="noopener noreferrer">
                {repoInfo.clone_url}
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {commits.length > 0 && (
        <motion.div 
          className="commits-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3>🔄 Latest Commits</h3>
          <div className="commits-list">
            {commits.map((commit, index) => (
              <motion.div 
                key={commit.sha}
                className="commit-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="commit-header">
                  <span className="commit-sha">{commit.sha.substring(0, 7)}</span>
                  <span className="commit-date">
                    {new Date(commit.commit.author.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="commit-message">
                  {commit.commit.message}
                </div>
                <div className="commit-author">
                  by {commit.commit.author.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GitHubInfo; 