const { MongoClient } = require('mongodb');

async function run() {
    const uri = 'mongodb://root:secret@localhost:27017/logitrack?authSource=admin';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('logitrack');
        const result = await db.collection('users').updateMany({}, { $set: { roles: ['ADMIN'] } });
        console.log('Updated ' + result.modifiedCount + ' users to ADMIN role.');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
