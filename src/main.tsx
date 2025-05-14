
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupMobileViewport } from './lib/mobile-viewport'

// Set up mobile viewport for better app-like experience
setupMobileViewport();

createRoot(document.getElementById("root")!).render(<App />);
