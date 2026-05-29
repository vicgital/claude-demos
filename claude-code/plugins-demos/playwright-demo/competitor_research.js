const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const competitors = [
  {
    name: 'barrys',
    label: "Barry's",
    homepage: 'https://www.barrys.com',
    schedulePath: null,
    pricingPath: null,
    austinPath: null,
  },
  {
    name: 'purebarre',
    label: 'Pure Barre',
    homepage: 'https://www.purebarre.com',
    schedulePath: null,
    pricingPath: null,
    austinPath: null,
  },
];

const findings = {};

async function screenshotPage(page, filePath, label) {
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`  [screenshot] ${label} -> ${path.basename(filePath)}`);
}

async function tryNavigate(page, url, timeout = 20000) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    await page.waitForTimeout(2500);
    return true;
  } catch (e) {
    console.log(`  [warn] Navigation failed for ${url}: ${e.message}`);
    return false;
  }
}

async function findLinkHref(page, patterns) {
  const links = await page.$$eval('a[href]', (els) =>
    els.map((el) => ({ href: el.href, text: el.innerText.trim().toLowerCase() }))
  );
  for (const { href, text } of links) {
    for (const pattern of patterns) {
      if (text.includes(pattern) || href.toLowerCase().includes(pattern)) return href;
    }
  }
  return null;
}

async function researchCompetitor(browser, competitor) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const result = {
    name: competitor.label,
    homepage: {},
    schedule: null,
    pricing: null,
    austin: null,
  };

  // 1. Homepage
  console.log(`\n== ${competitor.label} ==`);
  console.log(`  Visiting homepage: ${competitor.homepage}`);
  const homeOk = await tryNavigate(page, competitor.homepage);
  if (homeOk) {
    const homeFile = path.join(SCREENSHOTS_DIR, `${competitor.name}_homepage.png`);
    await screenshotPage(page, homeFile, `${competitor.label} homepage`);
    result.homepage.screenshot = homeFile;
    result.homepage.title = await page.title();
    result.homepage.url = page.url();

    // Extract hero text
    const heroText = await page.evaluate(() => {
      const candidates = [
        document.querySelector('h1'),
        document.querySelector('[class*="hero"] h1'),
        document.querySelector('[class*="hero"] h2'),
        document.querySelector('[class*="banner"] h1'),
        document.querySelector('[class*="headline"]'),
      ];
      for (const el of candidates) {
        if (el && el.innerText.trim()) return el.innerText.trim();
      }
      return null;
    });
    result.homepage.heroText = heroText;

    // Extract primary CTA
    const ctaText = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('a, button')].filter((el) => {
        const t = el.innerText.trim().toLowerCase();
        return (
          t.includes('book') ||
          t.includes('join') ||
          t.includes('start') ||
          t.includes('get') ||
          t.includes('try') ||
          t.includes('sign up') ||
          t.includes('free')
        );
      });
      return btns.slice(0, 3).map((el) => el.innerText.trim());
    });
    result.homepage.ctas = ctaText;

    // 2. Schedule/Classes page
    const scheduleLink = await findLinkHref(page, ['schedule', 'classes', 'class']);
    if (scheduleLink) {
      console.log(`  Found schedule/classes link: ${scheduleLink}`);
      const schedOk = await tryNavigate(page, scheduleLink);
      if (schedOk) {
        const schedFile = path.join(SCREENSHOTS_DIR, `${competitor.name}_schedule.png`);
        await screenshotPage(page, schedFile, `${competitor.label} schedule`);
        result.schedule = { screenshot: schedFile, url: page.url() };
      }
      await tryNavigate(page, competitor.homepage);
    }

    // 3. Pricing page
    const pricingLink = await findLinkHref(page, ['pricing', 'price', 'membership', 'plan']);
    if (pricingLink) {
      console.log(`  Found pricing link: ${pricingLink}`);
      const priceOk = await tryNavigate(page, pricingLink);
      if (priceOk) {
        const priceFile = path.join(SCREENSHOTS_DIR, `${competitor.name}_pricing.png`);
        await screenshotPage(page, priceFile, `${competitor.label} pricing`);
        result.pricing = { screenshot: priceFile, url: page.url() };
      }
      await tryNavigate(page, competitor.homepage);
    }

    // 4. Austin TX location
    const austinLink = await findLinkHref(page, ['austin', 'locations', 'studios', 'find']);
    if (austinLink) {
      console.log(`  Found locations link: ${austinLink}`);
      const austinOk = await tryNavigate(page, austinLink);
      if (austinOk) {
        const austinFile = path.join(SCREENSHOTS_DIR, `${competitor.name}_austin.png`);
        await screenshotPage(page, austinFile, `${competitor.label} Austin`);
        result.austin = { screenshot: austinFile, url: page.url() };
      }
    }
  }

  await page.close();
  return result;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  console.log('Browser launched. Starting competitor research...');

  for (const competitor of competitors) {
    findings[competitor.name] = await researchCompetitor(browser, competitor);
  }

  await browser.close();

  // Write findings summary JSON
  const summaryPath = path.join(SCREENSHOTS_DIR, 'findings.json');
  fs.writeFileSync(summaryPath, JSON.stringify(findings, null, 2));
  console.log(`\nFindings saved to ${summaryPath}`);
  console.log('\n=== RAW FINDINGS ===');
  console.log(JSON.stringify(findings, null, 2));
})();
