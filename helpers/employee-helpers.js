const { ddbClient } = require('./ddbclient');
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { UpdateCommand } = require('@aws-sdk/client-dynamodb');
 
const { marshall , unmarshall } = require('@aws-sdk/util-dynamodb');

class EmployeeService {

    constructor() {

        this.TABLENAME = 'Employees';
    }

    async getAllEmployees() {
        console.log("in employees");
        let params = {
            TableName: this.TABLENAME,
            Select: 'ALL_ATTRIBUTES',//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            // FilterExpression: 'Department = :dept',
            // ExpressionAttributeValues: {
            // ':dept' : {S: 'IT'}
            // },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            // "#Ename":"Name",
            // "#Loc":"Location"
            // }
        }

       // return ddbClient.send(new ScanCommand(params));
       let result = await ddbClient.send(new ScanCommand(params)).catch(err => {
           Promise.reject(err)
       });
       let employees= [];
       result.Items.forEach(item => employees.push(unmarshall(item)));
       return Promise.resolve(employees);
    }

    addEmployee(employee){
        let params = {
            TableName : 'Employees',
            Item : marshall(employee)
            // Item : {
            //     LocationId : {S : employee.LocationId},
            //     EmpCode : {S : employee.EmpCode},
            //     Name : {S: employee.Name },
            //     Age : {N : employee.Age},
            //     Location : {S : employee.Location},
            //     Designation :{ S: employee.Designation},
            //     Department : {S : employee.Department}
            // }
        };
        console.log(params);

        return ddbClient.send(new PutItemCommand(params));

    }

    async getEmplyeesByLocation(LocationId){
        let params = {
            TableName: this.TABLENAME,
           // Select: 'ALL_ATTRIBUTES',//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
           KeyConditionExpression: 'LocationId = :locId',
             ExpressionAttributeValues: {
             ':locId' : {S: LocationId}
             },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            // "#Ename":"Name",
            // "#Loc":"Location"
            // }
        }
       // return ddbClient.send(new QueryCommand(params));
       let result = await ddbClient.send(new QueryCommand(params))
            .catch(err => Promise.reject(err));
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    async getEmployee(LocationId,EmpCode){
    //     let params = {
    //       TableName: this.TABLENAME,
    //        Key : { "LocationId" :  { "S" : LocationId},
    //        "EmpCode" : { "S" :  EmpCode}
    //     }
    // };

    var params = {
        TableName: this.TABLENAME,
        Key : {
        "LocationId": { "S": LocationId },
        "EmpCode": { "S": EmpCode }
        }
        };
        console.log(params);
       //return ddbClient.send(new GetItemCommand(params));

       let result = await ddbClient.send(new GetItemCommand(params))
       .catch(err => Promise.reject(err));
       
       return Promise.resolve(result.Item ? unmarshall(result.Item) : undefined)

    }

    deleteEmployee(locationId, empCode){
        //implement here
    }

    updateEmployee(locationId, empCode, employee){
        //implement here

        var params = {
            TableName:this.TABLENAME,
            Key:{
                "LocationId": { "S": locationId },
                "EmpCode": { "S": empCode }
            },
            UpdateExpression: "set Name = :name",
            ExpressionAttributeValues:{
                ":name": employee.Name
            },
            ReturnValues:"UPDATED_NEW"
        };
        
        console.log("Updating the item...");
        return ddbClient.send(new UpdateCommand(params));
        // , function(err, data) {
        //     if (err) {
        //         console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        //     } else {
        //         console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        //     }
        // });
     }

}

module.exports = { EmployeeService };