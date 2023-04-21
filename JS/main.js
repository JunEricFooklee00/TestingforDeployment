const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
const mongodb = require("./mongodb")
const templatePath = path.join(__dirname, "../HTML")
const multer = require("multer")
const cloudinary = require("./cloudinary")
const dataCheck = require("./dataCheck")
const url = require("url")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require('bcrypt')
const { spawn } = require('child_process')

app.use(express.static("HTML"))
app.use(express.static("."))
app.use(express.json())
app.use(cookieParser())
app.set("view engine", "hbs", "ejs")
app.set("views", templatePath)
app.use(express.urlencoded({extended:false}))

app.get("/", (req,res) => {
    res.render("LOCALS/PortalPage")
})

app.get("/allform", (req,res) => {
    res.render("LOCALS/ForeReco")
})

app.get("/testing", (req,res) => {
    res.render("LOCALS/testing")
});

app.get("/example", (req,res) => {
    res.render("LOCALS/example")
});

app.get("/gg", (req,res) => {
    res.render("LOCALS/gg")
});

app.get("/jobs", (req,res) => {

    const User = mongodb.getJobOrders

    User.find()
    .then((users) => res.send(users))
    .catch((err) => console.log(err));
});

app.get("/MachineLearningForm", authenticateToken, (req,res) => {
    mongodb.getJobOrder.find((err, docs) => {
        if(!err){
            res.render("LOCALS/ClientInterfaces/JobOrder", {list: docs, user:req.user})
        }
    })
})

app.get("/JobOrder", authenticateToken, (req,res) => {
    res.render("LOCALS/JobOrder")
})

app.get("/Notification", (req,res) => {
    res.render("Notification")
})

app.post("/JobOrderLink", authenticateToken, (req,res) => {
    const user = {
        name:req.body.name,
        id:req.body.id
    }
    res.render("LOCALS/JobOrder", {user})
})

app.get("/Schedule", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterfaces/Adminschedule")
    else if(req.user.user === "Employee") res.render("Locals/EmployeeInterfaces/EmployeeSchedule")
    else if(req.user.user === "Client") res.render("LOCALS/ClientInterfaces/ClientSchedule")
    else res.sendStatus(401)
})

app.post("/logout", (req,res) => {
    if(req.cookies.jwt_s1 && req.cookies.jwt_s2){
        res.clearCookie("jwt_s1")
        res.clearCookie("jwt_s2")
        res.send({ success: true });
    }
})

const getCurrentJobIncrement = async () => {
    const jobOrder = await mongodb.getJobOrder.findOne().sort({ _id: -1 }).limit(1);
    if(jobOrder) {
        return jobOrder.JobIncrement;
    } else {
        return 0;
    }
}

app.get("/api/getname", (req, res) => {
    db.collection("users").findOne({}, (err, result) => {
      if (err) throw err;
      res.json({ name: result.name });
    });
  });

app.post("/JobOrder", authenticateToken, (req,res) => {
    try{
        const data = {
            idUser:req.user.id,
            name:req.body.name,
            Area:req.body.Area,
            Unit:req.body.Unit,
            TypeOfWork:req.body.TypeOfWork,
            Location:req.body.Location,
            StartingDate:req.body.StartingDate,
            ExpectedFinishDate:req.body.ExpectedFinishDate,
        }

        console.log(data)

        mongodb.getJobOrder.insertMany([data], (err) => {
            if(!err){
                res.json({ success:true })
            }
            else{
                res.send(err);
            }
        })
    } catch(error){
        res.send(error)
    }
})

app.post("/DeleteJob", async (req, res) => {
    const id = req.body.id
  
    try{
      const result = await mongodb.getJobOrders.findByIdAndDelete(id)
      if (!result) {
        return res.sendStatus(404)
      }
      res.json({ success: true })
    } catch (err){
      console.error(err)
      res.status(500).json({ success: false, error: "Server Error" })
    }
  });

app.get("/portalpage", (req,res) => {
    res.render("LOCALS/portalpage")
})

app.get("/loginpage", (req,res) => {
    res.render("LOCALS/loginpage")
})

app.get("/signuppage", (req,res) => {
    res.render("LOCALS/signuppage")
})

