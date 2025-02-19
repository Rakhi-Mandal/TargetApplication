const { expect } = require("@playwright/test");
require("dotenv").config();
const helper = require("../utils/helper");
const data = require("../Data/testimData.json");
exports.TestimPage = class TestimPage {
  constructor(page) {
    this.page = page;
    this.closePopUp = page.locator("//button[contains(@aria-label,'Dismiss')]");
    this.pageLogo = page.locator(
      "//div[contains(@class,'page-header')]//child::img[contains(@alt,'Testim Logo')]"
    );
    this.navigationElements = page.locator(
      "//div[contains(@class,'page-header')]//child::li[contains(@class,'has-drop')]"
    );
    this.companyOption = page.locator("//a[text()='Company']");
    this.subSection = (subSectionText) =>page.locator(`//span[text()='${subSectionText}']`);
    this.customerName = page.locator("(//div[@class='item-name'])[1]");
    this.customerPosition = page.locator("(//div[@class='item-position'])[1]");
    this.reviewContent = page.locator("(//div[@class='item-body']//p)[1]");
    this.footer = page.locator("//div[contains(@class,'footer')]");
    this.footerLinks = page.locator(
      "//div[@class='f-bottom']//child::div//ul[@class='l-list']//li//a"
    );
  }
  async navigate() {
    await helper.assertAllureStep("Navigate to Testim Website", async () => {
      await this.page.goto(process.env.testimBaseUrl);
      helper.logToFile(`\nTestim Application Logs:${helper.getCheckInDates()}`);
    });
  }
  async getNavOptions() {
    let headerOptions;
    await helper.assertAllureStep(
      "Get all the available header options",
      async () => {
        headerOptions = this.navigationElements.elementHandles();
      }
    );
    return headerOptions;
  }

  async validateTheHeaderOptions() {
    await helper.assertAllureStep(
      "validating available header options",
      async () => {
        expect(this.pageLogo).toBeVisible();

        const navOptions = await this.getNavOptions();
        let visibleCount = 0;
        for (const option of navOptions) {
          const isVisible = await option.isVisible();
          if (isVisible) {
            visibleCount++;
          }
        }
        helper.logToFile(`Total visible header options: ${visibleCount}`);
      }
    );
  }

  async validateCompanySection() {
    await helper.assertAllureStep(
      "validating company section options",
      async () => {
        await this.companyOption.click();
        for (const option of data.subSectionTexts) {
          const subSectionText = this.subSection(option);
          await expect(
            subSectionText,
            "validate about sub-section visibility"
          ).toBeVisible(parseInt(process.env.smallTimeOut));
        }
      }
    );
  }

  async validateCustomerSubSection() {
    await helper.assertAllureStep(
      "Fetching and validating company sub-section options",
      async () => {
        for (const option of data.subSectionTexts) {
          if (option.includes("Customers")) {
            const customersSubOption = this.subSection(option);
            helper.logToFile(
              `Customer sub section options: ${customersSubOption}`
            );

            await customersSubOption.click();
          }
        }
      }
    );
    await helper.assertAllureStep("validating current page url", async () => {
      await expect(
        this.page,
        "validate the url when we click on testim customer sub-section"
      ).toHaveURL(process.env.testimCustomerUrl);
    });
    await helper.assertAllureStep("validating customer name", async () => {
      await expect(
        this.customerName,
        "validate the customer name in the review section"
      ).toHaveText(data.customerSubSection.name);
    });
    await helper.assertAllureStep(
      "double validating customer details in review section with the data file",
      async () => {
        const reviewName = data.customerSubSection.name;
        const reviewPosition = data.customerSubSection.position;
        const reviewContent = data.customerSubSection.reviewContent;

        const displayedName = await this.customerName.textContent();
        const displayedContent = await this.reviewContent.textContent();
        const displayedPosition = await this.customerPosition.textContent();

        expect(displayedName).toBe(reviewName);
        const cleanedReceivedContent = displayedContent.slice(1, -1);
        expect(
          cleanedReceivedContent,
          "comparing the customer review contents stored in the data file with the reveived one from UI"
        ).toBe(reviewContent);
        expect(
          displayedPosition,
          "comparing the customer review position stored in the data file with the reveived one from UI"
        ).toBe(reviewPosition);
      }
    );
  }
  async getFooterOptions() {
    let footerOptions;
    await helper.assertAllureStep(
      "get all options available in footer",
      async () => {
        footerOptions = this.footerLinks.elementHandles();
      }
    );
    return await footerOptions;
  }
  async validateFooterSection() {
    await helper.assertAllureStep(
      "validating all the footer options are visible available as links",
      async () => {
        await this.footer.scrollIntoViewIfNeeded();
        expect(
          this.footer,
          "validate the footer is not hidden"
        ).not.toBeHidden();
        const footOptions = await this.getFooterOptions();
        let visibleCount = 0;
        for (const option of footOptions) {
          const isVisible = await option.isVisible();
          const hrefValue = await option.getAttribute("href");
          expect(
            hrefValue,
            "validate the options we have in page footer have an attribute 'href'"
          ).not.toBeNull();
          const displayedFooterLink = await option.textContent();
          helper.logToFile(`\nFooter: ${displayedFooterLink}`);
          if (isVisible) {
            visibleCount++;
          }
        }
        helper.logToFile(
          `\nTotal visible  footer link options: ${visibleCount}`
        );
      }
    );
  }
};
