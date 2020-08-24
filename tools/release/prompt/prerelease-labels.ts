import { Version } from '../version-name/parse-version';

/** 用于选择Beta预发行标签的查询者选择 */
const NEXT_CHOICE = { value: 'next', name: '"Next"" pre-release' };

/** 用于选择发布候选标签的查询者选择。 */
const RC_CHOICE = { value: 'rc', name: 'Release candidate' };

/**
 * 确定给定版本的所有允许的预发布标签。 例如，发行候选版本不能更改为Alpha或Beta预发行版本。
 */
export function determineAllowedPrereleaseLabels(version: Version) {
  const { prereleaseLabel } = version;

  if (!prereleaseLabel) {
    return [NEXT_CHOICE, RC_CHOICE];
  } else if (prereleaseLabel === 'next') {
    return [RC_CHOICE];
  }

  return null;
}
