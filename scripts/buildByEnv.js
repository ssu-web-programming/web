import { GetEnvVars } from 'env-cmd';
import { spawnSync } from 'child_process';

const arg = process.argv.slice(2);
const serverEnv = arg[0];

const build = async () => {
  await buildTarget('staging');
  await buildTarget('prod');
};

const buildTarget = async (target) => {
  console.log(`start ${serverEnv}_${target} building`);
  const env = await GetEnvVars({
    envFile: {
      filePath: `./env/.env.${target}.js`
    }
  });
  await spawnSync(`react-scripts`, ['--openssl-legacy-provider', 'build'], {
    stdio: 'inherit',
    shell: true,
    env
  });

  await spawnSync(`node`, ['-r', 'esm', './scripts/ready-to-deploy.js', serverEnv,target], {
    stdio: 'inherit',
    shell: true,
    env
  });

  console.log(`end ${serverEnv}_${target} building`);
};

build();
