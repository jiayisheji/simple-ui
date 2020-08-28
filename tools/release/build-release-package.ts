import { execSync } from 'child_process';
import { copyFile, copySync, pathExists, readJSON, writeFile, writeJSON } from 'fs-extra';
import * as minimatch from 'minimatch';
import { join } from 'path';
import { Bundler } from 'scss-bundle';
import { logger } from './logger';

export class BuildReleasePackages {
  private libsDir: string;
  constructor(private projectDir: string, private outputPath: string, private packageJson: any) {
    this.libsDir = join(this.projectDir, 'libs');
  }

  /**
   * 运行任务
   */
  async run(releasePackages: string[]): Promise<string[]> {
    const packages: string[] = [];
    for (let packageName of releasePackages) {
      try {
        const name = await this._build(packageName);
        if (name) {
          packages.push(name);
        }
      } catch (error) {}
    }
    return Promise.resolve(packages);
  }

  /**
   * 构建指定的libs
   * @param packageName
   */
  private async _build(packageName: string) {
    // 检查 ng-package.json 文件是否存在 它是打包工具默认指定配置文件
    if (!(await pathExists(join(this.libsDir, packageName, 'ng-package.json')))) {
      logger.error(`  ✘   An error occurred while building "${packageName}".`);
      return;
    }
    // 使用Cli构建指定包
    this.exec(`npm run build ${packageName} -- --configuration=production`);
    await this._themeBundle(packageName);
    await this._schematics(packageName);
    await this._updatePackageJsonVersionAndDependencyVersion(packageName);
    await copyFile(join(this.projectDir, 'LICENSE'), join(this.outputPath, packageName, 'LICENSE'));
    return packageName;
  }

  /**
   * 编译schematics
   * @param packageName
   */
  private async _schematics(packageName: string) {
    const source = join(this.libsDir, packageName, 'schematics');
    const target = join(this.outputPath, packageName, 'schematics');
    if (!(await pathExists(source))) {
      return;
    }
    const tsconfigFile = join(source, 'tsconfig.json');
    this.exec(`tsc -p ${tsconfigFile}`);
    // copy 静态文件
    copySync(source, target, {
      overwrite: true,
      filter: file => {
        // 排除文件
        const fileGlobs = ['**/*.ts', '**/*.spec.ts'].map(f => join(source, f));
        return !fileGlobs.some(p => minimatch(file, p));
      }
    });
  }

  /**
   * 编译打包主题样式
   * @param packageName
   */
  private async _themeBundle(packageName: string) {
    const source = join(this.libsDir, packageName);
    // 项目目录的绝对路径。
    const bundler = new Bundler(undefined, source);
    // 获取指定的编译的css文件
    const { bundledContent } = await bundler.bundle('./theming-bundle.scss');
    // 如果找不到直接返回
    if (bundledContent == null) {
      return;
    }
    // 写入输出文件
    const outFile = join(this.outputPath, packageName, 'simple-ui.scss');
    await writeFile(outFile, bundledContent);
  }

  /**
   * 更新package.json的version
   * @param packageName
   */
  private async _updatePackageJsonVersionAndDependencyVersion(packageName: string) {
    const packageJsonPath = join(this.outputPath, packageName, 'package.json');
    const packageJson = await readJSON(packageJsonPath);
    const { version, dependencies } = this.packageJson;
    packageJson.version = version;
    // 更新dependencies
    Object.keys(packageJson.dependencies).reduce((deps, pack) => {
      if (dependencies[pack]) {
        deps[pack] = dependencies[pack];
      }
      return deps;
    }, packageJson.dependencies);

    // 更新peerDependencies
    Object.keys(packageJson.peerDependencies).reduce((deps, pack) => {
      if (dependencies[pack]) {
        deps[pack] = dependencies[pack];
      }
      return deps;
    }, packageJson.peerDependencies);

    await writeJSON(packageJsonPath, packageJson, {
      spaces: 2
    });
  }

  /**
   * 在项目目录中执行给定命令
   * @param command 运行命令
   * @param captureStdout 是否应该捕获并返回标准输出
   */
  private exec(command: string, captureStdout: boolean = true) {
    const stdout = execSync(command, {
      cwd: __dirname,
      stdio: ['inherit', captureStdout ? 'pipe' : 'inherit', 'inherit']
    });

    if (captureStdout) {
      process.stdout.write(stdout);
      return stdout.toString().trim();
    }
  }
}
