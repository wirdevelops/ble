const { Client } = require('pg');

const client = new Client({
  user: 'postgres.yqmzzuarqknudorahoso',
  password: 'Wirngo19941$',
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Successfully connected to the database');
    const result = await client.query('SELECT current_database(), current_schema();');
    console.log('Database info:', result.rows[0]);
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    await client.end();
  }
}

testConnection();
