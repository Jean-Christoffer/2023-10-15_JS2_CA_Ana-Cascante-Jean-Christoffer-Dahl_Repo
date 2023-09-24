async function postComment(url,id,comment,token,commentCount,orgData){
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
        if (response.ok) {
       
   
            commentCount.textContent ++

        } else {
            console.error('Failed to update the like count on the server.');
        }
        

        
      } catch(err) {
        console.log(err);
      }
}
export default postComment