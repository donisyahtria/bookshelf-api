// Import dependencies
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Declare server
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server run at ${server.info.uri}`);
};

// Run server
init();
