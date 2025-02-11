import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import React from "react";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

        if (!pages[`./Pages/${name}.jsx`]) {
            console.error(`Component "${name}" not found in Pages directory.`);
            throw new Error(`Component "${name}" not found.`);
        }

        return pages[`./Pages/${name}.jsx`].default;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
