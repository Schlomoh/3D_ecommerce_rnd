const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const PORT = process.env.PORT || 3000;

module.exports = {
  entry: {
    app: path.join(__dirname, "src", "index.tsx"),
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
    // filename: "index.bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    host: "localhost",
    port: PORT,
    //  open: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
  //   optimization: optimization,
  // externals: { react: "react", ReactDOM: "react-dom" },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.worker\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "worker-loader",
            options: {
              filename: "[name].[contenthash].worker.js",
              chunkFilename: "[id].[contenthash].worker.js",
            },
          },
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
};
