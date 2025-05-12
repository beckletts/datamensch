# Training Report Builder

A visualization tool for training data analytics. Upload CSV data and view analytics on completion rates, geographic distribution, and engagement metrics.

## Development

To run the application in development mode:

```bash
npm install
npm run dev
```

This will start the development server at http://localhost:5173

## Deployment to a Test Server

There are two options for deploying to a test server:

### Option 1: Deploy the Development Build

For quick testing, you can deploy the development build directly:

1. Run the development server
```bash
npm run dev
```

2. Make the development server accessible externally by using a tool like ngrok:
```bash
npx ngrok http 5173
```
This will provide a public URL (e.g., https://abc123.ngrok.io) that you can share.

### Option 2: Build and Host Using Express

For a more production-like environment:

1. Build the project
```bash
npm run build
```

2. Start the Express server
```bash
npm run serve
```

This will serve the application on http://localhost:3000

## Troubleshooting

If you encounter module not found errors, try:

1. Reinstall dependencies
```bash
npm install
```

2. Clear TypeScript build cache
```bash
rm -rf tsconfig.app.tsbuildinfo
```

3. Restart the development server
```bash
npm run dev
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
