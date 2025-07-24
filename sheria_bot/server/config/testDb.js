import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { logger } from '../middleware/logging.js';

let mongod;

/**
 * Connect to the in-memory database.
 */
export const connectTestDB = async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    logger.info(`Connected to in-memory MongoDB: ${uri}`);
    
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
    
    return uri;
  } catch (err) {
    logger.error(`Error connecting to in-memory MongoDB: ${err.message}`);
    throw err;
  }
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeTestDB = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};

/**
 * Remove all the data for all db collections.
 */
export const clearTestDB = async () => {
  if (mongod) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
};