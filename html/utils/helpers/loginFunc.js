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
    const userName = responseData.name
    if (token) {
        localStorage.setItem('bearerToken', token);
        localStorage.setItem("name",userName)
        if(responseData && token){
            window.location.href = "profile/profile.html";
            
       
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