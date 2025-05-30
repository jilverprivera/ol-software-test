-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRATOR', 'REGISTRATION_ASSISTANT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "status" "Status" NOT NULL,
    "registered_by_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "establishment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL,
    "employee_count" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "registered_by_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "establishment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "merchant" ADD CONSTRAINT "merchant_registered_by_id_fkey" FOREIGN KEY ("registered_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant" ADD CONSTRAINT "merchant_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment" ADD CONSTRAINT "establishment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment" ADD CONSTRAINT "establishment_registered_by_id_fkey" FOREIGN KEY ("registered_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment" ADD CONSTRAINT "establishment_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
