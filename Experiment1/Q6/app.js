const fs=require('fs')

const rstream=fs.createReadStream('./input.txt')
const wstream=fs.createWriteStream('./output.txt')

rstream.pipe(wstream)

wstream.on("finish", () => {
  console.log(" Data successfully piped from input.txt to output.txt");
});

rstream.on("error", (err) => {
  console.error("❌ Error reading file:", err.message);
});

wstream.on("error", (err) => {
  console.error("❌ Error writing file:", err.message);
});