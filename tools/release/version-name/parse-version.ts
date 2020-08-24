/** 匹配版本名称和各个版本段的正则表达式。 */
const versionNameRegex = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|next|rc)\.(\d+))?$/;

export class Version {
  constructor(
    /** 主要版本号 */
    public major: number,
    /** 次要版本号 */
    public minor: number,
    /** 补丁版本号 */
    public patch: number,
    /** 版本的预发布标签（例如，alpha，beta，rc） */
    public prereleaseLabel: string | null,
    /** 预发布版的编号。 一个版本可以有多个预发布版本。 */
    public prereleaseNumber: number | null,
  ) {}

  clone(): Version {
    return new Version(this.major, this.minor, this.patch, this.prereleaseLabel, this.prereleaseNumber);
  }

  equals(other: Version): boolean {
    return (
      this.major === other.major &&
      this.minor === other.minor &&
      this.patch === other.patch &&
      this.prereleaseLabel === other.prereleaseLabel &&
      this.prereleaseNumber === other.prereleaseNumber
    );
  }

  /** 将版本信息序列化为字符串格式的版本名 */
  format(): string {
    return serializeVersion(this);
  }
}

/**
 * 解析指定的版本字符串并返回一个代表各个版本段的对象。
 * @param version 版本字符串
 * @returns 版本对象
 */
export function parseVersionName(version: string): Version | null {
  const matches = version.match(versionNameRegex);

  if (!matches) {
    return null;
  }

  return new Version(
    Number(matches[1]),
    Number(matches[2]),
    Number(matches[3]),
    matches[4] || null,
    matches[5] !== undefined ? Number(matches[5]) : null,
  );
}

/**
 * 将指定的版本序列化为字符串
 * @param newVersion 版本对象
 * @returns 版本字符串
 */
export function serializeVersion(newVersion: Version): string {
  const { major, minor, patch, prereleaseLabel, prereleaseNumber } = newVersion;

  let versionString = `${major}.${minor}.${patch}`;

  if (prereleaseLabel && prereleaseNumber !== null) {
    versionString += `-${prereleaseLabel}.${prereleaseNumber}`;
  }

  return versionString;
}
