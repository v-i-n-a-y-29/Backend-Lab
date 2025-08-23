// 1: Exporting nested objects and function from Module using exports Object.
const student = {
    name:"vinay",
    age:21,
    address:{
        city:"dehradun",
        state:"uttarakhand"
    },
    // error  - how to pass fucniton as a field in an object
    intro :function(){
        console.log("Hello i am vinay")
    }
}
// approach 1 - using common js
module.exports=student
// apporach 2 - using module system
// export default student 
