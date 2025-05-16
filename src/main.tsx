
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupMobileViewport } from './lib/mobile-viewport'
import { getTheme, toggleTheme } from './lib/utils'

// Set up mobile viewport for better app-like experience
setupMobileViewport();

// Apply theme on application startup
toggleTheme(getTheme());

createRoot(document.getElementById("root")!).render(<App />);
