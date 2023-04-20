function dashboardSubmit(){
    document.getElementById("fDashBoard").submit()
}

function scheduleSubmit(){
    document.getElementById("fSchedule").submit()
}

function projectSubmit(){
    document.getElementById("fProject").submit()
}

function employeeSubmit(){
    document.getElementById("fEmployees").submit()
}

function clientSubmit(){
    document.getElementById("fClients").submit()
}

function settingsSubmit(){
    document.getElementById("fSettings").submit()
}

async function logoutSubmit(){
    const response = await fetch("/logout", {
        method: "POST"
    });
    const data = await response.json();
    if(data.success){
        for(let i = 0; i < history.length; i++){
            window.history.pushState({}, null, "portalpage");
        }
        window.location.href = "portalpage";
    } else{
        alert("Logout failed");
    }
}