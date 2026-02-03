#!/usr/bin/env node

/**
 * Trello Power-Up Validation Script
 *
 * Checks for common issues in Trello Power-Up development:
 * - Required files exist
 * - TrelloPowerUp.initialize() is called
 * - No hardcoded credentials (basic check)
 * - Proper iframe initialization
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];
const info = [];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m'
};

function log(type, message) {
  const timestamp = new Date().toISOString();
  if (type === 'error') {
    errors.push(message);
    console.error(`${colors.red}✗ ERROR:${colors.reset} ${message}`);
  } else if (type === 'warning') {
    warnings.push(message);
    console.warn(`${colors.yellow}⚠ WARNING:${colors.reset} ${message}`);
  } else {
    info.push(message);
    console.log(`${colors.blue}ℹ INFO:${colors.reset} ${message}`);
  }
}

function checkFileExists(filePath, required = true) {
  const exists = fs.existsSync(filePath);
  if (!exists && required) {
    log('error', `Required file missing: ${filePath}`);
  } else if (exists) {
    log('info', `Found: ${filePath}`);
  }
  return exists;
}

function checkFileContent(filePath, checks) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');

  checks.forEach(check => {
    if (check.pattern.test(content)) {
      if (check.type === 'required') {
        log('info', `${filePath}: ${check.message}`);
      } else if (check.type === 'warning') {
        log('warning', `${filePath}: ${check.message}`);
      }
    } else if (check.type === 'required') {
      log('error', `${filePath}: ${check.message}`);
    }
  });
}

console.log(`${colors.green}==================================${colors.reset}`);
console.log(`${colors.green}Trello Power-Up Validation${colors.reset}`);
console.log(`${colors.green}==================================${colors.reset}\n`);

// Check required files
console.log('📁 Checking required files...\n');
checkFileExists('index.html', true);
checkFileExists('js/client.js', true);

// Check optional but common files
checkFileExists('card-back-section.html', false);
checkFileExists('search-books.html', false);

console.log('\n📝 Checking Power-Up initialization...\n');

// Validate client.js
if (fs.existsSync('js/client.js')) {
  checkFileContent('js/client.js', [
    {
      pattern: /TrelloPowerUp\.initialize/,
      type: 'required',
      message: '✓ TrelloPowerUp.initialize() found'
    },
    {
      pattern: /appKey:\s*['"][a-f0-9]{32}['"]/,
      type: 'required',
      message: '✓ App key configured'
    },
    {
      pattern: /appName:\s*['"].+['"]/,
      type: 'required',
      message: '✓ App name configured'
    }
  ]);
}

// Validate index.html
if (fs.existsSync('index.html')) {
  checkFileContent('index.html', [
    {
      pattern: /power-up\.min\.js/,
      type: 'required',
      message: '✓ Power-Up client library loaded'
    },
    {
      pattern: /src=["']\.\/js\/client\.js["']/,
      type: 'required',
      message: '✓ Client.js script included'
    }
  ]);
}

// Check for iframe initialization in HTML files
console.log('\n🖼  Checking iframe pages...\n');

const iframePages = ['card-back-section.html', 'search-books.html'];
iframePages.forEach(page => {
  if (fs.existsSync(page)) {
    checkFileContent(page, [
      {
        pattern: /TrelloPowerUp\.iframe/,
        type: 'required',
        message: `✓ ${page}: TrelloPowerUp.iframe() initialized`
      },
      {
        pattern: /power-up\.min\.css/,
        type: 'required',
        message: `✓ ${page}: Power-Up CSS loaded`
      }
    ]);
  }
});

// Security checks
console.log('\n🔒 Running security checks...\n');

const jsFiles = ['js/client.js', 'card-back-section.html', 'search-books.html'];
jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check for exposed API keys (basic pattern)
    const apiKeyPattern = /key=AIza[A-Za-z0-9_-]{35}/;
    if (apiKeyPattern.test(content)) {
      log('warning', `${file}: API key detected in client-side code. Ensure it's restricted by HTTP referrer in Google Cloud Console.`);
    }

    // Check for potential XSS vulnerabilities
    if (content.includes('innerHTML') && !content.includes('textContent')) {
      log('warning', `${file}: Uses innerHTML. Ensure user input is properly sanitized.`);
    }
  }
});

// Design token usage check
console.log('\n🎨 Checking design token usage...\n');

const cssFiles = ['card-back-section.html', 'search-books.html'];
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');

    if (content.includes('var(--ds-')) {
      log('info', `${file}: ✓ Using Atlassian design tokens`);
    }

    // Check for hardcoded colors
    const hardcodedColorPattern = /#[0-9a-fA-F]{3,6}(?![^<]*var\()/;
    if (hardcodedColorPattern.test(content)) {
      log('warning', `${file}: Contains hardcoded color values. Consider using design tokens for theme support.`);
    }
  }
});

// Summary
console.log(`\n${colors.green}==================================${colors.reset}`);
console.log(`${colors.green}Validation Summary${colors.reset}`);
console.log(`${colors.green}==================================${colors.reset}\n`);

console.log(`${colors.blue}Info: ${info.length}${colors.reset}`);
console.log(`${colors.yellow}Warnings: ${warnings.length}${colors.reset}`);
console.log(`${colors.red}Errors: ${errors.length}${colors.reset}\n`);

if (errors.length === 0) {
  console.log(`${colors.green}✓ All critical checks passed!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}✗ Validation failed with ${errors.length} error(s)${colors.reset}\n`);
  process.exit(1);
}
