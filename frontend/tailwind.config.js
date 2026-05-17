/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
                dark: '#1f2937',
                light: '#f9fafb',
                glass: 'rgba(255, 255, 255, 0.10)',
                'glass-light': 'rgba(255, 255, 255, 0.20)',
                'glass-dark': 'rgba(0, 0, 0, 0.05)',
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '12px',
                lg: '16px',
                xl: '20px',
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-in-out',
                slideIn: 'slideIn 0.3s ease-in-out',
                glassGlow: 'glassGlow 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                glassGlow: {
                    '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)' },
                    '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' },
                },
            },
        },
    },
    plugins: [],
}