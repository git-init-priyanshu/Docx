import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { shouldSnapshot, VERSION_THROTTLE_MS } from "../policy.ts";

const now = Date.parse("2026-01-01T12:00:00Z");
const ago = (ms: number) => new Date(now - ms);

describe("shouldSnapshot", () => {
  test("snapshots when no version exists yet", () => {
    assert.equal(shouldSnapshot(undefined, "data", now), true);
  });

  test("skips identical content however old the last version is", () => {
    const latest = { data: "same", createdAt: ago(VERSION_THROTTLE_MS * 10) };

    assert.equal(shouldSnapshot(latest, "same", now), false);
  });

  test("skips changed content inside the throttle window", () => {
    const latest = { data: "old", createdAt: ago(VERSION_THROTTLE_MS - 1) };

    assert.equal(shouldSnapshot(latest, "new", now), false);
  });

  test("snapshots changed content exactly at the throttle window", () => {
    const latest = { data: "old", createdAt: ago(VERSION_THROTTLE_MS) };

    assert.equal(shouldSnapshot(latest, "new", now), true);
  });

  test("accepts an ISO string timestamp from the guest localStorage path", () => {
    const latest = { data: "old", createdAt: ago(VERSION_THROTTLE_MS).toISOString() };

    assert.equal(shouldSnapshot(latest, "new", now), true);
  });
});
