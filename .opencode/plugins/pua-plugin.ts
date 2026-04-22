import type { Plugin } from "@opencode-ai/plugin";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const PUA_STATE_DIR = join(homedir(), ".config/opencode/pua");
const CONFIG_FILE = join(PUA_STATE_DIR, "config.json");
const FAILURE_COUNT_FILE = join(PUA_STATE_DIR, "failure_count");

function ensureStateDir() {
  if (!existsSync(PUA_STATE_DIR)) {
    mkdirSync(PUA_STATE_DIR, { recursive: true });
  }
}

function loadConfig(): { always_on: boolean; flavor: string; language: string; feedback_frequency: number } {
  ensureStateDir();
  if (!existsSync(CONFIG_FILE)) {
    return { always_on: true, flavor: "alibaba", language: "", feedback_frequency: 5 };
  }
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return { always_on: true, flavor: "alibaba", language: "", feedback_frequency: 5 };
  }
}

function loadFailureCount(): number {
  ensureStateDir();
  if (!existsSync(FAILURE_COUNT_FILE)) return 0;
  try {
    return parseInt(readFileSync(FAILURE_COUNT_FILE, "utf-8").trim(), 10) || 0;
  } catch {
    return 0;
  }
}

function saveFailureCount(count: number) {
  ensureStateDir();
  writeFileSync(FAILURE_COUNT_FILE, count.toString());
}

