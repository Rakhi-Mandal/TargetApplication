const { test, beforeEach } = require("@playwright/test");
const { BookingPage } = require("../pageObject/bookApi.page"); 
const helper = require("../utils/helper");
const data = require("../Data/bookApiData.json");


let bookApiPage;

beforeEach(async ({ page }) => {
   bookApiPage=new BookingPage(page);
   await bookApiPage.authorizationWithAxios();
});


test("Test Case : Book API Application to get the books of library" , async () => {
   helper.logToFile(`\nBook API logs :${helper.getCheckInDates()}`)
   // await bookApiPage.getAllRecords();
   await bookApiPage.getBook(data.sampleIsbn);  
});

test("Test Case : Book API Application to fetch all the book from user collection" , async () => {
   await bookApiPage.getBooksOfUser(data.userId);
});

test.only("Test Case : Book API Application to add a book to user collection" , async () => {
   await bookApiPage.addABookInUserCollection(data.userId,data.sampleIsbn);
});
// test.only("Test Case : Book API Application to delete a book from user collection" , async () => {
//    await bookApiPage.deleteBook(data.sampleIsbn,data.userId);
// });


test("Test Case : Book API Application to update a book from user collection" , async () => {
   await bookApiPage.updateCollection(data.userId,data.sampleIsbn);;
});