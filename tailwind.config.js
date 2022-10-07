/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const { cp } = require('fs');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        },
        colors: {
            ...colors,
            primary: colors.indigo[600],
            gray1: colors.slate[500],
            gray2: colors.zinc[300],
            error: colors.rose[600],
            success: colors.green[400],
            overlay: 'rgba(0, 0, 0, 0.3)',
        },
        spacing: {
            ...defaultTheme.spacing,
            container: '1200px',
        },
    },
    plugins: [],
};
