import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3001/course", { waitUntil: "networkidle" });

const data = await page.evaluate(() => {
  const nav = document.querySelector('nav[aria-label="Điều hướng chính"]');
  const grid = nav?.firstElementChild;
  const items = [...(grid?.children ?? [])];
  const navRect = nav?.getBoundingClientRect();
  const gridRect = grid?.getBoundingClientRect();
  const viewportCenter = window.innerWidth / 2;

  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    nav: navRect
      ? {
          left: navRect.left,
          width: navRect.width,
          center: navRect.left + navRect.width / 2,
          paddingLeft: getComputedStyle(nav).paddingLeft,
          paddingRight: getComputedStyle(nav).paddingRight,
        }
      : null,
    grid: gridRect
      ? {
          left: gridRect.left,
          width: gridRect.width,
          center: gridRect.left + gridRect.width / 2,
          className: grid.className,
        }
      : null,
    viewportCenter,
    gridOffsetFromViewportCenter: gridRect
      ? gridRect.left + gridRect.width / 2 - viewportCenter
      : null,
    items: items.map((el, i) => {
      const r = el.getBoundingClientRect();
      const icon = el.querySelector("svg");
      const label = el.querySelector("span");
      const iconRect = icon?.getBoundingClientRect();
      const labelRect = label?.getBoundingClientRect();
      const colCenter = gridRect
        ? gridRect.left + (gridRect.width / 4) * (i + 0.5)
        : null;

      return {
        i,
        tag: el.tagName,
        text: el.textContent?.trim(),
        itemCenter: r.left + r.width / 2,
        colCenter,
        offsetFromColCenter: colCenter ? r.left + r.width / 2 - colCenter : null,
        iconCenter: iconRect ? iconRect.left + iconRect.width / 2 : null,
        labelCenter: labelRect ? labelRect.left + labelRect.width / 2 : null,
        iconOffsetFromItemCenter: iconRect
          ? iconRect.left + iconRect.width / 2 - (r.left + r.width / 2)
          : null,
      };
    }),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
