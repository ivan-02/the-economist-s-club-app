import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoMemoryServer: MongoMemoryServer;

beforeAll(async () => {
  mongoMemoryServer = await MongoMemoryServer.create();
  const uri = await mongoMemoryServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const allCollections = await mongoose.connection.db.collections();
  await Promise.all(allCollections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoMemoryServer.stop();
  await mongoose.connection.close();
});
