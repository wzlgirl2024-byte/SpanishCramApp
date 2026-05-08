/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                spanish: {
                    red: '#AA151B',
                    yellow: '#F1BF00',
                    dark: '#1a1a1a',
                    light: '#f5f5f5',
                }
            }
        },
    },
    plugins: [],
}
