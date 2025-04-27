/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-27 09:06:01
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-27 18:24:48
 * @FilePath: /virtualization-platform/eslint.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // 更新为latest以支持所有新特性
      globals: {
        ...globals.browser,
        structuredClone: 'readonly',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-empty-object-type': 'warn', // 降级为警告，不报错
    },
  },
  // 将prettier配置放在最后，确保它可以覆盖前面的规则
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          // 这里可以内联Prettier规则，确保与.prettierrc保持一致
          endOfLine: 'lf',
        },
      ],
    },
  },
  // 确保prettierConfig在最后，用于关闭所有冲突的规则
  prettierConfig
);
