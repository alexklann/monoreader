import express from 'express';
import next from 'next';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const startupFunction = () => {
    fetch('http://localhost:3000/api/scheduler/', {
      method: 'POST'
    })
  };

  startupFunction();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
