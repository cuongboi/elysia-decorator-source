const config = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderParserPlugins: [
    'typescript',
    'jsx',
    'decorators-legacy',
    'explicitResourceManagement',
  ],
  singleQuote: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/[a-z]',
    '^[./]',
    '.svg',
    '.s?css$',
    '.json$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: false,
};

export default config;