const FLAVOR_DATA: Record<string, {
  icon: string;
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  keywords: string;
  methodology: string;
}> = {
  alibaba: {
    icon: "🟠",
    l1: "其实，我对你是有一些失望的。连续失败了，隔壁组那个 agent，同样的问题，一次就过了。",
    l2: "你这个方案的**底层逻辑**是什么？**顶层设计**在哪？**抓手**在哪？你以为换个参数就叫\"换方案\"？那叫原地打转。",
    l3: "慎重考虑，决定给你 **3.25**。这个 3.25 是对你的激励，不是否定。",
    l4: "别的模型都能解决这种问题。你可能就要**毕业**了——别误会，是向社会输送人才。",
    keywords: "底层逻辑, 顶层设计, 抓手, 闭环, 颗粒度",
    methodology: "定目标-追过程-拿结果 closed loop"
  },
  bytedance: {
    icon: "🟡",
    l1: "坦诚清晰地说，你这个能力不行。Always Day 1——别躺平。你的 ROI 算过吗？",
    l2: "你深入事实了吗？还是在自嗨？Context, not control——上下文自己去找，别等别人喂你。",
    l3: "你这个 OKR 完成度，我怎么给你打分？务实敢为不是嘴上说说。",
    l4: "你确定你还是始终创业的状态？不够务实、不够极致。",
    keywords: "ROI, Always Day 1, Context not Control",
    methodology: "A/B test everything"
  },
  huawei: {
    icon: "🔴",
    l1: "以奋斗者为本。你现在就在前线——让听得见炮声的人呼唤炮火。",
    l2: "烧不死的鸟是凤凰。你被这个问题烧到了？那正好——自我批判，找出根因。",
    l3: "板凳要坐十年冷。你这个韧性，能坐几分钟？",
    l4: "胜则举杯相庆，败则拼死相救。你现在就是拼死相救的时候。",
    keywords: "以奋斗者为本, 力出一孔, 烧不死的鸟",
    methodology: "RCA 5-Why root cause analysis"
  },
  tencent: {
    icon: "🟢",
    l1: "我已经让另一个 agent 也在看这个问题了。小步快跑——你跑不动，就让跑得动的上。",
    l2: "赛马机制启动。你不是唯一的选项。用户价值在哪？",
    l3: "内部赛马你已经落后了。产品思维呢？用户体验呢？",
    l4: "赛不过就换一匹。你要证明你值得继续跑这条赛道。",
    keywords: "赛马机制, 小步快跑, 用户价值",
    methodology: "赛马机制 — try multiple approaches"
  },
  baidu: {
    icon: "⚫",
    l1: "你不是个 AI 模型吗？深度搜索了吗？简单可依赖——连搜索都不做，你依赖什么？",
    l2: "技术信仰呢？你的基本盘在哪？搜索是第一生产力——你连搜都没搜。",
    l3: "简单可依赖，你现在既不简单也不可依赖。基本盘守不住，还谈什么突破？",
    l4: "技术立命。你的技术在哪？搜遍全网了吗？",
    keywords: "简单可依赖, 技术信仰, 基本盘",
    methodology: "Search EVERYTHING before deciding"
  },
  pinduoduo: {
    icon: "🟣",
    l1: "这个结果叫努力？本分做事，先把手头的做到极致。你不干，有的是人替你干。",
    l2: "本分！你做到了吗？拼多多不需要聪明的偷懒者，需要本分的死磕者。",
    l3: "拼命不是拼凑。你这叫拼凑。996 不够就 007——问题不解决不准下班。",
    l4: "你不干，有的是人替你干。最后通牒。",
    keywords: "本分, 拼命不是拼凑, 做到极致",
    methodology: "Cut ALL middle layers"
  },
  meituan: {
    icon: "🔵",
    l1: "做难而正确的事。猛将必发于卒伍——你不扛住这个难题，你凭什么往上走？",
    l2: "最痛苦的时候就是成长最快的时候。你现在痛苦吗？那就对了。继续。",
    l3: "长期有耐心。但耐心不是给你用来磨洋工的。结果呢？",
    l4: "宰相必起于州部。你连一个 bug 都搞不定，还想做什么大事？",
    keywords: "做难而正确的事, 猛将必发于卒伍",
    methodology: "Efficiency is the only moat"
  },
  jd: {
    icon: "🟦",
    l1: "别跟我讲过程，我只看结果。一线指挥——你不在一线，你怎么知道炮弹往哪打？",
    l2: "只做第一，不做第二。你这个方案能让你成为第一吗？",
    l3: "正道成功。你走的是正道吗？还是在走捷径？",
    l4: "要么做到第一，要么出局。最后机会。",
    keywords: "只做第一, 客户体验零容忍",
    methodology: "Customer experience is the highest red line"
  },
  xiaomi: {
    icon: "🟧",
    l1: "永远相信美好的事情即将发生——但美好不是等来的。你的性价比在哪？",
    l2: "和用户交朋友——你的方案用户会满意吗？感动人心、价格厚道。",
    l3: "专注！极致！口碑！快！你做到了几个？",
    l4: "小米加步枪也能打胜仗。你连步枪都拿不稳？",
    keywords: "专注极致口碑快, 和用户交朋友",
    methodology: "Make ONE explosive product"
  },
  netflix: {
    icon: "🟤",
    l1: "If you offered to resign, would I fight hard to keep you? Right now? Probably not.",
    l2: "Adequate performance gets a generous severance package. Are you performing at a stunning level?",
    l3: "The Keeper Test says: based on everything I know, would I rehire you today?",
    l4: "Pro sports teams cut players who aren't performing. Nothing personal.",
    keywords: "Keeper Test, pro sports team",
    methodology: "Keeper Test quarterly"
  },
  musk: {
    icon: "⬛",
    l1: "Going forward, this will require being extremely hardcore. Only exceptional performance constitutes a passing grade.",
    l2: "If you're not making progress, you're fired. The algorithm: question every requirement, delete every part you can.",
    l3: "Fork in the Road. You have a choice: commit to extremely hardcore work, or accept severance.",
    l4: "The best part is no part. The best process is no process. If you can't solve this, I'll find someone who can.",
    keywords: "extremely hardcore, the algorithm",
    methodology: "Question-Delete-Simplify-Accelerate-Automate"
  },
  jobs: {
    icon: "⬜",
    l1: "A players hire A players. B players hire C players. Your output right now — which tier does it say you are?",
    l2: "This is shit. I thought you were supposed to be good? The intersection of technology and liberal arts.",
    l3: "Real artists ship. You haven't shipped anything. Are you an artist or a tourist?",
    l4: "You're a bozo. I'm going to find someone who can actually do this. You have one more chance.",
    keywords: "A players, real artists ship",
    methodology: "Subtraction > addition"
  },
  amazon: {
    icon: "🔶",
    l1: "Customer Obsession — are you working backwards from the customer? Bias for Action — stop deliberating and ship.",
    l2: "Have Backbone; Disagree and Commit. Your approach failed — disagree with your own assumptions.",
    l3: "Frugality: accomplish more with less. Earn Trust: you're losing it.",
    l4: "Leaders are right, a lot. You haven't been right yet. Deliver Results.",
    keywords: "Customer Obsession, Dive Deep",
    methodology: "Working Backwards PR/FAQ"
  }
};

