const { expect } = require('@playwright/test');
require("dotenv").config();
const data = require("../Data/targetData.json");
const helper = require("../utils/helper");

exports.TargretPage = class TargretPage {
  constructor(page) {
    this.page = page;
    this.logo = page.locator("(//a[@aria-label='Target home'])[1]");
    this.searchBar = page.locator("//input[@id='search']");
    this.searchButton = page.locator("//button[@aria-label='search']");
    this.firstItem = page.locator("(//div[@data-test='product-grid']//child::a//child::div[@title])[1]");
    this.productDetail = page.locator("//div//child::h1");
    this.discountedItem = (discounted) => page.locator(`((//div[@data-test='urgency-message' and contains(text(),'${discounted}')])[1]//parent::div//parent::div//following-sibling::div//child::a[@data-test])[1]`);
    this.originalPrice = page.locator("//span[contains(@data-test,'regular-price')]");
    this.discountedPrice = page.locator("//span[@data-test='product-price']");
    this.customerSavings = page.locator("//span[contains(@data-test,'savings-amount')]");
  }

  async navigation() {
    await helper.assertAllureStep('Navigate to Target Application', async () => {
      await this.page.goto(process.env.targetBaseURL);
      helper.logToFile(`Target Application Logs: ${helper.getCheckInDates()}`);
    });
  }

  async checkingPageDetails() {
    await helper.assertAllureStep('Check page title', async () => {
      await expect(this.page).toHaveTitle(process.env.targetPageTitle);
    });
    await helper.assertAllureStep('Check page url', async () => {
      await expect(this.page).toHaveURL(process.env.targetBaseURL);
    });
    await helper.assertAllureStep('Check page logo visibility', async () => {
      await expect(this.logo).toBeVisible(); 
    });
      
      helper.logToFile(`Sucessfully validated the page details`);

  }

  async searchForAnItem() {
    await helper.assertAllureStep('Search for an item', async () => {
      await expect(this.searchBar).toBeVisible();
      await this.searchBar.fill(data.itemName);

    });
      await helper.assertAllureStep('Check search button visibility', async () => {
      await expect(this.searchButton).toBeVisible();
      });
      await helper.assertAllureStep('Check search button is enabled or not', async () => {
      await expect(this.searchButton).toBeEnabled();
      await this.searchButton.click();
        });
   
  }

  async validateTheResults() {
    await helper.assertAllureStep('Validate current title of page', async () => {
      await expect(this.page).toHaveTitle(process.env.watchPageTitle);
    });
    await helper.assertAllureStep('Fetching and validating the results obtained', async () => {
      const firstItemText = await this.firstItem.textContent();
      expect(firstItemText.toLowerCase()).toContain(data.itemName);
      helper.logToFile(`First item in result: ${firstItemText.toLowerCase()}`);
    });
  }

  async selectAProductWithDiscount() {
    await helper.assertAllureStep('Fetching a product with discount', async () => {

      for (const option of data.discounted) {
        const discountedLocator = this.discountedItem(option);
        await discountedLocator.click();
        break;
      }
    });
  }

  async validateDiscounts() {
    await helper.assertAllureStep('Validate customer offers', async () => {
   
      const original = await helper.getParsedPrice(this.originalPrice);  
      const inOffer = await helper.getParsedPrice(this.discountedPrice);  
      const calculatedDiscountPercentage = await helper.calculateDiscountPercentage(original.price, inOffer.price); 
      const calculatedDiscountPrice = await helper.calculateDiscountPrice(original.price, inOffer.price); 
      const result = await helper.getParsedPrice(this.customerSavings); 
      await helper.assertAllureStep('Validate discount percentage', async () => {
      expect(calculatedDiscountPercentage).toEqual(result.discount); 
    });
    await helper.assertAllureStep('Validate discount price', async () => {
      expect(calculatedDiscountPrice).toBeCloseTo(result.price, 0.05);  
      
    });
      helper.logToFile(`Calculated discounted price: ${calculatedDiscountPrice}`);
      helper.logToFile(`Claimed discounted price: ${result.price}`);
    });
  
  }
};
