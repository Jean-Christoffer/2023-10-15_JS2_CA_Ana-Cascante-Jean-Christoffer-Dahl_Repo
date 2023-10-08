async function editPost(url,id,titleInfo,bodyInfo,token){
    try{
        const response = await fetch(`${url}/social/posts/${id}`,
        {
          method:"PUT",
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        
            body:JSON.stringify({
                "title":titleInfo,
                 "body": bodyInfo
             
            })
        
        });
        console.log(response)
        if (response.ok) {
       
            const data = await response.json()
            return data

        } else {
            console.error("asd");
        }
        

        
      } catch(err) {
        console.log(err);
      }
}
export default editPost