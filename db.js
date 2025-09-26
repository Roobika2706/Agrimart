const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dbms',
  database: 'agrimart'
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection error:', err);
  } else {
    console.log('✅ MySQL connected');
  }
});

module.exports = db;
