/**
 * Import module for logging in.
 * @module logIn
 */
import logIn  from "../utils/loginFunc.js";
/** @type {string[]} */
const selectors =  [
    "#email",
    "#password",
    "#login_form",
    "#passwordError",
    "#emailError"
]
/** @type {Element[]} */
const selected = selectors.map(value => document.querySelector(value));
/** Regular expression for valid email format. */
const mailRegex = /^[a-zA-Z0-9._%+-]+@(stud\.)?noroff\.no$/;
/** Base URL for API requests. */
const baseURL = "https://api.noroff.dev/api/v1"
/** @type {Element[]} */
const [
    email,
    password,
    loginForm,
    passwordError,
    emailError
] = selected;
/**
 * Event listener for form submission when logging in.
 *
 * @param {Event} e - The form submission event.
 */

loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    /** @type {string} */
    const emailValue = email.value.trim().toLowerCase();
    /** @type {string} */
    const passwordValue = password.value
     /** Flag to indicate whether the form is valid. */
    let isFormValid = true;
    passwordError.textContent = '';
    emailError.textContent = '';

    if (passwordValue.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters long.';
        isFormValid = false;
    }

    if (!mailRegex.test(emailValue)) {
        emailError.textContent = 'Invalid email format. Must be a Noroff mail';
        isFormValid = false;
    }

    if(isFormValid){
        try{
           /**
            * Attempt user login.
            * @param {string} baseUrl - The base URL of the API.
            * @param {object} data - The login data containing email and password.
            * @returns {any} - The result of the login attempt.
            */ 
            logIn(`${baseURL}`,{"email":`${emailValue}`,"password":`${passwordValue}`})
            // Store the user's name in local storage
            localStorage.setItem('name', token);
        }catch(err){
            console.log(err)
        }
       
  
    }
})


