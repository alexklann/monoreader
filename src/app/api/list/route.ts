import { NextResponse } from "next/server";
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