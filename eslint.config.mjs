import js from '@eslint/js'
import globals from 'globals' // 1. これを追加

export default [
  js.configs.recommended, // 2. 推奨設定の書き方を修正
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // 3. ブラウザ環境の変数（documentなど）を許可
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'warn', // 本番環境に console.log を残さないようにする
      eqeqeq: 'error', // == ではなく === を強制する（型一致の厳格な比較）
      'no-var': 'error', // var を禁止し、let か const を使わせる
      'prefer-const': 'warn', // 再代入しない変数は const を使うよう促す
      curly: 'error', // if文などの {} を省略させない（バグ防止）
      'no-multi-spaces': 'warn', // 不要なスペースを禁止する
    },
  },
]
