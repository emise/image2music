var path = require('path');
var webpack = require('webpack');  
module.exports = {  
  entry: [
    "./js/app.js"
  ],
  output: {
    path: __dirname + '/static',
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'js'),
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
};
