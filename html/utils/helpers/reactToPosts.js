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
  