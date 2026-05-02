import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
 
// Configuration from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'timo-t-q'; // Your GitHub username
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
 
// Initialize GitHub API client
const octokit = new Octokit({
  auth: GITHUB_TOKEN
});
 
/**
 * Get today's date at midnight (UTC)
 */
function getTodayMidnight() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}
 
/**
 * Check if user has committed today across all repos
 */
async function hasCommittedToday() {
  try {
    const since = getTodayMidnight().toISOString();
    
    console.log(`🔍 Checking commits for ${GITHUB_USERNAME} since ${since}...`);
    
    // Search for commits by the user since midnight UTC
    const { data } = await octokit.search.commits({
      q: `author:${GITHUB_USERNAME} committer-date:>=${since}`,
      sort: 'committer-date',
      order: 'desc',
      per_page: 1
    });
 
    return {
      hasCommitted: data.total_count > 0,
      commitCount: data.total_count,
      latestCommit: data.items[0] || null
    };
  } catch (error) {
    console.error('❌ Error checking commits:', error.message);
    throw error;
  }
}
 
/**
 * Send notification to Discord
 */
async function sendDiscordNotification(message, color = 0x5865F2) {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('⚠️  No Discord webhook URL provided, skipping notification');
    return;
  }
 
  const embed = {
    embeds: [{
      title: message.title,
      description: message.description,
      color: color,
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Daily Commit Reminder'
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
      console.log('✅ Discord notification sent!');
    } else {
      console.error('❌ Failed to send Discord notification:', response.status);
    }
  } catch (error) {
    console.error('❌ Error sending Discord notification:', error.message);
  }
}
 
/**
 * Main function
 */
async function main() {
  console.log('🚀 Daily Commit Reminder starting...\n');
 
  // Validate environment variables
  if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }
 
  if (!GITHUB_USERNAME) {
    console.error('❌ GITHUB_USERNAME environment variable is required');
    process.exit(1);
  }
 
  try {
    const result = await hasCommittedToday();
 
    if (result.hasCommitted) {
      console.log(`✅ Great! You've made ${result.commitCount} commit(s) today!`);
      
      if (result.latestCommit) {
        console.log(`   Latest: "${result.latestCommit.commit.message.split('\n')[0]}" in ${result.latestCommit.repository.full_name}`);
      }
 
      // Optional: Send success notification (commented out to avoid spam)
      // await sendDiscordNotification({
      //   title: '✅ Commit Streak Active!',
      //   description: `You've made ${result.commitCount} commit(s) today. Keep it up!`
      // }, 0x57F287); // Green color
 
    } else {
      console.log('❌ No commits today yet!');
      
      // Send reminder notification
      await sendDiscordNotification({
        title: '⏰ Daily Commit Reminder',
        description: `Hey! You haven't committed any code today yet.\n\nDon't break your streak! 💪\n\nEven a small commit counts.`
      }, 0xED4245); // Red color
    }
 
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}
 
// Run the script
main();
 