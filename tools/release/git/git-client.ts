import { spawnSync, SpawnSyncReturns } from 'child_process';

/**
 * 可用于在给定项目目录中执行Git命令的类。
 *
 * 注意：依靠当前进程的工作目录是不好的，因为不能保证工作目录始终是目标项目目录。
 */
export class GitClient {
  constructor(public projectDir: string, public remoteGitUrl: string) {}

  addFileChanges(path: string): boolean {
    return this._spawnGitProcess(['add', path]).status === 0;
  }

  /** 切换指定名称的现有分支 */
  checkoutBranch(branchName: string): boolean {
    return this._spawnGitProcess(['checkout', branchName]).status === 0;
  }

  /** 创建一个基于先前活动分支的新分支 */
  checkoutNewBranch(branchName: string): boolean {
    return this._spawnGitProcess(['checkout', '-b', branchName]).status === 0;
  }

  /** 使用给定的提交消息在当前分支内创建一个新的提交 */
  createNewCommit(message: string): boolean {
    // 创建提交时禁用预提交挂钩。 开发人员可能尚未为“git-clang-format”预提交挂钩设置其Git配置。
    return this._spawnGitProcess(['commit', '--no-verify', '-m', message]).status === 0;
  }

  /** 为指定的提交引用创建tag */
  createTag(commitRef: string, tagName: string, message: string): boolean {
    return this._spawnGitProcess(['tag', tagName, '-m', message]).status === 0;
  }

  /** 获取已设置的所有可用远程操作的列表 */
  getAvailableRemotes(): string[] {
    // 请注意，“git”始终将换行符（\n）于新行
    return this._spawnGitProcess(['remote'])
      .stdout.trim()
      .split('\n');
  }

  /** 获取指定提交引用的标题 */
  getCommitTitle(commitRef: string): string {
    return this._spawnGitProcess(['log', '-n1', '--format="%s"', commitRef]).stdout.trim();
  }

  /**
   * 获取项目目录的当前签出分支
   */
  getCurrentBranch() {
    return this._spawnGitProcess(['symbolic-ref', '--short', 'HEAD']).stdout.trim();
  }

  /** 获取指定git引用的最新提交SHA */
  getLocalCommitSha(refName: string) {
    return this._spawnGitProcess(['rev-parse', refName]).stdout.trim();
  }

  /** 获取指定远程存储库分支的提交SHA */
  getRemoteCommitSha(branchName: string): string {
    return this._spawnGitProcess(['ls-remote', this.remoteGitUrl, '-h', `refs/heads/${branchName}`])
      .stdout.split('\t')[0]
      .trim();
  }

  /** 获取指定本地tag的Git SHA */
  getShaOfLocalTag(tagName: string) {
    // 我们需要使用“ ^ {}”后缀来指示Git将tag引用到实际commit。 See: https://www.git-scm.com/docs/git-rev-parse
    return this._spawnGitProcess(['rev-parse', `refs/tags/${tagName}^{}`]).stdout.trim();
  }

  /** 获取指定远程tag的Git SHA */
  getShaOfRemoteTag(tagName: string): string {
    // 我们需要使用“ ^ {}”后缀来指示Git将tag引用到实际commit。 See: https://www.git-scm.com/docs/git-rev-parse
    return this._spawnGitProcess(['ls-remote', this.remoteGitUrl, '-t', `refs/tags/${tagName}^{}`])
      .stdout.split('\t')[0]
      .trim();
  }

  /** 检查指定的tag是否在本地存在 */
  hasLocalTag(tagName: string) {
    return this._spawnGitProcess(['rev-parse', `refs/tags/${tagName}`], false).status === 0;
  }

  /** 检查给定远程是否已设置 */
  hasRemote(remoteName: string): boolean {
    return this._spawnGitProcess(['remote', 'get-url', remoteName], false).status === 0;
  }

  /** 获取当前Git存储库是否有未提交的更改 */
  hasUncommittedChanges(): boolean {
    return this._spawnGitProcess(['diff-index', '--quiet', 'HEAD']).status !== 0;
  }
  /** 将本地推送到远程git仓库 */
  pushRemote(branchName: string = 'master'): boolean {
    return this._spawnGitProcess(['push', 'origin', branchName]).status === 0;
  }

  /** 将指定的tag推送到远程git仓库 */
  pushTagToRemote(tagName: string, remoteName: string = this.remoteGitUrl): boolean {
    return this._spawnGitProcess(['push', remoteName, `refs/tags/${tagName}`]).status === 0;
  }

  /** 通过运行`git add -A`暂存所有更改 */
  stageAllChanges(): boolean {
    return this._spawnGitProcess(['add', '-A']).status === 0;
  }

  /**
   * 生成运行Git的子进程。
   * “stderr”输出将被继承，并在出现错误的情况下进行打印。 这使得调试失败的命令更加容易。
   */
  private _spawnGitProcess(args: string[], printStderr = true): SpawnSyncReturns<string> {
    return spawnSync('git', args, {
      cwd: this.projectDir,
      stdio: ['pipe', 'pipe', printStderr ? 'inherit' : 'pipe'],
      encoding: 'utf8',
    });
  }
}
