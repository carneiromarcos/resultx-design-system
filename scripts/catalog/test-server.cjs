'use strict';
async function closeServer(server) {
  if (!server) return;
  server.closeAllConnections();
  if (server.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
module.exports = {closeServer};
