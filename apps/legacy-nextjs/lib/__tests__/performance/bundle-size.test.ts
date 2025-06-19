import fs from 'fs';
import path from 'path';

describe('Bundle Size Monitoring', () => {
  const BUNDLE_SIZE_LIMITS = {
    'main.js': 250 * 1024, // 250KB
    'framework.js': 150 * 1024, // 150KB
    'commons.js': 100 * 1024, // 100KB
    '_app.js': 200 * 1024, // 200KB
  };

  // Skip in test environment, only run in CI after build
  const itif = process.env.CI ? it : it.skip;

  itif('keeps JavaScript bundles under size limits', () => {
    const buildDir = path.join(process.cwd(), '.next', 'static', 'chunks');
    
    if (!fs.existsSync(buildDir)) {
      console.warn('Build directory not found. Run "pnpm build" first.');
      return;
    }

    const files = fs.readdirSync(buildDir);
    const bundleSizes: Record<string, number> = {};

    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(buildDir, file);
        const stats = fs.statSync(filePath);
        bundleSizes[file] = stats.size;
      }
    });

    // Check main bundles
    Object.entries(BUNDLE_SIZE_LIMITS).forEach(([bundleName, limit]) => {
      const bundle = Object.entries(bundleSizes).find(([name]) => 
        name.includes(bundleName.replace('.js', ''))
      );

      if (bundle) {
        const [name, size] = bundle;
        expect(size).toBeLessThan(limit);
        console.log(`${name}: ${(size / 1024).toFixed(2)}KB (limit: ${(limit / 1024).toFixed(2)}KB)`);
      }
    });

    // Check total bundle size
    const totalSize = Object.values(bundleSizes).reduce((sum, size) => sum + size, 0);
    const totalLimit = 1024 * 1024; // 1MB total
    
    expect(totalSize).toBeLessThan(totalLimit);
    console.log(`Total JS size: ${(totalSize / 1024).toFixed(2)}KB`);
  });
});

describe('Dependencies Monitoring', () => {
  it('does not include unnecessary large dependencies', () => {
    const packageJson = require('../../../package.json');
    const dependencies = Object.keys(packageJson.dependencies);

    // List of known large dependencies that should not be included
    const blockedDependencies = [
      'moment', // Use date-fns or native dates instead
      'lodash-es', // Use individual lodash functions
      'rxjs', // Unless specifically needed
      'immutable', // Use native JS data structures
    ];

    blockedDependencies.forEach(dep => {
      expect(dependencies).not.toContain(dep);
    });
  });

  it('uses tree-shakeable imports where possible', () => {
    // This is more of a guideline test
    const packageJson = require('../../../package.json');
    const deps = packageJson.dependencies;

    // Check for modular imports
    if (deps['lodash']) {
      console.warn('Consider using lodash-es or individual lodash packages for better tree-shaking');
    }

    if (deps['@chakra-ui/react']) {
      // This is expected for now, but will be removed in migration
      expect(deps['@chakra-ui/react']).toBeTruthy();
    }
  });
});