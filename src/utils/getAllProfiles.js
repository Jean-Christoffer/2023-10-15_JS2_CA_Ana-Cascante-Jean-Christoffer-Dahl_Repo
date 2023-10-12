/**
 * Fetches profiles, including information about the profiles they follow, their followers, and their posts from a social platform.
 *
 * @param {string} url - The base URL for the profiles API.
 * @param {Object} options - The options for the fetch request, including headers and authorization.
 *
 * @returns {Promise<Array>} A Promise that resolves with an array of profiles with post counts greater than 0.
 * @throws {Error} If an error occurs during the fetch request or data retrieval.
 */
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