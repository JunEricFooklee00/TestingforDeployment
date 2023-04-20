let name = document.getElementsByName("name")
let password = document.getElementsByName("password")

const openModalButtons = document.querySelectorAll("[data-modal-target='#login']")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById("overlay")
const error = document.getElementById("error")

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})
            
overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active")
    modals.forEach(modal => {
        closeModal(modal)
    })
})
            
closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal")
        closeModal(modal)
    })
})
            
function openModal(modal){
    if(modal == null) return
    modal.classList.add("active")
    overlay.classList.add("active")
}
            
function closeModal(modal){
    if(modal == null) return
    modal.classList.remove("active")
    overlay.classList.remove("active")
}

function submitForm(event) {
    event.preventDefault()
    const form = event.target
    const name = form.name.value
    const password = form.password.value

    fetch("/loginpage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, password })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            window.history.pushState({}, null, "homepage")
            window.location.href = "homepage"
        } else{
            error.innerText = data.error
            alert("Login Failed")
        }
    })
    .catch(err => {
        console.error(err)
        alert("Login Failed")
    })
}