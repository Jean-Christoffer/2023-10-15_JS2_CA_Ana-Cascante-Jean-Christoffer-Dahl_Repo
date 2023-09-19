async function createPost(url,options){
    try{
      const data = await fetch(`${url}/social/posts`, options);
      const response = await data.json();
      console.log(response)
      return response
    } catch(err) {
      console.log(err);
    }
  }
  
  
export default createPost