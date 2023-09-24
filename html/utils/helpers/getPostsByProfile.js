async function getPostsByProfile(url,name,options){
    try{
        const data = await fetch(`${url}/social/profiles/${name}/posts?_comments=true&_reactions=true&_author=true`, options);
        const response = await data.json();
        
        return response
        
      } catch(err) {
        console.log(err);
      }
}
export default getPostsByProfile