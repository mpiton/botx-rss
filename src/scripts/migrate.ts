import { MongoClient } from "mongodb";
import { Database } from "bun:sqlite";
import logger from "../utils/logger";

const MONGO_URI = process.env.MONGODB_URI || "";

interface MongoFeed {
  link: string;
  createdAt?: Date;
}

async function migrateFeeds() {
  if (!MONGO_URI) {
    logger.error("MONGODB_URI is not defined in the environment variables");
    process.exit(1);
  }

  logger.info(`Attempting to connect to MongoDB: ${MONGO_URI}`);
  const client = new MongoClient(MONGO_URI);
  const sqliteDb = new Database("bot-rss.sqlite");

  try {
    await client.connect();
    logger.info("Connected to MongoDB successfully");

    const db = client.db("rss-bot");
    const feedsCollection = db.collection<MongoFeed>("feeds");

    // List all collections for debugging
    const collections = await db.listCollections().toArray();
    logger.info("Available collections:", collections.map(c => c.name));

    // Get all feeds from MongoDB
    const feeds = await feedsCollection.find({}).toArray();
    logger.info("Raw data from MongoDB:", feeds);
    logger.info(`${feeds.length} feeds found in MongoDB`);

    if (feeds.length > 0) {
      // Insert each feed into SQLite
      for (const feed of feeds) {
        const createdAt = feed.createdAt
          ? feed.createdAt.toISOString()
          : new Date().toISOString();

        sqliteDb.run(
          "INSERT INTO feeds (link, created_at) VALUES (?, ?)",
          [
            feed.link.toString(),
            createdAt
          ]
        );
        logger.info(`Feed inserted: ${feed.link}`);
      }
    }

    logger.info("Migration completed successfully");
  } catch (error) {
    logger.error("Error during migration:", error);
  } finally {
    await client.close();
    sqliteDb.close();
  }
}

// Run the migration
migrateFeeds();
