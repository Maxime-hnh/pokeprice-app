-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sets" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "symbol" TEXT,
    "cardCount" JSONB NOT NULL,
    "tcgOnline" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "legal" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serieId" INTEGER NOT NULL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT,
    "illustrator" TEXT,
    "rarity" TEXT,
    "averagePrice" DECIMAL(65,30),
    "highestPrice" DECIMAL(65,30),
    "lowestPrice" DECIMAL(65,30),
    "ebaySearchContent" TEXT,
    "setId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_variants" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_variant_on_card" (
    "cardId" INTEGER NOT NULL,
    "cardVariantId" INTEGER NOT NULL,

    CONSTRAINT "card_variant_on_card_pkey" PRIMARY KEY ("cardId","cardVariantId")
);

-- CreateTable
CREATE TABLE "user_card_variants" (
    "userId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "cardVariantId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_card_variants_pkey" PRIMARY KEY ("userId","cardId","cardVariantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uid_key" ON "users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_uid_key" ON "roles"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "series_uid_key" ON "series"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "series_code_key" ON "series"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sets_uid_key" ON "sets"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "sets_code_key" ON "sets"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cards_uid_key" ON "cards"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "cards_code_key" ON "cards"("code");

-- CreateIndex
CREATE UNIQUE INDEX "card_variants_uid_key" ON "card_variants"("uid");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_variant_on_card" ADD CONSTRAINT "card_variant_on_card_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_variant_on_card" ADD CONSTRAINT "card_variant_on_card_cardVariantId_fkey" FOREIGN KEY ("cardVariantId") REFERENCES "card_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_card_variants" ADD CONSTRAINT "user_card_variants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_card_variants" ADD CONSTRAINT "user_card_variants_cardId_cardVariantId_fkey" FOREIGN KEY ("cardId", "cardVariantId") REFERENCES "card_variant_on_card"("cardId", "cardVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_card_variants" ADD CONSTRAINT "user_card_variants_cardVariantId_fkey" FOREIGN KEY ("cardVariantId") REFERENCES "card_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
