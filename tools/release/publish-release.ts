import { readFileSync } from 'fs';
import { join } from 'path';
import { BaseReleaseTask } from './base-release-task';
import { BuildReleasePackages } from './build-release-package';
import { extractReleaseNotes } from './extract-release-notes';
import { GitClient } from './git/git-client';
import { getGithubNewReleaseUrl } from './git/github-urls';
import { logger } from './logger';
import { npmPublish } from './npm/npm-client';
import { promptForNpmDistTag } from './prompt/npm-dist-tag-prompt';
import { promptForUpstreamRemote } from './prompt/upstream-remote-prompt';
import { releasePackages } from './release-packages';
import { parseVersionName, Version } from './version-name/parse-version';

/** changelog的默认文件名 */
export const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/**
 * 发布builds包
 * 发布阶段包括以下步骤：
 * 1. builds包
 * 2. dist/simple-ui 移动到simple-ui-builds里
 * 3. 打tag并提交远程
 */
class PublishReleaseTask extends BaseReleaseTask {
  /** 解析项目的当前版本 */
  currentVersion: Version;

  /** 指定项目的序列化package.json */
  packageJson: any;

  /** 项目包JSON的路径 */
  packageJsonPath: string;

  /** 项目发布输出的路径 */
  releaseOutputPath: string;

  /** 发布任务发布到NPM的软件包列表 */
  releasePackages: BuildReleasePackages;

