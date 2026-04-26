const { MongoClient } = require('mongodb');

async function optimizeMongo() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('campus-service');
    
    // Create all necessary indexes
    console.log('Creating indexes...');
    
    // Users collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✓ users.email index created');
    
    // Complaints collection
    await db.collection('complaints').createIndex({ raisedBy: 1 });
    await db.collection('complaints').createIndex({ assignedTo: 1 });
    await db.collection('complaints').createIndex({ status: 1 });
    await db.collection('complaints').createIndex({ createdAt: -1 });
    await db.collection('complaints').createIndex({ raisedBy: 1, createdAt: -1 });
    await db.collection('complaints').createIndex({ assignedTo: 1, status: 1 });
    console.log('✓ complaints indexes created');
    
    // Show all indexes
    const usersIndexes = await db.collection('users').indexes();
    const complaintsIndexes = await db.collection('complaints').indexes();
    
    console.log('\nUsers indexes:', usersIndexes.length);
    console.log('Complaints indexes:', complaintsIndexes.length);
    
    // Run performance test
    console.log('\nRunning performance test...');
    const start = Date.now();
    await db.collection('users').findOne({ email: 'test@example.com' });
    const end = Date.now();
    console.log(`Query time: ${end - start}ms`);
    
  } finally {
    await client.close();
  }
}

optimizeMongo().catch(console.error);