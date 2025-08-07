const GhostContentAPI = require("@tryghost/content-api");

// Settings categorization for better organization
const SETTING_CATEGORIES = {
  branding: ['title', 'description', 'logo', 'icon', 'cover_image', 'accent_color'],
  social: ['facebook', 'twitter', 'linkedin_url', 'github_url', 'social_urls'],
  content: ['posts_per_page', 'default_page_visibility', 'members_allow_free_signup'],
  technical: ['timezone', 'locale', 'codeinjection_head', 'codeinjection_foot', 'url'],
  navigation: ['navigation', 'secondary_navigation'],
  meta: ['meta_title', 'meta_description', 'og_image', 'og_title', 'og_description', 'twitter_image', 'twitter_title', 'twitter_description'],
  other: [] // Will be populated with uncategorized settings
};

// Default ignore list for assets and computed values
const DEFAULT_IGNORE = ['logo', 'icon', 'cover_image', 'url', 'og_image', 'twitter_image'];

// Command line argument parsing
const args = process.argv.slice(2);
const showAll = args.includes('--show-all');
const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'enhanced';
const categoryFilter = args.find(arg => arg.startsWith('--category='))?.split('=')[1];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

// Utility functions
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function truncateValue(value, maxLength = 50) {
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

function categorizeSettings(settings) {
  const categorized = {};
  const uncategorized = [];
  
  // Initialize categories
  Object.keys(SETTING_CATEGORIES).forEach(cat => {
    categorized[cat] = [];
  });
  
  Object.keys(settings).forEach(key => {
    let found = false;
    for (const [category, keys] of Object.entries(SETTING_CATEGORIES)) {
      if (keys.includes(key)) {
        categorized[category].push(key);
        found = true;
        break;
      }
    }
    if (!found) {
      uncategorized.push(key);
    }
  });
  
  if (uncategorized.length > 0) {
    categorized.other = uncategorized;
  }
  
  return categorized;
}

function printHeader(title) {
  const width = 80;
  const padding = Math.max(0, Math.floor((width - title.length - 2) / 2));
  const line = '═'.repeat(width);
  
  console.log(colorize(line, 'cyan'));
  console.log(colorize(`${'═'.repeat(padding)} ${title} ${'═'.repeat(padding)}`, 'cyan'));
  console.log(colorize(line, 'cyan'));
}

function printSummary(stats) {
  console.log(colorize('\n📊 SUMMARY', 'bold'));
  console.log('─'.repeat(40));
  console.log(`Total Settings:    ${stats.total}`);
  console.log(`${colorize('✅ Identical:', 'green')}      ${stats.identical} (${Math.round(stats.identical/stats.total*100)}%)`);
  console.log(`${colorize('❌ Different:', 'red')}      ${stats.different} (${Math.round(stats.different/stats.total*100)}%)`);
  console.log(`${colorize('⚠️  Ignored:', 'yellow')}       ${stats.ignored} (${Math.round(stats.ignored/stats.total*100)}%)`);
  console.log('─'.repeat(40));
}

function compareSettings(localSettings, prodSettings) {
  const stats = { total: 0, identical: 0, different: 0, ignored: 0 };
  const categorized = categorizeSettings(localSettings);
  
  printHeader('GHOST SETTINGS COMPARISON');
  
  // Process each category
  Object.entries(categorized).forEach(([category, keys]) => {
    if (keys.length === 0) return;
    if (categoryFilter && category !== categoryFilter) return;
    
    console.log(colorize(`\n🏷️  ${category.toUpperCase()}`, 'blue'));
    console.log('─'.repeat(60));
    
    keys.forEach(key => {
      stats.total++;
      const localValue = localSettings[key];
      const prodValue = prodSettings[key];
      
      if (DEFAULT_IGNORE.includes(key)) {
        stats.ignored++;
        if (showAll) {
          console.log(`${colorize('⚠️', 'yellow')}  ${colorize(key, 'dim')}: ${colorize('(ignored - asset/computed)', 'yellow')}`);
        }
      } else if (JSON.stringify(localValue) === JSON.stringify(prodValue)) {
        stats.identical++;
        if (showAll) {
          console.log(`${colorize('✅', 'green')} ${key}: ${colorize('identical', 'green')}`);
        }
      } else {
        stats.different++;
        console.log(`${colorize('❌', 'red')} ${colorize(key, 'bold')}:`);
        console.log(`   Local:  ${colorize(truncateValue(localValue), 'cyan')}`);
        console.log(`   Prod:   ${colorize(truncateValue(prodValue), 'cyan')}`);
        
        // Show full values if truncated
        if (JSON.stringify(localValue).length > 50 || JSON.stringify(prodValue).length > 50) {
          console.log(`   ${colorize('(values truncated - use --verbose for full)', 'dim')}`);
        }
        console.log();
      }
    });
  });
  
  printSummary(stats);
  
  if (!showAll && stats.identical > 0) {
    console.log(colorize(`\n💡 Use --show-all to see ${stats.identical} identical settings`, 'dim'));
  }
}

// Initialize APIs
const apiLocal = new GhostContentAPI({
  url: process.env.LOCAL_GHOST_ADMIN_API_URL,
  key: process.env.LOCAL_GHOST_CONTENT_API_KEY,
  version: "v6.0",
});

const apiProd = new GhostContentAPI({
  url: process.env.PROD_GHOST_CONTENT_API_URL,
  key: process.env.PROD_GHOST_CONTENT_API_KEY,
  version: "v6.0",
});

// Main execution
async function compareGhostSettings() {
  try {
    console.log(colorize('🔄 Fetching settings from both environments...', 'dim'));
    
    const [localSettings, prodSettings] = await Promise.all([
      apiLocal.settings.browse(),
      apiProd.settings.browse()
    ]);
    
    compareSettings(localSettings, prodSettings);
    
  } catch (error) {
    console.error(colorize('❌ Error fetching settings:', 'red'));
    console.error(error.message);
    process.exit(1);
  }
}

// Run the comparison
compareGhostSettings();
