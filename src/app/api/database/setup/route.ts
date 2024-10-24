import sqlite3 from "sqlite3";
import path from "path";
import { NextResponse } from "next/server";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

export async function POST() {
    const database = new sqlite3.Database(databasePath);
    database.run("CREATE TABLE IF NOT EXISTS feeds (id INTEGER PRIMARY KEY, name TEXT, url TEXT, image TEXT, updated INTEGER)");
    database.run(`
        CREATE TABLE rss_articles (
            id SERIAL PRIMARY KEY,
            feed_url VARCHAR(255),
            title TEXT NOT NULL,
            link TEXT NOT NULL,
            pub_date TIMESTAMP,
            description TEXT,
            content TEXT,
            guid TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    database.close();

    return NextResponse.json(
        { message: 'Database setup' },
        { status: 200 },
    );
}