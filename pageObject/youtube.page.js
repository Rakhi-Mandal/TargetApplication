import { expect } from "@playwright/test";
require("dotenv").config();
const data = require("../Data/youtubeData.json");
const helper = require("../utils/helper");

export class YoutubePage {
  constructor(page) {
    this.page = page;
    this.searchBar = page.locator("(//input[contains(@name,'search')])[1]");
    this.iconSearch = page.locator("(//button[contains(@title,'Search')])[1]");
    this.verifyMetaAttribute = page.locator(
      "//meta[@name='description' or @name='viewport']"
    );
    this.onlyVideos = page.locator(
      "//div[@id='chip-container']//child::yt-formatted-string[text()='Videos']"
    );
    this.countSuggestedVideos = page.locator("//h3[contains(@class,'title')]");
    this.clickAVideo = page.locator("(//h3[contains(@class,'title')])[1]");
    this.sponsored = page.locator(
      "//div[contains(@class,'ad-info')]//div[text()='Sponsored']"
    );
    this.skipAd = page.locator("//button[contains(@id,'skip')]");
    this.playPauseButton = page.locator(
      "//button[contains(@class,'ytp-play-button')]"
    );
    this.videoProgressBar = page.locator(
      "//div[contains(@class,'progress-bar-container')]"
    );
    this.videoSettings = page.locator("//button[contains(@class,'settings')]");
  }

  async navigation() {
    await helper.assertAllureStep("Navigate to Youtube Website", async () => {
      await this.page.goto(process.env.youtubeBaseURL);
      helper.logToFile(`\nYoutube Application Logs:${helper.getCheckInDates()}`);
    });
  }
  async checkingPageDetails() {
    await helper.assertAllureStep(
      "Validating Website detials(URL,Title,Meta data)",
      async () => {
        await expect(this.page, "validate page title").toHaveTitle(
          process.env.youtubePageTitle
        );
        await expect(this.page, "validate page url").toHaveURL(
          process.env.youtubeBaseURL
        );
        expect(this.verifyMetaAttribute, "validate page meta data").toBeVisible;
      }
    );
  }

  async searchingForVideos() {
    await helper.assertAllureStep(
      "Asserting search bar is visible",
      async () => {
        await expect(
          this.searchBar,
          "validate search bar is visible"
        ).toBeVisible();
      }
    );
    await helper.assertAllureStep(
      "Asserting search bar is editable",
      async () => {
        await expect(
          this.searchBar,
          "validate search bar is editable"
        ).toBeEditable();
      }
    );
    await helper.assertAllureStep(
      "Searching according to requirement and getting the count of recommendations",
      async () => {
        await this.searchBar.fill(data.searchQuery);
        await this.iconSearch.click();
        await this.onlyVideos.click();
        await this.page.waitForTimeout(parseInt(process.env.smallTimeOut));
        const count = await this.countSuggestedVideos.count();
        helper.logToFile(`\nWe got recommendations of ${count} videos.`);
        expect(
          count,
          "validate the found recommendations to be greater than 10"
        ).toBeGreaterThanOrEqual(10);
      }
    );
  }

  async selectVideoFromResults() {
    await helper.assertAllureStep("Asserting video visibility", async () => {
      expect(
        this.clickAVideo,
        "validate the selected video is visible"
      ).toBeVisible();
    });
    await helper.assertAllureStep("Asserting video enability", async () => {
      expect(
        this.clickAVideo,
        "validate the selected video is enabled"
      ).toBeEnabled();
    });
    await helper.assertAllureStep(
      "Select a video from obtained results",
      async () => {
        await this.clickAVideo.click();
        await this.page.waitForTimeout(parseInt(process.env.mediumTimeOut));
        await this.page.waitForSelector("//button[contains(@id,'skip')]");
        await helper.assertAllureStep(
          "Asserting skip add video visibility then click",
          async () => {
            const advertisement = await this.sponsored.isVisible();
            if (advertisement) {
              const skipVisible = await this.skipAd.isVisible();
              if (skipVisible) await this.skipAd.click();
            }
          }
        );
      }
    );
  }
  async interactWithVideo() {
    await helper.assertAllureStep(
      "validate video play/pause is visible and enabled",
      async () => {
        expect(
          this.playPauseButton,
          "validate video play/pause is visible"
        ).toBeVisible();
        expect(
          this.playPauseButton,
          "validate video play/pause is enabled"
        ).toBeEnabled();
      }
    );
    await helper.assertAllureStep("Interaction with video", async () => {
      let count = 1;
      while (count < 5) {
        await this.playPauseButton.click();
        await this.page.waitForTimeout(parseInt(process.env.miniTimeOut));
        count++;
      }
    });
    await helper.assertAllureStep(
      "validate video progress bar is visible",
      async () => {
        expect(
          this.videoProgressBar,
          "validate video progress bar is visible"
        ).toBeVisible();
      }
    );
    await helper.assertAllureStep(
      "validate video setting button is visible",
      async () => {
        expect(
          this.videoSettings,
          "validate video setting button is visible"
        ).toBeVisible();
      }
    );
    await helper.assertAllureStep(
      "validate video setting button is enabled then click",
      async () => {
        expect(
          this.videoSettings,
          "validate video setting button is enabled"
        ).toBeEnabled();
        await this.videoSettings.click();
      }
    );
  }
}
