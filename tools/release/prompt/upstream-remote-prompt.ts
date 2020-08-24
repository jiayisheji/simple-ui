import { prompt } from 'inquirer';

/**
 * 提示当前用户输入接口的Git远程引用当前Git项目的上游。
 */
export async function promptForUpstreamRemote(availableRemotes: string[]): Promise<string> {
  const { distTag } = await prompt<{ distTag: string }>({
    type: 'list',
    name: 'distTag',
    message: 'What is the Git remote for pushing changes upstream?',
    choices: availableRemotes.map(remoteName => ({ value: remoteName, name: remoteName })),
  });

  return distTag;
}
