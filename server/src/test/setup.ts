import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { beforeAll, afterAll, afterEach } from "vitest";

let mongod: MongoMemoryServer;

/**
 * Spins up an in-memory MongoDB instance before all tests.
 * No real DB connection needed — tests are isolated and repeatable.
 */
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), { dbName: "taskflow-test" });
});

/**
 * Clears all collections after each test — prevents state leaking
 * between tests (e.g. user created in test A affecting test B).
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
