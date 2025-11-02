// document.addEventListener("DOMContentLoaded", function () {
//     var form = document.querySelector("#form");
//     var password = document.querySelector("#password");
//     var email = document.querySelector("#email");

//     form.addEventListener("submit", function (e) {
//         e.preventDefault(); // Prevent default form submission

//         if (validateInputs()) {
//             console.log("Login successful! Redirecting..."); // Debugging
//             window.location.href = "products.html"; // Redirect
//         } else {
//             console.log("Validation failed!"); // Debugging
//         }
//     });
// });
document.addEventListener("DOMContentLoaded", function ()
     {
    var form = document.querySelector("#form");
    var password = document.querySelector("#password");
    var email = document.querySelector("#email");

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission

        if (validateInputs()) {
            console.log("Logging in...");

            const userData = {
                email: email.value.trim(),
                password: password.value.trim(),
            };
            const token = localStorage.getItem("token");
            console.log("Token from localStorage:", token);

            try {
  const response = await fetch("https://bloomtrack-herbal-plant-e-commerce.onrender.com/user",
                // const response = await fetch("http://localhost:3600/user", 
                    {  // Ensure this URL matches your backend
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                        
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Login successful!", data.auth);
                    
                    if(data.auth.isProfiled){
                        console.log("Storing Token:", data.token);
                        localStorage.setItem("token", data.token); // Store token for authentication
                        document.querySelector(".alert-success").style.display="block";
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        // alert("successfully login");
                        window.location.href = "products.html"; // Redirect to the products page
                    successmsg();
                    }
                    else{
                        if (!data.auth.isProfiled) {
                            console.log("Storing Token:", data.token);
                            localStorage.setItem("token", data.token); // Store token for authentication 
                            document.querySelector(".alert-profile").style.display="block";
                            profilemsg(); // Call function to show and hide alert
                            setTimeout(() => {
                                window.location.href = "profileget.html"; // Redirect after showing alert
                            }, 3000); // Redirect after 3 seconds
                        }
                        

                        // console.log("Storing Token:", data.token);
                        // localStorage.setItem("token", data.token); // Store token for authentication 
                        // document.querySelector(".alert-profile").style.display="block"
                        // window.location.href = "profileget.html"; 
                        // alert("go to create profile");
                    }
                    
                } else {
                    console.log("Login failed:", data.message);
                    document.querySelector(".alert-text").textContent="Login failed: " + data.message;
            // alert("Error: " + errorData.message);
            document.querySelector(".alert-error-msg").style.display = "block"; // Show error box
            seterrormsg();
                    // alert("Login failed: " + data.message);
                }
            } catch (error) {
                console.error("Error:", error);
                document.querySelector(".alert-error").style.display="block";
                // alert("submitted successfull");
                await new Promise((resolve) => setTimeout(resolve, 3000));
                // Delay redirection so the message is visible
                 errormsg();
                // alert("An error occurred. Please try again.");
            }
        }
    });
});
function successmsg() {
    const successAlert = document.querySelector(".alert-success");
    if (successAlert) {
        successAlert.style.display = "flex"; // Show success message
        setTimeout(() => {
            successAlert.style.display = "none"; // Hide after 1.5s
        }, 3000);
    }
}

function errormsg() {
    const errorAlert = document.querySelector(".alert-error");
    if (errorAlert) {
        errorAlert.style.display = "flex"; // Show error message
        setTimeout(() => {
            errorAlert.style.display = "none";
        }, 3000);
    }
}

function seterrormsg() {
    const errorMsgAlert = document.querySelector(".alert-error-msg");
    if (errorMsgAlert) {
        errorMsgAlert.style.display = "flex"; // Show custom error message
        setTimeout(() => {
            errorMsgAlert.style.display = "none";
        }, 3000);
    }
}
function profilemsg(){
    alertProfile =document.querySelector(".alert-profile");
    if(alertProfile){
        alertProfile.style.display="flex";
        setTimeout(() => {
            alertProfile.style.display="none";
        }, 3000);
    }

}
function validateInputs() {
    const passwordVal = password.value.trim();
    const emailVal = email.value.trim();
    let success = true;

    if (emailVal === "") {
        success = false;
        setError(email, "Email is required");
    } else if (!validateEmail(emailVal)) {
        success = false;
        setError(email, "Please enter a valid email");
    } else {
        setSuccess(email);
    }

    if (passwordVal === "") {
        success = false;
        setError(password, "Password is required");
    } else if (passwordVal.length < 8) {
        success = false;
        setError(password, "Password must be at least 8 characters");
    } else {
        setSuccess(password);
    }

    console.log("Validation status:", success); // Debugging
    return success;
}
//msg is password
function setError(element, message) {
    var inputGroup = element.closest('.input-group'); // Get the parent with .input-group
    var errorElement = inputGroup.querySelector('.error');
    
    errorElement.innerText = message; // Set error message
    inputGroup.classList.add('error'); 
    inputGroup.classList.remove('success'); 
}

function setSuccess(element) {
    var inputGroup = element.closest('.input-group'); // Get the parent with .input-group
    var errorElement = inputGroup.querySelector('.error');
    
    errorElement.innerText = ''; // Clear error message
    inputGroup.classList.remove('error'); 
    inputGroup.classList.add('success'); 
}
//mail check
const validateEmail = (email) =>{
    return String(email)
    .toLowerCase()
    .match(
        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    );
 };
 //navbar
 var sideNavbar=document.querySelector('.side-navbar');

function shownavbar(){
 sideNavbar.style.left='0%';}
 function closenavbar(){
sideNavbar.style.left='-60%';}
 //show password method
  //show password method

  function togglePassword() {
    var passwordField = document.getElementById("password");
    var passwordVal = passwordField.value.trim();
    var showPassword12=document.getElementById("showPassword");
    if (passwordVal === "") {
        
        setError(passwordField, "Password is required to show");
    } else {
        setSuccess(passwordField); // Remove any error message
        if (passwordField.type === "password") {
            passwordField.type = "text";
            showPassword12.classList.remove('fa-eye');
            showPassword12.classList.add('fa-eye-slash');
           
        } 
        else 
        {
            passwordField.type = "password";
            showPassword12.classList.add('fa-eye');
            showPassword12.classList.remove('fa-eye-slash');
        }
    }
}