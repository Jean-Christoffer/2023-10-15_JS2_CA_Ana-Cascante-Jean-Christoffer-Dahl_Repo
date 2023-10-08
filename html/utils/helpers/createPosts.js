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
