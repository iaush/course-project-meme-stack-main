var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');
const cors = require('cors');
var mongoose = require('mongoose');

// Load env and cors should it be dev env
if (process.env.NODE_ENV === 'dev') {
  var corsOptions = {
    origin: 'http://localhost:3000',
  };
}
require('dotenv').config();

mongoose.connect(process.env.MONGODB_CONNSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routers
var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');

var app = express();

const { createServer } = require("http");
const server = createServer(app);

io = require('socket.io')(server);
app.set("io", io)

// Connect routes and socket to app
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle attach listeners for room sockets
var roomRouter = require('./routes/room')(app);

// Use swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
// Attach the API router
app.use('/api', apiRouter);
// Serve docs at /docs
app.get('/docs', function(req, res, next) {
  res.sendFile(path.join(__dirname, "public", "docs", "index.html"));
});
app.use('/ws', roomRouter);
// Built react app is the last route to allow react to handle 
// routing that is not already handled by the server
app.use('*', indexRouter);

module.exports = {
  app,
  server
};
