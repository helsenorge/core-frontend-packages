import * as fs from 'fs';
import * as path from 'path';

import { globSync } from 'glob';

// 1. CONFIGURATION
const PACKAGE_JSON_PATH = 'package.json';

// Directories that should be "flattened" in exports.
// e.g. lib/foo.js -> ./foo (instead of ./lib/foo)
const FLATTEN_DIRS = new Set(['lib', 'dist']);

const IGNORE_PATTERNS = [
  '**/*.map',
  '**/*.test.js',
  '**/*.spec.js',
  '**/__tests__/**',
  '**/*.scss.d.ts',
  '**/package.json',
  '**/*.tsbuildinfo',
];

function run() {
  const cwd = process.cwd();
  const pkgPath = path.resolve(cwd, PACKAGE_JSON_PATH);

  if (!fs.existsSync(pkgPath)) {
    console.error(`❌ package.json not found in ${cwd}`);
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  // Default to 'lib' if "files" is missing, but usually it respects package.json
  const dirsToScan: string[] = pkg.files || ['lib'];

  // Start with standard package.json export
  const exportMap: Record<string, string> = {
    './package.json': './package.json',
  };

  let totalFilesFound = 0;

  dirsToScan.forEach(dirEntry => {
    const dirPath = path.resolve(cwd, dirEntry);

    // Only process directories (skip root files like README.md in the files array)
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return;
    }

    // Determine if we strip this directory from the export key
    // lib/foo.js -> ./foo (Flattened)
    // config/foo.json -> ./config/foo.json (Not flattened)
    const shouldFlatten = FLATTEN_DIRS.has(dirEntry);

    // Scan the directory
    const files = globSync('**/*.{js,d.ts,json}', {
      cwd: dirPath,
      ignore: IGNORE_PATTERNS,
      posix: true,
    });

    const jsFileSet = new Set(files.filter(f => f.endsWith('.js')));

    files.forEach(file => {
      // "file" is relative to "dirEntry" (e.g. "utils/date.js")
      const fullPath = `./${dirEntry}/${file}`;

      // Calculate the base path for the export key
      // If flat: "utils/date.js"
      // If not flat: "config/utils/date.js"
      const pathForExport = shouldFlatten ? file : `${dirEntry}/${file}`;

      let exportKey = '';

      // --- CASE 1: JavaScript ---
      if (file.endsWith('.js')) {
        if (pathForExport.endsWith('index.js')) {
          // lib/components/index.js -> ./components
          // config/index.js -> ./config
          const dirName = path.dirname(pathForExport);
          exportKey = dirName === '.' ? '.' : `./${dirName}`;
        } else {
          // lib/utils.js -> ./utils
          const baseName = pathForExport.substring(0, pathForExport.length - 3);
          exportKey = `./${baseName}`;
        }
        exportMap[exportKey] = fullPath;
      }

      // --- CASE 2: JSON ---
      else if (file.endsWith('.json')) {
        // Always keep extension for JSON
        exportKey = `./${pathForExport}`;
        exportMap[exportKey] = fullPath;
      }

      // --- CASE 3: Type Definitions (Orphans) ---
      else if (file.endsWith('.d.ts')) {
        const jsSibling = file.replace(/\.d\.ts$/, '.js');

        // Skip if JS sibling exists (TS finds it automatically)
        if (jsFileSet.has(jsSibling)) {
          return;
        }

        // Export standalone type
        const baseName = pathForExport.substring(0, pathForExport.length - 5);
        exportKey = `./${baseName}`;
        exportMap[exportKey] = fullPath;
      }

      totalFilesFound++;
    });
  });

  // SORTING
  const sortedExports = Object.keys(exportMap)
    .sort()
    .reduce(
      (obj, key) => {
        obj[key] = exportMap[key];
        return obj;
      },
      {} as Record<string, string>
    );

  // WRITE
  pkg.exports = sortedExports;
  delete pkg.typesVersions; // Clean up legacy field

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  console.log(`✅ Scanned [${dirsToScan.join(', ')}]`);
  console.log(`✅ Generated ${Object.keys(sortedExports).length} exports in package.json`);
}

run();
