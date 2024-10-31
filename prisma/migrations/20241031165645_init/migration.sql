/*
  Warnings:

  - You are about to drop the column `feed_image` on the `rss_articles` table. All the data in the column will be lost.
  - You are about to drop the column `feed_url` on the `rss_articles` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rss_articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feed_id" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "pub_date" TEXT NOT NULL,
    "contentSnippet" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rss_articles_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rss_articles" ("content", "contentSnippet", "created_at", "guid", "id", "link", "pub_date", "title") SELECT "content", "contentSnippet", "created_at", "guid", "id", "link", "pub_date", "title" FROM "rss_articles";
DROP TABLE "rss_articles";
ALTER TABLE "new_rss_articles" RENAME TO "rss_articles";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
