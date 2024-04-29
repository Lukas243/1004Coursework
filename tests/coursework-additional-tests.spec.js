import exp from "constants";

// @ts-check
const { test, expect } = require("@playwright/test");

// change this to the URL of your website, could be local or GitHub pages
const websiteURL = "https://lukas243.github.io/coursework/people-search.html";

// Go to the website home page before each test.
test.beforeEach(async ({ page }) => {
    await page.goto(websiteURL);
});

// # JS tests
// add vehicle
test("Add a vehicle (existing person)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK10XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Rachel Smith")
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Vehicle added successfully")

    await page.getByRole("link", { name: "Vehicle search" }).click();
    await page.locator("#rego").fill("GK10XRR")
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.locator("#results")).toContainText("Mini")
    await expect(page.locator("#results").locator("div")).toHaveCount(1)
    await expect(page.locator("#message")).toContainText("Search successful")
});

// add vehicle and person
test("Add a vehicle (new person)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK11XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Greenhalf")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    // add a new person
    await page.locator("#personid").fill("6")
    await page.locator("#name").fill("Lukas Greenhalf")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#license").fill("SD876ES")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Vehicle added successfully")

    await page.getByRole("link", { name: "People search" }).click();
    await page.locator("#name").fill("Lukas Greenhalf")
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.locator("#results")).toContainText("SD876ES")
    await expect(page.locator("#results").locator("div")).toHaveCount(1)

    await page.getByRole("link", { name: "Vehicle search" }).click();
    await page.locator("#rego").fill("GK11XRR")
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.locator("#results")).toContainText("Mini")
    await expect(page.locator("#results").locator("div")).toHaveCount(1)
    await expect(page.locator("#message")).toContainText("Search successful")
});

// no vehicle details filled
test("Add a vehicle (no details)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// no person details filled
test("Add a vehicle (no person details)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK10XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only reg filled
test("Add a vehicle (only reg)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK10XRR")

    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only make filled
test("Add a vehicle (only make)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#make").fill("Mini")

    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only reg filled
test("Add a vehicle (only model)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#model").fill("First")

    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only reg filled
test("Add a vehicle (only colour)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#colour").fill("White")

    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only reg filled
test("Add a vehicle (only owner)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#owner").fill("Lukas Greenhalf")

    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only person id
test("Add a person (only id)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("7")

    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only name
test("Add a person (only name)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#name").fill("Lukas Halfgreen")

    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only address
test("Add a person (only address)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#address").fill("Sevenoaks")

    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only dob
test("Add a person (only dob)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#dob").fill("2004-12-06")

    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only license num
test("Add a person (license num)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#license").fill("SD876ET")

    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// only exiry date
test("Add a person (only expiry date)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#expire").fill("2030-01-02")

    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// person id already exists
test("Add a person (person id already exists)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("5")
    await page.locator("#name").fill("Lukas Halfgreen")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#license").fill("SD876ES")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing reg plate
test("Add a vehicle (missing reg plate)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing make
test("Add a vehicle (missing make)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing model
test("Add a vehicle(missing model)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing colour
test("Add a vehicle(missing colour)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing owner
test("Add a vehicle(missing owner)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.getByRole("button", { name: "Add vehicle" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing person id
test("Add a person (missing person id)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#name").fill("Lukas Halfgreen")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#license").fill("SD876ES")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing name
test("Add a person (missing name)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("6")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#license").fill("SD876ES")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing address
test("Add a person (missing address)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("6")
    await page.locator("#name").fill("Lukas Halfgreen")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#license").fill("SD876ES")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing DOB
test("Add a person (missing DOB)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("6")
    await page.locator("#name").fill("Lukas Halfgreen")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#license").fill("SD876ES")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing License
test("Add a person (missing License)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("6")
    await page.locator("#name").fill("Lukas Halfgreen")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// missing expiry date
test("Add a person (missing expiry date)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("GK12XRR")
    await page.locator("#make").fill("Mini")
    await page.locator("#model").fill("First")
    await page.locator("#colour").fill("White")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("6")
    await page.locator("#name").fill("Lukas Halfgreen")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#license").fill("SD876ES")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});

// invalid data type
test("Add a vehicle (invalid data types)", async ({ page }) => {
    await page.getByRole("link", { name: "Add a vehicle" }).click();
    await page.locator("#rego").fill("123")
    await page.locator("#make").fill("123")
    await page.locator("#model").fill("123")
    await page.locator("#colour").fill("123")
    await page.locator("#owner").fill("Lukas Halfgreen")
    await page.getByRole("button", { name: "Add vehicle" }).click();

    await page.locator("#personid").fill("string")
    await page.locator("#name").fill("Lukas Halfgreen")
    await page.locator("#address").fill("Sevenoaks")
    await page.locator("#dob").fill("2004-12-06")
    await page.locator("#license").fill("SD876ES")
    await page.locator("#expire").fill("2030-01-01")
    await page.getByRole("button", { name: "Add owner" }).click();
    await expect(page.locator("#message")).toContainText("Error")
});