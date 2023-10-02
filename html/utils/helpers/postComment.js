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