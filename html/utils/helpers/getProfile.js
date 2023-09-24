async function getProfile(url,userName,options){

    try{
    const response = await fetch(`${url}/social/profiles/${userName}?_followers=true&_following=true&_posts=true`,options)
    const responseData = await response.json()

    return responseData;
    }catch(err){
        console.log(err)
    }


}
export default getProfile