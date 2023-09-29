async function follow(url,userName,token,btn, follow_Unfollow = "follow"){
    try{
      const response = await fetch(`${url}/social/profiles/${userName}/${follow_Unfollow}`,
      {
        method:"PUT",
        headers: {
            Authorization: `Bearer ${token}`,
      
          },
        }
      )
      const responseData = await response.json()
      if(response.ok && follow_Unfollow !== "unfollow" ){
        btn.disabled = true
        btn.textContent = "Followed!"
      }
      console.log(responseData)
     if(!response.ok){
      btn.textContent = responseData.errors[0].message
    
     }
      
    } catch(err){
        console.log(err)
    }

  }


  export default follow