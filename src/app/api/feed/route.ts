import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const feeds = await prisma.feeds.findMany();

    if (feeds.length > 0) {
        const modifiedFeeds = feeds.map(feed => {
            if (feed.image === null) {
                feed.image = "";
            }
            return feed;
        });

        return NextResponse.json(
            { data: modifiedFeeds },
            { status: 200 },
        );
    } else {
        return NextResponse.json({
            message: "No feeds found",
            status: 404,
        });
    }
}

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const image = searchParams.get('image') || "";
    const url = searchParams.get('url');
    
    if (!name || !url) {
        return NextResponse.json(
            { error: 'Name and URL are required' },
            { status: 400 },
        );
    }

    await prisma.feeds.create({
        data: {
            name: name,
            url: url,
            image: image || "",
        }
    });
    await prisma.$disconnect();

    return NextResponse.json(
        { message: 'Added feed' },
        { status : 200 },
    )
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 },
        );
    }

    await prisma.feeds.delete({
        where: {
            id: parseInt(id),
        }
    });
    await prisma.$disconnect();

    return NextResponse.json(
        { message: 'Deleted feed' },
        { status : 200 },
    );
}