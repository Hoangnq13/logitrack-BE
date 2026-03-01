const { MongoClient, ObjectId } = require('mongodb');

async function seed() {
    // Sửa lại chuỗi kết nối để bao gồm user:password giống trong file .env
    const uri = "mongodb://root:secret@localhost:27017/logitrack?authSource=admin";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");

        const db = client.db('logitrack');
        const users = db.collection('users');
        const drivers = db.collection('drivers');

        // Mongoose creates collections lowercase-plural
        // Ensure we are inserting correctly
        const fakeUserId = new ObjectId('60d5ecb8b311234567890123'); // Custom ID

        // 1. Insert User
        await users.updateOne(
            { _id: fakeUserId },
            {
                $set: {
                    firebaseUid: "fake_firebase_uid_123",
                    email: "driver_test@example.com",
                    roles: ["DRIVER"],
                    fullName: "Tài xế Test GPS",
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
        console.log("User seeded setup");

        // 2. Insert Driver linked to User
        const fakeDriverId = new ObjectId('60d5ecb8b311234567890123');
        await drivers.updateOne(
            { _id: fakeDriverId },
            {
                $set: {
                    user: fakeUserId,
                    vehicle: {
                        licensePlate: "29A-123.45",
                        type: "TRUCK",
                        model: "Hino 500"
                    },
                    status: "OFFLINE",
                    isAvailable: true,
                    stats: {
                        totalOrders: 0,
                        totalDistance: 0,
                        rating: 5
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
        console.log("Driver seeded setup");

    } finally {
        await client.close();
    }
}

seed().catch(console.dir);
