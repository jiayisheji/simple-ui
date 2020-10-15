import { findNodes, getDecoratorMetadata } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';

export function getMetadataField(node: ts.ObjectLiteralExpression, metadataField: string): ts.ObjectLiteralElement[] {
  return (
    node.properties
      .filter(prop => ts.isPropertyAssignment(prop))
      // Filter out every fields that's not "metadataField". Also handles string literals
      // (but not expressions).
      .filter(({ name }: ts.PropertyAssignment) => {
        return (ts.isIdentifier(name) || ts.isStringLiteral(name)) && name.getText() === metadataField;
      })
  );
}

/**
 * Returns the RouterModule declaration from NgModule metadata, if any.
 */
export function getRouterModuleDeclaration(source: ts.SourceFile): ts.Expression | undefined {
  const result = getDecoratorMetadata(source, 'NgModule', '@angular/core') as ts.Node[];
  const node = result[0] as ts.ObjectLiteralExpression;
  const matchingProperties = getMetadataField(node, 'imports');

  if (!matchingProperties) {
    return;
  }

  const assignment = matchingProperties[0] as ts.PropertyAssignment;

  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return;
  }

  const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;

  return arrLiteral.elements
    .filter(el => el.kind === ts.SyntaxKind.CallExpression)
    .find(el => (el as ts.Identifier).getText().startsWith('RouterModule'));
}

export function addRoutesToModule(source: ts.SourceFile, fileToAdd: string, routeLiteral: string): Change {
  const routerModuleExpr = getRouterModuleDeclaration(source);
  if (!routerModuleExpr) {
    throw new Error(`Couldn't find a route declaration in ${fileToAdd}.`);
  }

  const scopeConfigMethodArgs = (routerModuleExpr as ts.CallExpression).arguments;
  if (!scopeConfigMethodArgs.length) {
    const { line } = source.getLineAndCharacterOfPosition(routerModuleExpr.getStart());
    throw new Error(`The router module method doesn't have arguments ` + `at line ${line} in ${fileToAdd}`);
  }

  let routesArr: ts.ArrayLiteralExpression | undefined;
  const routesArg = scopeConfigMethodArgs[0];

  // 检查路由声明数组是RouterModule的内联参数还是独立变量
  if (ts.isArrayLiteralExpression(routesArg)) {
    routesArr = routesArg;
  } else {
    const routesVarName = routesArg.getText();
    let routesVar;
    if (routesArg.kind === ts.SyntaxKind.Identifier) {
      routesVar = source.statements
        .filter((s: ts.Statement) => s.kind === ts.SyntaxKind.VariableStatement)
        .find((v: ts.VariableStatement) => {
          return v.declarationList.declarations[0].name.getText() === routesVarName;
        }) as ts.VariableStatement | undefined;
    }

    if (!routesVar) {
      const { line } = source.getLineAndCharacterOfPosition(routesArg.getStart());
      throw new Error(`No route declaration array was found that corresponds ` + `to router module at line ${line} in ${fileToAdd}`);
    }

    routesArr = findNodes(routesVar, ts.SyntaxKind.ArrayLiteralExpression, 1)[0] as ts.ArrayLiteralExpression;
  }

  const occurrencesCount = routesArr.elements.length;
  const text = routesArr.getFullText(source);

  let route: string = routeLiteral;
  let insertPos = routesArr.elements.pos;

  if (occurrencesCount > 0) {
    // 不一样的开始
    // 获取最后一个element
    const lastRouteLiteral = [...routesArr.elements].pop() as ts.Expression;
    // 从当前元素的属性里面获取`children`属性token信息
    const children = (ts.isObjectLiteralExpression(lastRouteLiteral) &&
      lastRouteLiteral.properties.find(n => {
        return ts.isPropertyAssignment(n) && ts.isIdentifier(n.name) && n.name.text === 'children';
      })) as ts.PropertyAssignment;
    if (!children) {
      throw new Error('"children" does not exist.');
    }
    // 处理路由字符串
    const indentation = text.match(/\r?\n(\r?)\s*/) || [];
    const routeText = `${indentation[0] || ' '}${routeLiteral}`;
    // 获取当前`children`结束位置
    insertPos = (children.initializer as ts.ArrayLiteralExpression).elements.end;
    // 拼接路由信息
    route = `,${routeText}`;
    // 不一样的结束
  }

  return new InsertChange(fileToAdd, insertPos, route);
}
