import { Database } from "bun:sqlite";
import { Tweet } from "../types/tweet";
import logger from "../utils/logger";
import { TwitterApi } from "twitter-api-v2";

let database = await import("../db/database").then(m => m.default);

export const setTestDatabase = (testDb: Database) => {
  database = testDb;
};

export const createTweet = async (
  link: string,
  title: string,
  pubDate: string
): Promise<Tweet | null> => {
  try {
    const existingTweet = database.query(
      "SELECT * FROM tweets WHERE link = ?"
    ).get(link) as Tweet | null;

    if (!existingTweet) {
      const result = database.run(
        "INSERT INTO tweets (link, title, pub_date, sended) VALUES (?, ?, ?, ?)",
        [link, title, pubDate, 0]
      );

      if (result.lastInsertRowid) {
        return database.query("SELECT * FROM tweets WHERE id = ?")
          .get(result.lastInsertRowid) as Tweet;
      }
    }
    return null;
  } catch (error) {
    logger.error("Error creating tweet:", error);
    return null;
  }
};

export const getAllTweetNotSended = async (): Promise<Tweet[]> => {
  try {
    return database.query("SELECT * FROM tweets WHERE sended = 0").all() as Tweet[];
  } catch (error) {
    logger.error("Error retrieving tweets:", error);
    return [];
  }
};

export const sendTweet = async (tweet: Tweet): Promise<void> => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });

  try {
    await client.v2.tweet(`${tweet.title} : ${tweet.link}`);
    await updateTweetStatus(tweet.id);
  } catch (error) {
    logger.error("Error sending tweet:", error);
  }
};

const updateTweetStatus = async (id: number): Promise<void> => {
  try {
    database.run("UPDATE tweets SET sended = 1 WHERE id = ?", [id]);
  } catch (error) {
    logger.error("Error updating tweet status:", error);
  }
};
