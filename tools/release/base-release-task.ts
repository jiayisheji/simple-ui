import { prompt } from 'inquirer';
import { GitClient } from './git/git-client';
import { logger } from './logger';
import { Version } from './version-name/parse-version';
import { getAllowedPublishBranches } from './version-name/publish-branches';

/**
 * 基本发行版任务类，其中包含在登台和发布脚本中常用的共享方法
 */
export class BaseReleaseTask {
  /** 可以执行Git命令的包装器的实例  */
  constructor(public git: GitClient) {}

  /** 检查用户是否在指定版本的允许发布分支上 */
  protected async assertValidPublishBranch(newVersion: Version): Promise<string> {
    const allowedBranches = getAllowedPublishBranches(newVersion);
    const currentBranchName = this.git.getCurrentBranch();

    // 如果当前分支已经与允许的发布分支之一匹配，则只需退出此函数并返回当前使用的发布分支即可继续操作。
    if (allowedBranches.includes(currentBranchName)) {
      logger.success(`  ✓   Using the "${logger.italic(currentBranchName)}" branch.`);
      return currentBranchName;
    }

    logger.error('  ✘   You are not on an allowed publish branch.');
    logger.info(`      Allowed branches are: ${logger.bold(allowedBranches.join(', '))}`);
    logger.blank('info');

    // 提示用户是否要强制使用当前分支。
    // 我们支持这一点，因为在某些情况下，发行版不使用公共的发布分支。
    // 例如 一个主要版本被延迟，并且为下一个次要版本收集了新功能。
    if (await this.promptConfirm(`Do you want to forcibly use the current branch? (${logger.italic(currentBranchName)})`)) {
      logger.blank();
      logger.success(`  ✓   Using the "${logger.italic(currentBranchName)}" branch.`);
      return currentBranchName;
    }

    logger.blank('warn');
    logger.warn('      Please switch to one of the allowed publish branches.');
    process.exit(0);
  }

  /** 验证本地分支与给定的发布分支是否最新 */
  protected verifyLocalCommitsMatchUpstream(publishBranch: string) {
    const upstreamCommitSha = this.git.getRemoteCommitSha(publishBranch);
    const localCommitSha = this.git.getLocalCommitSha('HEAD');

    // 检查当前分支是否与远程分支同步。
    if (upstreamCommitSha !== localCommitSha) {
      logger.error(
        `  ✘ The current branch is not in sync with the remote branch. ` +
          `Please make sure your local branch "${logger.italic(publishBranch)}" is up to date.`
      );
      process.exit(1);
    }
  }

  /** 验证项目中没有未提交的更改 */
  protected verifyNoUncommittedChanges() {
    if (this.git.hasUncommittedChanges()) {
      logger.error(`  ✘   There are changes which are not committed and should be discarded.`);
      process.exit(1);
    }
  }

  /** 向用户提示确认问题和指定的消息。 */
  protected async promptConfirm(message: string, defaultValue = false): Promise<boolean> {
    return (
      await prompt<{ result: boolean }>({
        type: 'confirm',
        name: 'result',
        message: message,
        default: defaultValue
      })
    ).result;
  }
}
