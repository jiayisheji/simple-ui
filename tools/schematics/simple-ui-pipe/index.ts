import { strings } from '@angular-devkit/core';
import { chain, externalSchematic, noop, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { toFileName } from '@nrwl/workspace';
import { Schema } from './schema';

export default function (schema: Schema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const options = normalizeOptions(schema);
    return chain([options.export ? updatePublicApi(options) : noop(), externalSchematic('@schematics/angular', 'pipe', options)]);
  };
}

function updatePublicApi(options: Schema): Rule {
  return (tree: Tree) => {
    const publicApiFilePath = `${options.path}/public-api.ts`;
    const name = strings.dasherize(options.name);
    // 读取目标文件
    const buffer = tree.read(publicApiFilePath);
    if (buffer === null) {
      throw new SchematicsException(`File ${publicApiFilePath} does not exist.`);
    }
    // 获取内容
    const tsContent = buffer.toString('utf-8');
    const fileName = name.replace(/.+\//, '');
    const folderName = `${options.flat ? name : name + '/' + fileName}`;
    const insertion = '\n' + `export * from './${folderName}.pipe';`;

    if (tsContent.includes(insertion)) {
      return;
    }
    // 更新目标文件内容
    const recorder = tree.beginUpdate(publicApiFilePath);
    recorder.insertLeft(tsContent.length, insertion);
    tree.commitUpdate(recorder);
  };
}

function normalizeOptions(options: Schema) {
  const name = toFileName(options.name);
  const fileName = name.replace(new RegExp('/.+'), '');
  const projectRoot = `libs/${options.project}`;
  const folderName = `${projectRoot}/${fileName}`;
  return Object.assign(Object.assign({}, options), {
    name: name.includes('/') ? name.slice(fileName.length + 1) : name,
    path: folderName,
    module: `${fileName}.module.ts`
  });
}
