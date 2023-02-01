import { readFile, writeFile } from 'fs';

type PackageData = {
  name: string;
  author: string;
  version: string;
  main: string;
  peerDependencies: string;
  license: string;
  dependencies: string;
  scripts?: Record<string, string>;
};

/**
 * Function used to create the package.json file under /lib
 * @param packageName - the name field in package.json (for example: @helsenorge/toolkit')
 */
export function createPackageJsonFile(packageName: string, inputPath: string, outputPath: string) {
  return new Promise((resolve: (value: string) => void) => {
    readFile(inputPath, 'utf8', (err, data: string) => {
      if (err) {
        throw err;
      }
      resolve(data);
    });
  })
    .then((data: string) => JSON.parse(data))
    .then((packageData: PackageData) => {
      const { author, version, peerDependencies, license, dependencies } = packageData;

      const minimalPackage: PackageData = {
        name: packageName,
        author,
        version,
        main: './index.js',
        license,
        peerDependencies,
        dependencies,
      };

      return new Promise(resolve => {
        const data = JSON.stringify(minimalPackage, null, 2);
        writeFile(outputPath, data, err => {
          if (err) throw err;
          console.log(`Created package.json in ${outputPath}`);
          resolve(outputPath);
        });
      });
    });
}
