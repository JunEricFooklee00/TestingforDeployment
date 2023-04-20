const mongodb = require("./mongodb")

async function getData(user, id){   
    if(user === "Employee"){
        const check = await mongodb.getEmployee.findOne({id})
        return check
    }
    else if(user === "Admin"){
        const check = await mongodb.getAdmin.findOne({id})
        return check
    }
    else{
        const check = await mongodb.getClient.findOne({id})
        return check
    }
}

async function adminData(name){
    const adm1 = await mongodb.getAdmin.findOne({username:name})
    const adm2 = await mongodb.getAdmin.findOne({email:name})
    
    if(adm1 !== null && adm2 === null){
        return adm1
    }
    else{
        return adm2
    }
}

async function employeeData(name){
    const emp1 = await mongodb.getEmployees.findOne({username:name})
    const emp2 = await mongodb.getEmployees.findOne({email:name})
    
    if(emp1 !== null && emp2 === null){
        return emp1
    }
    else{
        return emp2
    }
}

async function clientData(name){
    const cli1 = await mongodb.getClients.findOne({username:name})
    const cli2 = await mongodb.getClients.findOne({email:name})
    
    if(cli1 !== null && cli2 === null){
        return cli1
    }
    else{
        return cli2
    }
}

module.exports.getData = { getData }
module.exports.adminData = { adminData }
module.exports.employeeData = { employeeData }
module.exports.clientData = { clientData }