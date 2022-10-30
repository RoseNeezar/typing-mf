// const { ModuleFederationPlugin } = require("webpack").container;
// const deps = require("./package.json").dependencies;
const fs = require("fs");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const evalSourceMap = require("react-dev-utils/evalSourceMapMiddleware");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");
const noopServiceWorker = require("react-dev-utils/noopServiceWorkerMiddleware");
module.exports = {
  webpack: {
    configure: {
      output: {
        publicPath: "auto",
      },
    },
    module: {
      rules: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "assets/[name].[contenthash:8].[ext]",
          },
        },
        {
          test: /\.wav$/,
          loader: "file-loader",
        },
      ],
    },
    plugins: {
      add: [
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }),
        // new ModuleFederationPlugin({
        //   name: "workspace-mf",
        //   filename: "remoteEntry.js",
        //   remotes: {},
        //   shared: {
        //     ...deps,
        //     tsconfig: {
        //       singleton: true,
        //     },
        //     react: {
        //       singleton: true,
        //       requiredVersion: deps.react,
        //     },
        //     "react-dom": {
        //       singleton: true,
        //       requiredVersion: deps["react-dom"],
        //     },
        //   },
        // }),
      ],
    },
  },
  devServer: (devServerConfig, { env, paths }) => {
    devServerConfig = {
      onBeforeSetupMiddleware: undefined,
      onAfterSetupMiddleware: undefined,
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error("webpack-dev-server is not defined");
        }
        if (fs.existsSync(paths.proxySetup)) {
          require(paths.proxySetup)(devServer.app);
        }
        middlewares.push(
          evalSourceMap(devServer),
          redirectServedPath(paths.publicUrlOrPath),
          noopServiceWorker(paths.publicUrlOrPath)
        );
        return middlewares;
      },
    };
    return devServerConfig;
  },
};
