const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

console.log('Starting test server...');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@hcmute.edu.vn' && password === '123456') {
    return res.json({ 
      user: { id: 1, email: 'admin@hcmute.edu.vn', name: 'Admin HCMUTE', role: 'admin' },
      token: 'test-token'
    });
  }
  res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});