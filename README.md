# Easygun landing page

This is a landing page

### Recommended system

- Nodejs: >= 18 [https://nodejs.org/download/release/v16.20.2/](https://nodejs.org/download/release/v16.20.2/)
  - Recommend: use [Fast node manager](https://github.com/Schniz/fnm)
- Pnpm: latest version [https://pnpm.io/installation](https://pnpm.io/installation)
  - update latest version: `npm install -g pnpm`.
- Editor: `vscode`.

### Structure

```sh
|- openedu
  |- src
    |- assets
    |- components
    |- pages
    |- router
    |- utils
  package.json
  .env.development # variables for development environment
  .env.staging # variables for staging environment
  .env.production # variables for production environment
  ...
```

### Packages

- use `vite`, `react-router`, `swr`, `shadcn UI`, `tailwindcss`, ...

### Scripts

> Workspace is always root repo.

- Installation

```sh
pnpm install
```

- Add packages

```sh
pnpm add {npm_package}
```

- Run dev

```sh
pnpm dev
```

- Run build

```sh
pnpm build
```

- Run type check for typescript

```sh
pnpm typecheck
```

- Run eslint

```sh
pnpm lint
pnpm lint:fix
```

- Run prettier format

```sh
pnpm format
pnpm format:fix
```

- Run clean for remove `node_modules`, `dist`, `.next`.

```sh
pnpm clean
```
