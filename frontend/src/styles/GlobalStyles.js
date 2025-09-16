import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Aboreto:wght@400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Alegreya+Sans+SC:ital,wght@0,100;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,300;1,400;1,500;1,700;1,800;1,900&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-primary);
    color: var(--text-secondary);
    background: var(--background-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.58;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-primary);
    font-weight: 600;
    color: var(--text-primary);
    margin-top: 0;
    line-height: 1.15;
    letter-spacing: -0.022em;
  }

  p {
    font-family: var(--font-body);
    font-size: 1.125rem;
    line-height: 1.58;
    margin-bottom: 1.5rem;
    color: var(--text-secondary);
    font-weight: 400;
    letter-spacing: -0.003em;
  }

  :root {
    /* Your Exact Color Palette */
    --milky-way: #FFF9F0;
    --galaxy: #081f5c;
    
    /* Milky Way Theme (Light) */
    --milky-way-bg: #FFF9F0;
    --milky-way-surface: #f5f0e6;
    --milky-way-accent: #e8e3d8;
    --milky-way-text-primary: #2c2925;
    --milky-way-text-secondary: #5a5651;
    --milky-way-text-tertiary: #8a857f;
    --milky-way-border: #e0dbd0;
    
    /* Galaxy Theme (Dark Blue) */
    --galaxy-bg: #081f5c;
    --galaxy-surface: #0a2468;
    --galaxy-accent: #0f1f48ff;
    --galaxy-text-primary: #ffffff;
    --galaxy-text-secondary: #e8ecf4;
    --galaxy-text-tertiary: #b8c2d4;
    --galaxy-border: #2d4585;
    
    /* Active Theme - Default Milky Way */
    --background-primary: var(--milky-way-bg);
    --background-surface: var(--milky-way-surface);
    --background-accent: var(--milky-way-accent);
    --text-primary: var(--milky-way-text-primary);
    --text-secondary: var(--milky-way-text-secondary);
    --text-tertiary: var(--milky-way-text-tertiary);
    --border-primary: var(--milky-way-border);
    
    /* Accent Colors */
    --accent-primary: #667eea;
    --accent-secondary: #764ba2;
    --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;
    
    /* Border Radius */
    --border-radius: 6px;
    --border-radius-large: 12px;
    --border-radius-full: 99em;
    
    /* Typography - YOUR FONTS */
    --font-primary: 'Aboreto', cursive, sans-serif;         /* Everything */
    --font-heading: 'Alegreya Sans SC', sans-serif;         /* Text/Headings */
    --font-body: 'Alegreya Sans SC', sans-serif;            /* Text/Headings */
    
    /* Layout */
    --max-width-content: 680px;
  }

  /* Galaxy Theme Toggle */
  .theme-galaxy {
    --background-primary: var(--galaxy-bg);
    --background-surface: var(--galaxy-surface);
    --background-accent: var(--galaxy-accent);
    --text-primary: var(--galaxy-text-primary);
    --text-secondary: var(--galaxy-text-secondary);
    --text-tertiary: var(--galaxy-text-tertiary);
    --border-primary: var(--galaxy-border);
  }

  /* Milky Way Theme Toggle */
  .theme-milky-way {
    --background-primary: var(--milky-way-bg);
    --background-surface: var(--milky-way-surface);
    --background-accent: var(--milky-way-accent);
    --text-primary: var(--milky-way-text-primary);
    --text-secondary: var(--milky-way-text-secondary);
    --text-tertiary: var(--milky-way-text-tertiary);
    --border-primary: var(--milky-way-border);
  }
`;

export default GlobalStyles;
