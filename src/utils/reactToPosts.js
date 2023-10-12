/**
 * Reacts to a specific post with a "👍" (like) using the provided token.
 *
 * @param {string} url - The base URL where the reaction request will be sent.
 * @param {string} id - The unique identifier of the post to react to.
 * @param {string} token - The authorization token for the request.
 * @param {HTMLSpanElement} likeSpan - The HTML <span> element displaying the like count.
 *
 * @returns {Promise<void>} A Promise that resolves once the reaction is successfully updated.
 * @throws {Error} If an error occurs during the reaction update or data retrieval.
 */
async function reactToPosts(url,id,token,likeSpan){
    try{
      const response = await fetch(`${url}/social/posts/${id}/react/👍`,
       { 
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
        
      }});
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        likeSpan.textContent = data.count; 
    } else {
        console.error('Failed to update the like count on the server.');
    }


    } catch(err) {
      console.log(err);
    }
  }
  
export default reactToPosts
  