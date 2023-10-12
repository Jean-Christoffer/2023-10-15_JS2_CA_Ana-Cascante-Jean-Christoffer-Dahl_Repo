/**
 * Creates a new post and sends it to the specified URL using the provided token.
 *
 * @param {string} url - The URL where the post will be created.
 * @param {string} token - The authorization token for the request.
 * @param {object} formData - An object containing post data.
 * @param {string} formData.title - The title of the post (required).
 * @param {string} formData.body - The body/content of the post (required).
 * @param {string} formData.tags - Comma-separated tags for the post (optional).
 * @param {string} formData.imageUrl - The URL of an optional image to include in the post.
 * 
 * @returns {Promise<object>} A Promise that resolves with the response data after creating the post.
 * @throws {Error} If an error occurs during the post creation or data retrieval.
 */
async function createPost(url, token, formData) {
  const options = {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: formData.title, // req
      body: formData.body, // req
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [], // Assuming comma-separated tags
      media: formData.imageUrl || "" // Optional
    })
  };

  try {
    const data = await fetch(`${url}/social/posts`, options);
    const response = await data.json();
    return response;
  } catch (err) {
    console.log(err);
  }
}
  
  
export default createPost
