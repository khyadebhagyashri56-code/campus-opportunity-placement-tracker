-- CreateTable
CREATE TABLE "BrokenProductAttempt" (
    "id" SERIAL NOT NULL,
    "scenario" TEXT NOT NULL DEFAULT 'NovaCart Checkout Bug',
    "selectedApproach" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "proposedFix" TEXT,
    "score" INTEGER,
    "feedback" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BrokenProductAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrokenProductAttempt_userId_createdAt_idx" ON "BrokenProductAttempt"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "BrokenProductAttempt" ADD CONSTRAINT "BrokenProductAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
