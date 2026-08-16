// Rolling-window rate limit for AI calls, backed by one row per call.
//
// A counter table rather than an in-memory limiter because the app runs on
// serverless instances that do not share memory, and because the rows are
// worth keeping: they are the usage record that later evaluation work reads.

import prisma from "@/prisma/prismaClient";

export const AI_CALLS_PER_HOUR = 30;
const WINDOW_MS = 60 * 60 * 1000;
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

  if (Math.random() < PRUNE_PROBABILITY) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    prisma.aiUsage
      .deleteMany({ where: { createdAt: { lt: cutoff } } })
      .catch((e) => console.error("[aiUsage] prune failed:", e));
  }

  return { allowed: true, used: used + 1, limit: AI_CALLS_PER_HOUR };
}
