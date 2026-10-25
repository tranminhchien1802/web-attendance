const http = require('http');

const PORT = 4000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Native HTTP server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});