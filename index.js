// require node version>=14.0 to run the app,
// because we use optional chaining etc...
const path = require('path');
const express = require('express');
const injectMiddleWares = require('./src/middleware');
const errorMiddleware = require('./src/middleware/error');
const routes = require('./src/routes');

const { validateEnvVar, loadDataInMemory } = require('./src/utils/util');
const { version } = require('./package.json');

const { PORT = 3001, NODE_ENV } = process.env;

// validate if we have all the env variables setup.
validateEnvVar();

const app = express();

// load all data in memory
loadDataInMemory();

// set up all middleware
injectMiddleWares(app);

// serving static files
app.use('/static', express.static('./public'));
// eslint-disable-next-line no-undef
app.get('/', (req, res) => {
  res.sendStatus(200);
});
// serving internal (products) images
app.use('/', express.static(path.join(__dirname, 'public')));
// routes
app.use('/api/v1/', routes);

// routes with authorization
// app.use('/api/v1/auth/', authUser, routes);

// app.get('/', async (req, res) => {
//   console.log(req.path);
//   res.send(await express.static(path.join(__dirname, req.path)));
// });

app.get('*', (req, res) => {
  res.status(404).send('not found!');
});
app.use((req, res, next) => {
  res.set('Content-Type', 'application/json');
  next();
});
// use custom middleware for errors
app.use(errorMiddleware);

// start listening
app.listen(PORT, () => {
  console.info(`[Node][${NODE_ENV}] App v${version} running on PORT ${PORT}`);
});
