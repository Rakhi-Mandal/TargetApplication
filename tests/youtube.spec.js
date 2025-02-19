
const { test, beforeEach } = require("@playwright/test"); 
require("dotenv").config(); 
const { YoutubePage } = require("../pageObject/youtube.page"); 

let youtubePage;

beforeEach(async ({ page }) => {
    youtubePage = new YoutubePage(page);
});

test("Test Case: Youtube Application", async() => {
    await youtubePage.navigation(); 
    await youtubePage.checkingPageDetails(); 
    await youtubePage.searchingForVideos();
    await youtubePage.selectVideoFromResults();
    await youtubePage.interactWithVideo();
});
