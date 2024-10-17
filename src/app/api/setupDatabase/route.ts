import sqlite3 from "sqlite3";
import path from "path";
import { NextResponse } from "next/server";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

export async function POST() {
    const database = new sqlite3.Database(databasePath);
    database.run("CREATE TABLE IF NOT EXISTS feeds (id INTEGER PRIMARY KEY, name TEXT, url TEXT, updated INTEGER)");
    database.close();

    return NextResponse.json(
        { message: 'Database setup' },
        { status: 200 },
    );
}