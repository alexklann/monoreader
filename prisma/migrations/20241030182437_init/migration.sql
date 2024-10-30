-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_feeds" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "updateInterval" INTEGER NOT NULL DEFAULT 15,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_feeds" ("id", "image", "name", "updated", "url") SELECT "id", "image", "name", "updated", "url" FROM "feeds";
DROP TABLE "feeds";
ALTER TABLE "new_feeds" RENAME TO "feeds";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
