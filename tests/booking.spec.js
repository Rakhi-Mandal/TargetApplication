const { test, beforeEach } = require("@playwright/test");
const { BookingPage } = require("../pageObject/booking.page"); 
let bookingPage;

beforeEach(async ({ page }) => {
    bookingPage=new BookingPage(page);
});

test("Test Case:Booking Application", async () => {
   await bookingPage.navigate();
   await bookingPage.handlePopup();
   await bookingPage.verifyURLAndTitle();
   await bookingPage.validateSearchBars();
   await bookingPage.fillBookingRequirements();
   await bookingPage.filterAndVerifyTheResults();
   await bookingPage.verifySelectedHotel();
   
 
});