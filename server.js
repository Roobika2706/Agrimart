                         // server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db'); // your db.js with MySQL connection

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

/* =========================== PRODUCTS (Farmer Uploads) =========================== */

// Fetch all products (for farmers.html)
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) {
      console.error('DB fetch error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(result);
  });
});

// Upload new product (for farmers.html)
app.post('/upload-product', upload.single('image'), (req, res) => {
  const { name, quantity, price, email } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !quantity || !price || !email || !image) {
    return res.status(400).json({ message: 'All fields including image are required' });
  }

  const query =
    'INSERT INTO products (image, name, quantity, price, email) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [image, name, quantity, price, email], (err, result) => {
    if (err) {
      console.error('DB insert error:', err);
      return res.status(500).json({ message: 'Insert failed' });
    }
    res.status(200).json({ message: 'Product uploaded', id: result.insertId });
  });
});

/* =========================== ORDERS =========================== */

app.post('/api/orders', (req, res) => {
  const { productId, userEmail, userAddress } = req.body;
  const query =
    'INSERT INTO orders (product_id, user_email, user_address) VALUES (?, ?, ?)';
  db.query(query, [productId, userEmail, userAddress], (err) => {
    if (err) {
      console.error('Order insert error:', err);
      return res.status(500).json({ message: 'Order insert failed' });
    }
    res.status(200).json({ message: 'Order saved' });
  });
});

/* =========================== USERS (Admin adds users) =========================== */

// Add new user
app.post('/api/users', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
  db.query(query, [email, password, role], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'User already exists' });
      }
      console.error('User insert error:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.status(200).json({ message: 'User added successfully' });
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  db.query('SELECT id, email, role FROM users', (err, result) => {
    if (err) {
      console.error('DB fetch users error:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(result);
  });
});

/* =========================== LOGIN =========================== */

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('DB login error:', err);
      return res.status(500).send('DB error');
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = results[0];
    res.json({ message: 'Login successful', role: user.role });
  });
});

/* =========================== START SERVER =========================== */
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});