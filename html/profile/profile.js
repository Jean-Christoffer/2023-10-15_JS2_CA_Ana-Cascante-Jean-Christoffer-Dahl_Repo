import getProfile  from "../utils/helpers/getProfile.js";
import updateMedia from "../utils/helpers/updateMedia.js";
import getPostByProfile from "../utils/helpers/getPostsByProfile.js";
import timeStamp from "../utils/helpers/timeStamp.js";
import createPost from "../utils/helpers/createPosts.js";
const selectors =
 [
    "#username",
    "#followingCount",
    "#followersCount",
    "#headerImage",
    "#profileImage",
    "#updateMediaForm",
    "#headerImg",
    "#profileImg",
    "#likeCount",
    "#yourPosts",
    "#headerImageError",
    "#profileImageError",
    "#messageForUser"
]
const selected = selectors.map(value => document.querySelector(value))

const [
    profileName,
    followingCount,
    followersCount,
    headerImage,
    profileImage,
    updateMediaForm,
    headerImg,
    profileImg,
    likeCount,
    yourPosts,
    headerImageError,
    profileImageError,
    messageForUser

] = selected


let token
let userName
token =  localStorage.getItem('bearerToken', token);
userName =  localStorage.getItem('name', userName);

const baseURL = "https://api.noroff.dev/api/v1";

const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
//checks if link and if image
updateMediaForm.addEventListener("submit",async(e) =>{
    e.preventDefault()
    const  headerImageValue =  headerImage.value
    const  profileImageValue = profileImage.value


    const updateOptions = {
        method:"PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
    
          body:JSON.stringify({
            "banner": headerImageValue,
            "avatar": profileImageValue
          })
    }
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(headerImageValue)) {
      headerImageError.textContent ="URL is not valid"
    }
    if (!urlPattern.test(profileImageValue)) {
      profileImageError.textContent = "URL is not valid"
  }

  if(urlPattern.test(headerImageValue) && urlPattern.test(profileImageValue)){
    await updateMedia(baseURL,userName,updateOptions)

    messageForUser.textContent = "Images changed successfully! you can now close the window"
    messageForUser.className ="text-success text-center  display-6 p-2"

  }


   


} )

async function generateHTML(){
    const data = await getProfile(baseURL,userName, options)
    const getUserPosts = await getPostByProfile(baseURL,userName,options)

    console.log( getUserPosts)
    
    profileName.textContent = data.name
    followingCount.textContent = data._count.following
    followersCount.textContent = data._count.followers

    headerImg.src= data.banner
    profileImg.src = data.avatar
    generateProfileCards(getUserPosts, yourPosts)


}
generateHTML()


function generateProfileCards(data, container){

  data.forEach(element => {


    const card = document.createElement('div');
    card.className = 'card mb-3 w-100';

    card.id = element.id
    
    const row = document.createElement('div');
    row.className = 'row g-0';
    

    
    
    const colContent = document.createElement('div');
    colContent.className = 'col-md-10';
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    

    //postTitle
    const pTitle = document.createElement('h6');
    pTitle.className = ' d-flex justify-content-between font-weight-bold';
    const spanTitle = document.createElement('span');
    spanTitle.textContent = element.title;
    const smallTime = document.createElement('small');
    smallTime.className = 'text-muted ';
    smallTime.textContent = timeStamp(element.created);
    pTitle.append(spanTitle,smallTime);
 
    cardBody.appendChild(pTitle);
    
    //postBody
    const p = document.createElement('p');
    p.className = 'card-text ';
    p.textContent = element.body;


    
    if (element.media) {
      const mediaWrapper = document.createElement('div');
      mediaWrapper.style.maxHeight = '200px'; // You can adjust this value
      mediaWrapper.className ="w-100 "
  
      const postMedia = document.createElement("img");
      postMedia.src = element.media;
      postMedia.className = "rounded img-fluid";
      postMedia.style ="max-height:200px;"

  
      mediaWrapper.appendChild(postMedia);
  
      cardBody.appendChild(mediaWrapper);
  }
    cardBody.append(p);

    
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'd-flex';
    
    const btnComment = document.createElement('button');
    btnComment.className = 'btn btn-link btn-sm text-muted';
    const iComment = document.createElement('i');
    iComment.className = 'fas fa-comment';
    btnComment.appendChild(iComment);
    const spanComment = document.createElement('span');
    spanComment.id = 'commentCount';
    spanComment.textContent = element._count.comments;
    btnComment.appendChild(spanComment);
    
    const btnLike = document.createElement('button');
    btnLike.className = 'btn btn-link btn-sm text-muted';
    const iLike = document.createElement('i');
    iLike.className = 'fas fa-heart text-danger';
    btnLike.appendChild(iLike);
    const spanLike = document.createElement('span');
    spanLike.id = 'likeCount';
    spanLike.textContent = element._count.reactions;
    btnLike.appendChild(spanLike);
    
    btnGroup.appendChild(btnComment);
    btnGroup.appendChild(btnLike);
    cardBody.appendChild(btnGroup);
    
    colContent.appendChild(cardBody);
    
    

    row.appendChild(colContent);
    
    
    card.appendChild(row);
    
    
    
    container.appendChild(card);




  })

 
}





