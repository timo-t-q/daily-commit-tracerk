import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'timo-t-q';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

function getWeekStart() {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - daysToSubtract);
  weekStart.setUTCHours(0, 0, 0, 0);
  return weekStart;
}

async function getWeeklyCommits() {
  const since = getWeekStart().toISOString();
  const until = new Date().toISOString();
  
  console.log(`Fetching commits for ${GITHUB_USERNAME} from ${since}...`);
  
  let allCommits = [];
  let page = 1;
  
  while (true) {
    const { data } = await octokit.search.commits({
      q: `author:${GITHUB_USERNAME} committer-date:${since}..${until}`,
      sort: 'committer-date',
      order: 'desc',
      per_page: 100,
      page
    });
    
    if (data.items.length === 0) break;
    allCommits.push(...data.items);
    page++;
    if (data.items.length < 100) break;
  }
  
  return allCommits;
}

function calculateStats(commits) {
  const days = {};
  const repos = {};
  let streak = 0;
  
  commits.forEach(commit => {
    const date = new Date(commit.commit.committer.date);
    const dayKey = date.toISOString().split('T')[0];
    
    days[dayKey] = (days[dayKey] || 0) + 1;
    
    const repoName = commit.repository.full_name;
    repos[repoName] = (repos[repoName] || 0) + 1;
  });
  
  const sortedDays = Object.entries(days).sort((a, b) => b[1] - a[1]);
  const mostProductiveDay = sortedDays[0] ? { date: sortedDays[0][0], count: sortedDays[0][1] } : null;
  
  const sortedRepos = Object.entries(repos).sort((a, b) => b[1] - a[1]);
  const favoriteRepo = sortedRepos[0] ? { name: sortedRepos[0][0], count: sortedRepos[0][1] } : null;
  
  const today = new Date().toISOString().split('T')[0];
  let currentStreak = 0;
  let checkDate = new Date();
  
  while (true) {
    const dateKey = checkDate.toISOString().split('T')[0];
    if (days[dateKey]) {
      currentStreak++;
      checkDate.setUTCDate(checkDate.getUTCDate() - 1);
    } else {
      break;
    }
  }
  
  return {
    totalCommits: commits.length,
    mostProductiveDay,
    favoriteRepo,
    currentStreak
  };
}

async function sendWeeklySummary(stats) {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('No Discord webhook URL, skipping');
    return;
  }
  
  const embed = {
    embeds: [{
      title: '📊 Weekly Commit Summary',
      description: `Here's your coding activity for the week!`,
      color: 0x57F287,
      fields: [
        {
          name: '📈 Total Commits',
          value: `${stats.totalCommits} commits this week`,
          inline: true
        },
        {
          name: '🔥 Current Streak',
          value: `${stats.currentStreak} day(s)`,
          inline: true
        },
        {
          name: '🏆 Most Productive Day',
          value: stats.mostProductiveDay ? `${stats.mostProductiveDay.date}: ${stats.mostProductiveDay.count} commits` : 'N/A',
          inline: true
        },
        {
          name: '📂 Favorite Repo',
          value: stats.favoriteRepo ? `${stats.favoriteRepo.name}: ${stats.favoriteRepo.count} commits` : 'N/A',
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Weekly Commit Summary'
      }
    }]
  };
  
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });
    
    if (response.ok) {
      console.log('✅ Weekly summary sent!');
    } else {
      console.error('❌ Failed to send:', response.status);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  console.log('📊 Weekly Commit Summary starting...');
  
  const commits = await getWeeklyCommits();
  const stats = calculateStats(commits);
  
  console.log(`Total: ${stats.totalCommits} commits`);
  console.log(`Streak: ${stats.currentStreak} days`);
  console.log(`Most productive: ${stats.mostProductiveDay?.date} (${stats.mostProductiveDay?.count})`);
  console.log(`Favorite repo: ${stats.favoriteRepo?.name} (${stats.favoriteRepo?.count})`);
  
  await sendWeeklySummary(stats);
}

main();