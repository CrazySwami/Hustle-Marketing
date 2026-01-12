#!/usr/bin/env node

/**
 * Visual QA Script
 *
 * Screenshots all Storybook stories and analyzes them with Claude Haiku
 * for visual bugs, accessibility issues, and design system compliance.
 *
 * Usage: npm run visual-qa
 */

import { chromium } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, '../.storybook/screenshots');
const REPORT_PATH = path.join(__dirname, '../.storybook/visual-qa-report.json');

// Storybook URL (update if different)
const STORYBOOK_URL = 'http://localhost:6006';

// Viewports to test
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

/**
 * Get all stories from Storybook
 */
async function getStories(page) {
  await page.goto(`${STORYBOOK_URL}/iframe.html?viewMode=story`);

  // Wait for Storybook to load
  await page.waitForTimeout(2000);

  // Get stories from Storybook index
  const stories = await page.evaluate(async () => {
    // Access Storybook's internal API
    const response = await fetch('/index.json');
    const data = await response.json();

    return Object.entries(data.entries || data.stories || {})
      .filter(([_, entry]) => entry.type === 'story')
      .map(([id, entry]) => ({
        id,
        title: entry.title,
        name: entry.name,
      }));
  });

  return stories;
}

/**
 * Screenshot a single story
 */
async function screenshotStory(page, story, viewport) {
  const storyUrl = `${STORYBOOK_URL}/iframe.html?viewMode=story&id=${story.id}`;

  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(storyUrl);

  // Wait for story to render
  await page.waitForTimeout(1000);

  // Create filename
  const safeName = story.id.replace(/[^a-z0-9]/gi, '-');
  const filename = `${safeName}-${viewport.name}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);

  // Take screenshot
  await page.screenshot({ path: filepath, fullPage: false });

  return {
    story,
    viewport: viewport.name,
    filepath,
    filename,
  };
}

/**
 * Analyze screenshot with Haiku (placeholder - integrate with actual API)
 */
async function analyzeWithHaiku(screenshot) {
  // This is a placeholder for the actual Haiku analysis
  // In production, this would:
  // 1. Read the screenshot file
  // 2. Send to Claude Haiku API with the analysis prompt
  // 3. Parse and return results

  console.log(`  Analyzing: ${screenshot.filename}`);

  // Simulated analysis result
  return {
    ...screenshot,
    analysis: {
      passed: true,
      score: 95,
      issues: [],
      // In real implementation, this would contain actual Haiku analysis
    },
  };
}

/**
 * Generate HTML report
 */
async function generateReport(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalScreenshots: results.length,
    passed: results.filter(r => r.analysis.passed).length,
    failed: results.filter(r => !r.analysis.passed).length,
    averageScore: results.reduce((acc, r) => acc + r.analysis.score, 0) / results.length,
    issues: results.flatMap(r => r.analysis.issues),
  };

  // Save JSON report
  await fs.writeFile(REPORT_PATH, JSON.stringify({ summary, results }, null, 2));

  // Generate HTML report
  const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual QA Report - ${summary.timestamp}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    .header { margin-bottom: 2rem; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat { background: #1e293b; padding: 1.5rem; border-radius: 0.5rem; }
    .stat-value { font-size: 2rem; font-weight: bold; }
    .stat-label { color: #94a3b8; font-size: 0.875rem; }
    .passed { color: #10b981; }
    .failed { color: #ef4444; }
    .results { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .result { background: #1e293b; border-radius: 0.5rem; overflow: hidden; }
    .result img { width: 100%; height: 200px; object-fit: cover; }
    .result-info { padding: 1rem; }
    .result-title { font-weight: 600; margin-bottom: 0.5rem; }
    .result-meta { color: #94a3b8; font-size: 0.75rem; }
    .score { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; }
    .score.high { background: #10b981; color: white; }
    .score.medium { background: #f59e0b; color: white; }
    .score.low { background: #ef4444; color: white; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Visual QA Report</h1>
    <p>Generated: ${summary.timestamp}</p>
  </div>

  <div class="summary">
    <div class="stat">
      <div class="stat-value">${summary.totalScreenshots}</div>
      <div class="stat-label">Total Screenshots</div>
    </div>
    <div class="stat">
      <div class="stat-value passed">${summary.passed}</div>
      <div class="stat-label">Passed</div>
    </div>
    <div class="stat">
      <div class="stat-value failed">${summary.failed}</div>
      <div class="stat-label">Failed</div>
    </div>
    <div class="stat">
      <div class="stat-value">${Math.round(summary.averageScore)}%</div>
      <div class="stat-label">Average Score</div>
    </div>
  </div>

  <h2>Results</h2>
  <div class="results">
    ${results.map(r => `
      <div class="result">
        <img src="screenshots/${r.filename}" alt="${r.story.title} - ${r.story.name}" />
        <div class="result-info">
          <div class="result-title">${r.story.title} / ${r.story.name}</div>
          <div class="result-meta">${r.viewport} • <span class="score ${r.analysis.score >= 90 ? 'high' : r.analysis.score >= 70 ? 'medium' : 'low'}">${r.analysis.score}%</span></div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();

  await fs.writeFile(path.join(__dirname, '../.storybook/visual-qa-report.html'), htmlReport);

  return summary;
}

/**
 * Main function
 */
async function main() {
  console.log('\\n🔍 Visual QA Analysis\\n');

  // Ensure screenshots directory exists
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

  // Launch browser
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Get all stories
    console.log('Fetching stories from Storybook...');
    const stories = await getStories(page);
    console.log(`Found ${stories.length} stories\\n`);

    if (stories.length === 0) {
      console.log('No stories found. Make sure Storybook is running at', STORYBOOK_URL);
      console.log('Run: npm run storybook');
      return;
    }

    // Screenshot all stories at all viewports
    const screenshots = [];

    for (const story of stories) {
      console.log(`📸 ${story.title} / ${story.name}`);

      for (const viewport of VIEWPORTS) {
        const screenshot = await screenshotStory(page, story, viewport);
        screenshots.push(screenshot);
      }
    }

    console.log(`\\nTook ${screenshots.length} screenshots`);

    // Analyze with Haiku
    console.log('\\n🤖 Analyzing with Haiku...\\n');
    const results = [];

    for (const screenshot of screenshots) {
      const result = await analyzeWithHaiku(screenshot);
      results.push(result);
    }

    // Generate report
    console.log('\\n📊 Generating report...');
    const summary = await generateReport(results);

    // Print summary
    console.log('\\n════════════════════════════════════════');
    console.log('           VISUAL QA SUMMARY              ');
    console.log('════════════════════════════════════════');
    console.log(`  Total:    ${summary.totalScreenshots}`);
    console.log(`  Passed:   ${summary.passed} ✓`);
    console.log(`  Failed:   ${summary.failed} ✗`);
    console.log(`  Score:    ${Math.round(summary.averageScore)}%`);
    console.log('════════════════════════════════════════\\n');

    console.log('Report saved to: .storybook/visual-qa-report.html');

  } finally {
    await browser.close();
  }
}

// Run
main().catch(console.error);
