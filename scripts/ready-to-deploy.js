//단일 파일로 압축

import fs from 'fs';
import { zipBuildResult } from './ready-to-deploy-utils';
import { spawnSync } from 'child_process';

const arg = process.argv.slice(2);
const buildTarget = arg[0];
const executionEnv = arg[1];
const distDir = './dist';
const targetDir = `${distDir}/${buildTarget}`;
//const tempDir = `${targetDir}/temp-${uuidv4()}`;

//make Folder

const ready = async () => {
  !fs.existsSync(distDir) && fs.mkdirSync(distDir);
  !fs.existsSync(targetDir) && fs.mkdirSync(targetDir);
  //!fs.existsSync(tempDir) && fs.mkdirSync(tempDir);

  /* process.env.REACT_APP_VERSION.replace(
    '$npm_package_version',
    process.env.npm_package_version
  ); */

  let buildName = ``;
  let verName = '';

  const childProcess = spawnSync(`git`, ['describe', '--tags', '--abbrev=0'], {
    stdio: 'pipe',
    shell: true
  });

  // console.log(childProcess);

  if (childProcess.stdout && childProcess.stdout.byteLength > 0) {
    verName = childProcess.stdout.toString().replace('\n', '');
    //console.log(verName);
  }

  if (childProcess.stderr && childProcess.stderr.byteLength > 0) {
    console.log(childProcess.stderr.toString().replace('\n', ''));
    console.log('fatal error : fail to get ver info');
    return;
  }

  const verNameWithEnv = verName + `.${executionEnv}`;
  buildName = `[AI Berlin] ${verNameWithEnv}`;

  fs.copyFileSync('./build/index.html', './build/dynamic.html');
  fs.writeFileSync('./build/ver.json', JSON.stringify({ ver: verNameWithEnv }));

  //zip
  zipBuildResult(targetDir, `${buildName}.zip`);

 // fs.rmdirSync(tempDir, { recursive: true });
};

ready();
