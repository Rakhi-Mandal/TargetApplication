const { expect } = require("@playwright/test");
require("dotenv").config();
const data = require("../Data/bookApiData.json");
const helper = require("../utils/helper");
const axios = require('axios');
const ErrorCodes = require("../utils/errorCodes");

let axiosInstance;
let response;
let responseStatus;
let responseData;
exports.BookingPage = class BookingPage {
    constructor(page) {
        this.page = page;
    }

async authorizationWithAxios(){

const encodedEmail =process.env.api_username;
const encodedPassword = process.env.api_password;
const decodedEmail = atob(encodedEmail); 
const decodedPassword = atob(encodedPassword); 

const authHeader = 'Basic ' + Buffer.from(`${decodedEmail}:${decodedPassword}`).toString('base64');
 axiosInstance = axios.create({
    baseURL: process.env.fakeStore, 
    headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json' 
    }
})
    }

    async getAllRecords() { 
        const endPoint = process.env.getAllBooks;
        response = await axiosInstance.get(endPoint);
        responseStatus = response.status; 
        responseData = response.data; 
    helper.logToFile(`Fetched records :${JSON.stringify(responseData,null,2)}`)
    expect(responseStatus).toEqual(ErrorCodes.SUCCESS_OK); 
    helper.logToFile(`Respose status :${responseStatus}`)
    }
    
   

    async getBook(isbn) {
        const endPoint = `${process.env.getABook}${isbn}`;
        try{
            
            response = await axiosInstance.get(endPoint);
            responseStatus = response.status; 
            responseData = response.data; 
            helper.logToFile(`Fetched the required record  :${JSON.stringify(responseData,null,2)}`)
            expect(responseStatus).toEqual(ErrorCodes.SUCCESS_OK); 
            helper.logToFile(`Respose status :${responseStatus}`)
        }
        catch (error) {
            helper.logToFile(`Error fetching the book  ${error.response.data.message}`)
          
             }
        

    }
    async addABookInUserCollection(userId, isbn) {
        const endPoint = process.env.getAllBooks;
        console.log(endPoint);
        const payload = {
            userId: userId,
            collectionOfIsbns: [
                { isbn: isbn }
            ]
        };
        try {
            helper.validateSchema(requestSchema,data.requestBody.addBook);
            response = await axiosInstance.post(endPoint, payload);
            helper.validateSchema(responseSchema,response.data);
            helper.logToFile(`Response status code : ${response.status}`)
            expect(responseStatus).toEqual(StatusCodes.SUCCESS_CREATED); 
            helper.logToFile('Record added succesfully');         
        } catch (error) {
            helper.logToFile(`Error while adding the book to the collection : ${error.response}`)

            // helper.logToFile(`Error while adding the book to the collection : ${error.response.data.message}`)
        }
    }
    async deleteBook(isbn, userId) { 
        const endPoint = process.env.bookDelete;
        const payload = {
            isbn: isbn,
            userId: userId
        };
        try {
             response = await axiosInstance.delete(endPoint, {
                data: payload  })   
                helper.validateSchema(payload,data.deleteRequestBody); 
            responseStatus = response.status; 
            expect(responseStatus).toEqual(ErrorCodes.DELETED); 
            helper.logToFile('Response status code :', response.status)
            helper.logToFile('Record deleted successfully');           
        } catch (error) {
       helper.logToFile(`Error deleting a book : ${error.response.data.message}`)
       throw error
        }
    }
    async updateCollection(userId,isbn) {
        const payload = {
            userId: userId,
             isbn: data.updatedIsbn
           
        };
        const endPoint = `${process.env.updateUserBookCollection}${isbn}`;
        try {
            helper.validateSchema(payload,data.updateRequestBody);  
            response = await axiosInstance.put(endPoint, payload);
            helper.validateSchema(response.data,data.ModifyAndFetchBookResponseBody);  
            helper.logToFile(`Response: ${JSON.stringify(response.data,null,2)}`)
            helper.logToFile(`Response status code :'${response.status}`)
            helper.logToFile('Record updated successfully');    

        } catch (error) {
            helper.logToFile(`Error while updating a book to the collection : ${error.response.data.message}`)
          

        }
    }
    async getBooksOfUser(userId) {
        const base = process.env.fakeStore;
        const endPoint = `${process.env.getBooksOfUser}${userId}`;
        try{
            response = await axiosInstance.get(base + endPoint);
            helper.logToFile(`Records available: ${JSON.stringify(response.data,null,2)}`)
            helper.logToFile('Response status code :', response.status)
            helper.logToFile('Records fetched successfully');    
        }
        catch (error) {
            helper.logToFile(`Error while fetching records from user's collection : ${error.response.data.message}`)

        }
    }
};