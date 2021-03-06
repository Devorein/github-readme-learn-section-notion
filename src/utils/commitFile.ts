import { spawn } from 'child_process';

const exec = (cmd: string, args: string[] = []) =>
  new Promise((resolve, reject) => {
    const app = spawn(cmd, args, { stdio: 'pipe' });
    let stdout = '';
    app.stdout.on('data', (data) => {
      stdout = data;
    });
    app.on('close', (code) => {
      if (code !== 0 && !stdout.includes('nothing to commit')) {
        const err = new Error(`Invalid status code: ${code}`) as any;
        err.code = code;
        return reject(err);
      }
      return resolve(code);
    });
    app.on('error', reject);
  });

export const commitFile = async () => {
  await exec('git', [
    'config',
    '--global',
    'user.email',
    '41898282+github-actions[bot]@users.noreply.github.com'
  ]);
  await exec('git', ['config', '--global', 'user.name', 'readme-bot']);
  await exec('git', ['add', 'README.md']);
  await exec('git', ['commit', '-m', 'Updated readme with learn section']);
  await exec('git', ['push']);
};
