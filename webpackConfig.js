const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const immutable = require('immutable');
const jsonLoader = require('json-loader');

const appConfig = require('./config/defaults.js');

// List of external node modules to exclude from server build.
const nodeModules = {};
fs.readdirSync(path.resolve('node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .concat(['react-dom/server']) // TODO(ivan): This one shouldn't need special treatment.
  .forEach(mod => {
    nodeModules[mod] = 'commonjs2 ' + mod;
  });

// React/ES6 webpack loader configureation.
const loaders = [
  {
    test: /.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
      presets: ['es2015', 'react']
    }
  },
  { test: /\.jsx?$/, loader: 'eslint-loader', exclude: /node_modules/ },
  { test: /\.json$/, loader: "json-loader" },
];

// Base webpack configuration.
const baseConfig = immutable.fromJS({
  module: { loaders: loaders },
  resolve: {
    root: path.resolve('src'),
    extensions: ['', '.js', '.jsx'],
  }
});

// Client webpack configuration.
const clientConfig = baseConfig.merge(immutable.fromJS({
  entry: ['babel-polyfill', 'app.js'],
  plugins: [
    new webpack.DefinePlugin({
      BUILD_TARGET: '"browser"',
    }),
  ],
  resolve: baseConfig.get('resolve')
    .setIn(['alias', 'config'], path.resolve('config/browserConfig.js')),
  output: {
    path: path.resolve('out/public/js'),
    filename: 'app.js',
  },
}));

// Server webpack configuration.
const serverConfig = baseConfig.merge(immutable.fromJS({
  entry: path.resolve('src/server.js'),
  target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      BUILD_TARGET: '"node"',
    }),
  ],
  resolve: baseConfig.get('resolve')
    .setIn(['alias', 'config'], path.resolve('config/nodeConfig.js'))
    .setIn(['alias', 'configDefaults'], path.resolve('config/defaults.js')),
  output: {
    path: path.resolve('out'),
    filename: 'server.js',
    libraryTarget: "commonjs2",
  },
  externals: nodeModules,
  node: {
    __dirname: true,
    __filename: true,
  },
}));

// iOS configuration.
const iosConfig = baseConfig.merge(immutable.fromJS({
  debug: true,
  entry: path.resolve('src/index.ios'),
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      BUILD_TARGET: '"native"',
      BUILD_NATIVE_CONFIG: JSON.stringify(appConfig.nativeConfig),
    }),
  ],
  resolve: baseConfig.get('resolve')
    .setIn(['alias', 'config'], path.resolve('config/nativeConfig.js')),
  externals: nodeModules,
  output: {
    path: path.resolve('out'),
    filename: 'ios.js',
    libraryTarget: 'commonjs2',
  },
}));

// Android configuration.
const androidConfig = iosConfig.merge(immutable.fromJS({
  entry: path.resolve('src/index.android'),
  output: {
    path: path.resolve('out'),
    filename: 'android.js',
    libraryTarget: 'commonjs2',
  },
}));

// One-off jobs configuration.
const oneOffConfig = serverConfig.merge(immutable.fromJS({
  entry: path.resolve('src/oneOff.js'),
  output: {
    path: path.resolve('out'),
    filename: 'oneOff.js',
    libraryTarget: "commonjs2",
  },
}));

// Webpack configuration for test bundle.
const testConfig = serverConfig
  .setIn(['output', 'filename'], 'test.js')
  .set('entry', path.resolve('test/test.js'));

function webpackCallback(done) {
  return (err, stats) => {
    if (err) {
      console.log('Error', err);
    } else if (stats.hasErrors || stats.hasWarnings) {
      console.log(stats.toString({
        errorDetails: true,
        modules: false,
        chunks: false,
        version: false,
        assets: false,
        hash: false,
        timings: false,
        children: true,
      }));
    }

    if (done) {
      done();
    }
  }
}

module.exports = {
  client: clientConfig.toJS(),
  server: serverConfig.toJS(),
  ios: iosConfig.toJS(),
  android: androidConfig.toJS(),
  oneoff: oneOffConfig.toJS(),
  test: testConfig.toJS(),
  callback: webpackCallback,
};
