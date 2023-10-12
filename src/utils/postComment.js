/**
 * Posts a comment on a specific post using the provided token.
 *
 * @param {string} url - The base URL where the comment request will be sent.
 * @param {string} id - The unique identifier of the post to comment on.
 * @param {string} comment - The comment content to post.
 * @param {string} token - The authorization token for the request.
 *
 * @returns {Promise<Object>} A Promise that resolves with the response data after posting the comment.
 * @throws {Error} If an error occurs during the comment posting or data retrieval.
 */
async function postComment(url,id,comment,token){
    try{
        const response = await fetch(`${url}/social/posts/${id}/comment`,
        {
          method:"POST",
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        
            body:JSON.stringify({
              "body": comment,
             
            })
        
        });
        const data = await response.json()     
        return data
      } catch(err) {
        console.log(err);
      }
}
export default postComment