'use strict';
const message = process.env['HUSKY_GIT_PARAMS'];
const fs = require('fs');

/**
 * type-enum 提交type的枚举
 * - feat：新增功能
 * - fix：bug 修复
 * - perf：性能, 体验优化
 * - refactor： 重构代码(既没有新增功能，也没有修复 bug)
 * - docs：文档更新
 * - style： 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等， 没有改变代码逻辑)
 * - test： 新增测试用例或是更新现有测试
 * - revert： 回滚某个更早之前的提交
 * - build：主要目的是修改项目构建系统(例如 glup， webpack， rollup，npm的配置等.xxx) 的提交
 * - ci：主要目的是修改项目继续集成流程(例如 Travis， Jenkins， GitLab CI， Circle等) 的提交
 * - release: 发布版本
 * - chore：不属于以上类型的其他类型
 */
const types = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'release', 'revert', 'style', 'test'];

/**
 * scope-enum 提交scope的枚举
 * - deps：依赖管理 package.json
 * - simple-ui/* simple-ui模块
 * - simple-ui-doc：simple-ui-doc 演示文档
 * - tools：工具箱
 * - highlight：代码高亮包装组件
 */
const scopes = ['simple-ui-doc', 'highlight', 'tools', 'deps', 'simple-ui/*'];

function parseMessage(message) {
  const PATTERN = /^(\w+)(?:\(([^)]+)\))?\: (.+)$/;
  const match = PATTERN.exec(message);
  if (!match) {
    return null;
  }
  return {
    type: match[1] || null,
    scope: match[2] || null
  };
}

function getScopesRule() {
  const messages = fs.readFileSync(message, { encoding: 'utf-8' });
  const parsed = parseMessage(messages.split('\n')[0]);
  if (!parsed) {
    return [2, 'always', scopes];
  }
  const { scope, type } = parsed;
  if (scope && !scopes.includes(scope) && type !== 'release' && !/simple-ui\/.+/.test(scope)) {
    return [2, 'always', scopes];
  } else {
    return [2, 'always', []];
  }
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': getScopesRule,
    'type-enum': [2, 'always', types]
  }
};
