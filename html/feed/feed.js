const baseUrl = "https://api.noroff.dev/api/v1";

let token
token = localStorage.getItem('bearerToken', token);

const options ={
    method:"GET",
    credentials:"same-origin",
    headers:{
        "Content-Type":"application/json",
    Authorization: `Bearer ${token}`,
}
}

async function getPosts (headerOptions){
    try {
        const response = await fetch (`${baseUrl}/social/posts`,headerOptions); 
        const posts= await response.json();
        console.log (posts); 
        return posts;
    } catch (error){
        console.log (error);
    }
}

getPosts(options);
