async function updateMedia(url,userName,values){

    try{
    const response = await fetch(`${url}/social/profiles/${userName}/media`,values)
    const responseData = await response.json()

    return responseData;
    }catch(err){
        console.log(err)
    }


}
export default updateMedia