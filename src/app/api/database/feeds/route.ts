import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sqlite3 from "sqlite3";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body) {
        return NextResponse.json({
            message: "Bad request",
            status: 400,
            body: {
                message: "No feed provided",
            },
        });
    }

    const database = new sqlite3.Database(databasePath);
    database.run("INSERT INTO feeds (name, url, image, updated) VALUES (?, ?, ?, ?)", [body.name, body.url, body.image, Date.now()]);
    database.close();

    return NextResponse.json(
        { message: 'Added feed' },
        { status : 200 },
    )
}