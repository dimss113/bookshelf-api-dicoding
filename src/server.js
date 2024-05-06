const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 9000;
const HOST = 'localhost';
const IP_ADDRESS = '0.0.0.0';

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    // eslint-disable-next-line no-undef
    host: process.env.NODE_ENV !== 'production' ? HOST : IP_ADDRESS,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init();