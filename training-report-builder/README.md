# Training Report Builder

A React-based dashboard application for analyzing training enrollment data, with a specific focus on tracking webinar enrollments. The application visualizes training statistics and allows filtering by date ranges and course categories while maintaining accurate webinar enrollment counts.

## Key Features

- **Webinar Enrollment Tracking**: Counts all enrollments for each webinar regardless of enrollment date
- **Interactive Filtering**: Filter data by date range and training category without losing sight of total webinar counts
- **Comprehensive Analytics**: View completion rates, geographic distribution, and engagement metrics
- **Searchable Webinar Table**: Easily find specific webinars and their enrollment counts
- **CSV Data Import**: Upload and analyze your own training data

## Technologies Used

- React + TypeScript
- Material UI for components
- Chart.js for data visualization
- Papa Parse for CSV parsing

## Setup and Installation

1. Clone the repository:
```
git clone https://github.com/beckletts/datamensch.git
cd datamensch
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm run dev
```

4. Open your browser and navigate to: `http://localhost:5174/`

## Usage

1. Upload your CSV training data using the file upload component
2. Use the dashboard filters to select specific date ranges or training categories
3. View the webinar enrollment counts and other key statistics
4. Analyze detailed metrics in the charts and tables

## Data Format

The application expects CSV data with the following columns:
- Course
- Enrollment Date (UTC TimeZone)
- Started Date (UTC TimeZone)
- Completion Date (UTC TimeZone)
- Status
- Progress %
- Time Spent(minutes)
- Quiz Score
- Centre Number
- Centre Country

## License

MIT License

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
