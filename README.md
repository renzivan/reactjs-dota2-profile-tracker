# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Deploying

The site is static and lives on a personal server behind a shared Caddy edge proxy at https://dotactics.renzivan.com.
Caddy serves `~/sites/dotactics` on the server straight off disk, with unknown paths falling back to `index.html` for React Router.

Every push to `main` deploys automatically through `.github/workflows/deploy.yml`.
The workflow lints, tests, builds with the `VITE_API_URL` variable and `VITE_API_TOKEN` secret, rsyncs `dist/` to the server over a deploy key that `rrsync` restricts to the site folder, and then checks that the live site serves the new bundle.
Caddy picks the new files up immediately, so nothing on the server needs restarting.

To deploy by hand from a machine with the `renz` SSH alias and a local `.env`:

```sh
./scripts/deploy.sh
```
