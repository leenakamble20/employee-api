const {Router} = require('express')
const { EmployeeService} = require('../helpers/employee-helpers')

var router = Router();
const empSrv=new EmployeeService();

router.get("/",async (req,res)=>{
   // res.status(200).json(await empSrv.getAllEmployees());
let emp =await empSrv.getAllEmployees().catch(err=> res.status(500).json('message : Error'));
res.status(200).json(emp);
})

router.get("/test",async (req,res)=>{
    // res.status(200).json(await empSrv.getAllEmployees());
 res.status(200).json('Demo of Code Build');
 })

 
router.post("/",async (req,res)=>{
    // res.status(200).json(await empSrv.getAllEmployees());
 let result =await empSrv.addEmployee(req.body).catch(err=> res.status(500).json('message : Error'));
    if(result){
        res.status(200).json(result);
    }
 })


 router.get("/location/:locId",async (req,res)=>{
     let LocationId = req.params['locId'];
    // console.log(LocationId);
     let emp =await empSrv.getEmplyeesByLocation(LocationId).catch(err=> res.status(500).json('message : Error'));
   if(emp){
       res.status(200).json(emp);
   }
 })
 router.get("/location/:locId/employee/:empCode",async (req,res)=>{
    let LocationId = req.params['locId'];
    let EmpCode = req.params['empCode'];
    //console.log(LocationId);
    console.log(EmpCode);
    let emp =await empSrv.getEmployee(LocationId,EmpCode).catch(err=> res.status(500).json('message : Error'));
  if(emp){
      console.log(emp);
      res.status(200).json(emp);
  }
})

//delete the employees

router.delete("/location/:locId/employee/:empCode",async (req,res)=>{
    let LocationId = req.params['locId'];
    let EmpCode = req.params['empCode'];
})

//update
router.put("/update/location/:locId/employee/:empCode",async (req,res)=>{
    let locationId = req.params['locId'];
    let empCode = req.params['empCode'];
    let employee = req.body;
    let emp =await empSrv.updateEmployee(locationId,empCode,employee).catch(err=> {
        console.log(err);
        res.status(500).json('message : Error')});
    if(emp){
       // console.log(emp.Items);
        res.status(200).json(emp.Items);
    }
})
module.exports=router;