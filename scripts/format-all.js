#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件的目录
const __dirname = path.dirname(__filename);
// 项目根目录
const rootDir = path.resolve(__dirname, '..');

try {
  console.log('🚀 开始格式化所有文件...');

  // 使用 Prettier 格式化所有支持的文件
  execSync('npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,less,scss,html,md}"', {
    cwd: rootDir,
    stdio: 'inherit',
  });

  // 使用 ESLint 修复所有 JS/TS 文件的问题
  execSync('npx eslint --fix "**/*.{js,jsx,ts,tsx}"', { cwd: rootDir, stdio: 'inherit' });

  console.log('✅ 所有文件格式化完成！');
} catch (error) {
  console.error('❌ 格式化过程中出现错误:', error.message);
  process.exit(1);
}
