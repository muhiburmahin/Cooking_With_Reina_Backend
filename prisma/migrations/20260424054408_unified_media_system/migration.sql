/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the `menu_images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `url` to the `gallery` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- DropForeignKey
ALTER TABLE "menu_images" DROP CONSTRAINT "menu_images_menuItemId_fkey";

-- AlterTable
ALTER TABLE "gallery" DROP COLUMN "imageUrl",
ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "menu_items" DROP COLUMN "imageUrl",
ADD COLUMN     "thumbnailUrl" TEXT;

-- DropTable
DROP TABLE "menu_images";

-- CreateTable
CREATE TABLE "menu_media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "menuItemId" TEXT NOT NULL,

    CONSTRAINT "menu_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "menu_media_menuItemId_idx" ON "menu_media"("menuItemId");

-- AddForeignKey
ALTER TABLE "menu_media" ADD CONSTRAINT "menu_media_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
