🚀 React + Vite Template

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Oxc-00B4D8?style=for-the-badge" alt="Oxc" />
  <img src="https://img.shields.io/badge/SWC-00B4D8?style=for-the-badge" alt="SWC" />
  <img src="https://img.shields.io/badge/HMR-FF6B35?style=for-the-badge" alt="HMR" />
</p>

This template provides a minimal setup to get React working in Vite with Hot Module Replacement (HMR) and some ESLint rules for code quality.

📦 Official Plugins

Currently, two official plugins are available:

<p align="center">
  <img src="https://img.shields.io/badge/@vitejs/plugin--react-Oxc-00B4D8?style=for-the-badge" alt="@vitejs/plugin-react" />
  <img src="https://img.shields.io/badge/@vitejs/plugin--react--swc-SWC-00B4D8?style=for-the-badge" alt="@vitejs/plugin-react-swc" />
</p>

🔹 @vitejs/plugin-react

· Uses Oxc - A blazing fast JavaScript/TypeScript linter and compiler written in Rust
· Provides fast refresh and optimal development experience
· Suitable for most React projects

🔹 @vitejs/plugin-react-swc

· Uses SWC - A super-fast Rust-based platform for the web
· Offers even faster builds and transforms compared to Babel
· Great for large-scale applications where build performance matters

⚛️ React Compiler

⚠️ Note: The React Compiler is not enabled on this template due to its impact on dev & build performances.

To add the React Compiler to your project, follow the official documentation:

· 📖 React Compiler Installation Guide

🔧 Expanding the ESLint Configuration

If you're developing a production application, we strongly recommend using TypeScript with type-aware lint rules enabled.

🚀 Recommended Setup:

1. Check out the TypeScript template for detailed integration steps
2. Integrate typescript-eslint for robust type checking:
   ```bash
   npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```
3. Update your ESLint config to include TypeScript support:
   ```js
   export default {
     extends: [
       'eslint:recommended',
       'plugin:@typescript-eslint/recommended',
       'plugin:@typescript-eslint/recommended-type-checked',
       'plugin:react/recommended',
       'plugin:react/jsx-runtime'
     ],
     parser: '@typescript-eslint/parser',
     parserOptions: {
       project: './tsconfig.json',
       tsconfigRootDir: import.meta.dirname,
     },
   }
   ```

🛠️ Additional Optimizations

<p align="center">
  <img src="https://img.shields.io/badge/Code_Splitting-FF6B35?style=for-the-badge" alt="Code Splitting" />
  <img src="https://img.shields.io/badge/Lazy_Loading-7C3AED?style=for-the-badge" alt="Lazy Loading" />
  <img src="https://img.shields.io/badge/Tree_Shaking-00B4D8?style=for-the-badge" alt="Tree Shaking" />
  <img src="https://img.shields.io/badge/Environment_Vars-0080FF?style=for-the-badge" alt="Environment Variables" />
</p>

· Code Splitting: Use dynamic imports for route-based splitting
· Lazy Loading: Implement React.lazy() for component-level loading
· Tree Shaking: Vite automatically removes unused code in production
· Environment Variables: Use import.meta.env for configuration

📚 Useful Resources

· 📘 Vite Documentation
· ⚛️ React Documentation
· 🧹 ESLint Rules
· 📦 Vite Plugin React

---

<p align="center">
  <sub>Built with ❤️ using Vite ⚡</sub>
</p>