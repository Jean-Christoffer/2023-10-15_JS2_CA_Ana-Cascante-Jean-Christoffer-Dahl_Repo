

const selectors =  [
    "#email",
    "#password",
    "#name",
    "#nameError",
    "#register_form",
    "#passwordError",
    "#emailError"
]

const selected = selectors.map(value => document.querySelector(value));
const mailRegex = /^[a-zA-Z0-9._%+-]+@(stud\.)?noroff\.no$/;
const baseURL = "https://api.noroff.dev/api/v1"
const [
    email,
    password,
    userName,
    nameError,
    registerForm,
    passwordError,
    emailError
] = selected;

registerForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = password.value
    const nameValue = userName.value.trim().replace(" ", "")
    
  
    let isFormValid = true;
    passwordError.textContent = '';
    emailError.textContent = '';
    nameError.textContent = "";

    if (passwordValue.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters long.';
        isFormValid = false;
    }
    if(nameValue.length < 2){
        nameError.textContent = "Your name must be atleast 2 characters long"
        isFormValid = false;
    }
       
    

    if (!mailRegex.test(emailValue)) {
        emailError.textContent = 'Invalid email format.';
        isFormValid = false;
    }

    if(isFormValid){
        try{
     
             createUser(`${baseURL}`,
            {"name":`${nameValue}`,"email":`${emailValue}`,"password":`${passwordValue}`,"avatar:":"","banner":""})
            showSnackbar("User created successfully! you can now log in");

        }catch(err){
            console.log(err)
        }
       
  
    }
})


//createUser
async function createUser(url ="", data={}){
    try{
        const response = await fetch(`${url}/social/auth/register`,{
            method:"POST",
            credentials:"same-origin",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
          
    })
    if(!response.ok){
        console.log(response)
    }
    const userData = await response.json()

    return userData
    }catch(err){
        console.log(err)
    }

}

function showSnackbar(message) {
    const snackbar = document.getElementById('snackbar');
    const snackbarMessage = document.getElementById('snackbarMessage');

    snackbarMessage.textContent = message; 
    snackbar.classList.remove('d-none'); 


    setTimeout(() => {
        snackbar.classList.add('d-none');
    }, 3000);
}



