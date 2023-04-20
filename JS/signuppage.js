var Form1 = document.getElementById("form1")
var Form2 = document.getElementById("form2")
var Form3 = document.getElementById("form3")
var Form4 = document.getElementById("form4")

var Next1 = document.getElementById("Next1")
var Next2 = document.getElementById("Next2")
var Back1 = document.getElementById("Back1")
var Back2 = document.getElementById("Back2")

var progress = document.getElementById("progress")

let user = document.querySelector(".user")
let job = document.querySelector(".job")
let name = document.querySelector(".name")
let email = document.querySelector(".email")
let username = document.querySelector(".username")
let password = document.querySelector(".password")
let confPass = document.querySelector(".confPass")

let birthday = document.querySelector(".birthday")
let gender = document.querySelector(".gender")
let contNum = document.querySelector(".contactNumber")
let address1 = document.querySelector(".address1")
let address2 = document.querySelector(".address2")
let address3 = document.querySelector(".address3")
let address4 = document.querySelector(".address4")
let zipcode = document.querySelector(".zipcode")

let nameError = document.querySelector(".name-error")
let emailError = document.querySelector(".email-error")
let usernameError = document.querySelector(".username-error")
let passwordError = document.querySelector(".password-error")
let confPassError = document.querySelector(".confPass-error")

let genderError = document.querySelector(".form-gender")
let contError = document.querySelector(".contactnumber-error")
let add1Error = document.querySelector(".address1-error")
let add2Error = document.querySelector(".address2-error")
let add3Error = document.querySelector(".address3-error")
let add4Error = document.querySelector(".address4-error")
let zipError = document.querySelector(".zipcode-error")

emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var usernameRegex = new RegExp("^[A-Za-z][A-Za-z0-9_]{7,29}$")
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
nameRegex = /^[a-z ,.'-]+$/i
contRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
bdayRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/

document.getElementById("hide1").addEventListener("click", () => {
    document.getElementById("hide1").style.display = "none"
    document.getElementById("show1").style.display = "flex"
    document.getElementById("password").type = "text"
})

document.getElementById("show1").addEventListener("click", () => {
    document.getElementById("hide1").style.display = "flex"
    document.getElementById("show1").style.display = "none"
    document.getElementById("password").type = "password"
})

document.getElementById("hide2").addEventListener("click", () => {
    document.getElementById("hide2").style.display = "none"
    document.getElementById("show2").style.display = "flex"
    document.getElementById("confPass").type = "text"
})

document.getElementById("show2").addEventListener("click", () => {
    document.getElementById("hide2").style.display = "flex"
    document.getElementById("show2").style.display = "none"
    document.getElementById("confPass").type = "password"
})

function clearError1(){
    nameError.style.display = "none"
    usernameError.style.display = "none"
    passwordError.style.display = "none"
    confPassError.style.display = "none"
}

function clearError2(){
    contError.style.display = "none"
    add1Error.style.display = "none"
    add2Error.style.display = "none"
    add3Error.style.display = "none"
    add4Error.style.display = "none"
    zipError.style.display = "none"
}

function checkUser(){
    if(user.value.match("Choose User Type")){
        user.style = "border-color: red;"
        return false
    } else if(user.value.match("Employee")){
        user.style = "border-color: green;"
        job.style.display = "flex"
        document.querySelector(".container-signup").style = "height: 600px;"
        document.querySelector("#form1").style = "height: 423px;"
        if(job.value.match("Choose Job Type")){
            job.style = "border-color: red;"
            return false
        } else{
            job.style = "border-color: green;"
            return true
        }
    } else if(user.value.match("Client")){
        job.style.display = "none"
        document.querySelector(".container-signup").style = "height: 550px;"
        document.querySelector("#form1").style = "height: 373px;"
        user.style = "border-color: green;"
        return true
    } else document.write(404)

}

function checkName(){
    if(!name.value.match(nameRegex)){
        nameError.style.display = "flex"
        name.style = "border-color: red;"
        return false
    } else {
        nameError.style.display = "none", name.style = "border-color: green;"
        return true
    }
}

function checkEmail(){

    const emailInput = email.value

    fetch("/check-email", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        }, body: JSON.stringify({ email:emailInput }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.exists){
            emailError.style.display = "flex", email.style = "border-color: red;"
            return false
        } else if(!email.value.match(emailRegex)){
            emailError.style.display = "flex", email.style = "border-color: red;"
            return false
        } else{
            emailError.style.display = "none", email.style = "border-color: green;"
            return true
        }
    })
    .catch(error => console.error(error))
}

function checkUsername(){

    const usernameInput = username.value

    fetch("/check-username", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        }, body: JSON.stringify({ username:usernameInput }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.exists){
            usernameError.style.display = "flex", username.style = "border-color: red;"
            return false
        } else if(!username.value.match(usernameRegex)){
            usernameError.style.display = "flex", username.style = "border-color: red;"
            return false
        } else{
            usernameError.style.display = "none", username.style = "border-color: green;"
            return true
        }
    })
    .catch(error => console.error(error))
}

