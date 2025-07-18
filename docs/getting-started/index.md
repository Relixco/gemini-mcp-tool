:::warning Work in Progress
This page is currently under development and may be incomplete. 
For quick start instructions, please refer to our [Installation Guide](/installation/) or the [**GitHub README**](https://github.com/jamubc/gemini-mcp-tool#readme).
:::

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

# Getting Started

Welcome to the Gemini MCP Tool! This guide will help you get up and running in minutes.

## Quick Start Guide

Get Gemini MCP Tool running in 3 simple steps:

### Step 1: Setup Prerequisites
Ensure you have the Gemini CLI installed:
```bash
pip install google-generativeai-cli
gemini config set api_key YOUR_API_KEY
```

### Step 2: Configure Claude Desktop
Add to your Claude Desktop config file:
```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "npx",
      "args": ["-y", "gemini-mcp-tool"]
    }
  }
}
```

### Step 3: Start Using
Restart Claude Desktop and try:
- "Use Gemini to analyze this file"
- `/gemini-cli:ping "Hello Gemini!"`

## Prerequisites

Before installing, ensure you have:

- **[Node.js](https://nodejs.org/)** v16.0.0 or higher
- **[Google Gemini CLI](https://github.com/google-gemini/gemini-cli)** installed and configured on your system
- **Claude Desktop** or **Claude Code** with MCP support

### Installing Gemini CLI

```bash
# Install the Gemini CLI first
pip install google-generativeai-cli

# Configure with your API key
gemini config set api_key YOUR_API_KEY

# Verify it works
gemini -help
```

## Installation Methods

### Method 1: Using npx (Recommended - No Installation!)

This is the simplest approach - no global installation needed:

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "npx",
      "args": ["-y", "gemini-mcp-tool"]
    }
  }
}
```

### Method 2: Global Installation

If you prefer a traditional global install:

```bash
# Install globally
npm install -g gemini-mcp-tool

# Then use this configuration:
```

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp"
    }
  }
}
```

## Configuration File Locations

Find your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

::: tip
After updating the configuration, restart Claude Desktop completely for changes to take effect.
:::

## Using with Claude Code

For Claude Code users, there's an even simpler approach:

```bash
# In your project directory
claude mcp add gemini-cli -- npx -y gemini-mcp-tool

# This automatically configures the MCP for your project
```

## Verify Your Setup

Once configured, test that everything is working:

### 1. Basic Connectivity Test
Type in Claude:
```
/gemini-cli:ping "Hello from Gemini MCP!"
```

### 2. Test File Analysis
```
/gemini-cli:analyze @README.md summarize this file
```

### 3. Test Sandbox Mode
```
/gemini-cli:sandbox create a simple Python hello world script
```

## Quick Command Reference

Once installed, you can use natural language or slash commands:

### Natural Language Examples
- "use gemini to explain index.html"
- "understand the massive project using gemini"
- "ask gemini to search for latest news"

### Slash Commands in Claude Code
Type `/gemini-cli` and these commands will appear:
- `/gemini-cli:analyze` - Analyze files or ask questions
- `/gemini-cli:sandbox` - Safe code execution
- `/gemini-cli:help` - Show help information
- `/gemini-cli:ping` - Test connectivity

## Common Issues

### "Command not found: gemini"
Make sure you've installed the Gemini CLI:
```bash
pip install google-generativeai-cli
```

### "MCP server not responding"
1. Check your configuration file path
2. Ensure JSON syntax is correct
3. Restart Claude Desktop completely

### "Permission denied"
On macOS/Linux, you might need to make scripts executable:
```bash
chmod +x contribution/*.sh
```

## What's Next?

Now that you're set up, explore these resources:

- **[Complete Installation Guide](/installation/)** - Detailed setup for all platforms  
- **[Commands Reference](/usage/commands)** - Full command documentation
- **[File Analysis Guide](/concepts/file-analysis)** - Master the @syntax for file processing
- **[How It Works](/concepts/how-it-works)** - Understanding the architecture
- **[Examples](/usage/examples)** - Real-world use cases
- **[Troubleshooting](/resources/troubleshooting)** - Common issues and solutions

::: info Need Help?
If you run into issues, [open an issue](https://github.com/jamubc/gemini-mcp-tool/issues) on GitHub.
:::


