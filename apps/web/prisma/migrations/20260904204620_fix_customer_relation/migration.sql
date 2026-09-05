/*
  Warnings:

  - You are about to drop the column `customerIdField` on the `Order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "chargeId" TEXT,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerAvatar" TEXT,
    "amount" REAL NOT NULL,
    "fee" REAL NOT NULL,
    "net" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "itemsCount" INTEGER NOT NULL DEFAULT 0,
    "country" TEXT,
    "ipAddress" TEXT,
    "merchantId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "fraudRiskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT,
    "riskExplanation" TEXT,
    "riskFactors" TEXT,
    "timeline" TEXT,
    "stripeEvents" TEXT,
    "webhookLogs" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("amount", "chargeId", "country", "createdAt", "currency", "customerAvatar", "customerEmail", "customerId", "customerName", "fee", "fraudRiskScore", "id", "ipAddress", "itemsCount", "merchantId", "net", "orderNumber", "organizationId", "paymentIntentId", "paymentMethod", "riskExplanation", "riskFactors", "riskLevel", "status", "stripeEvents", "timeline", "updatedAt", "webhookLogs") SELECT "amount", "chargeId", "country", "createdAt", "currency", "customerAvatar", "customerEmail", "customerId", "customerName", "fee", "fraudRiskScore", "id", "ipAddress", "itemsCount", "merchantId", "net", "orderNumber", "organizationId", "paymentIntentId", "paymentMethod", "riskExplanation", "riskFactors", "riskLevel", "status", "stripeEvents", "timeline", "updatedAt", "webhookLogs" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Order_paymentIntentId_key" ON "Order"("paymentIntentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
