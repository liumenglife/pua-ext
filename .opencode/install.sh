#!/bin/bash
set -e

PLUGIN_DIR="$HOME/.config/opencode/plugins/pua"

echo "Installing PUA OpenCode plugin..."

# Create plugins directory
mkdir -p "$HOME/.config/opencode/plugins"

# Clone repository
if [ -d "$PLUGIN_DIR" ]; then
    echo "Plugin already exists at $PLUGIN_DIR, pulling latest..."
    cd "$PLUGIN_DIR"
    git pull origin main
else
    echo "Cloning PUA repository..."
    git clone https://github.com/tanweai/pua.git "$PLUGIN_DIR"
    cd "$PLUGIN_DIR"
fi

echo "Installing Bun dependencies..."
if [ -f "package.json" ]; then
    bun install
fi

echo ""
echo "✅ PUA plugin installed to $PLUGIN_DIR"
echo ""
echo "Installation paths:"
echo "  - Plugin: $PLUGIN_DIR"
echo "  - State:  ~/.config/opencode/pua/"
echo "  - Skills: $PLUGIN_DIR/skills/"
echo ""
echo "Restart OpenCode to activate the plugin."