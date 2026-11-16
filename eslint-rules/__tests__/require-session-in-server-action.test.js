const { RuleTester } = require("eslint");
const { test } = require("node:test");

const rule = require("../require-session-in-server-action");

const tester = new RuleTester({
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
});

test("require-session-in-server-action", () => {
  tester.run("require-session-in-server-action", rule, {
    valid: [
      `"use server";
       export const A = async () => { const session = await getServerSession(); return session; };`,
      `"use server";
       export async function B() { try { await getServerSession(); } catch (e) {} }`,
      `export const NotAServerFile = async () => 1;`,
      `"use server";
       const helper = async () => 1;
       export const C = async () => { await getServerSession(); return helper(); };`,
    ],
    invalid: [
      {
        code: `"use server";
               export const A = async () => 1;`,
        errors: [{ messageId: "missingSession", data: { name: "A" } }],
      },
      {
        code: `"use server";
               export async function B() { return 1; }`,
        errors: [{ messageId: "missingSession", data: { name: "B" } }],
      },
      {
        code: `"use server";
               const ok = async () => { await getServerSession(); };
               export const C = async () => ok();`,
        errors: [{ messageId: "missingSession", data: { name: "C" } }],
      },
    ],
  });
});
