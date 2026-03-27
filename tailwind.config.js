/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Soft pastel palette for CampusEats
                peach: {
                    50: '#FFF5F0',
                    100: '#FFE8DC',
                    200: '#FFD1B9',
                    300: '#FFBA96',
                    400: '#FFA373',
                    500: '#FF8C50',
                },
                cream: {
                    50: '#FFFEF9',
                    100: '#FFF9E6',
                    200: '#FFF3CC',
                    300: '#FFEDB3',
                    400: '#FFE799',
                    500: '#FFE180',
                },
                mint: {
                    50: '#F0FFF4',
                    100: '#C6F6D5',
                    200: '#9AE6B4',
                    300: '#68D391',
                    400: '#48BB78',
                    500: '#38A169',
                },
                sage: {
                    50: '#F7F9F7',
                    100: '#E8F0E8',
                    200: '#D1E1D1',
                    300: '#B9D2B9',
                    400: '#A2C3A2',
                    500: '#8BB48B',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
