
import logIn  from "./utils/helpers/loginFunc.js";
const selectors =  [
    "#email",
    "#password",
    "#login_form",
    "#passwordError",
    "#emailError"
]

const selected = selectors.map(value => document.querySelector(value));
const mailRegex = /^[a-zA-Z0-9._%+-]+@(stud\.)?noroff\.no$/;
const baseURL = "https://api.noroff.dev/api/v1"
const [
    email,
    password,
    loginForm,
    passwordError,
    emailError
] = selected;


loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = password.value
  
    let isFormValid = true;
    passwordError.textContent = '';
    emailError.textContent = '';

    if (passwordValue.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters long.';
        isFormValid = false;
    }

    if (!mailRegex.test(emailValue)) {
        emailError.textContent = 'Invalid email format.';
        isFormValid = false;
    }

    if(isFormValid){
        try{
            logIn(`${baseURL}`,{"email":`${emailValue}`,"password":`${passwordValue}`})
        }catch(err){
            console.log(err)
        }
       
  
    }
})
//register func
async function logIn(url, data={}){

    try{
        const response = await fetch(`${url}/social/auth/login`,{
            method:"POST",
            credentials:"same-origin",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
    })
    if (!response.ok) {
     
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json()

    const token = responseData.accessToken
    if (token) {
        localStorage.setItem('bearerToken', token);
        if(responseData && token){
            window.location.href = "profile.html";
            
            console.log("succ")
        }
    } else {
        console.error("Token not found in response");
    }
    
    return responseData;
    }catch(err){
        console.log(err)
    }


}

export default logIn

