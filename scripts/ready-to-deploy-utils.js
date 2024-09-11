import archiver from 'archiver';
import { spawnSync } from 'child_process';
import fs from 'fs';
import * as rra from 'recursive-readdir-async';
import xml2js from 'xml2js';

export const makeAuditReport = (targetDir, fileName) => {
  spawnSync(`yarn`, ['genAuditReport', `./${targetDir}/${fileName}`], {
    stdio: 'inherit',
    shell: true
  });
};

export const zipBuildResult = (targetDir, fileName) => {
  const output = fs.createWriteStream(`./${targetDir}/${fileName}`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.directory('./build', false);
  //archive.file('./ver.json', { date: JSON.stringify({ rev }) });

  archive.finalize();
};

export const getSVNRev = (workingDir, targetDir) => {
  return new Promise((resolve) => {
    //const tempID = Buffer.from(Math.random().toString()).toString('base64');

    spawnSync('svn', ['info', '--xml', '>', `${targetDir}/svnInfo.xml`], {
      stdio: 'inherit',
      shell: true,
      cwd: workingDir
    });

    const parser = new xml2js.Parser();
    const svnInfo = fs.readFileSync(`${targetDir}/svnInfo.xml`, 'utf8');

    parser.parseStringPromise(svnInfo).then(function (result) {
      resolve(result.info.entry[0].commit[0].$.revision);
    });
  });
};

export const listSpecificExtFile = async (folder, ext) => {
  try {
    const list = await rra.list(folder, { extensions: true });

    const res = list
      .filter((file) => {
        return file.extension === `.${ext}`;
      })
      .filter((file) => {
        return file.isDirectory === false;
      });

    return res;
  } catch (err) {
    console.log('err: ', err);
    throw err;
  }
};
