import * as path from 'path';

export function run(): Promise<void> {
  // Create the mocha test
  const { Mocha } = require('mocha');
  const { glob } = require('glob');
  
  const mocha = new Mocha({
    ui: 'bdd',
    color: true,
    timeout: 10000,
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((resolve, reject) => {
    glob('**/*.test.js', { cwd: testsRoot }, (err: any, files: string[]) => {
      if (err) {
        return reject(err);
      }

      // Add files to the test suite
      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures: number) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}