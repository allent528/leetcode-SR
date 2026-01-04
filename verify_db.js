import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Checking environment configuration...');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI is undefined. Check your .env file.');
    process.exit(1);
}

console.log(`Endpoint: ${uri.split('@').pop().split('/')[0]}`); // Log host only for safety

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connection Successful!');

        // Check if there is data
        mongoose.connection.db.listCollections().toArray()
            .then(collections => {
                console.log('Collections:', collections.map(c => c.name));
                process.exit(0);
            })
            .catch(err => {
                console.error('Failed to list collections:', err);
                process.exit(1);
            });
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.log('👉 Hint: Verify that your MongoDB service is running or the URI is correct.');
        }
        process.exit(1);
    });
