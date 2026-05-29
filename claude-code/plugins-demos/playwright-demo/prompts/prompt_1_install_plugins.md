# Prompt 1: Install Playwright and Marketing Plugins

Plugins extend Claude Code with entirely new abilities — like browsing the web or generating marketing strategies. Let's install two free ones.

\---

## Plugin 1: Playwright (Browser Automation)

This gives Claude the ability to open a real browser, navigate websites, click things, take screenshots, and read page content.

Inside Claude Code, type:

```
/plugin install playwright@claude-plugins-official
```

> \\\*\\\*What this does:\\\*\\\* Installs the Playwright browser automation plugin from the official Claude Code marketplace. Claude can now literally control a web browser — navigate pages, click elements, take screenshots, and read content.

> \\\*\\\*Note:\\\*\\\* The `claude-plugins-official` marketplace is pre-configured in every Claude Code installation — no setup needed.

\---

## Plugin 2: Anthropic Marketing Plugin

This gives Claude marketing expertise — content strategy, campaign planning, brand positioning, and competitive analysis.

Inside Claude Code, first add the marketplace:

```
/plugin marketplace add anthropics/knowledge-work-plugins
```

Then install the marketing plugin:

```
/plugin install marketing@knowledge-work-plugins
```

> \\\*\\\*What this does:\\\*\\\* Adds Anthropic's official marketing skills to Claude Code. Claude now has structured frameworks for content creation, positioning, and competitive analysis.

\---

## Verify both are working

Inside Claude Code, type:

```
/skills
```

You should see both Playwright and marketing skills listed.

\---

## What you just unlocked

* **Playwright:** Claude can browse any website, take screenshots, extract content, and interact with pages — all for free
* **Marketing Plugin:** Claude has structured marketing frameworks for strategy, content, and competitive analysis

