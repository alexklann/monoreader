import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const url = searchParams.get('url');

    if (!name || !url) {
        return NextResponse.json(
            { error: 'Name and URL are required' },
            { status: 400 },
        );
    }

    const database = new sqlite3.Database(databasePath);
    database.run("INSERT INTO feeds (name, url, updated) VALUES (?, ?, ?)", [name, url, Date.now()]);
    database.close();


    return NextResponse.json(
        { message: 'Added feed' },
        { status : 200 },
    )
}