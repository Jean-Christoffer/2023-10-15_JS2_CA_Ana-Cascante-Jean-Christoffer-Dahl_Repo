/**
 * Updates the media (banner and avatar) of a user's profile.
 *
 * @param {string} url - The base URL where the update media request will be sent.
 * @param {string} userName - The username of the user whose media is being updated.
 * @param {Object} values - An object containing media update data.
 * @returns {Promise<Object>} A Promise that resolves with the response data after updating the media.
 * @throws {Error} If an error occurs during the media update or data retrieval.
 */
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