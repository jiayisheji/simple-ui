import { ListChoiceOptions, prompt, Separator, SeparatorOptions } from 'inquirer';
import { createNewVersion, ReleaseType } from '../version-name/create-version';
import { parseVersionName, Version } from '../version-name/parse-version';
import { determineAllowedPrereleaseLabels } from './prerelease-labels';

/** 将提示您回答. */
interface VersionPromptAnswers {
  isPrerelease: boolean;
  prereleaseLabel: string;
  proposedVersion: string;
}

/**
 * 提示当前的用户输入界面输入新的版本名称。 新版本将被验证为指定当前版本的适当增量。
 */
export async function promptForNewVersion(currentVersion: Version): Promise<Version> {
  const allowedPrereleaseChoices = determineAllowedPrereleaseLabels(currentVersion);
  const versionChoices: Array<ListChoiceOptions | SeparatorOptions> = [];
  const currentVersionName = currentVersion.format();

  if (currentVersion.prereleaseLabel) {
    versionChoices.push(
      createVersionChoice(currentVersion, 'stable-release', 'Stable release'),
      createVersionChoice(currentVersion, 'bump-prerelease', 'Bump pre-release number'),
    );

    // 如果可以将当前版本更改为新标签，则仅添加选项以更改预发行标签。
    // 例如 已经标记为候选版本的版本不应更改为Beta版或alpha版。
    if (allowedPrereleaseChoices) {
      versionChoices.push({
        value: 'new-prerelease-label',
        name: `New pre-release (${allowedPrereleaseChoices.map(c => c.value).join(', ')})`,
      });
    }
  } else {
    versionChoices.push(
      createVersionChoice(currentVersion, 'major', 'Major release'),
      createVersionChoice(currentVersion, 'minor', 'Minor release'),
      createVersionChoice(currentVersion, 'patch', 'Patch release'),
    );
  }

  // 我们始终希望提供使用当前版本的选项。 如果该版本之前被手动修改过，这将很有用。
  versionChoices.push(new Separator(), { name: `Use current version (${currentVersionName})`, value: currentVersionName });

  const answers = await prompt<VersionPromptAnswers>([
    {
      type: 'list',
      name: 'proposedVersion',
      message: `What's the type of the new release?`,
      choices: versionChoices,
    },
    {
      type: 'confirm',
      name: 'isPrerelease',
      message: 'Should this be a pre-release?',
      // 如果当前版本已经是预发行版本，或者如果该版本已经被手动修改，我们不想提示是否应该是预发行版本。
      when: ({ proposedVersion }) => !currentVersion.prereleaseLabel && proposedVersion !== currentVersionName,
      default: false,
    },
    {
      type: 'list',
      name: 'prereleaseLabel',
      message: 'Please select a pre-release label:',
      choices: allowedPrereleaseChoices,
      when: ({ isPrerelease, proposedVersion }) =>
        // 如果当前版本是预发行版本，或者仅应更改现有的预发行版本标签，则仅提示您选择一个预发行版本标签。
        isPrerelease || proposedVersion === 'new-prerelease-label',
    },
  ]);

  // 如果新版本只是更改了预发行标签，我们将新版本基于当前版本。 否则，我们将使用提示答案中的建议版本。
  const newVersion =
    answers.proposedVersion === 'new-prerelease-label' ? currentVersion.clone() : (parseVersionName(answers.proposedVersion) as Version);

  if (answers.prereleaseLabel) {
    newVersion.prereleaseLabel = answers.prereleaseLabel;
    newVersion.prereleaseNumber = 0;
  }

  return newVersion;
}

/** 创建一个新选择，以在“查询者”列表提示中选择一个版本 */
function createVersionChoice(currentVersion: Version, releaseType: ReleaseType, message: string) {
  const versionName = createNewVersion(currentVersion, releaseType).format();

  return {
    value: versionName,
    name: `${message} (${versionName})`,
  };
}
