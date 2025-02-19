const { test, beforeEach } = require("@playwright/test");
const { TestimPage } = require("../pageObject/testim.page"); 
let testimPage;

beforeEach(async ({ page }) => {
    testimPage=new TestimPage(page);
});

test("Test Case:Testim Application", async () => {
   await testimPage.navigate();
   await testimPage.validateTheHeaderOptions();
   await testimPage.validateCompanySection();
   await testimPage.validateCustomerSubSection();
   await testimPage.validateFooterSection();
 
});