function checkPassword(){
    if(!password.value.match(strongRegex)){
        passwordError.style.display = "flex"
        password.style = "border-color: red;"
        return false
    } else{
        passwordError.style.display = "none", password.style = "border-color: green;"
        return true
    }
}

function checkConfPass(){
    if(confPass.value.match(strongRegex) && confPass.value === password.value){
        confPassError.style.display = "none"
        confPass.style = "border-color: green;" 
        return true
    } else{
        confPassError.style.display = "flex", confPass.style = "border-color: red;"
        return false
    }
}

function checkInputFields1(){
    clearError1()
    let x1 = checkUser()
    let x2 = checkName()
    let x3 = checkEmail()
    let x4 = checkUsername()
    let x5 = checkPassword()
    let x6 = checkConfPass()
    if(x1 != false && x2 != false && x3 != false && x4 != false && x5 != false && x6 != false) return true
    else return false
}

function checkBDay(){
    if(birthday.value == 0){
        birthday.style = "border-color: red; text-align: center; margin-top: 0px;"
        return false
    } else{
        birthday.style = "border-color: green; text-align: center; margin-top: 0px;"
        return true
    }
}

function checkGender(){
    const radioButtons = document.getElementsByName("gender")
    for(let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            genderError.style = "border-color: green;"
            return true
        }
    } genderError.style = "border-color: red;"; return false
    
}

function checkContNum(){
    if(!contNum.value.match(contRegex)){
        contError.style.display = "flex"
        contNum.style = "border-color: red;"
        return false
    } else{
        contError.style.display = "none", contNum.style = "border-color: green;"
        return true
    }
}

function checkAdd1(){
    if(address1.value.length >= 8){
        add1Error.style.display = "none"
        address1.style = "border-color: green;"
        return true
    } else{
        add1Error.style.display = "flex", address1.style = "border-color: red;"
        return false
    }
}

function checkAdd2(){
    if(address2.value.length >= 8){
        add2Error.style = "display: none; left: -176px;", address2.style = "border-color: green; width: 49.4%;"
        return true
    } else{
        add2Error.style = "display: flex; left: -176px;", address2.style = "border-color: red; width: 49.4%;"
        return false
    }
}

function checkAdd3(){
    if(address3.value.length >= 8){
        add3Error.style.display = "none", address3.style = "border-color: green; width: 49.4%;"
        return true
    } else{
        add3Error.style.display = "flex", address3.style = "border-color: red; width: 49.4%;"
        return false
    }
}

function checkAdd4(){
    if(address4.value.length >= 3){
        add4Error.style = "display: none; left: -176px;", address4.style = "border-color: green; width: 49.4%;"
        return true
    } else{
        add4Error.style = "display: flex; left: -176px;", address4.style = "border-color: red; width: 49.4%;"
        return false
    }
}

function checkZip(){
    if(zipcode.value.length == 4){
        zipError.style = "display: none;", zipcode.style = "border-color: green; width: 49.4%;"
        return true
    } else{
        zipError.style = "display: flex;", zipcode.style = "border-color: red; width: 49.4%;"
        return false
    }
}

function checkInputFields2(){
    clearError2()
    
    x1 = checkBDay()
    x2 = checkGender()
    x3 = checkContNum()
    x4 = checkAdd1()
    x5 = checkAdd2()
    x6 = checkAdd3()
    x7 = checkAdd4()
    x8 = checkZip()
    if(x1 != false && x2 != false && x3 != false && x4 != false && x5 != false && x6 != false 
        && x7 != false && x8 != false) return true
    else return false
}

hide1.onclick = function(){
    hide1.style.display = "none"
    show1.style.display = "flex"
}

Next1.onclick = function(event){
    if(checkInputFields1() != false){
        Form1.style.left = "-500px";
        Form2.style.left = "25px";
        progress.style.width = "250px";
    }
    event.preventDefault();
}

Back1.onclick = function(){
    Form1.style.left = "25px";
    Form2.style.left = "500px";
    progress.style.width = "125px";
}

Next2.onclick = function(event){
    if(checkInputFields2() != false){
        Form2.style.left = "-500px";
        Form3.style.left = "25px";
        progress.style.width = "375px";
    }
    event.preventDefault();
}

Back2.onclick = function(){
    Form2.style.left = "25px";
    Form3.style.left = "500px";
    progress.style.width = "250px";
}

// {{!-- Next3.onclick = function(){
//     Form3.style.left = "-500px";
//     Form4.style.left = "25px";
//     progress.style.width = "500px";
// } --}}

Back3.onclick = function(){
    Form3.style.left = "25px";
    Form4.style.left = "500px";
    progress.style.width = "375px";
}