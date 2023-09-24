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