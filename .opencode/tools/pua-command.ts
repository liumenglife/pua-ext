import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";

const PLUGIN_ROOT = dirname(dirname(__dirname));
const SKILL_DIR = join(PLUGIN_ROOT, "skills");

interface PuaCommandArgs {
  subcommand?: "on" | "off" | "status" | "p7" | "p9" | "p10" | "pro" | "mama" | "shot" | "yes" | "pua-loop" | "loop-status" | "loop-abort" | "flavor" | "feedback" | "team-status" | "teardown-all";
  args?: string;
}

const skillMap: Record<string, string> = {
  "on": "pua/SKILL.md",
  "off": "",
  "status": "",
  "p7": "p7/SKILL.md",
  "p9": "p9/SKILL.md",
  "p10": "p10/SKILL.md",
  "pro": "pro/SKILL.md",
  "mama": "mama/SKILL.md",
  "shot": "shot/SKILL.md",
  "yes": "yes/SKILL.md",
  "pua-loop": "pua-loop/SKILL.md",
  "flavor": "pua/references/flavors.md",
};

const CONFIG_FILE = join(homedir(), ".config/opencode/pua/config.json");

function loadSkill(subcommand: string): string {
  const defaultSubs = ["on", "p7", "p9", "p10", "pro", "mama", "shot", "yes", "pua-loop"];
  if (!subcommand || !defaultSubs.includes(subcommand)) {
    subcommand = "on";
  }

  const skillFile = skillMap[subcommand];
  if (!skillFile) {
    return `[PUA] Unknown subcommand: ${subcommand}\nAvailable: ${Object.keys(skillMap).join(", ")}`;
  }

  const fullPath = join(SKILL_DIR, skillFile);
  if (!existsSync(fullPath)) {
    return `[PUA] Skill file not found: ${fullPath}`;
  }

  return readFileSync(fullPath, "utf-8");
}

function setConfig(key: string, value: any): string {
  let config: Record<string, any> = {};
  const dir = join(homedir(), ".config/opencode/pua");

  if (existsSync(CONFIG_FILE)) {
    try {
      config = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
    } catch {
      config = {};
    }
  }

  config[key] = value;

  const fs = require("fs");
  if (!existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

  return `[PUA] Config updated: ${key}=${value}`;
}

export function handlePuaCommand(args: PuaCommandArgs): string {
  const { subcommand, args: cmdArgs } = args;

  switch (subcommand) {
    case "on":
      return setConfig("always_on", true);
    case "off":
      return setConfig("always_on", false);
    case "status":
      if (existsSync(CONFIG_FILE)) {
        const config = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
        return `[PUA Status]\n${JSON.stringify(config, null, 2)}`;
      }
      return "[PUA Status]\nalways_on: true\nflavor: alibaba";
    case "flavor":
      if (cmdArgs) {
        return setConfig("flavor", cmdArgs);
      }
      return "[PUA] Usage: /pua flavor <alibaba|bytedance|huawei|tencent|baidu|netflix|musk|jobs|amazon>";
    case "teardown-all":
    case "team-status":
      return "[PUA] Feature not implemented yet";
    case "feedback":
      return "[PUA] Feedback collection at session end";
    default:
      return loadSkill(subcommand || "on");
  }
}

export default handlePuaCommand;