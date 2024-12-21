import { Database } from "bun:sqlite";
import { Feed } from "../types/feed";
import logger from "../utils/logger";

let database = await import("../db/database").then(m => m.default);

export const setTestDatabase = (testDb: Database) => {
  database = testDb;
};

export const findFeeds = async (): Promise<Feed[]> => {
  try {
    const feeds = database.query("SELECT * FROM feeds").all() as Feed[];
    logger.info(`Number of feeds: ${feeds.length}`);
    return feeds;
  } catch (error) {
    logger.error("Error retrieving feeds:", error);
    return [];
  }
};

export const createFeed = async (link: string): Promise<Feed | null> => {
  try {
    const result = database.run(
      "INSERT INTO feeds (link) VALUES (?)",
      [link]
    );

    if (result.lastInsertRowid) {
      return database.query("SELECT * FROM feeds WHERE id = ?")
        .get(result.lastInsertRowid) as Feed;
    }
    return null;
  } catch (error) {
    logger.error("Error creating feed:", error);
    return null;
  }
};
