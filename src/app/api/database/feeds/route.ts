import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

    await prisma.feeds.create({
        data: {
            name: body.name,
            url: body.url,
            image: body.image,
        }
    });

    await prisma.$disconnect();

    return NextResponse.json(
        { message: 'Added feed' },
        { status : 200 },
    )
}