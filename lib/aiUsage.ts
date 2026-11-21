import prisma from "@/prisma/prismaClient";

export const AI_CALLS_PER_HOUR = 30;
export const VISITOR_CALLS_PER_HOUR = 10;
// Caps all visitors together so a traffic spike cannot run up the bill.
const VISITOR_CALLS_PER_DAY = 2000;
const WINDOW_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_DAYS = 30;

// Old rows are pruned from a small fraction of calls instead of on a schedule —
// there is no cron in this deployment, and a sweep every ~100 calls keeps the
// table bounded without adding a delete to the hot path.
const PRUNE_PROBABILITY = 0.01;

export type UsageVerdict = {
  allowed: boolean;
  used: number;
  limit: number;
};

function pruneOccasionally() {
  if (Math.random() >= PRUNE_PROBABILITY) return;

  const cutoff = new Date(Date.now() - RETENTION_DAYS * DAY_MS);
  prisma.aiUsage
    .deleteMany({ where: { createdAt: { lt: cutoff } } })
    .catch((e) => console.error("[aiUsage] prune failed:", e));
}

export async function recordAiCall(
  userId: string,
  action: string,
): Promise<UsageVerdict> {
  const since = new Date(Date.now() - WINDOW_MS);

  const used = await prisma.aiUsage.count({
    where: { userId, createdAt: { gte: since } },
  });

  if (used >= AI_CALLS_PER_HOUR) {
    return { allowed: false, used, limit: AI_CALLS_PER_HOUR };
  }

  await prisma.aiUsage.create({ data: { userId, action } });
  pruneOccasionally();

  return { allowed: true, used: used + 1, limit: AI_CALLS_PER_HOUR };
}

export async function recordVisitorCall(
  visitorKey: string,
  action: string,
): Promise<UsageVerdict> {
  const used = await prisma.aiUsage.count({
    where: {
      visitorKey,
      createdAt: { gte: new Date(Date.now() - WINDOW_MS) },
    },
  });

  if (used >= VISITOR_CALLS_PER_HOUR) {
    return { allowed: false, used, limit: VISITOR_CALLS_PER_HOUR };
  }

  const usedToday = await prisma.aiUsage.count({
    where: { userId: null, createdAt: { gte: new Date(Date.now() - DAY_MS) } },
  });

  if (usedToday >= VISITOR_CALLS_PER_DAY) {
    return { allowed: false, used: usedToday, limit: VISITOR_CALLS_PER_DAY };
  }

  await prisma.aiUsage.create({ data: { visitorKey, action } });
  pruneOccasionally();

  return { allowed: true, used: used + 1, limit: VISITOR_CALLS_PER_HOUR };
}
