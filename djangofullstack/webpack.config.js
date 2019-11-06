module.exports = {
	entry: ['@babel/polyfill', './src/index.js'],
	externals: {
            "jsdom": "jsdom"
        },
  plugins: [
		],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use:
					{
						loader: "babel-loader"
					}
			},
			{test: /\.css$/, use: ['style-loader', 'css-loader'] }
		]
	}
}
