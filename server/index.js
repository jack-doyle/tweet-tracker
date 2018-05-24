/* eslint no-console: 0 */
require('dotenv').config()

const path = require('path');
const express = require('express');
const cors = require("cors");
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

require("./socket")(io);
require("./routes")(app);

app.use("/lib", express.static(path.join(__dirname, '../lib')));
app.use("/app", express.static(path.join(__dirname, '../app')));

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });

  app.use(cors());
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(__dirname + '../app'));
} else {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
