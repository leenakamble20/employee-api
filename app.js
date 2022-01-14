const express = require('express');
var cors = require('cors');
const router = require('./routes/employee-routes');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

var app = express();


//configure the middleware(including rounting middleware)
// app.use(function(req,res,next){
// console.log("Middleware 1 - Request");
// next();
// console.log("Middleware 1 - Response");
// });

// app.use(function(req,res,next){
//     console.log("Middleware 2 - Request");
//     next();
//     console.log("Middleware 2 - Response");
//     });

//     app.use(function(req,res,next){
//         console.log("Middleware 3 - Request");
//         next();
//         console.log("Middleware 3 - Response");
//         });
        
// app.get("/about",(req,res)=>{
//     res.send(`<html>
//     <head><title>Sample App</title>
//     <body>
//     <h2>Employee API</h2>
//     </body>
//     </head>
//     </html>`)
// });

// app.get("/contact",(req,res)=>{
//     res.send(`<html>
//     <head><title>Sample App</title>
//     <body>
//     <h2>Contact API</h2>
//     </body>
//     </head>
//     </html>`)
// });

// app.get("/",(req,res)=>{
//     console.log("home page action executed");
//     res.send(`<html>
//     <head><title>Sample App</title>
//     <body>
//     <h2>Welcome to Express</h2>
//     </body>
//     </head>
//     </html>`)
// });

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

let emps =[
    {LocationId:"MUM", EmpCode:"E101",Name:"Ajay"}
]


//swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

//app.use("/employess",router);
app.use("/employees",require('./routes/employee-routes'));


app.use((req, res, next) => {
    return res.status(404).json({
      error: "Not Found",
    });
  });

app.use(function(err,req,res,next){
    if(process.env.NODE_ENV=="Development"){
        console.log(err.stack);
    }
res.status(500).send({'error':'Something broken!'});
})
// app.get("/getEmployees",(req,res)=>{
//     res.status(200).json(emps);
// })

// app.post("/employees",(req,res)=>{
// //console.log(req.body);
// let emp=req.body;
// console.log(emp);
// emps.push(emp);
// res.status(201).json(emp);
// })

module.exports = app;