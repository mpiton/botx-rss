import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import * as feedService from "../feedService";

describe("FeedService", () => {
  let testDb: Database;

  beforeEach(() => {
    testDb = new Database(":memory:");
    testDb.run(`
      CREATE TABLE feeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    feedService.setTestDatabase(testDb);
  });

  afterEach(() => {
    testDb.close();
  });

  it("should create a new feed", async () => {
    const link = "https://example.com/rss";
    const feed = await feedService.createFeed(link);

    expect(feed).not.toBeNull();
    expect(feed?.link).toBe(link);
  });

  it("should find all feeds", async () => {
    await feedService.createFeed("https://example1.com/rss");
    await feedService.createFeed("https://example2.com/rss");

    const feeds = await feedService.findFeeds();
    expect(feeds.length).toBe(2);
  });
}); 
