const fs = require("fs");

// Create a writable stream (overwrite mode by default)
const writableStream = fs.createWriteStream("./output.txt");

// Write data to the file
writableStream.write("Hello, Node.js!", (err) => {
  if (err) {
    console.error(" Error writing to file:", err.message);
  } else {
    console.log(" Data written successfully to output.txt");
  }
});


// Close the stream
writableStream.end();
