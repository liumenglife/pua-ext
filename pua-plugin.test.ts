import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { tmpdir } from "os";
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const TEST_STATE_DIR = join(tmpdir(), "pua-test-state");

beforeEach(() => {
  mkdirSync(TEST_STATE_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TEST_STATE_DIR)) {
    rmSync(TEST_STATE_DIR, { recursive: true });
  }
});

describe("pua-plugin hooks", () => {
  test("should export puaPlugin function", async () => {
    const { puaPlugin } = await import("./.opencode/plugins/pua-plugin.ts");
    expect(puaPlugin).toBeDefined();
    expect(typeof puaPlugin).toBe("function");
  });
});