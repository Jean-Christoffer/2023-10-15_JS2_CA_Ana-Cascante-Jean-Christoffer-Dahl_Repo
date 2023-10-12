/**
 * Fetches posts authored by a specific user profile, including additional information about comments, reactions, and the author.
 *
 * @param {string} url - The base URL for the posts API.
 * @param {string} name - The name of the user profile for which to retrieve posts.
 * @param {Object} options - The options for the fetch request, including headers and authorization.
 *
 * @returns {Promise<Array>} A Promise that resolves with an array of posts authored by the specified user profile.
 * @throws {Error} If an error occurs during the fetch request or data retrieval.
 */
async function getPostsByProfile(url,name,options){
    try{
        const data = await fetch(`${url}/social/profiles/${name}/posts?_comments=true&_reactions=true&_author=true`, options);
        const response = await data.json();
        
        return response
        
      } catch(err) {
        console.log(err);
      }
}
export default getPostsByProfile