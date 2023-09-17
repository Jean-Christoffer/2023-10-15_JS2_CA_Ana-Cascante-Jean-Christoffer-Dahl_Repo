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