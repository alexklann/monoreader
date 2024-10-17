import { NextResponse } from "next/server";
import path from "path";
import sqlite3 from "sqlite3";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

export async function GET() {
    return new Promise((resolve, reject) => {
        const database = new sqlite3.Database(databasePath);
        database.all("SELECT * FROM feeds", (error, rows) => {
            database.close();
            if (error) {
                reject(error);
            } else {
                resolve(NextResponse.json(
                    { data: rows },
                ));
            }
        });
    });
}