/**
 * Fetches the user profile data for a specific user, including information about followers, following, and authored posts.
 *
 * @param {string} url - The base URL for the profiles API.
 * @param {string} userName - The username for the user profile to retrieve.
 * @param {Object} options - The options for the fetch request, including headers and authorization.
 *
 * @returns {Promise<Object>} A Promise that resolves with the user profile data for the specified user.
 * @throws {Error} If an error occurs during the fetch request or data retrieval.
 */
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