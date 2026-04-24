-- AlterTable
ALTER TABLE "gallery" ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "menu_categories" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "menu_items" ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "cookingTime" TEXT,
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "preparationTime" TEXT,
ADD COLUMN     "servingSize" TEXT;

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_menuItemId_idx" ON "reviews"("menuItemId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