app.get("/homepage", authenticateToken, (req, res) => {
    res.render("LOCALS/homepage")
})

app.get("/RecommendedWorker", authenticateToken, (req,res) => {
    res.render("LOCALS/RecommendedWorker")
})

app.get("/jobsPending", authenticateToken, (req,res) => {
    mongodb.getJobOrder.find((err, docs) => {
        if(!err){
            res.render("LOCALS/Joblist", {list: docs})
        }
    })
})

app.get("/OrderedList", authenticateToken, (req,res) => {
    console.log(req.body.name)
})

app.get("/EmployeeDB", authenticateToken, (req,res) => {hbs.registerHelper('cloudinaryUrl', (publicId, options) => {
    const format = options.hash.format || 'jpg';
    const url = cloudinary.url(publicId, { format: format });
    return url;
  });
    mongodb.getEmployee.find((err, docs) => {
        if(!err){
            res.render("LOCALS/AdminInterfaces/EmployeeDatabase", {list: docs})
            
        }
    })
})

app.get("/ClientDB", authenticateToken, (req,res) => {
    mongodb.getClient.find((err, docs) => {
        if(!err){
            res.render("LOCALS/AdminInterfaces/ClientDatabase", {list: docs})
        }
    })
})

app.get("/AdminInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterfaces/AdminInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/AdminInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterfaces/AdminInterface", {user:req.user})
    else res.sendStatus(401)
})

app.get("/EmployeeInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Employee") res.render("LOCALS/EmployeeInterfaces/EmployeeInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/EmployeeInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Employee") res.render("LOCALS/EmployeeInterfaces/EmployeeInterface", {user:req.user})
    else res.sendStatus(401)
})

app.get("/ClientInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Client") res.render("LOCALS/ClientInterfaces/ClientInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/ClientInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Client") res.render("LOCALS/ClientInterfaces/ClientInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/interface", authenticateToken, (req, res) => {
    if(req.user.user === "Admin"){
        res.json({ success:true, user:req.user.user })
    } else if(req.user.user === "Employee"){
        res.json({ success:true, user:req.user.user })
    } else if(req.user.user === "Client"){
        res.json({ success:true, user:req.user.user })
    } else res.sendStatus(401)
})

app.get(":path", (req, res) => {
    url(req.params.path)
})

app.get("/interface/:user/:id",async (req, res) => {
    const check = await dataCheck.getData.getData(req.params.user, req.params.id)
    console.log(check)
    res.render("USERS/"+ req.params.user, {check})
})

app.get("/delete/:id/:user", (req, res) => {
    mongodb.checkUsers.checkUsers(req.params.user).findByIdAndRemove(req.params.id, (err) => {
        if(!err){
            res.redirect("/" + req.params.user + "DB")
        }
        else{ 
            console.log("Failed to Delete Details: " + err)
        }
    })
})

app.get("/accept/:id/:user", async (req, res) => {
    const id = (req.params.id)
    const user = (req.params.user + "s")
    const data1 = await mongodb.checkUsers.checkUsers(req.params.user).findById(id)
    mongodb.checkUsers.checkUsers(user).insertMany([data1],async (err) => {
        if(!err){
            await mongodb.checkUsers.checkUsers(req.params.user).findByIdAndRemove(id)
            res.redirect("/" + req.params.user + "DB")
        }
        else{
            res.send("May Mali")
        }
    })
})

// app.get("/accept/:id/:user",async (req, res) => {
//     const id = (req.params.id)
//     const data1 = await mongodb.getJobOrder.checkJob(id).findById(id)
//     mongodb.checkJobs.checkJob(id).insertMany([data1],async (err) => {
//         if(!err){
//             await mongodb.checkJobs.checkJob(id).findByIdAndRemove(id)
//             res.redirect("/" + req.params.user + "Database")
//         }
//         else{
//             res.send("May Mali")
//         }
//     })
// })

app.post("/save-review", authenticateToken, async (req,res) => {
    const review = req.body.review
})

