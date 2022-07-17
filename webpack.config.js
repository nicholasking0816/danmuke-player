const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './demo/index.tsx',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            },
            {
                test: /\.tsx$/,
                use: ['ts-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'demo/index.html'),
            
        })
        
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'demo/public'),
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    }
}