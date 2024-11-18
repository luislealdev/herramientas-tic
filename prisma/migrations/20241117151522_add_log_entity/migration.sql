-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "madeBy" TEXT NOT NULL,
    "realizedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_madeBy_fkey" FOREIGN KEY ("madeBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
