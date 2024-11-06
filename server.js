import express from 'express';
import next from 'next';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const SERVER_PORT = 1696;

app.prepare().then(() => {
  const server = express();

  const startupFunction = () => {
    fetch(`http://localhost:${SERVER_PORT}/api/scheduler/`, {
      method: 'POST'
    })
  };

  startupFunction();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(SERVER_PORT, () => {
    console.log(`> Ready on http://localhost:${SERVER_PORT}`);
  });
});
