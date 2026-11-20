const os = require("os");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// app.js loads every controller, and some read keys the moment they load.
// Tests never call Groq or Stripe, so test values are enough.
process.env.JWT_SECRET = "test-secret";
process.env.GROQ_API_KEY = "test-groq-key";
process.env.STRIPE_SECRET_KEY = "sk_test_not_used";

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    // Jest's sandbox stops the MongoDB driver loading the os module by itself, so we hand it over
    await mongoose.connect(mongod.getUri(), { runtimeAdapters: { os } });
});

afterEach(async () => {
    // Reset the stage after every scene: each test starts with empty collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});