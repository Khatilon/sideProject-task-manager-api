const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	// @babel/polyfill is for async issue
	entry: ['@babel/polyfill', './src/index.js'],
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	
	module: {
		rules: [
			{ test: /\.(js)$/, use: 'babel-loader' },
			{ test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
			{test: /\.(png|jpe?g|gif)$/i, use: [{loader: 'file-loader'}]}
		]
	},
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
		new Dotenv()
		// new Dotenv({
		// 	path: './config/test.env'
		// })
    ],
	devServer: {
		// 透過這樣的設定可以解決cors問題, 表面上是在localhost:8080打API, 實際上是打給3003
		proxy: {
		  '/': 'http://localhost:3003'
		}
	},
	mode: 'development'
}