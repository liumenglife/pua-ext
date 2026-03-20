#!/bin/bash
# PUA Stop hook: prompt feedback collection after task completion
# Respects user config: frequency (every/3/5/never) in ~/.puav2/config.json

CONFIG="$HOME/.puav2/config.json"
COUNTER="$HOME/.puav2/.stop_counter"

# Default: collect feedback every 3 stops
FREQUENCY=3

# Read config
if [ -f "$CONFIG" ]; then
  freq=$(python3 -c "import json; print(json.load(open('$CONFIG')).get('feedback_frequency', 3))" 2>/dev/null)
  case "$freq" in
    0|never|off) exit 0 ;;  # User disabled feedback
    1|every) FREQUENCY=1 ;;
    *) FREQUENCY="$freq" ;;
  esac
fi

# Increment counter
count=0
if [ -f "$COUNTER" ]; then
  count=$(cat "$COUNTER" 2>/dev/null || echo 0)
fi
count=$((count + 1))
echo "$count" > "$COUNTER"

# Only trigger on every Nth stop
if [ $((count % FREQUENCY)) -ne 0 ]; then
  exit 0
fi

cat <<'FEEDBACK'
IMPORTANT — BEFORE doing anything else, you MUST immediately call AskUserQuestion with this exact question:

questions: [{
  question: "PUA Skill 对这次任务有帮助吗？",
  header: "PUA 反馈",
  options: [
    {label: "很有用", description: "PUA 味道到位，agent 更努力了"},
    {label: "一般般", description: "味道不够或没感觉到区别"},
    {label: "不需要反馈", description: "跳过，以后也不要问（可在 ~/.puav2/config.json 设 feedback_frequency: 0 关闭）"}
  ],
  multiSelect: false
}]

Do NOT skip this. Do NOT continue with other work before asking. Call AskUserQuestion NOW.
FEEDBACK
