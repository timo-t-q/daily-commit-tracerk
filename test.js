#!/usr/bin/env node

/**
 * Test script to demonstrate the reminder logic without real API calls
 */

console.log('🧪 Running test mode...\n');

const scenarios = [
  {
    name: 'Has committed today',
    hasCommitted: true,
    commitCount: 3,
    latestCommit: 'feat: add daily commit reminder'
  },
  {
    name: 'No commits today',
    hasCommitted: false,
    commitCount: 0,
    latestCommit: null
  }
];

console.log('Testing both scenarios:\n');

scenarios.forEach((scenario, index) => {
  console.log(`--- Scenario ${index + 1}: ${scenario.name} ---`);
  
  if (scenario.hasCommitted) {
    console.log(`✅ Great! You've made ${scenario.commitCount} commit(s) today!`);
    console.log(`   Latest: "${scenario.latestCommit}"`);
    console.log('   → No notification sent (to avoid spam)\n');
  } else {
    console.log('❌ No commits today yet!');
    console.log('📬 Discord notification would be sent:');
    console.log('   Title: "⏰ Daily Commit Reminder"');
    console.log('   Message: "Hey! You haven\'t committed any code today yet."');
    console.log('   "Don\'t break your streak! 💪"');
    console.log('   "Even a small commit counts."\n');
  }
});

console.log('✅ Test completed!\n');
console.log('To run with real GitHub data:');
console.log('  1. Copy .env.example to .env');
console.log('  2. Fill in your tokens');
console.log('  3. Run: npm run check');