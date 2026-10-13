import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default tseslint.config(
  // Never lint build output or the throwaway spikes.
  { ignores: ['dist/', 'spikes/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: globals.browser,
      // Lets ESLint read the TypeScript inside <script lang="ts"> in .vue files.
      parserOptions: { parser: tseslint.parser },
    },
  },
)
