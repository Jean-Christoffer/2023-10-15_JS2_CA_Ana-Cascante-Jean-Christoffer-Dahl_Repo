/**
 * Logs in a user by sending a POST request to the specified URL with user login data.
 *
 * @param {string} url - The URL for the login API endpoint.
 * @param {Object} data - The user login data, including email and password.
 *
 * @returns {Promise<Object>} A Promise that resolves with the response data, including an access token and user name, after a successful login.
 * @throws {Error} If the HTTP request fails or if an access token is not found in the response.
 */
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
            window.location.href = "./profile.html";
            
       
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