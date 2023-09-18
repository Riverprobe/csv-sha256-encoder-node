const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const crypto = require("crypto");

// Input and output CSV file paths
const inputFilePath = "input.csv";
const outputFilePath = "output.csv";

function sha256(text) {
  const msgBuffer = new TextEncoder().encode(text);

  // hash the message
  const hashBuffer = crypto.createHash("sha256").update(msgBuffer).digest();

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

// Function to process and modify data
function processData(data) {
  // Modify the data as needed; for example, add "Modified" to each cell
  return {
    Email: data["Email Address"],
    Encoded: sha256(data["Email Address"]),
    // Add more columns as needed
  };
}

// Read the CSV file
const inputRows = [];
fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", row => {
    const modifiedRow = processData(row);
    inputRows.push(modifiedRow);
  })
  .on("end", () => {
    // Write the modified data to a new CSV file
    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: Object.keys(inputRows[0]).map(column => ({
        id: column,
        title: column,
      })),
    });

    csvWriter
      .writeRecords(inputRows)
      .then(() => {
        console.log("CSV file has been modified and saved.");
      })
      .catch(error => {
        console.error("Error writing CSV:", error);
      });
  });
