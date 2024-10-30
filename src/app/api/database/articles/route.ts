import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Article {
    feed_url: string,
    title: string,
    link: string,
    pub_date: string,
    description: string,
    content: string,
    guid: string,
}

export async function GET() {
    const articles = await prisma.rss_articles.findMany({
        take: 200,
        orderBy: {
            created_at: "asc"
        }
    });

    await prisma.$disconnect();
    return NextResponse.json({
        data: articles,
        status: 200,
    })
}

/**
 * POST request to add articles to the database
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
    const body = await request.json();

    for (const article of body.articles as Article[]) {
        const result = await prisma.rss_articles.findMany({
            where: {
                guid: article.guid
            }
        });

        if (result.length > 0) {
            continue;
        }

        await prisma.rss_articles.create({
            data: {
                feed_url: article.feed_url,
                title: article.title,
                link: article.link,
                pub_date: article.pub_date,
                description: article.description,
                content: article.content,
                guid: article.guid,
            }
        });
    }

    await prisma.$disconnect();
    
    return NextResponse.json({
        message: "Articles added",
        status: 200,
    });
}
