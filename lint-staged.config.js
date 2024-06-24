export default {
  '*.{js,ts,tsx}': ['pnpm format:fix', () => 'pnpm typecheck', () => 'pnpm lint:fix --'],
  '*.{json,css,md,html}': ['pnpm format:fix'],
};
