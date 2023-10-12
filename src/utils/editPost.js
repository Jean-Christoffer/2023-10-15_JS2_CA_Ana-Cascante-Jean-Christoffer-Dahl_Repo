/**
 * Edits a post with the specified ID using the provided token and new title and body information.
 *
 * @param {string} url - The base URL where the post edit request will be sent.
 * @param {string} id - The unique identifier of the post to edit.
 * @param {string} titleInfo - The updated title information for the post.
 * @param {string} bodyInfo - The updated body information for the post.
 * @param {string} token - The authorization token for the request.
 * 
 * @returns {Promise<Object>} A Promise that resolves with the edited post data as an object.
 * @throws {Error} If an error occurs during the post editing or data retrieval.
 */
async function editPost(url,id,titleInfo,bodyInfo,token){
    try{
        const response = await fetch(`${url}/social/posts/${id}`,
        {
          method:"PUT",
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        
            body:JSON.stringify({
                "title":titleInfo,
                 "body": bodyInfo
             
            })
        
        });
        console.log(response)
        if (response.ok) {
       
            const data = await response.json()
            return data

        } else {
            console.error("asd");
        }
        

        
      } catch(err) {
        console.log(err);
      }
}
export default editPost