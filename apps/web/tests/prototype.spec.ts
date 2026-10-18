import { test, expect, type Page, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { rawRequest, lesson } from "../src/prototype/content";

test("Mobile drawer contains keyboard focus, closes, and navigates", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.locator("html").evaluate(el => getComputedStyle(el).colorScheme)).toBe("dark");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await keyboardFocus(page, menu);
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "BOUNTYLAB_" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Close" })).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await drawer.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await accessibility(page);
  await page.screenshot({ path: testInfo.outputPath("navigation-375.png"), fullPage: true });
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(menu).toBeFocused();
  await page.keyboard.press("Enter");
  await drawer.getByRole("link", { name: "learn", exact: true }).click();
  await expect(page).toHaveURL("/week-1");
  await expect(drawer).not.toBeVisible();
  for (const size of [{ width: 320, height: 740 }, { width: 812, height: 375 }]) {
    await page.setViewportSize(size);
    for (const url of ["/", "/week-1", "/week-1/read-http"]) {
      await page.goto(url);
      await noOverflow(page);
      await accessibility(page);
    }
  }
});
async function accessibility(page: Page) {
  const focused = await page.evaluateHandle(() => document.activeElement);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await focused.evaluate((el) => {
    if (el instanceof HTMLElement) el.focus();
  });
  await focused.dispose();
  expect(result.violations).toEqual([]);
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
async function keyboardFocus(page: Page, target: Locator) {
  for (let i = 0; i < 80; i++) {
    if (await target.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error("Could not reach control with Tab");
}
async function keyboardActivate(page: Page, name: string) {
  const button = page.getByRole("button", { name, exact: true });
  // Traverse from the current focus; no mouse or programmatic focus for lesson controls.
  for (let i = 0; i < 80; i++) {
    if (await button.evaluate((el) => el === document.activeElement)) {
      await page.keyboard.press("Enter");
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error(`Could not reach ${name} with Tab`);
}
for (const width of [390, 768, 1440]) {
  test(`Layout and accessibility at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const [url, name] of [
      ["/", "dashboard"],
      ["/week-1", "module"],
      ["/week-1/read-http", "lesson"],
    ]) {
      await page.goto(url);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await noOverflow(page);
      await accessibility(page);
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
    }
    await page.getByRole("button", { name: "Continue to observe" }).click();
    await page
      .getByRole("button", {
        name: "Inspect Bearer synthetic-session-a",
        exact: true,
      })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "The server still has to check permission",
    );
    await noOverflow(page);
    await accessibility(page);
    await page.screenshot({
      path: testInfo.outputPath(`http-interaction-${width}.png`),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Raw", exact: true }).click();
    await expect(page.getByLabel("Raw HTTP request")).toHaveText(
      rawRequest(lesson.request),
    );
    await noOverflow(page);
    await accessibility(page);
    await page.getByRole("button", { name: "Formatted", exact: true }).click();
    await page.getByRole("button", { name: "Continue to think" }).click();
    await page
      .getByLabel("Your hypothesis", { exact: true })
      .fill("If I change the identifier, I request another order.");
    await accessibility(page);
    await page.getByRole("button", { name: "Continue to inspect" }).click();
    await page
      .getByRole("button", { name: "Inspect 418", exact: true })
      .click();
    await page.getByRole("button", { name: "Continue to explain" }).click();
    await page
      .getByLabel("What selects the order, and what supplies identity?")
      .fill(
        "The path selects the order. The bearer token supplies identity context.",
      );
    await page
      .getByRole("button", { name: "Compare with the reasoning", exact: true })
      .click();
    await accessibility(page);
    await page.getByRole("button", { name: "Continue to apply" }).click();
    await page
      .getByRole("button", { name: "Inspect 418", exact: true })
      .click();
    await page.getByLabel("New order identifier").fill("419");
    await page
      .getByRole("button", { name: "Prepare request →", exact: true })
      .click();
    await noOverflow(page);
    await accessibility(page);
    await page.screenshot({
      path: testInfo.outputPath(`apply-${width}.png`),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Finish practice" }).click();
    await noOverflow(page);
    await accessibility(page);
    await page.screenshot({
      path: testInfo.outputPath(`conclusion-${width}.png`),
      fullPage: true,
    });
    await page
      .getByRole("navigation", { name: "Lesson steps" })
      .getByRole("button", { name: /Observe/ })
      .click();
    await expect(
      page.getByRole("heading", { name: "Read what is actually there." }),
    ).toBeFocused();
  });
}
test("Complete the investigation using keyboard, retry a selection, and return to mock progress", async ({
  page,
}) => {
  await page.goto("/week-1/read-http");
  await keyboardActivate(page, "Continue to observe");
  await keyboardActivate(page, "Inspect GET");
  await expect(page.getByRole("status")).toContainText("GET asks the server");
  await keyboardActivate(page, "Continue to think");
  await expect(
    page.getByRole("button", { name: "Continue to inspect" }),
  ).toBeDisabled();
  await keyboardFocus(
    page,
    page.getByLabel("Your hypothesis", { exact: true }),
  );
  await expect(
    page.getByLabel("Your hypothesis", { exact: true }),
  ).toBeFocused();
  await page.keyboard.type(
    "If I change 418 to 419, I expect a request for another order.",
  );
  await keyboardActivate(page, "Continue to inspect");
  await keyboardActivate(page, "Inspect Bearer synthetic-session-a");
  await expect(page.getByRole("status")).toContainText(
    "That part has a different role.",
  );
  await expect(
    page.getByRole("button", { name: "Continue to explain" }),
  ).toBeDisabled();
  await keyboardActivate(page, "Inspect 418");
  await expect(page.getByRole("status")).toContainText(
    "418 identifies the requested order",
  );
  await accessibility(page);
  await keyboardActivate(page, "Continue to explain");
  await keyboardFocus(
    page,
    page.getByLabel("What selects the order, and what supplies identity?"),
  );
  await expect(
    page.getByLabel("What selects the order, and what supplies identity?"),
  ).toBeFocused();
  await page.keyboard.type(
    "418 in the path selects the order. Authorization supplies a session credential.",
  );
  await keyboardActivate(page, "Compare with the reasoning");
  await expect(page.getByRole("status")).toContainText(
    "Your explanation has not been graded",
  );
  await keyboardActivate(page, "Continue to apply");
  await keyboardActivate(page, "Inspect GET");
  await expect(page.getByRole("status").first()).toContainText(
    "Keep this part unchanged.",
  );
  await keyboardActivate(page, "Inspect 418");
  await keyboardFocus(page, page.getByLabel("New order identifier"));
  await expect(page.getByLabel("New order identifier")).toBeFocused();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("420");
  await keyboardActivate(page, "Prepare request →");
  await expect(page.getByRole("status")).toContainText(
    "This task asks for order 419",
  );
  await expect(
    page.getByRole("button", { name: "Finish practice" }),
  ).toBeDisabled();
  // Tab through the page back to the input, preserving a pure keyboard completion path.
  for (
    let i = 0;
    i < 80 &&
    !(await page
      .getByLabel("New order identifier")
      .evaluate((el) => el === document.activeElement));
    i++
  )
    await page.keyboard.press("Tab");
  await expect(page.getByLabel("New order identifier")).toBeFocused();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("419");
  await keyboardActivate(page, "Prepare request →");
  await expect(
    page.getByRole("heading", { name: "Prepared request · not sent" }),
  ).toBeVisible();
  await expect(
    page.getByText("Request inspected. No server response collected."),
  ).toBeVisible();
  await accessibility(page);
  await noOverflow(page);
  await keyboardActivate(page, "Finish practice");
  await expect(
    page.getByRole("heading", {
      name: "A request is a question. The response is evidence.",
    }),
  ).toBeFocused();
  await accessibility(page);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/week-1");
  await expect(page.getByText("lessons complete in preview")).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("lessons complete", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Current", { exact: true })).toBeVisible();
});
test("Revisiting earlier steps retains drafts; learner text remains text", async ({
  page,
}) => {
  await page.goto("/week-1/read-http");
  await page.getByRole("button", { name: "Continue to observe" }).click();
  await page.getByRole("button", { name: "Inspect 418" }).click();
  await page.getByRole("button", { name: "Continue to think" }).click();
  const draft =
    "<img src=x onerror=alert(1)> If I change the path, another order is requested.";
  await page.getByLabel("Your hypothesis", { exact: true }).fill(draft);
  await page.getByRole("button", { name: "Continue to inspect" }).click();
  await page
    .getByRole("navigation", { name: "Lesson steps" })
    .getByRole("button", { name: /Observe/ })
    .click();
  await page
    .getByRole("navigation", { name: "Lesson steps" })
    .getByRole("button", { name: /Think/ })
    .click();
  await expect(page.getByLabel("Your hypothesis", { exact: true })).toHaveValue(
    draft,
  );
  expect(await page.locator("img").count()).toBe(0);
});
