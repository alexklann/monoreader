import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sqlite3 from "sqlite3";

const databasePath = path.resolve(process.cwd(), 'monoreader.sqlite');

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