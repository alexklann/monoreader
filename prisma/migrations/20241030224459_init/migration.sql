-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rss_articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feed_image" TEXT NOT NULL DEFAULT '',
    "feed_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "pub_date" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_rss_articles" ("content", "created_at", "description", "feed_url", "guid", "id", "link", "pub_date", "title") SELECT "content", "created_at", "description", "feed_url", "guid", "id", "link", "pub_date", "title" FROM "rss_articles";
DROP TABLE "rss_articles";
ALTER TABLE "new_rss_articles" RENAME TO "rss_articles";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