app.post("/check-email", authenticateToken, async (req, res) => {
        const email = req.body.email
        const eEmployee = await mongodb.getEmployee.findOne({ email })
        const eEmployees = await mongodb.getEmployees.findOne({ email })
        const eClient = await mongodb.getClient.findOne({ email })
        const eClients = await mongodb.getClients.findOne({ email })

        if(eEmployee !== null || eClient !== null || eEmployees !== null || eClients !== null){
            const exists = !!true
            res.json({ exists })
        } else{
            const exists = !!false
            res.json({ exists })
        }
})

app.post("/check-username", authenticateToken, async (req, res) => {
    const username = req.body.username
    const uEmployee = await mongodb.getEmployee.findOne({ username })
    const uEmployees = await mongodb.getEmployees.findOne({ username })
    const uClient = await mongodb.getClient.findOne({ username })
    const uClients = await mongodb.getClients.findOne({ username })

    if(uEmployee !== null || uClient !== null || uEmployees !== null || uClients !== null){
        const exists = !!true
        res.json({ exists })
    } else{
        const exists = !!false
        res.json({ exists })
    }
})

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "resume")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

async function uploadImage(images){
    try{
        
        const avatar = await cloudinary.key.uploader.upload(images.avatar, {
            folder: "Avatar"
        }, (err) => {
            console.log(err)
        })
        const resume = await cloudinary.key.uploader.upload(images.resume, {
            folder: "Resume"
        }, (err) => {
            console.log(err)
        })
        
        const data2 = {
            avatar:avatar.secure_url,
            resume:resume.secure_url,
        }
        return data2
    } catch{
        res.sendStatus(500)
    }
}

app.post("/signuppage", upload.fields([
    { name: "images", maxCounts: 1},
    { name: "image", maxCounts: 1}]),
    async (req, res) => {
        try{
            const data1 = await inputData(req.body)
            const images = {
                avatar:req.files["images"][0].path,
                resume:req.files["image"][0].path,
            }
            const data2 = await uploadImage(images)
            const data = Object.assign({}, data1, data2)
            
            mongodb.checkUsers.checkUsers(req.body.user).insertMany([data], (err) => {
                if(!err){
                    res.render("LOCALS/loginpage")
                } else if(err){
                    res.sendStatus(err)
                }
            })
        } catch{
            res.sendStatus(404)
        }
})

async function inputData(body){
    const securedPassword = 10
    const hashedPassword = await bcrypt.hash(body.password, securedPassword)
    console.log(body.user)
    if(body.user === "Client"){
        const data1 = {
            user:body.user,
            email:body.email,
            username:body.username,
            name:body.name,
            contactNumber:body.contactNumber,
            password:hashedPassword,
            address:(body.address1 + ", " + body.address2 + ", " + body.address3 + ", " + body.address4),
            birthday:body.birthday,
            zipcode:body.zipcode,
            gender:body.gender,
        } 
        return data1
    } else{
        const data1 = {
            user:body.user,
            jobType:body.job,
            email:body.email,
            username:body.username,
            name:body.name,
            contactNumber:body.contactNumber,
            password:hashedPassword,
            address:(body.address1 + ", " + body.address2 + ", " + body.address3 + ", " + body.address4),
            birthday:body.birthday,
            zipcode:body.zipcode,
            gender:body.gender,
        } 
        return data1
    }
}


app.post("/check-data", authenticateToken, async (req, res) => {
    const input = {
        name:req.body.name,
        password:req.body.password
    }

    const adm = await dataCheck.adminData.adminData(req.body.name)
    const emp = await dataCheck.employeeData.employeeData(req.body.name)
    const cli = await dataCheck.clientData.clientData(req.body.name)
    const user = adm || emp || cli || undefined

    if(input.name === "" && input.password === ""){
        const error = "Please enter your Username/Email and Password."
        const validity = !!true
        
        res.json({error:error, validity:validity})
    } else if(input.name !== null && input.password === ""){
        const error = "Please enter your Password."
        
    } else if(input.name === "" && input.password !== null){
        const error = "Please enter your Username/Password."
  
    } else if(user === undefined && (req.body.name !== null && req.body.password !== null)){
        const error = "Invalid Account."
        
    } else if((user.username === req.body.name || user.email === req.body.name) && user.password === req.body.password){ 
        const validity = !!false
        console.log(validity)
        res.json({validity})
    } else{
        const error = ("Wrong Email/Username or Password!")
        
    }
})

