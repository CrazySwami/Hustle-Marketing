#!/usr/bin/env node

/**
 * Check Tests Script
 * Determines what tests should run for given files
 * Used by Claude Code hooks during the development loop
 */

import { getTestsForFiles, getSkillsForTests } from '../src/lib/registry/test-registry.js';
import {
  recordTestRun,
  getRegistrySummary,
  initializeRegistry,
} from '../src/lib/registry/tracking-registry.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const command = args[0];

function printUsage() {
  console.log(`
Social Canvas AI - Test Check Utility

Usage:
  node scripts/check-tests.mjs <command> [options]

Commands:
  check <files...>    Check what tests are needed for files
  run <files...>      Run tests for the specified files
  summary             Show registry summary
  init                Initialize registry with existing components

Examples:
  node scripts/check-tests.mjs check src/components/ui/button.jsx
  node scripts/check-tests.mjs run src/app/api/chat/route.ts
  node scripts/check-tests.mjs summary
`);
}

async function checkFiles(files) {
  if (files.length === 0) {
    console.log('No files specified');
    return;
  }

  const result = getTestsForFiles(files);

  console.log('\n📋 Test Requirements Analysis\n');
  console.log('Files analyzed:', files.length);
  console.log('Categories:', result.categories.join(', ') || 'None');
  console.log('Tests needed:', result.tests.join(', ') || 'None');
  console.log('Primary test type:', result.primary || 'None');

  if (Object.keys(result.commands).length > 0) {
    console.log('\n🔧 Commands to run:');
    Object.entries(result.commands).forEach(([type, cmd]) => {
      console.log(`  ${type}: ${cmd}`);
    });
  }

  const skills = getSkillsForTests(result.tests);
  if (skills.length > 0) {
    console.log('\n⚡ Claude Code skills to invoke:');
    skills.forEach(skill => console.log(`  /${skill}`));
  }

  console.log('\n📁 File breakdown:');
  result.files.forEach(f => {
    console.log(`  ${f.file}`);
    console.log(`    Category: ${f.category}`);
    console.log(`    Tests: ${f.tests.join(', ') || 'None'}`);
  });

  return result;
}

async function runTests(files) {
  const result = await checkFiles(files);

  if (result.tests.length === 0) {
    console.log('\n✅ No tests required for these files');
    return;
  }

  console.log('\n🚀 Running tests...\n');

  const runResults = [];

  for (const [type, cmd] of Object.entries(result.commands)) {
    console.log(`\n--- Running ${type} tests ---`);
    console.log(`Command: ${cmd}\n`);

    const startTime = Date.now();
    let status = 'passed';
    let output = '';

    try {
      output = execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
    } catch (error) {
      status = 'failed';
      output = error.message;
    }

    const duration = Date.now() - startTime;

    runResults.push({
      type,
      command: cmd,
      status,
      duration,
    });

    // Record in registry
    recordTestRun({
      type,
      files,
      status,
      duration,
      command: cmd,
    });
  }

  console.log('\n📊 Test Results Summary:');
  runResults.forEach(r => {
    const icon = r.status === 'passed' ? '✅' : '❌';
    console.log(`  ${icon} ${r.type}: ${r.status} (${r.duration}ms)`);
  });

  const allPassed = runResults.every(r => r.status === 'passed');
  console.log(`\n${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`);

  return runResults;
}

async function showSummary() {
  const summary = getRegistrySummary();

  console.log('\n📊 Registry Summary\n');

  console.log('Components:');
  console.log(`  Total: ${summary.components.total}`);
  Object.entries(summary.components.byStatus).forEach(([status, count]) => {
    if (count > 0) console.log(`  ${status}: ${count}`);
  });

  console.log('\nTests:');
  console.log(`  Total results tracked: ${summary.tests.totalResults}`);
  console.log(`  Recent runs: ${summary.tests.recentRuns}`);
  console.log(`  Pass rate: ${summary.tests.passRate}%`);
  if (summary.tests.lastRun) {
    console.log(`  Last run: ${summary.tests.lastRun.type} - ${summary.tests.lastRun.status}`);
  }

  console.log('\nQA:');
  console.log(`  Total audits: ${summary.qa.totalAudits}`);
  console.log(`  Open issues: ${summary.qa.openIssues}`);
  console.log(`  Resolved issues: ${summary.qa.resolvedIssues}`);

  console.log(`\nGenerated: ${summary.generatedAt}`);
}

async function initRegistry() {
  // Find all component files
  const componentPaths = [];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scanDir(fullPath);
        }
      } else if (entry.isFile()) {
        if (/\.(jsx|tsx)$/.test(entry.name) && !entry.name.includes('.stories.') && !entry.name.includes('.test.')) {
          componentPaths.push(fullPath.replace(process.cwd() + '/', ''));
        }
      }
    }
  }

  scanDir('src/components');

  console.log(`Found ${componentPaths.length} components`);

  const summary = initializeRegistry(componentPaths);

  console.log('\n✅ Registry initialized');
  console.log(`  Components registered: ${summary.components.total}`);
}

// Main
switch (command) {
  case 'check':
    checkFiles(args.slice(1));
    break;
  case 'run':
    runTests(args.slice(1));
    break;
  case 'summary':
    showSummary();
    break;
  case 'init':
    initRegistry();
    break;
  default:
    printUsage();
}
