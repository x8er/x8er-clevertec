const path = require("path");
const nodeExternals = require("webpack-node-externals");

const clientConfig = {
  mode: "development",

  name: "client",
  target: "web",

  entry: {
    client: ["@babel/polyfill", path.resolve(__dirname, "src", "client.js")],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        include: [path.resolve(__dirname, "src")],
        query: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["file-loader"],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          name: "vendor",
          test: (module) => /node_modules/.test(module.resource),
          enforce: true,
        },
      },
    },
  },

  devtool: "cheap-module-source-map",

  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
};

const serverConfig = {
  mode: "development",

  name: "server",
  target: "node",
  externals: nodeExternals({
    allowlist: [/^arui-feather/],
  }),

  entry: {
    server: ["@babel/polyfill", path.resolve(__dirname, "src", "server.js")],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        include: [path.resolve(__dirname, "src")],
        query: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
      {
        test: /\.svg$/,
        loader: "file-loader?emitFile=false",
      },
    ],
  },

  devtool: "cheap-module-source-map",

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

module.exports = [clientConfig, serverConfig];
