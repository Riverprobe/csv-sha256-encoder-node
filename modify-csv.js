const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const crypto = require("crypto");

// Input and output CSV file paths
const inputFilePath = "input.csv";
const outputFilePath = "output.csv";

function sha256(text) {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex");
}

// Function to process and modify data
function processData(data) {
  const value = Object.values(data)[0];

  // Modify the data as needed; for example, add "Modified" to each cell
  return {
    Column1: sha256(value),
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
