import { Version } from './parse-version';

export type VersionType = 'major' | 'minor' | 'patch';

/** 确定用于发布指定版本的允许分支名称 */
export function getAllowedPublishBranches(version: Version): string[] {
  const versionType = getSemverVersionType(version);

  if (versionType === 'major') {
    return ['master'];
  } else if (versionType === 'minor') {
    // 看守者也可能希望从“master”分支以外的其他分支进行次要释放。
    // 如果重大更改已合并到“master”中，而非重大更改被挑选到单独的分支中（例如7.x），则可能会发生这种情况
    return ['master', `${version.major}.x`];
  }

  return [`${version.major}.${version.minor}.x`];
}

/** 确定指定的Semver版本的类型 */
export function getSemverVersionType(version: Version): VersionType {
  if (version.minor === 0 && version.patch === 0) {
    return 'major';
  } else if (version.patch === 0) {
    return 'minor';
  } else {
    return 'patch';
  }
}
