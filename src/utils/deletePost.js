/**
 * Deletes a post with the specified ID using the provided token.
 *
 * @param {string} url - The base URL where the post deletion request will be sent.
 * @param {string} id - The unique identifier of the post to delete.
 * @param {string} token - The authorization token for the request.
 * 
 * @returns {Promise<Response>} A Promise that resolves with the response object after deleting the post.
 * @throws {Error} If an error occurs during the post deletion or data retrieval.
 */
async function deletePost(url,id,token){

    try{
        const response = await fetch(`${url}/social/posts/${id}`,
        {
          method:"DELETE",
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        
        });
        return response
      } catch(err) {
        console.log(err);
      }


}
export default deletePost