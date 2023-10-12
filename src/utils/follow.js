/**
 * Follow or unfollow a user on the social platform.
 *
 * @param {string} url - The base URL where the follow/unfollow request will be sent.
 * @param {string} userName - The name of the user to follow or unfollow.
 * @param {string} token - The authorization token for the request.
 * @param {HTMLButtonElement} btn - The button element that triggers the follow action.
 * @param {string} [follow_Unfollow="follow"] - The action to perform: "follow" or "unfollow".
 *
 * @throws {Error} If an error occurs during the follow/unfollow request.
 */
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