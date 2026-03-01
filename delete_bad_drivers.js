const { MongoClient } = require('mongodb');
const uri = 'mongodb://logitrack:logitrack123@localhost:27017/logitrack?authSource=admin';
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('logitrack');
        console.log('Connected to DB');

        // Delete drivers where user is not an ObjectId (e.g. string "dsfasdfbska")
        const driversCollection = db.collection('drivers');

        // We cannot easily query by type string in basic query, but we can just delete exactly "dsfasdfbska"
        const result = await driversCollection.deleteMany({ user: "dsfasdfbska" });
        console.log('Deleted bad drivers with dsfasdfbska:', result.deletedCount);

        // Also delete any where user type is string, just in case
        const stringResult = await driversCollection.deleteMany({ user: { $type: "string" } });
        console.log('Deleted bad drivers with string user ID:', stringResult.deletedCount);

        const users = await db.collection('users').find({}).toArray();
        console.log('Current expected valid users object IDs:', users.map(u => ({ id: u._id.toString(), email: u.email })));

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
run();
