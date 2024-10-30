-- CreateTable
CREATE TABLE "feeds" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "updated" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "rss_articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feed_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "pub_date" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
