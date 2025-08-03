// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Function to update site metadata
async function updateSiteMetadata() {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('https://events-opcina.poruci.ba/api/settings');
    const data = await response.json();

    // Update title
    if (data.data.site_name) {
      document.title = data.data.site_name;
    }

    // Update favicon
    if (data.data.favicon16x16) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = data.data.favicon16x16;
      }
    }
  } catch (error) {
    console.error('Failed to load site metadata:', error);
    // Keep default values on error
  }
}

// Load metadata and render app
async function initializeApp() {
  // Update metadata first
  await updateSiteMetadata();

  // Then render the React app
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Initialize the app
initializeApp();
