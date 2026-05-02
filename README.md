# 📅 Daily Commit Reminder

Never break your coding streak again! This bot checks if you've committed code today and sends you a Discord reminder at 8 PM if you haven't.

![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-automated-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)

## 🎯 Features

- ✅ Automatically checks all your GitHub commits daily
- 📬 Sends Discord notification if you haven't committed
- 🔥 Helps maintain coding streaks
- ⚡ Runs automatically via GitHub Actions
- 🧪 Easy to test locally

## 🚀 Setup Instructions

### 1. Create Discord Webhook

1. Open Discord and go to your server
2. Go to **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Name it "Commit Reminder" and choose a channel
5. Click **Copy Webhook URL** and save it

### 2. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name like "Daily Commit Reminder"
4. Select scopes: `repo` and `read:user`
5. Click **Generate token** and copy it immediately

### 3. Fork/Clone This Repository

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/daily-commit-reminder.git
cd daily-commit-reminder

# Install dependencies
npm install
```

### 4. Add GitHub Secrets

1. Go to your repo on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `DISCORD_WEBHOOK_URL`: Your Discord webhook URL
   - `GITHUB_TOKEN`: Already available (GitHub provides this automatically)

### 5. Test Locally (Optional)

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your tokens
nano .env

# Run the script
npm run check
```

### 6. Enable GitHub Actions

1. Go to the **Actions** tab in your repo
2. Click **I understand my workflows, go ahead and enable them**
3. The workflow will now run daily at 8 PM UTC

## 🧪 Manual Testing

You can trigger the workflow manually to test it:

1. Go to **Actions** tab
2. Click **Daily Commit Reminder** workflow
3. Click **Run workflow** → **Run workflow**

## 📊 How It Works

```
┌─────────────────┐
│  GitHub Actions │
│  (8 PM daily)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check commits   │
│ via GitHub API  │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌─────┐    ┌──────┐
│ Yes │    │  No  │
└──┬──┘    └───┬──┘
   │           │
   │           ▼
   │    ┌──────────────┐
   │    │ Send Discord │
   │    │  Reminder    │
   │    └──────────────┘
   │
   ▼
┌──────┐
│ Done │
└──────┘
```

## ⚙️ Configuration

### Change Reminder Time

Edit `.github/workflows/daily-reminder.yml`:

```yaml
on:
  schedule:
    # Change the cron expression
    # Format: 'minute hour * * *'
    # Examples:
    # - '0 12 * * *'  = 12 PM UTC
    # - '0 20 * * *'  = 8 PM UTC (current)
    # - '30 19 * * *' = 7:30 PM UTC
    - cron: '0 20 * * *'
```

**Note:** GitHub Actions uses UTC time. Budapest is UTC+1 (winter) or UTC+2 (summer).

### Change Username

The workflow automatically uses your GitHub username (`${{ github.repository_owner }}`). If you want to check a different user, edit the workflow:

```yaml
env:
  GITHUB_USERNAME: YourGitHubUsername
```

## 🎨 Customization Ideas

- **Add streak tracking**: Store commit history and show current streak
- **Weekly summary**: Send stats every Sunday
- **Multi-user support**: Check commits for your whole team
- **Smarter reminders**: Only remind on weekdays
- **Achievement badges**: Celebrate milestones (7-day streak, 30-day streak, etc.)

## 📝 Example Discord Messages

**When you haven't committed:**
```
⏰ Daily Commit Reminder

Hey! You haven't committed any code today yet.

Don't break your streak! 💪

Even a small commit counts.
```

**When you have committed:**
```
No notification sent (to avoid spam)
```

## 🐛 Troubleshooting

**Workflow not running?**
- Make sure GitHub Actions are enabled in your repo
- Check if you have enough GitHub Actions minutes (free tier: 2000 min/month)

**Not receiving Discord notifications?**
- Verify webhook URL is correct in Secrets
- Check Discord channel permissions
- Test locally first using `.env` file

**"No commits" even though you committed?**
- Commits are checked in UTC timezone
- Make sure the commit is pushed to GitHub (local commits don't count)
- Verify your GitHub username is correct

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Built by Timotej Tipary for the GitHub Student Developer Pack application.

Ideas for improvement? Open an issue or PR!

---

**Keep coding, keep committing! 🚀**