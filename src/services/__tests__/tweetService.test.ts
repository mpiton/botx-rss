import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import * as tweetService from "../tweetService";

describe("TweetService", () => {
  let testDb: Database;

  beforeEach(() => {
    testDb = new Database(":memory:");
    testDb.run(`
      CREATE TABLE tweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT NOT NULL,
        title TEXT NOT NULL,
        pub_date TEXT NOT NULL,
        sended INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expire_at DATETIME DEFAULT (datetime('now', '+7 days'))
      )
    `);

    tweetService.setTestDatabase(testDb);
  });

  afterEach(() => {
    testDb.close();
  });

  it("should create a new tweet", async () => {
    const tweet = await tweetService.createTweet(
      "https://example.com/article",
      "Test Article",
      new Date().toISOString()
    );

    expect(tweet).not.toBeNull();
    expect(tweet?.title).toBe("Test Article");
    expect(tweet?.sended).toBe(0); // SQLite stores booleans as 0/1
  });

  it("should get all unsent tweets", async () => {
    await tweetService.createTweet(
      "https://example.com/article1",
      "Test Article 1",
      new Date().toISOString()
    );
    await tweetService.createTweet(
      "https://example.com/article2",
      "Test Article 2",
      new Date().toISOString()
    );

    const unsentTweets = await tweetService.getAllTweetNotSended();
    expect(unsentTweets.length).toBe(2);
  });
});
