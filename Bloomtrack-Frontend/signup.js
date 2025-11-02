var forms = document.querySelector('#form');
var username = document.querySelector('#username');
var email = document.querySelector('#email');
var password = document.querySelector('#password');
var cpassword = document.querySelector('#cpassword');

forms.addEventListener('submit', async (e) => 
    {
    e.preventDefault(); 
    console.log("haii I am here....");
    if (!validateInputs()) 
        {
        return;
    }

    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();  

    try {
       const res = await fetch("https://bloomtrack-herbal-plant-e-commerce.onrender.com/user/auth",
        // const res = await fetch("http://localhost:3600/user/auth",
             {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: emailVal, password: passwordVal })
        });
        if (res.ok) {
            console.log("User authenticated successfully.");
            document.querySelector(".alert-success").style.display="block";
            await new Promise((resolve) => setTimeout(resolve, 2000));
            window.location.href = "login.html";
             successmsg();
        } else {
            const errorData = await res.json();
            console.error("Server error response:", errorData);
            document.querySelector(".alert-text").textContent="Error: " + errorData.message;
            document.querySelector(".alert-error-msg").style.display = "block";
            seterrormsg();
        }
    } catch (error) {
        console.error("API call failed:", error);
        document.querySelector(".alert-error").style.display="block";
        await new Promise((resolve) => setTimeout(resolve, 2000));
         errormsg();
    }
});
function successmsg() {
    const successAlert = document.querySelector(".alert-success");
    if (successAlert) {
        successAlert.style.display = "flex";
        setTimeout(() => {
            successAlert.style.display = "none"; 
        }, 2000);
    }
}
function errormsg() {
    const errorAlert = document.querySelector(".alert-error");
    if (errorAlert) {
        errorAlert.style.display = "flex"; 
        setTimeout(() => {
            errorAlert.style.display = "none";
        }, 2000);
    }
}
function seterrormsg() {
    const errorMsgAlert = document.querySelector(".alert-error-msg");
    if (errorMsgAlert) {
        errorMsgAlert.style.display = "flex"; 
        setTimeout(() => {
            errorMsgAlert.style.display = "none";
        }, 2000);
    }
}

/***** */
// Function to show success message and then hide it
// function successmsg() {
    
//     // if (successMessage) {
//     //     successMessage.style.display = "flex"; // Ensure flex display
//         setTimeout(() => {
//             document.querySelector(".alert-success").style.display="none";
//         }, 1500); // Hide after 1.5s
//     // }
// }
// function errormsg(){
//     setTimeout(() => {
//         document.querySelector(".alert-error").style.display="none";
//     }, 1500); // Hide after 1.5s
// }
//  function seterrormsg(){
//     setTimeout(() => {
//         document.querySelector(".alert-error-msg").style.display="none";
//     }, 1500); // Hide after 1.5s
//  }   
/**** */
function validateInputs(){
    const usernameVal=username.value.trim();
    const emailVal=email.value.trim();
    const passwordVal=password.value.trim();
    const cpasswordVal=cpassword.value.trim();
    let success=true;
    if(usernameVal === ''){
        success=false;
        setError(username,'username is required')
    }
else{
    setSuccess(username)
}
if(emailVal===''){
    success=false;
    setError(email,'email is required')
}
else if(!validateEmail(emailVal)){
    success=false;
    setError(email,'please enter crt mail id')
}
else{
    setSuccess(email)
}
if(passwordVal===''){
    success=false;

    setError(password,'password is required')
}
else if(passwordVal.length<8){
    success=false;
    setError(password,'password atleast 8 char must')
}
else{
    setSuccess(password)
}
if(cpasswordVal===''){
    success=false;
    setError(cpassword,'confirm password is required')
}
else if(cpasswordVal!== passwordVal)
{
    success=false;
    setError(cpassword,'incorrect password')
}
else{
    setSuccess(cpassword)
}
return success;
}

//error msg is set
 function setError(element, message) {
    var inputGroup = element.parentElement;
    var errorElement = inputGroup.querySelector('.error');
    errorElement.innerText = message;
    inputGroup.classList.add('error'); 
    inputGroup.classList.remove('success'); 
}
//success is add
function setSuccess(element) {
    var inputGroup = element.parentElement;
    var errorElement = inputGroup.querySelector('.error');
    errorElement.innerText = '';
    inputGroup.classList.remove('error'); 
    inputGroup.classList.add('success'); 
}
//email verfication
const validateEmail = (email) =>{
    return String(email)
    .toLowerCase()
    .match(
        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    );
 };
 //  show side navbar
var sideNavbar=document.querySelector('.side-navbar');
function showNavbar(){
    sideNavbar.style.left='0%';
}
//close side navbar
function closeNavbar(){
    sideNavbar.style.left='-60%';
}
//show password method
function togglePassword() {
    var passwordField = document.getElementById("password");
    var showPassword123=document.getElementById("showPassword");
    var passwordVal = passwordField.value.trim();
    
    if (passwordVal=== "") {
        
        setError(passwordField, "Password is required to show");
    } else {
        setSuccess(passwordField);
         // Remove any error message
        if (passwordField.type === "password") {
            passwordField.type = "text";
            showPassword123.classList.remove('fa-eye');
           showPassword123.classList.add('fa-eye-slash');
        } else {
            passwordField.type = "password";
            showPassword123.classList.add('fa-eye');
            showPassword123.classList.remove('fa-eye-slash');
        }
    }
}
//show confirm-method
function togglePassword1() {
    var passwordField = document.getElementById("cpassword"); 
    var showPasswordIcon = document.getElementById("showPassword1");
    var errorMessage = document.getElementById("error-message");

    var passwordVal = passwordField.value.trim();
    if (passwordVal === "") {
        errorMessage.textContent = "Password is required to show";
    } else {
        errorMessage.textContent = ""; // Clear any error message
        setSuccess(passwordField);
        if (passwordField.type === "password") {
            passwordField.type = "text";
            showPasswordIcon.classList.remove('fa-eye');
            showPasswordIcon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = "password";
            showPasswordIcon.classList.add('fa-eye');
            showPasswordIcon.classList.remove('fa-eye-slash');
        }
    }
}

