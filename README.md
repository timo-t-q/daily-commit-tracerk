# 📅 Daily Commit Reminder

Never break your coding streak again! This bot checks if you've committed code today and sends you Discord reminders throughout the day.

![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-automated-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)

## 🎯 Features

- ✅ Automatically checks all your GitHub commits daily
- 📬 Sends Discord notification if you haven't committed
- 🔥 Daily reminders at 8 AM & 8 PM (your time)
- 📊 Weekly summary every Saturday with stats
- ⚡ Runs automatically via GitHub Actions
- 🧪 Easy to test locally

## 🚀 Schedule (Budapest Time)

| Check | Your Time | UTC |
|-------|----------|-----|
| Morning Reminder | 8 AM | 6 AM |
| Evening Reminder | 8 PM | 6 PM |
| Weekly Summary | Saturday 12 PM | 10 AM |

## 📊 Weekly Summary Includes

- Total commits this week
- Current streak
- Most productive day
- Favorite repo

## 🚀 Setup Instructions

### 1. Create Discord Webhook

1. Open Discord and go to your server
2. Go to **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Name it "Commit Reminder" and choose a channel
5. Click **Copy Webhook URL** and save it

### 2. Fork/Clone This Repository

```bash
git clone https://github.com/timo-t-q/daily-commit-tracerk.git
cd daily-commit-tracerk
npm install
```

### 3. Add GitHub Secrets

1. Go to your repo on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add secret: `DISCORD_WEBHOOK_URL` = your Discord webhook URL

### 4. Test Locally (Optional)

```bash
cp .env.example .env
# Edit .env with your tokens
npm run check    # Test daily check
npm run weekly  # Test weekly summary
```

### 5. Enable GitHub Actions

1. Go to the **Actions** tab in your repo
2. Click **I understand my workflows, go ahead and enable them**

## 🧪 Manual Testing

```bash
# Test daily check
npm run check

# Test weekly summary
npm run weekly
```

Or trigger workflows manually from the Actions tab.

## ⚙️ Configuration

### Change Schedule

Edit `.github/workflows/daily-reminder.yml`:

```yaml
on:
  schedule:
    # '0 6 * * *' = 6 AM UTC (8 AM Budapest summer)
    # '0 18 * * *' = 6 PM UTC (8 PM Budapest summer)
    - cron: '0 6 * * *'
    - cron: '0 18 * * *'
```

Edit `.github/workflows/weekly-summary.yml`:

```yaml
on:
  schedule:
    # '0 10 * * 6' = Saturday 10 AM UTC
    - cron: '0 10 * * 6'
```

### Change Username

Edit the workflow files to change the tracked user:

```yaml
env:
  GITHUB_USERNAME: your-username
```

## 📝 Example Discord Messages

**Daily Reminder (when no commits):**
```
⏰ Daily Commit Reminder

Hey! You haven't committed any code today yet.

Don't break your streak! 💪
Even a small commit counts.
```

**Weekly Summary (Saturday):**
```
📊 Weekly Commit Summary

Total Commits: 23
🔥 Current Streak: 5 days
🏆 Most Productive Day: Wednesday (7 commits)
📂 Favorite Repo: timo-t-q/my-project (12 commits)
```

## 🐛 Troubleshooting

**Workflow not running?**
- Make sure GitHub Actions are enabled
- Check Actions minutes (free tier: 2000 min/month)

**Not receiving Discord notifications?**
- Verify webhook URL in Secrets
- Test locally first

**"No commits" even though you committed?**
- Commits use UTC timezone
- Make sure commit is pushed to GitHub

## 📄 License

MIT License

## 🤝 Contributing

Built by timo-t-q

---

**Keep coding, keep committing! 🚀**
