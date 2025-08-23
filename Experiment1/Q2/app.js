// 2: Reading into a file asynchronously and writing code for handling error if file not found to read.

// approach 1 - using fs module - callback based api

// const fs=require('fs')

// error while specifying the path of file  , should be './test.txt
// fs.readFile('./test.txt' , 'utf-8' , (err,data)=>{
//     if(err)
//     {
//         console.log("error while reading the file",err.message)
//         return
//     }
//     else
//         console.log(data)
// })

// approach 2 - using fs/promises - using promise based api
const fs =require('fs/promises')

async function readingFile() {
    try{
        const data=await fs.readFile('test.txt' , 'utf-8');
        console.log(data)
    }
    catch(err)
    {
        console.log("error while reading the file" , err.message)
    }
}
readingFile()