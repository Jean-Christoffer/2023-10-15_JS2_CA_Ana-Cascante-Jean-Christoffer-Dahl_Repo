
const selectors =  [
    "#email",
    "#password",
    "#login_form"
]
const selected = selectors.map(value => document.querySelector(value));
const mailRegex = /^[a-zA-Z0-9._%+-]+@(stud\.)?noroff\.no$/;
const baseURL = "https://api.noroff.dev/api/v1"
const [
    email,
    password,
    loginForm
] = selected;


loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = password
  
    
    if(passwordValue.value.length >= 8 &&  mailRegex.test(emailValue)){
        try{
            logIn(`${baseURL}`,{"email":`${emailValue}`,"password":`${passwordValue.value}`})
        }catch(err){
            console.log(err)
        }
       
  
    }
})



//login func
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
        console.log(response)
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json()
    console.log(responseData)
    const token = responseData.accessToken
    if (token) {
        localStorage.setItem('bearerToken', token);
        if(responseData && token){
            //window.location.href = "profile.html";
            
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