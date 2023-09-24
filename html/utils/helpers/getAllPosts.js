async function getAllPosts(url,options){

    try{
    const response = await fetch(`${url}/social/posts?_author=true&_comments=true&_reactions=true`,options)
    const responseData = await response.json()
   

    return responseData
    }catch(err){
        console.log(err)
    }


}
export default getAllPosts