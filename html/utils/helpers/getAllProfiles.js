async function getAllProfiles(url,options){

    try{
    const response = await fetch(`${url}/social/profiles?_following=true&_followers=true&_posts=true`,options)
    const responseData = await response.json()
    const profileNames = responseData.filter(p => p._count.posts > 0)

    return profileNames
    }catch(err){
        console.log(err)
    }


}
export default getAllProfiles