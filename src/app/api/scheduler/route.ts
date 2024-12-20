import { NextResponse } from "next/server";
import { ToadScheduler, SimpleIntervalJob, Task } from "toad-scheduler";
import { PrismaClient } from "@prisma/client";
import Parser from 'rss-parser';

const prisma = new PrismaClient();
const parser: Parser = new Parser();

const taskScheduler: ToadScheduler = new ToadScheduler();

async function getAllFeeds() {
    const feeds = await prisma.feeds.findMany();
    return feeds;
}

async function getFeedData(url: string) {
    console.log(`Fetching feed data from: ${url}`);
    const feed = await parser.parseURL(decodeURIComponent(url));
    return feed;
}

async function createFeedTask(feed: any) {
    const feedName = feed.name;
    const feedId = feed.id;
    
    try {
        taskScheduler.removeById(feedName);
    } catch {
        console.warn(`No existing job with ID: ${feedName} to remove.`);
    }

    console.log(`Adding feed: ${feedName}`);

    const newTask = new Task(
        feedName,
        () => addFeedDataToDatabase(feed.url, feedId),
    );

    const intervalJob = new SimpleIntervalJob(
        { minutes: 5, runImmediately: true },
        newTask,
        { id: feedName }
    );

    taskScheduler.addSimpleIntervalJob(intervalJob);
}

async function addFeedDataToDatabase(url: string, id: number) {
    const feedData = await getFeedData(url);
    const feedItems = feedData.items;

    for (const item of feedItems) {
        const existingItem = await prisma.rss_articles.findFirst({
            where: {
                link: item.link,
            }
        });

        if (existingItem === null) {
            await prisma.rss_articles.create({
                data: {
                    feed_id: id,
                    title: item.title || "",
                    link: item.link || "",
                    pub_date: item.pubDate || "",
                    contentSnippet: item.contentSnippet || "",
                    content: item.content || "",
                    guid: item.guid || "",
                }
            });
        }
    }
}

/**
 * GET request to retrieve the list of tasks
 * @returns NextResponse; JSON object containing the list of tasks
 */
export async function GET() {
    return NextResponse.json({
        message: JSON.stringify(taskScheduler.getAllJobs()),
        status: 200,
    })
}

/**
 * POST request to restart the scheduler
 * @param request 
 * @returns NextResponse
 */
export async function POST() {
    taskScheduler.stop();
    console.log("Restarting scheduler...");

    const feeds = await getAllFeeds();
    for (const feed of feeds) {
        await createFeedTask(feed);
    }

    return NextResponse.json({
        message: "Restarted scheduler",
        status: 200
    });
}
