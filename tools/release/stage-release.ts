import { readFileSync } from 'fs';
import { writeJSON } from 'fs-extra';
import { join } from 'path';
import { BaseReleaseTask } from './base-release-task';
import { promptAndGenerateChangelog } from './changelog';
import { GitClient } from './git/git-client';
import { logger } from './logger';
import { promptForNewVersion } from './prompt/new-version-prompt';
import { parseVersionName, Version } from './version-name/parse-version';

/** changelog的默认文件名 */
export const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/**
 * 可以实例化的类以暂存新版本。 这些任务需要用户通过命令行提示进行交互/输入。
 * 发布阶段包括以下步骤：
 * 1. 提示发布类型（带有版本建议）
 * 2. 如果未选择建议，则提示输入版本名称
 * 3. 声明没有未提交的本地更改
 * 4. 确认已签出正确的发布分支（例如6.4.x表示补丁）如果使用其他分支，请尝试自动切换到发布分支
 * 5. 确认Github状态检查通过了publish分支
 * 6. 断言本地分支与远程分支是最新的
 * 7. 为发布阶段创建一个新分支（release-stage / {VERSION}）
 * 8. 切换到暂存分支并更新package.json
 * 9. 提示发布名称并生成变更日志
 * 10.等待用户继续（用户可以自定义生成的变更日志）
 * 11.创建一个提交，其中包括暂存分支中的所有更改
 */
class StageReleaseTask extends BaseReleaseTask {
  /** 解析项目的当前版本 */
  currentVersion: Version;

  /** 指定项目的序列化package.json */
  packageJson: any;
  /** 项目包JSON的路径 */
  packageJsonPath: string;

  constructor(public projectDir: string, public repositoryOwner: string, public repositoryName: string) {
    super(new GitClient(projectDir, `https://github.com/${repositoryOwner}/${repositoryName}.git`));

    this.packageJsonPath = join(projectDir, 'package.json');
    this.packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));
    this.currentVersion = parseVersionName(this.packageJson.version) as Version;

    if (!this.currentVersion) {
      logger.error(
        `Cannot parse current version in ${logger.italic('package.json')}. Please ` +
          `make sure "${this.packageJson.version}" is a valid Semver version.`
      );
      process.exit(1);
    }
  }
  async run() {
    logger.blank();
    logger.divider();
    logger.log('  Angular Simple-Ui stage release script');
    logger.divider();
    logger.blank();

    // 根据当前版本获取将要发布的新版本
    const newVersion = await promptForNewVersion(this.currentVersion);
    const newVersionName = newVersion.format();
    const needsVersionBump = !newVersion.equals(this.currentVersion);

    // 在新版本的提示之后，打印一个空行，因为我们希望新的日志消息更多地出现在前台。
    logger.blank();

    // 确保没有未提交的更改。 切换到发布分支之前进行检查就足够了，因为未暂存的更改并非特定于Git分支。
    this.verifyNoUncommittedChanges();

    // 该分支将用于为新选定的版本暂定发行
    const publishBranch = await this.assertValidPublishBranch(newVersion);

    this.verifyLocalCommitsMatchUpstream(publishBranch);

    if (needsVersionBump) {
      await this._updatePackageJsonVersion(newVersionName);
      logger.log(
        `  ✓   Updated the version to "${logger.bold(newVersionName)}" inside of the ` + `${logger.italic('package.json')}`,
        'green'
      );
      logger.blank();
    }

    // 生产版本日志
    await promptAndGenerateChangelog(join(this.projectDir, CHANGELOG_FILE_NAME));

    logger.blank();
    logger.log(`  ✓   Updated the changelog in ` + `"${logger.bold(CHANGELOG_FILE_NAME)}"`, 'green');
    logger.log(
      `  ⚠   Please review CHANGELOG.md and ensure that the log contains only changes ` +
        `that apply to the public library release. When done, proceed to the prompt below.`,
      'yellow'
    );
    logger.blank();

    if (!(await this.promptConfirm('Do you want to proceed and commit the changes?'))) {
      logger.blank();
      logger.log('Aborting release staging...', 'yellow');
      process.exit(0);
    }

    this.git.stageAllChanges();

    // 注意:在这里更新提交消息时。还请更新发布脚本以检测新的提交消息。
    if (needsVersionBump) {
      this.git.createNewCommit(`release: cut the ${newVersionName} release`);
    } else {
      this.git.createNewCommit(`chore: update changelog for ${newVersionName}`);
    }

    logger.blank();
    logger.log(`  ✓   Created the staging commit for: "${newVersionName}".`, 'green');
    logger.log(`  ✓   Please push the changes and submit a PR on GitHub.`, 'green');
    logger.blank();
  }

  /** 更新package.json的version */
  private async _updatePackageJsonVersion(newVersionName: string) {
    const newPackageJson = { ...this.packageJson, version: newVersionName };
    await writeJSON(this.packageJsonPath, newPackageJson, {
      spaces: 2
    });
  }
}

if (require.main === module) {
  new StageReleaseTask(join(__dirname, '../../'), 'jiayisheji', 'simple-ui').run();
}
