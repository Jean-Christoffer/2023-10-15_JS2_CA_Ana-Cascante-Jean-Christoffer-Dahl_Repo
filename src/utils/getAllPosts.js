/**
 * Fetches all posts, including author information, comments, and reactions, from a social platform.
 *
 * @param {string} url - The base URL for the posts API.
 * @param {Object} options - The options for the fetch request, including headers and authorization.
 *
 * @returns {Promise<Array>} A Promise that resolves with an array of posts.
 * @throws {Error} If an error occurs during the fetch request or data retrieval.
 */
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