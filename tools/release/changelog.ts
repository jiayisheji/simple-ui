import * as chalk from 'chalk';
import * as conventionalChangelog from 'conventional-changelog';
import * as changelogCompare from 'conventional-changelog-writer/lib/util';
import { createReadStream, createWriteStream, readFileSync } from 'fs';
import { prompt } from 'inquirer';
import * as merge2 from 'merge2';
import { join } from 'path';
import { Readable } from 'stream';
import { releasePackages } from './release-packages';

interface ChangelogPackage {
  breakingChanges: any[];
  commits: any[];
  deprecations: any[];
}

/** 将提交注释映射到将用于匹配提交消息中给定类型的注释的字符串。 */
const enum CommitNote {
  Deprecation = 'DEPRECATED',
  BreakingChange = 'BREAKING CHANGE'
}

/** 变更日志中显示的软件包的硬编码顺序 */
const orderedChangelogPackages = releasePackages;

/** 变更日志中排除的软件包列表 */
const excludedChangelogPackages: string[] = [];

/**
 * 提示输入变更日志发布名称并添加新的变更日志
 * @param changelogPath CHANGELOG.md路径
 */
export async function promptAndGenerateChangelog(changelogPath: string): Promise<void> {
  // const releaseName = await promptChangelogReleaseName();
  await prependChangelogFromLatestTag(changelogPath, '');
}

/** 向终端提示更改日志发布名称 */
export async function promptChangelogReleaseName(): Promise<string> {
  return (
    await prompt<{ releaseName: string }>({
      type: 'input',
      name: 'releaseName',
      message: 'What should be the name of the release?'
    })
  ).releaseName;
}

/**
 * 将更改日志从最新的Semver标记写入当前的HEAD
 * @param changelogPath CHANGELOG.md路径
 * @param releaseName 应该显示在变更日志中的版本名称
 */
export async function prependChangelogFromLatestTag(changelogPath: string, releaseName: string) {
  const angularPresetWriterOptions = await require('conventional-changelog-angular/writer-opts');
  const outputStream: Readable = conventionalChangelog(
    /* core options */ { preset: 'angular' },
    /* context options */ { title: releaseName },
    /* raw-commits options */ null,
    /* commit parser options */ {
      // Expansion of the convention-changelog-angular preset to extract the package
      // name from the commit message.
      headerPattern: /^(\w*)(?:\((?:([^/]+)\/)?(.*)\))?: (.*)$/,
      headerCorrespondence: ['type', 'package', 'scope', 'subject'],
      noteKeywords: [CommitNote.BreakingChange, CommitNote.Deprecation]
    },
    /* writer options */
    createChangelogWriterOptions(changelogPath, angularPresetWriterOptions)
  );

  // 用于读取现有变更日志的流。 这是必要的，因为我们想将新的变更日志实际添加到现有的变更日志之前。
  const previousChangelogStream = createReadStream(changelogPath);

  return new Promise((resolve, reject) => {
    // 顺序合并变更日志输出和先前的变更日志流，以便新的变更日志部分位于现有版本之前。
    // 然后，将其传输到changelog文件中，以使更改反映在文件系统上。
    const mergedCompleteChangelog = merge2(outputStream, previousChangelogStream);

    // 等待之前的变更日志被完全读取，因为否则我们将从同一源进行读取和写入，这将导致内容被丢弃。
    previousChangelogStream.on('end', () => {
      mergedCompleteChangelog
        .pipe(createWriteStream(changelogPath))
        .once('error', (error: any) => reject(error))
        .once('finish', () => resolve());
    });
  });
}

/**
 * 创建更改日志编写器选项，以确保重复的提交或实验性程序包的提交不会多次出现。
 * 如果已在发布分支上生成了变更日志并将其摘录为“master”，则提交可以多次出现。
 * 在这种情况下，更改日志将已经包含来自主服务器的精心挑选的提交，这些提交可以再次添加到将来的“master”的更改日志中。
 * 这是因为通常从发布分支对补丁和次要发行版进行标记，因此当从“ master”分支发布新的主要版本时，
 * 常规更改日志会尝试将更改日志从上一个主要版本构建为主要HEAD。
 * @param changelogPath
 * @param presetWriterOptions
 */
