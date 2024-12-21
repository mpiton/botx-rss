import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import cron from "node-cron";
import { XMLParser } from "fast-xml-parser";
import * as feedService from "./services/feedService";
import * as tweetService from "./services/tweetService";
import logger from "./utils/logger";
import { CreateFeedDto } from "./types/feed";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Bot RSS is running")
  .get("/feeds", async () => {
    return await feedService.findFeeds();
  })
  .post("/feed", async ({ body }: { body: CreateFeedDto }) => {
    return await feedService.createFeed(body.link);
  });

// Function to check and create tweets
const checkAndCreateTweets = async () => {
  try {
    const feeds = await feedService.findFeeds();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });

    for (const feed of feeds) {
      try {
        const response = await fetch(feed.link);
        const xmlData = await response.text();
        const data = parser.parse(xmlData);

        // Check RSS structure
        if (!data?.rss?.channel?.item) {
          logger.error(`Invalid RSS structure for feed: ${feed.link}`);
          continue;
        }

        const articles = Array.isArray(data.rss.channel.item)
          ? data.rss.channel.item
          : [data.rss.channel.item];

        if (articles.length > 0) {
          const article = articles[0];
          const pubDate = new Date(article.pubDate);
          const oneHourAgo = new Date(Date.now() - 3600000);

          if (pubDate > oneHourAgo) {
            await tweetService.createTweet(
              article.link,
              article.title,
              pubDate.toISOString()
            );
          }
        }
      } catch (feedError) {
        logger.error(`Error processing feed ${feed.link}:`, feedError);
        continue;
      }
    }
  } catch (error) {
    logger.error("Error checking RSS feeds:", error);
  }
};

// Function to send tweets
const sendPendingTweets = async () => {
  try {
    const tweets = await tweetService.getAllTweetNotSended();
    for (const tweet of tweets) {
      await tweetService.sendTweet(tweet);
    }
  } catch (error) {
    logger.error("Error sending tweets:", error);
  }
};

// Schedule tasks
cron.schedule("*/30 * * * *", async () => {
  await checkAndCreateTweets();
  await sendPendingTweets();
});

app.listen(process.env.PORT || 3000);
