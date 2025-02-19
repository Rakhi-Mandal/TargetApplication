const { allure } = require('allure-playwright');
const fs = require('fs');
let isFileCleaned = false;

function getCheckInDates() {
  const today = new Date();
  const date = today.getDate().toString();
  const year = today.getFullYear().toString();
  const month = today.toLocaleString("default", { month: "long" });
  const formattedDate = `${date} ${month} ${year}`;
  return formattedDate;
}
function getCheckOutDates() {
  const today = new Date();
  const date = today.getDate().toString();
  const year = today.getFullYear().toString();
  const month = today.toLocaleString("default", { month: "long" });
  const formattedDate = `${date} ${month} ${year}`;
  return formattedDate;
}
 function logToFile(message) {
  const logFilePath = 'output/testLogs.txt';
  if (!isFileCleaned) {
    fs.writeFileSync(logFilePath, '', 'utf8'); 
    isFileCleaned = true; 
  }
  fs.appendFileSync(logFilePath, message + '\n', 'utf8');
  
}

async function getParsedPrice(element) {
  const text = await element.textContent();
  const price = parseFloat(text.replace(/[^\d.-]/g, ''));
  const discountMatch = text.match(/(\d+)% off/);
  const discount = discountMatch ? parseInt(discountMatch[1], 10) : null;
  return { price, discount };
}

function calculateDiscountPercentage(original, discounted) {
  return Math.round(((original - discounted) / original) * 100);
}

function calculateDiscountPrice(original, discounted) {
  return (original - discounted);
}

async function assertAllureStep(stepName,stepTask) {
  await allure.step(stepName,async()=>{
    await stepTask()
  })
}

module.exports = {
  // getCurrentDate,
  // updateTheDate,
  // getCheckoutDate,
  getCheckInDates,
  getCheckOutDates,
  logToFile,
  getParsedPrice,
  calculateDiscountPercentage,
  calculateDiscountPrice,
  assertAllureStep
};
