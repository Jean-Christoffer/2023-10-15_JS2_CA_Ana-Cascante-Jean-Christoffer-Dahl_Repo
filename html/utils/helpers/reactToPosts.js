async function reactToPosts(url,token){
    try{
      const data = await fetch(`${url}/social/posts/${1539}/react/👍`,
       { 
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
        
      }});
  
      const response = await data.json();
      return response
    } catch(err) {
      console.log(err);
    }
  }
  
export default reactToPosts
  