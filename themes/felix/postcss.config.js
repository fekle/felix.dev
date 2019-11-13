module.exports = {
    parser: 'postcss-scss',
    plugins: [require('tailwindcss'), require('precss'), require('postcss-font-display'), require('autoprefixer')],
};
