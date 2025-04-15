// // utils/googleSheets.ts
// import { google } from "googleapis";
// // import path from "path";
// // import { googleAuth } from 'googleapis-common';

// const encodedCredentials = process.env.NEXT_GOOGLE_SHEET_CREDENTIALS;
// if (!encodedCredentials) {
//   throw new Error('Google Sheets credentials are missing.');
// }

// const spreadsheetId = "191S57rJvB8TlQAL4m7kvs01hO3hHRUih57Da4ufrUAw";

// const credentialsBuffer = Buffer.from(encodedCredentials, 'base64');
// const credentials = JSON.parse(credentialsBuffer.toString('utf-8'));

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });
// const sheets = google.sheets({ version: "v4", auth });

// export const appendToSheet = async (data: any) => {
//   try {
//     const range = "WebSite response !A1"; 
//     const values = [
//       [
//         new Date().toISOString(), // Timestamp (current date and time)
//         data.name, // NAME
//         data.contactNo, // CONTACT NO.
//         data.email, // EMAIL
//         // data.gender, // GENDER
//         data.examShift, // SELECT EXAM SHIFT/TIME
//         data.examDate, // EXAM DATE
//         data.pickupPoint, // PICKUP POINT
//         data.examCenter, // Exam Center
//         data.paymentId, // PAYMENT SCREENSHOT (URL or base64 image)
//       ],
//     ];

//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId,
//       range,
//       valueInputOption: "RAW",
//       requestBody: {
//         values,
//       },
//     });

//     console.log("Data written to Google Sheets:", response.data);
//   } catch (error) {
//     console.error("Error writing to Google Sheets:", error);
//   }
// };
