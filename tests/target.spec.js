const { test, beforeEach } = require("@playwright/test");
const { TargretPage } = require("../pageObject/target.page"); 
let targetPage;

beforeEach(async ({ page }) => {
    targetPage=new TargretPage(page);
});

test("Test Case:Testim Application", async () => {
   await targetPage.navigation();
   await targetPage.checkingPageDetails();
   await targetPage.searchForAnItem();
   await targetPage.validateTheResults();
   await targetPage.selectAProductWithDiscount();
   await targetPage.validateDiscounts();
 
});