import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

interface Article {
    feed_url: string,
    title: string,
    link: string,
    pub_date: string,
    description: string,
    content: string,
    guid: string,
}

/**
 * POST request to add articles to the database
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
    const body = await request.json();

    const database = new sqlite3.Database(databasePath);

    for (const article of body.articles as Article[]) {
        database.all(`
            SELECT * FROM rss_articles
            WHERE guid = ?
        `, [
            article.guid
        ], (error, rows) => {
            if (error) {
                return NextResponse.json({
                    message: "Internal server error",
                    status: 500,
                    body: {
                        message: error.message,
                    },
                });
            }

            if (rows.length > 0) {
                return;
            }

            database.run(`
                INSERT INTO rss_articles (feed_url, title, link, pub_date, description, content, guid)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                article.feed_url,
                article.title,
                article.link,
                article.pub_date,
                article.description,
                article.content,
                article.guid,
            ]);
        });
    }
    
    database.close();
    
    return NextResponse.json({
        message: "Articles added",
        status: 200,
    });
}