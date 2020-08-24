import { strings } from '@angular-devkit/core';
import {
  chain,
  externalSchematic,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { toFileName } from '@nrwl/workspace';
import { Schema } from './schema';

export default function (schema: Schema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const options = normalizeOptions(schema);
    return chain([
      options.export ? updatePublicApi(options) : noop(),
      externalSchematic('@schematics/angular', 'class', options),
    ]);
  };
}

function updatePublicApi(options: Schema): Rule {
  return (tree: Tree) => {
    const publicApiPath = `${options.path}/public-api.ts`;
    const name = strings.dasherize(options.name);
    // 读取目标文件
    const text = tree.read(publicApiPath);
    if (text === null) {
      throw new SchematicsException(`File ${publicApiPath} does not exist.`);
    }
    // 获取内容
    const sourceText = text.toString('utf-8');
    const fileName = `${name}${options.type ? '.' + options.type : ''}`;
    // 替换后文件
    const replaceText = `${sourceText.trimRight()}\nexport * from './${fileName}';`;
    // 更新目标文件内容
    tree.overwrite(publicApiPath, replaceText);
    return tree;
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
  });
}
