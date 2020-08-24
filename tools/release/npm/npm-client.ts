import { spawnSync } from 'child_process';

/** 在指定的目录中运行NPM publish */
export function npmPublish(
  packagePath: string,
  distTag: string
): string | null {
  const result = spawnSync(
    'npm',
    ['publish', '--access', 'public', '--tag', distTag],
    {
      cwd: packagePath,
      shell: true,
      env: process.env,
    }
  );

  // 我们只希望在退出代码不为零时返回错误。NPM默认情况下将日志消息打印到“stdout”，因此仅仅检查“stdout”是不可靠的。
  if (result.status !== 0) {
    return result.stderr.toString();
  }
  return null;
}
