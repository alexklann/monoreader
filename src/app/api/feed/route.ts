import { NextResponse, NextRequest } from "next/server";
import path from "path";
import sqlite3 from "sqlite3";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

interface FeedRow {
    id: number;
    title: string;
    description: string;
    link: string;
    image: string | null;
}

export async function GET() {
    return new Promise((resolve, reject) => {
        const database = new sqlite3.Database(databasePath);
        database.all("SELECT * FROM feeds", (error, rows: FeedRow[]) => {
            database.close();
            if (error) {
                reject(error);
            } else {
                const modifiedRows = rows.map(row => {
                    if (row.image === null) {
                        row.image = "";
                    }
                    return row;
                });
                resolve(NextResponse.json(
                    { data: modifiedRows },
                ));
            }
        });
    });
}

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const image = searchParams.get('image');
    const url = searchParams.get('url');

    console.log(name, url);

    if (!name || !url) {
        return NextResponse.json(
            { error: 'Name and URL are required' },
            { status: 400 },
        );
    }

    // Can't use API route since this is the server-side
    // TO DO: Need a better idea to do this 
    const database = new sqlite3.Database(databasePath);
    database.run("INSERT INTO feeds (name, url, image, updated) VALUES (?, ?, ?, ?)", [name, url, image, Date.now()]);
    database.close();

    return NextResponse.json(
        { message: 'Added feed' },
        { status : 200 },
    )
}

export async function DELETE(request: NextRequest) {
    return new Promise((resolve, reject) => {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 },
            );
        }

        const database = new sqlite3.Database(databasePath);
        database.run("DELETE FROM feeds WHERE id = ?", [id], (error) => {
            database.close();
            if (error) {
                reject(error);
            } else {
                resolve(NextResponse.json(
                    { message: 'Deleted feed' },
                    { status: 200 },
                ));
            }
        });
    });
}