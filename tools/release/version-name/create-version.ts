import { Version } from './parse-version';
import { VersionType } from './publish-branches';

/** 新版本类型 */
export type ReleaseType = VersionType | 'stable-release' | 'bump-prerelease';

/**
 * 创建可用于给定发布版类型的新版本
 * @param currentVersion
 * @param releaseType
 */
export function createNewVersion(currentVersion: Version, releaseType: ReleaseType): Version {
  // 克隆version对象，以保持原始版本信息不被修改。
  const newVersion = currentVersion.clone();
  if (releaseType === 'bump-prerelease') {
    (newVersion.prereleaseNumber as number)++;
  } else {
    // F对于所有其他发布版本，应删除预发布标签和编号，因为新版本不是另一个预发布版本。
    newVersion.prereleaseLabel = null;
    newVersion.prereleaseNumber = null;
  }

  if (releaseType === 'major') {
    newVersion.major++;
    newVersion.minor = 0;
    newVersion.patch = 0;
  } else if (releaseType === 'minor') {
    newVersion.minor++;
    newVersion.patch = 0;
  } else if (releaseType === 'patch') {
    newVersion.patch++;
  }

  return newVersion;
}
