const fs=require('fs')

const stream=fs.createReadStream('./daa.txt')

// Read and display the file data on console
stream.on('data', function (chunk) {
    console.log(chunk.toString());
});

stream.on('end', () => {
  console.log('Finished reading the file.');
});

stream.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error('No such file exists');
  } else {
    console.error('An error occurred:', err);
  }
});