  constructor(public projectDir: string, public repositoryOwner: string, public repositoryName: string) {
    super(new GitClient(projectDir, `https://github.com/${repositoryOwner}/${repositoryName}.git`));

    this.packageJsonPath = join(projectDir, 'package.json');
    this.releaseOutputPath = join(projectDir, 'dist/libs');
    this.packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));
    const version = this.packageJson.version || '';
    const parsedVersion = parseVersionName(version);
    if (!parsedVersion) {
      logger.error(
        `Cannot parse current version in ${logger.italic('package.json')}. Please make sure "${version}" is a valid Semver version.`
      );
      process.exit(1);
    }
    this.currentVersion = parsedVersion;
    this.releasePackages = new BuildReleasePackages(projectDir, this.releaseOutputPath, this.packageJson);
  }
  async run() {
    logger.blank();
    logger.divider();
    logger.log('  Angular Simple-UI publish release script');
    logger.divider();
    logger.blank();

    const newVersion = this.currentVersion;
    const newVersionName = this.currentVersion.format();
    await this.releasePackages.run(['simple-ui']);
    // await this.releasePackages.run(releasePackages);
    // 确保没有未提交的更改。切换到发布分支之前进行检查就足够了，因为未暂存的更改并非特定于Git分支。
    this.verifyNoUncommittedChanges();

    // 将用于生成当前版本发布的输出的分支。
    const publishBranch = await this.assertValidPublishBranch(newVersion);

    this._verifyLastCommitFromStagingScript();
    this.verifyLocalCommitsMatchUpstream(publishBranch);

    const upstreamRemote = await this._getProjectUpstreamRemote();
    const npmDistTag = await promptForNpmDistTag(newVersion);

    // 如果用户想将稳定版本发布到“next” npm标签，我们要仔细检查一下，因为通常只有预发布版本才被推送到该标签。
    if (npmDistTag === 'next' && !newVersion.prereleaseLabel) {
      await this._promptStableVersionForNextTag();
    }
    // 发布构建指定的包
    const packages = await this.releasePackages.run(releasePackages);
    logger.info(`  ✓   Built the release output.`, 'green');

    // 在发布之前，根据发布输出验证检查所有发布包。
    if (!packages.length) {
      logger.error(`  ✘   Release output does not pass all release validations. Please fix all failures or reach out to the team.`);
      process.exit(1);
    }

    // 从变更日志文件中提取新版本的发行说明
    const extractedReleaseNotes = extractReleaseNotes(join(this.projectDir, CHANGELOG_FILE_NAME), newVersionName);

    if (!extractedReleaseNotes) {
      logger.error(`  ✘   Could not find release notes in the changelog.`);
      process.exit(1);
    }

    const { releaseNotes, releaseTitle } = extractedReleaseNotes;

    // 在发布到NPM之前，创建并推送发布标签。
    this._createReleaseTag(newVersionName, releaseNotes);
    this._pushReleaseTag(newVersionName, upstreamRemote);

    await this._promptConfirmReleasePublish();

    for (let packageName of packages) {
      this._publishPackageToNpm(packageName, npmDistTag);
    }

    const newReleaseUrl = getGithubNewReleaseUrl({
      owner: this.repositoryOwner,
      repository: this.repositoryName,
      tagName: newVersionName,
      releaseTitle: releaseTitle,
      // TODO: 我们无法在此处插入真实的更改日志，因为URL会变得太大，Github会将其视为格式错误的页面请求。
      body: 'Copy-paste changelog in here!'
    });

    logger.blank();
    logger.info(logger.bold(`  ✓   Published all packages successfully`), 'green');
    logger.info(`  ⚠   Please draft a new release of the version on Github.`);
    logger.info(`      ${newReleaseUrl}`);
  }

  /**
   * 验证当前分支上的最新提交是否已经通过发布阶段脚本创建。
   */
  private _verifyLastCommitFromStagingScript() {
    if (!/chore: (bump version|update changelog for)/.test(this.git.getCommitTitle('HEAD'))) {
      logger.error(`  ✘   The latest commit of the current branch does not seem to be ` + ` created by the release staging script.`);
      logger.error(`      Please stage the release using the staging script.`);
      process.exit(1);
    }
  }

  /**
   * 提示用户是否确定应将当前的稳定版本发布到“next” NPM dist-tag。
   */
  private async _promptStableVersionForNextTag() {
    if (!(await this.promptConfirm('Are you sure that you want to release a stable version to the "next" tag?'))) {
      logger.blank();
      logger.log('Aborting publish...', 'yellow');
      process.exit(0);
    }
  }

  /** 提示用户是否确定脚本应继续将发行版发布到NPM。 */
  private async _promptConfirmReleasePublish() {
    if (!(await this.promptConfirm('Are you sure that you want to release now?'))) {
      logger.blank();
      logger.log('Aborting publish...', 'yellow');
      process.exit(0);
    }
  }

  /** 在给定的NPM dist标签内发布指定的程序包。 */
  private _publishPackageToNpm(packageName: string, npmDistTag: string) {
    logger.info(`  ⭮   Publishing "${packageName}"..`, 'green');

    const errorOutput = npmPublish(join(this.releaseOutputPath, packageName), npmDistTag);

    if (errorOutput) {
      logger.error(`  ✘   An error occurred while publishing "${packageName}".`);
      logger.error(`      Please check the terminal output and reach out to the team.`);
      logger.error(`\n${errorOutput}`);
      process.exit(1);
    }

    logger.info(`  ✓   Successfully published "${packageName}"`);
  }

  /** 在本地创建指定的发行标签 */
  private _createReleaseTag(tagName: string, releaseNotes: string) {
    if (this.git.hasLocalTag(tagName)) {
      const expectedSha = this.git.getLocalCommitSha('HEAD');

      if (this.git.getShaOfLocalTag(tagName) !== expectedSha) {
        logger.error(
          `  ✘   Tag "${tagName}" already exists locally, but does not refer ` +
            `to the version bump commit. Please delete the tag if you want to proceed.`
        );
        process.exit(1);
      }

      logger.info(`  ✓   Release tag already exists: "${logger.italic(tagName)}"`, 'green');
    } else if (this.git.createTag('HEAD', tagName, releaseNotes)) {
      logger.info(`  ✓   Created release tag: "${logger.italic(tagName)}"`, 'green');
    } else {
      logger.error(`  ✘   Could not create the "${tagName}" tag.`);
      logger.error(`      Please make sure there is no existing tag with the same name.`);
      process.exit(1);
    }
  }

  /** 将发布标记推送到远程存储库 */
  private _pushReleaseTag(tagName: string, upstreamRemote: string) {
    const remoteTagSha = this.git.getShaOfRemoteTag(tagName);
    const expectedSha = this.git.getLocalCommitSha('HEAD');

    // The remote tag SHA is empty if the tag does not exist in the remote repository.
    if (remoteTagSha) {
      if (remoteTagSha !== expectedSha) {
        logger.error(`  ✘   Tag "${tagName}" already exists on the remote, but does not ` + `refer to the version bump commit.`);
        logger.error(`      Please delete the tag on the remote if you want to proceed.`);
        process.exit(1);
      }

      logger.info(`  ✓   Release tag already exists remotely: "${logger.italic(tagName)}"`, 'green');
      return;
    }

    if (!this.git.pushTagToRemote(tagName, upstreamRemote)) {
      logger.error(`  ✘   Could not push the "${tagName}" tag upstream.`);
      logger.error(`      Please make sure you have permission to push to the ` + `"${this.git.remoteGitUrl}" remote.`);
      process.exit(1);
    }

    logger.info(`  ✓   Pushed release tag upstream.`, 'green');
  }

  /**
   * 确定用于将更改向上游推送到github的Git远程服务器的名称。
   */
  private async _getProjectUpstreamRemote() {
    const remoteName = this.git.hasRemote('upstream') ? 'upstream' : await promptForUpstreamRemote(this.git.getAvailableRemotes());

    logger.info(`  ✓   Using the "${remoteName}" remote for pushing changes upstream.`, 'green');
    return remoteName;
  }
}

if (require.main === module) {
  new PublishReleaseTask(join(__dirname, '../../'), 'jiayisheji', 'simple-ui').run();
}
