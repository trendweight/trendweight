#!/usr/bin/env node

/**
 * Script to inject build information into environment variables
 * Run this before building: node scripts/inject-build-info.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Get git information
function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    const commitSha = execSync('git rev-parse HEAD').toString().trim()
    const commitMessage = execSync('git log -1 --pretty=%B').toString().trim()
    
    return { branch, commitSha, commitMessage }
  } catch (error) {
    console.warn('Git info not available:', error.message)
    return {
      branch: 'unknown',
      commitSha: 'unknown',
      commitMessage: 'unknown'
    }
  }
}

// Get package version
function getVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))
    return packageJson.version || '0.0.0'
  } catch (error) {
    console.warn('Package version not available:', error.message)
    return '0.0.0'
  }
}

// Create build info
const gitInfo = getGitInfo()
const version = getVersion()
const buildTime = new Date().toISOString()

// Create .env.production.local with build info
const envContent = `
# Build-time information
VITE_BUILD_TIME=${buildTime}
VITE_BUILD_VERSION=${version}
VITE_COMMIT_SHA=${gitInfo.commitSha}
VITE_BRANCH=${gitInfo.branch}
VITE_COMMIT_MESSAGE=${gitInfo.commitMessage.replace(/\n/g, ' ')}
`.trim()

// Write to .env.production.local
const envPath = path.join(__dirname, '../.env.production.local')
fs.writeFileSync(envPath, envContent)

console.log('Build info injected:')
console.log(`  Version: ${version}`)
console.log(`  Branch: ${gitInfo.branch}`)
console.log(`  Commit: ${gitInfo.commitSha.substring(0, 7)}`)
console.log(`  Time: ${buildTime}`)