function createChangelogWriterOptions(changelogPath: string, presetWriterOptions: any) {
  const existingChangelogContent = readFileSync(changelogPath, 'utf8');
  const commitSortFunction = changelogCompare.functionify(['type', 'scope', 'subject']);
  const allPackages = [...orderedChangelogPackages, ...excludedChangelogPackages];

  return {
    // 覆盖变更日志模板，以便我们可以按组呈现提交通过包名。
    headerPartial: readFileSync(join(__dirname, 'changelog-header-template.hbs'), 'utf8'),
    mainTemplate: readFileSync(join(__dirname, 'changelog-root-template.hbs'), 'utf8'),
    commitPartial: readFileSync(join(__dirname, 'changelog-commit-template.hbs'), 'utf8'),
    transform: (commit, context) => {
      commit.notes.forEach(n => (n.type = n.title));
      return presetWriterOptions.transform(commit, context);
    },
    finalizeContext: (context: any) => {
      const packageGroups: { [packageName: string]: ChangelogPackage } = {};

      context.commitGroups.forEach((group: any) => {
        group.commits.forEach((commit: any) => {
          // 过滤出重复的提交。 请注意，我们无法比较SHA，因为如果将提交挑选到其他分支中，则提交将具有不同的SHA。
          if (existingChangelogContent.includes(commit.subject)) {
            console.log(chalk.yellow(`  ↺   Skipping duplicate: "${chalk.bold(commit.header)}"`));
            return false;
          }

          // 仅仅指定引用包的作用域但不遵循常规的changelog-parser解析的提交格式的提交，仍可以从该范围解析为其包。
          // 这处理了提交针对整个包且未指定特定范围的情况。
          // 例如 "refactor(login): 删除过期接口".
          if (!commit.package && commit.scope) {
            const matchingPackage = allPackages.find(pkgName => pkgName === commit.scope);
            if (matchingPackage) {
              commit.scope = null;
              commit.package = matchingPackage;
            }
          }

          // 如果没有指定包名，那就default 防止没有分组名
          const packageName = commit.package || 'default';
          const type = getTypeOfCommitGroupDescription(group.title);

          if (!packageGroups[packageName]) {
            packageGroups[packageName] = { commits: [], breakingChanges: [], deprecations: [] };
          }
          const packageGroup = packageGroups[packageName];

          // 收集提交的所有注释。 打破变更或弃用说明。
          commit.notes.forEach(n => {
            if (n.type === CommitNote.Deprecation) {
              packageGroup.deprecations.push(n);
            } else if (n.type === CommitNote.BreakingChange) {
              packageGroup.breakingChanges.push(n);
            } else {
              throw Error(`Found commit note that is not known: ${JSON.stringify(n, null, 2)}`);
            }
          });

          packageGroup.commits.push({ ...commit, type });
        });
      });

      const sortedPackageGroupNames = Object.keys(packageGroups)
        .filter(pkgName => !excludedChangelogPackages.includes(pkgName))
        .sort(preferredOrderComparator);

      context.packageGroups = sortedPackageGroupNames.map(pkgName => {
        const packageGroup = packageGroups[pkgName];
        return {
          title: pkgName === 'default' ? undefined : pkgName,
          commits: packageGroup.commits.sort(commitSortFunction),
          breakingChanges: packageGroup.breakingChanges,
          deprecations: packageGroup.deprecations
        };
      });

      return context;
    }
  };
}

/**
 * 比较器函数，用于根据硬编码的changelog包顺序对给定的字符串数组进行排序。
 * 未硬编码的条目在硬编码条目之后按字母顺序排序。
 */
function preferredOrderComparator(a: string, b: string): number {
  const aIndex = orderedChangelogPackages.indexOf(a);
  const bIndex = orderedChangelogPackages.indexOf(b);
  // 如果找不到按硬编码顺序排列的软件包名称，则应按字母顺序在硬编码条目后对其进行排序。
  if (aIndex === -1) {
    return bIndex === -1 ? a.localeCompare(b) : 1;
  } else if (bIndex === -1) {
    return -1;
  }
  return aIndex - bIndex;
}

/** 获取提交组描述的类型 */
function getTypeOfCommitGroupDescription(description: string): string {
  if (description === 'Features') {
    return 'feature';
  } else if (description === 'Bug Fixes') {
    return 'bug fix';
  } else if (description === 'Performance Improvements') {
    return 'performance';
  } else if (description === 'Reverts') {
    return 'revert';
  } else if (description === 'Documentation') {
    return 'docs';
  } else if (description === 'Code Refactoring') {
    return 'refactor';
  }
  return description.toLowerCase();
}

/** 当通过CLI调用时，用于生成更改日志的入口点。 */
if (require.main === module) {
  promptAndGenerateChangelog(join(__dirname, '../../CHANGELOG.md')).then(() => {
    console.log(chalk.green('  ✓   Successfully updated the changelog.'));
  });
}