app.post("/loginpage",async (req, res) => {
    const input = {
        name:req.body.name,
        password:req.body.password
    }

    const secret_key = "c1b9e493ae98131ea822664641c0a08ec53639a0e9ea536de61fad222d7ab6d3684c0b15e61425247d9f42773b32867e967d4d78f96955b0c2805c538d10da10"

    const adm = await dataCheck.adminData.adminData(req.body.name)
    const emp = await dataCheck.employeeData.employeeData(req.body.name)
    const cli = await dataCheck.clientData.clientData(req.body.name)
    const user = adm || emp || cli || undefined
    
    if(input.name === "" && input.password === ""){
        const error = "Please enter your Username/Email and Password."
        res.json({error, success:false})
    } else if(input.name !== null && input.password === ""){
        const error = "Please enter your Password."
        res.json({error, success:false})
    } else if(input.name === "" && input.password !== null){
        const error = "Please enter your Username/Password."
        res.json({error, success:false})
    } else if(user === undefined && (req.body.name !== null && req.body.password !== null)){
        const error = "Invalid Account."
        res.json({error, success:false})
    } else if((user.username === req.body.name || user.email === req.body.name) && (await bcrypt.compare(input.password, user.password) ||  user.password === req.body.password )){ 
        const tokenAccess = jwt.sign({ userId: user.id }, secret_key, { expiresIn: "1h"})
        const tokenRefresh = jwt.sign({ userId: user.id }, secret_key, { expiresIn: "1d"})
        res.cookie("jwt_s1", tokenAccess, { httpOnly: true, secure: true })
        res.cookie("jwt_s2", tokenRefresh, { httpOnly: true, secure: true })
        res.json({success:true})
    } else{
        const error = ("Wrong Email/Username or Password!")
        res.json({error, success:false})
    }
})

async function authenticateToken(req, res, next) {
    const accessToken = req.cookies.jwt_s1;
    const refreshToken = req.cookies.jwt_s2;
    const secretKey = "c1b9e493ae98131ea822664641c0a08ec53639a0e9ea536de61fad222d7ab6d3684c0b15e61425247d9f42773b32867e967d4d78f96955b0c2805c538d10da10";
  
    try {
      const decoded = jwt.verify(accessToken, secretKey)
      const userId = decoded.userId
      const user = await getUser(userId)
  
      req.user = user
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        try {
          const decoded = jwt.verify(refreshToken, secretKey)
          const userId = decoded.userId
          const user = await getUser(userId)
  
          const newAccessToken = jwt.sign({ userId }, secretKey, { expiresIn: '15m' })
  
          res.cookie('jwt', newAccessToken, { httpOnly: true })
  
          req.user = user;
          next()
        } catch (err) {
          res.status(401).send({ success: false, message: "Invalid Token" })
        }
      } else {
        res.status(401).send({ success: false, message: "Invalid Token" })
      }
    }
}
  
async function getUser(userId) {
    const adm = await mongodb.getAdmin.findOne({ _id: userId });
    const emp = await mongodb.getEmployees.findOne({ _id: userId });
    const cli = await mongodb.getClients.findOne({ _id: userId });
    return adm || emp || cli || undefined;
}







app.post('/recommendation', (req, res) => {
    const recommendValue = req.body.recommend;
    const numWorkerValue = req.body.numWorkers;
  
    console.log('Data received from client: ', { recommend: recommendValue, numWorkers: numWorkerValue });
  
    const python_process = spawn('python', ['HTML/models/RecommendEngineV2.py', recommendValue, numWorkerValue]); 
    let matched_profiles = '';

    python_process.stdout.on('data', (data) => {
      matched_profiles = data.toString().trim();
      console.log(matched_profiles);
    });
  
    python_process.stderr.on('data', (data) => {
      console.error(`Error from command: ${data}`);
    });
  
    python_process.on('close', () => {
      if (matched_profiles) {
        console.log('Matched profiles: ', matched_profiles);
        res.write(matched_profiles + '\n');
      } else {
        console.log('No matches found');
      }
  
      res.end();
    });
});

const port = 3000;
app.listen(port, () => {
    console.log("Port is Connected: " + port)
})
