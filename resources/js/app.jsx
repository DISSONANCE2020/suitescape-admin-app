import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import React from 'react';

createInertiaApp({
    resolve: (name) => {
      const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
      const component = pages[`./Pages/${name}.jsx`];
  
      console.log(`Resolved component for "${name}":`, component);
  
      if (!component || !component.default) {
        throw new Error(`Component "${name}" not found or invalid.`);
      }
  
      return component.default;
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />);
    },
  });