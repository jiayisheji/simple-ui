/** 获取root目录 */
const rootPath = process.cwd();
import { readdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

const src = 'apps/simple-ui-doc/src/assets/icon';
const dist = 'apps/simple-ui-doc/src/app/components/icon/icon.ts';

/** 获取所有svg文件 */
try {
  const files = readdirSync(join(rootPath, src));

  const icons: string[] = [];

  files.forEach(file => {
    if (extname(file) === '.svg') {
      icons.push("'" + file.replace('.svg', '') + "'");
    }
  });

  const data = `
/**
 * scripts generate
 */
export const icon = [${icons}];
  `;

  writeFileSync(dist, data);
} catch (error) {
  console.log(error);
}
