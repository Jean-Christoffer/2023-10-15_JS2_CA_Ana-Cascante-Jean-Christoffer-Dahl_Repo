async function getPostsByProfile(url,name,options){
    try{
        const data = await fetch(`${url}/social/profiles/${name}/posts`, options);
        const response = await data.json();
        
        return response.filter(i => i.id === 1539 || i.id === 1557) //just until i can delete the duplicates :P
        
      } catch(err) {
        console.log(err);
      }
}
export default getPostsByProfile