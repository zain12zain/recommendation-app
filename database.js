const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'products.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create products table for tracking clicks
db.run(`
    CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        tags TEXT,      -- Tags saved as JSON text
        image TEXT
    )
`);

// Function to save a product click
const saveProductClick = (title, tags, image) => {
    return new Promise((resolve, reject) => {
        const tagsJSON = JSON.stringify(tags);
        const query = `INSERT INTO clicks (title, tags, image) VALUES (?, ?, ?)`;
        db.run(query, [title, tagsJSON, image], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, title, tags });
            }
        });
    });
};

module.exports = { saveProductClick };
