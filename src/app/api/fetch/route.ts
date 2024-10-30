import { NextRequest, NextResponse } from "next/server";
import Parser from 'rss-parser';

const parser: Parser = new Parser();

async function fetchRSS(url: string) {
  const feed = await parser.parseURL(url);
  return feed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rssURL = searchParams.get('url');

  if (!rssURL) {
    return NextResponse.json(
      { error: 'No RSS URL provided' },
      { status: 400 },
    );
  }

  try {
    const fetchedFeed = await fetchRSS(decodeURIComponent(rssURL));
    return NextResponse.json(
      { data: fetchedFeed },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch RSS: ${error}` },
      { status: 500 },
    );
  }
}