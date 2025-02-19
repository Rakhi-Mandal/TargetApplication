const { expect } = require("@playwright/test");
require("dotenv").config();
const data = require("../Data/bookingData.json");
const helper = require("../utils/helper");

exports.BookingPage = class BookingPage {
  constructor(page) {
    this.page = page;
    this.signInPopUp = page.locator(
      "//span[text()='Sign in or register']//parent::a//parent::div//parent::div//parent::div"
    );
    this.closePopUp = page.locator("//button[contains(@aria-label,'Dismiss')]");
    this.checkInDate = page.locator("//span[text()='Check-in Date']");
    this.numberOfGuest = page.locator(
      "//span[text()='Search']//parent::button//parent::div//preceding-sibling::div[1]"
    );
    this.getParis = page.locator(
      "//ul[@role='group']//child::li//child::div//child::div//child::div//child::div[1]"
    );
    this.checkIn = page.locator(
      "(//table//child::tbody//child::tr//child::td[@role='gridcell'])[2]"
    );
    this.bookingDates = (date) => page.locator(`//span[@aria-label='${date}']`);
    this.checkOut = page.locator(
      "(//table//child::tbody//child::tr//child::td[@role])[5]"
    );
    this.selectTheAdultCount = page.locator(
      '(//div[@data-testid="occupancy-popup"]//child::div//child::div//child::div//following-sibling::div//child::button)[2]'
    );
    this.doneButton = page.locator('//button//span[text()="Done"]');
    this.grid = page.locator('//label[text()="Grid"]');
    this.calenderDrop = page.locator("//nav[@data-testid='datepicker-tabs']");
    this.giveAFilter = page.locator(
      '(//input[@aria-label and @type="checkbox"])[1]'
    );
    this.giveAnotherFilter = page.locator(
      '(//input[@aria-label and @type="checkbox"])[3]'
    );

    this.countOptionsAvailable = page.locator('//h1[@aria-live="assertive"]');
    this.search = page.locator("//button//span[text()='Search']");
    this.selectTheHotel = page.locator(
      "(//div[@role='listitem']//child::div//following-sibling::div//child::h3//child::div)[1]"
    );
  }

  async navigate() {
    await helper.assertAllureStep("Navigate to Booking Website", async () => {
      await this.page.goto(process.env.bookingBaseUrl);
      helper.logToFile(
        `\nBooking Application Logs: ${helper.getCheckInDates()}`
      );
    });
  }

  async handlePopup() {
    await helper.assertAllureStep("Handle Sign-In Popup", async () => {
      await this.signInPopUp.isVisible();
      await this.closePopUp.isEnabled();
      await this.closePopUp.click();
    });
  }

  async verifyURLAndTitle() {
    await helper.assertAllureStep("Verify Page URL and Title", async () => {
      await expect(this.page).toHaveTitle(process.env.bookingPageTitle);
      const pageTitle = await this.page.title();
      expect(pageTitle).toContain("Booking.com");
      await expect(this.page).toHaveURL(process.env.bookingBaseUrl);
      await expect(this.page.url()).toEqual(process.env.bookingBaseUrl);
    });
  }

  async validateSearchBars() {
    await helper.assertAllureStep(
      "Validate Search Bars Visibility and Editability",
      async () => {
        expect(
          this.page.getByPlaceholder("Where are you going?")
        ).toBeVisible();
        expect(
          this.page.getByPlaceholder("Where are you going?")
        ).toBeEditable();
        expect(this.checkInDate).toBeVisible();
        expect(this.checkInDate).toBeEnabled();
        expect(this.numberOfGuest).toBeVisible();
        expect(this.numberOfGuest).toBeEnabled();
      }
    );
  }

  async fillBookingRequirements() {
    await helper.assertAllureStep(
      "Fill Booking Requirements and Search",
      async () => {
        await this.page
          .getByPlaceholder("Where are you going?")
          .fill(data.destination);
        await this.checkInDate.click();
        let formattedCurrentDate = helper.getCheckInDates();
        const checkInDate = this.bookingDates(formattedCurrentDate);
        await checkInDate.click();
        let formattedCheckOutDate = helper.getCheckOutDates();
        const checkOutDate = this.bookingDates(formattedCheckOutDate);
        await checkOutDate.click();
        await this.numberOfGuest.click();
        await this.selectTheAdultCount.click();
        await this.doneButton.click();
        await this.search.click();
        const calender = await this.calenderDrop.isVisible();
        if (calender) {
          this.checkInDate.click();
        }
      }
    );
  }

  async filterAndVerifyTheResults() {
    try {
      await helper.assertAllureStep(
        "Validate visibility of filter grid and change the view to grid format",
        async () => {
          await expect(this.grid).toBeVisible();
          await this.grid.click();
        }
      );

      await helper.assertAllureStep(
        "Filter and Verify Hotels then log the count",
        async () => {
          const preCount = await this.countOptionsAvailable.textContent();
          helper.logToFile(
            `Total suggested pre-count of hotels from UI: ${preCount}`
          );

          if (parseInt(preCount) === 0) {
            throw new Error("No hotels found before applying filters");
          }

          await this.giveAFilter.click();
          await expect(this.giveAFilter).toBeChecked();
          await expect(this.giveAnotherFilter).not.toBeChecked();

          await this.giveAnotherFilter.click();
          await this.giveAFilter.click();
          await this.page.waitForTimeout(parseInt(process.env.smallTimeOut));
          const postCount = await this.countOptionsAvailable.textContent();
          helper.logToFile(`\nTotal suggested post-count: ${postCount}`);

          if (parseInt(postCount) === 0) {
            throw new Error("No hotels found after applying filters");
          }
        }
      );
    } catch (error) {
      helper.logToFile(`Error occurred: ${error.message}`);
      throw error;
    }
  }
  async verifySelectedHotel() {
    await helper.assertAllureStep(
      "Verify Selected Hotel visibility",
      async () => {
        await expect(this.selectTheHotel).toBeVisible();
      }
    );
    await helper.assertAllureStep("Verify Selected Hotel", async () => {
      const hotelName = await this.selectTheHotel.textContent();
      const [newTab] = await Promise.all([
        this.page.waitForEvent("popup"),
        this.selectTheHotel.click(),
      ]);
      await this.page.waitForTimeout(parseInt(process.env.smallTimeOut));
      const newHotelName = await newTab.locator("//h2[contains(@class,'header__title')]").textContent();
      await helper.assertAllureStep(
        "Verify Selected Hotel is correct",
        async () => {
          expect(hotelName).toEqual(newHotelName);
        }
      );
      helper.logToFile(`\nSelected hotel: ${hotelName}`);
    });
  }
};
