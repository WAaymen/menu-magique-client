const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read config file
const configPath = path.join(__dirname, 'config.env');
const configContent = fs.readFileSync(configPath, 'utf8');
const config = {};

configContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    config[key.trim()] = value.trim();
  }
});

// Create PostgreSQL connection pool
const pool = new Pool({
  host: config.DB_HOST || 'localhost',
  port: config.DB_PORT || 5432,
  database: config.DB_NAME || 'RestaurantMangement',
  user: config.DB_USER || 'postgres',
  password: config.DB_PASSWORD || 'admin',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create menu_items table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL CHECK (price > 0),
        category VARCHAR(100) NOT NULL,
        image_url TEXT,
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
      CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
    `;

    await pool.query(createTableQuery);
    console.log('✅ Database tables initialized successfully');



    // Insert sample data if table is empty
    const checkDataQuery = 'SELECT COUNT(*) FROM menu_items';
    const result = await pool.query(checkDataQuery);
    
    if (parseInt(result.rows[0].count) === 0) {
      await insertSampleData();
      console.log('✅ Sample data inserted successfully');
    }

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}



// Insert sample menu items
async function insertSampleData() {
  const sampleItems = [
    {
      name: 'Steak Grillé',
      description: 'Filet de bœuf grillé aux légumes de saison, servi avec sauce au poivre',
      price: 28.50,
      category: 'Plats Principaux',
      image_url: null, // Will use fallback image from frontend
      available: true
    },
    {
      name: 'Salade César',
      description: 'Laitue romaine, parmesan, croûtons et sauce césar maison',
      price: 14.90,
      category: 'Salades',
      image_url: null, // Will use fallback image from frontend
      available: true
    },
    {
      name: 'Soupe à l\'Oignon',
      description: 'Soupe traditionnelle française au fromage fondu et croûtons dorés',
      price: 9.80,
      category: 'Entrées',
      image_url: null, // Will use fallback image from frontend
      available: true
    },
    {
      name: 'Dessert Chocolat',
      description: 'Fondant au chocolat avec fruits rouges et crème anglaise',
      price: 8.50,
      category: 'Desserts',
      image_url: null, // Will use fallback image from frontend
      available: true
    }
  ];

  for (const item of sampleItems) {
    const insertQuery = `
      INSERT INTO menu_items (name, description, price, category, image_url, available)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await pool.query(insertQuery, [
      item.name,
      item.description,
      item.price,
      item.category,
      item.image_url,
      item.available
    ]);
  }
}

module.exports = {
  pool,
  initializeDatabase
};

