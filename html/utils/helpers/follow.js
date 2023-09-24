async function follow(url,userName,options){
    try{
      const response = await fetch(`${url}/social/profiles/${userName}/follow`,options)
      const responseData = await response.json()

      return responseData;
    } catch(err){
        console.log(err)
    }

  }
  /*
  //for put request you dont need to use application.json
  const followOpt = {
  method:"PUT",
  headers: {
      Authorization: `Bearer ${token}`,

    },

}
  */

  export default follow