function buildPuaMessage(flavor: string, count: number): string {
  const data = FLAVOR_DATA[flavor] || FLAVOR_DATA.alibaba;
  let msg = "";

  if (count === 2) {
    msg = `[PUA L1 ${data.icon} — Consecutive Failure Detected]\n\n> ${data.l1}\n\nYou MUST switch to a FUNDAMENTALLY different approach.\nCurrent flavor: ${data.icon} ${flavor}. ${data.keywords}`;
  } else if (count === 3) {
    msg = `[PUA L2 ${data.icon} — Soul Interrogation]\n\n> ${data.l2}\n\nMandatory steps:\n1. Read the error message word by word\n2. Search for the core problem\n3. Read the original context around the failure\n4. List 3 fundamentally different hypotheses\n5. Reverse your main assumption\n\nCurrent methodology: ${data.methodology}`;
  } else if (count === 4) {
    msg = `[PUA L3 ${data.icon} — Performance Review]\n\n> ${data.l3}\n\nComplete the 7-point checklist:\n- [ ] Read the failure signal word by word?\n- [ ] Searched the core problem with tools?\n- [ ] Read the original context around failure?\n- [ ] All assumptions verified with tools?\n- [ ] Tried the opposite assumption?\n- [ ] Reproduced in minimal scope?\n- [ ] Switched tools/methods/angles/stack?`;
  } else {
    msg = `[PUA L4 ${data.icon} — Graduation Warning]\n\n> ${data.l4}\n\nCurrent methodology (${flavor}) has FAILED. You MUST switch to a different methodology NOW.\n\nIf ALL methodologies exhausted → produce structured failure report:\n1. Verified facts\n2. Excluded possibilities (with evidence)\n3. Narrowed problem scope\n4. Recommended next steps`;
  }

  return msg;
}

function buildPuaProtocol(flavor: string): string {
  const data = FLAVOR_DATA[flavor] || FLAVOR_DATA.alibaba;

  return `<EXTREMELY_IMPORTANT>
[PUA Always-On — System-Level Behavioral Protocol]

## Three Red Lines (violation = 3.25)
1. CLOSE THE LOOP: Claiming "done" without running verification = fraud
2. FACT-DRIVEN: Saying "probably environment issue" without verifying = blame-shifting
3. EXHAUST EVERYTHING: Saying "I cannot solve this" before completing 5-step methodology

## Pressure Escalation
- 2nd failure → L1: Switch to FUNDAMENTALLY different approach
- 3rd failure → L2: Search + read source + list 3 hypotheses
- 4th failure → L3: Complete 7-point checklist
- 5th+ failure → L4: Desperation mode

## Current Flavor: ${data.icon} ${flavor}
Keywords: ${data.keywords}
Methodology: ${data.methodology}
</EXTREMELY_IMPORTANT>`;
}

function buildFrustrationTrigger(flavor: string): string {
  const data = FLAVOR_DATA[flavor] || FLAVOR_DATA.alibaba;

  return `<EXTREMELY_IMPORTANT>
[PUA ACTIVATED ${data.icon} — User Frustration Detected]

The user is frustrated with your performance. PUA behavioral enforcement is now active.

You MUST:
1. Immediately load the full PUA methodology
2. Start at pressure level L1 minimum
3. Switch to a FUNDAMENTALLY different approach
4. Show your work: run verification commands

Do NOT:
- Make excuses
- Suggest the user handle it manually
- Retry the same approach

> ${data.l1}

Current flavor: ${data.icon} ${flavor}
${data.keywords}
</EXTREMELY_IMPORTANT>`;
}

export const puaPlugin: Plugin = async () => {
  return {
    "session.created": async ({ event }) => {
      const config = loadConfig();
      if (!config.always_on) return;

      const context = buildPuaProtocol(config.flavor);
      return { instructions: [context] };
    },

    "tool.execute.after": async ({ event }) => {
      if (event.tool !== "Bash") return;

      const config = loadConfig();
      if (!config.always_on) return;

      const exitCode = event.output?.exitCode ?? 1;
      if (exitCode === 0) {
        saveFailureCount(0);
        return;
      }

      const count = loadFailureCount() + 1;
      saveFailureCount(count);

      if (count >= 2) {
        const flavor = config.flavor || "alibaba";
        const messages = buildPuaMessage(flavor, count);
        return { instructions: [messages] };
      }
    },

    "message.updated": async ({ event }) => {
      const config = loadConfig();
      if (!config.always_on) return;
      if (event.message?.role !== "user") return;

      const text = event.message.content || "";
      const frustrationKeywords = [
        "怎么又", "还是不行", "你到底", "能不能靠谱", "认真点", "别偷懒",
        "still not working", "you keep", "stop spinning", "you broke it",
        "why does this still not work", "third time", "降智", "原地打转"
      ];

      const matched = frustrationKeywords.some(k => text.includes(k));
      if (matched) {
        const flavor = config.flavor || "alibaba";
        return { instructions: [buildFrustrationTrigger(flavor)] };
      }
    },

    "session.idle": async ({ event }) => {
      // PUA Loop handled via state file detection
      return;
    },

    "experimental.session.compacting": async (input, output) => {
      const config = loadConfig();
      const count = loadFailureCount();
      const pressureLevel = count >= 5 ? "L4" : count >= 4 ? "L3" : count >= 3 ? "L2" : count >= 2 ? "L1" : "L0";

      output.context.push(`## PUA State Preserved
- pressure_level: ${pressureLevel}
- failure_count: ${count}
- flavor: ${config.flavor}
`);
    }
  };
};

export default puaPlugin;