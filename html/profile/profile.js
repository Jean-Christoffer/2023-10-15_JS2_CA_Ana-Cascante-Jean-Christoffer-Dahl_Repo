import getProfile  from "../utils/helpers/getProfile.js"
import postComment from "../utils/helpers/postComment.js";
import updateMedia from "../utils/helpers/updateMedia.js";
import getPostByProfile from "../utils/helpers/getPostsByProfile.js";
import timeStamp from "../utils/helpers/timeStamp.js";
import getPostsByProfile from "../utils/helpers/getPostsByProfile.js";
import reactToPosts from "../utils/helpers/reactToPosts.js";
import deletePost from "../utils/helpers/deletePost.js";
import editPost from "../utils/helpers/editPost.js";
// file is getting really big, lots of functions :P will do a propper cleanup later, but it works :P

//stores html id's in a array to escape document.queryselector hell in vanilla js
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
    "#messageForUser",
    "#followerPosts",
    "#confirmEdit"
]
//i map through the selector array and for each element i document.querySelector it
const selected = selectors.map(value => document.querySelector(value))
// stores the css selectors in a array, which i then deconstruct from the selected array, saves alot of document.queryselector.
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
    messageForUser,
    followerPostsContainer,
    confirmEditBtn

] = selected

//token from localStorage, this is key
let token
//stores the name from the person who logged in to localstorage, need this to match post with author of posts etc, might be a better way but i have no idea
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
//generates html trying to the best of my ability to stick to functional programming method. 
async function generateHTML(){
    const data = await getProfile(baseURL,userName, options)
    //your posts
    const getUserPosts = await getPostByProfile(baseURL,userName,options)
    console.log(getUserPosts)


    //get posts by followed users
    const userPostsFollow = data.following.map(async (n) => {
      return await getPostsByProfile(baseURL, n.name, options);
    });
  
    const resultsUserPosts = await Promise.all(userPostsFollow);
    console.log(resultsUserPosts)

        //get userBio by followed users
        const userBio = data.following.map(async (n) => {
          return await getProfile(baseURL, n.name, options);
        });
      
        const userBioResult = await Promise.all(userBio);
    

    profileName.textContent = data.name
    followingCount.textContent = data._count.following
    followersCount.textContent = data._count.followers

    headerImg.src= data.banner
    profileImg.src = data.avatar
    //my posts
    generateProfileCards(getUserPosts, yourPosts,data)
    //people i follow posts
    generateProfileCards(resultsUserPosts[0],followerPostsContainer,userBioResult[0])

    


}
// edit function for editing post, uses data-attributes to get the post id from your posts

confirmEditBtn.addEventListener('click', async function(event) {

  const postId = event.currentTarget.getAttribute('data-post-id');
  let modal = bootstrap.Modal.getInstance(document.querySelector('#editPostModal'));
  let updatedTitle = document.querySelector('#editTitle').value;
  let updatedBody = document.querySelector('#editBody').value;

  const response = await editPost(baseURL,postId,updatedTitle,updatedBody, token);
  console.log(response)
  if(response.updated > response.created) {

    const postCard = document.getElementById(postId);
    const titleElement = postCard.querySelector('span');
    const bodyElement = postCard.querySelector('.card-text');

    titleElement.textContent = updatedTitle;
    bodyElement.textContent = updatedBody;
    updatedTitle = "";
    updatedBody = "";
    modal.hide(); 
  }

  

});

generateHTML()





// function from hell
function generateProfileCards(data, container, userProfile) {

// this is a big drawback for using vanilla js to create medium-large webapps, it will be much easier working with html and js when you start with frameworks so dont get scared by this horrible long document.create
  data.forEach(element => {
 
    const card = document.createElement('div');
    card.className = 'card mb-3 w-100 p-2';
    card.id = element.id;

    const row = document.createElement('div');
    row.className = 'row g-0';

    const colImage = document.createElement('div');
    colImage.className = 'col-md-auto py-2 pl-3';
    const userImg = document.createElement('img');
    userImg.src = userProfile.avatar ?? "../../img/lion2.jpg";
    userImg.className = 'rounded-circle img-fluid';
    userImg.style = 'width: 50px; height: 50px; display: block;';
    colImage.appendChild(userImg);

    const colContent = document.createElement('div');
    colContent.className = 'col-md-10';
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Username and Timestamp
    const usernameAndTimeDiv = document.createElement('div');
    usernameAndTimeDiv.className =  'd-flex justify-content-start align-items-center mb-2';

    const usernameSpan = document.createElement('h6');
    usernameSpan.textContent = userProfile.name.charAt(0).toUpperCase() + userProfile.name.slice(1)
    usernameSpan.className = 'font-weight-bold mr-2';
    usernameSpan.style.marginRight = "auto";
    const smallTime = document.createElement('small');
    smallTime.className = 'text-muted';
    smallTime.textContent = timeStamp(element.created);
    smallTime.style.marginRight = "10px"
    usernameAndTimeDiv.appendChild(usernameSpan);
    usernameAndTimeDiv.appendChild(smallTime);


    //deleteButtonPost

    if (userName === userProfile.name) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-link btn-sm text-muted ml-auto delete-post-btn';
      const iTrash = document.createElement('i');
      iTrash.className = 'fas fa-trash';
      deleteBtn.appendChild(iTrash);
      usernameAndTimeDiv.appendChild(deleteBtn);
  
      // Optionally, you can add an event listener to the delete button to perform an action.
      deleteBtn.addEventListener('click', async function() {
        const response = await deletePost(baseURL,element.id,token);
        if(response && response.ok) {
   
            card.remove();
        }
      });
  }

    cardBody.appendChild(usernameAndTimeDiv);



    // Post Title
    const pTitle = document.createElement('p');
    pTitle.className = ' d-flex justify-content-between';
    const spanTitle = document.createElement('span');
    spanTitle.textContent = element.title;
    pTitle.appendChild(spanTitle);
    cardBody.appendChild(pTitle);

    // Post Body
    const p = document.createElement('p');
    p.className = 'card-text ';
    p.textContent = element.body;

    if (element.media) {
      const mediaWrapper = document.createElement('div');
      mediaWrapper.className = "w-100";

      const postMedia = document.createElement("img");
      postMedia.src = element.media;
      postMedia.className = "rounded img-fluid";
      
      mediaWrapper.appendChild(postMedia);
      cardBody.appendChild(mediaWrapper);
    }
    cardBody.append(p);


    //more buttons
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
    spanLike.id = `likeCount${element.id}`;
    spanLike.textContent = element._count.reactions;
    btnLike.appendChild(spanLike);

    //edit btn
    if(userName === element.author.name){
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-link btn-sm text-muted';
        const iEdit = document.createElement('i');
        iEdit.className = 'fas fa-edit';  // Font Awesome icon for edit
        btnEdit.appendChild(iEdit);
        const spanEdit = document.createElement('span');
        spanEdit.textContent = " Edit";
        btnEdit.setAttribute('data-post-id', element.id);
        confirmEditBtn.setAttribute('data-post-id', element.id);
          btnEdit.appendChild(spanEdit);
      
        // Add an event listener to handle post editing
        btnEdit.addEventListener('click', function() {


            document.getElementById('editTitle').value = element.title;
            document.getElementById('editBody').value = element.body;
            
            var modal = new bootstrap.Modal(document.getElementById('editPostModal'));
          modal.show();

    });
    btnGroup.appendChild(btnEdit);  
}

    //likeButton eventListener
    btnLike.addEventListener("click",(e)=>{
      reactToPosts(baseURL,element.id,token,spanLike)
 
    })
    
    btnGroup.appendChild(btnComment);
    btnGroup.appendChild(btnLike);
 
    cardBody.appendChild(btnGroup);

    colContent.appendChild(cardBody);

    row.appendChild(colImage);
    row.appendChild(colContent);

    card.appendChild(row);


    //commentSection
    const commentCollapse = document.createElement('div');
    commentCollapse.className = 'collapse mt-3';
    commentCollapse.id = `commentCollapse${element.id}`;
    
    // Create the form
    const commentForm = document.createElement('form');


    
    const commentInput = document.createElement('input');
    commentInput.className = 'form-control';
    commentInput.type = 'text';
    commentInput.placeholder = 'Write a reply...';
    commentForm.appendChild(commentInput); // Append to form instead
    
    // Add a hidden submit button. This allows users to press Enter to submit.
    const hiddenSubmitButton = document.createElement('button');
    hiddenSubmitButton.style.display = 'none';
    commentForm.appendChild(hiddenSubmitButton);
    
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault()
        const commentText = commentInput.value;
        if (commentText) {

            postComment(baseURL,element.id,commentText,token,spanComment,element);

            commentInput.value = '';
          
        }
    


      
    })
    commentCollapse.appendChild(commentForm);
    
    // Modify btnComment to control the collapse of comment section
    btnComment.setAttribute('data-bs-toggle', 'collapse');
    btnComment.setAttribute('data-bs-target', `#commentCollapse${element.id}`);
    btnComment.setAttribute('aria-expanded', 'false');
    btnComment.setAttribute('aria-controls', `commentCollapse${element.id}`);
    
    cardBody.appendChild(commentCollapse);

    //commentSectionPanel to store comments..



    const commentsPanel = document.createElement('div');
    commentsPanel.className = 'comments-panel border-top mt-2';
    commentsPanel.style.display = 'none'; // Initially hide the panel

    element.comments.forEach(comment => { 
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment py-2 d-flex justify-content-between align-items-center';  // Make it a flex container
  
      const commentUser = document.createElement('strong');  
      commentUser.textContent = comment.author.name + ": ";
      commentDiv.appendChild(commentUser);
  
      const commentText = document.createElement('span');  
      commentText.textContent = comment.body;
      commentDiv.appendChild(commentText);
  
      // Check if the comment author's name matches the logged-in user's name
      if (comment.author.name === userName) {
          const deleteCommentBtn = document.createElement('button');
          deleteCommentBtn.className = 'btn btn-link btn-sm text-muted ml-2 delete-comment-btn';
          const iTrashComment = document.createElement('i');
          iTrashComment.className = 'fas fa-trash';
          deleteCommentBtn.appendChild(iTrashComment);
  
          // Add an event listener to handle comment deletion
          deleteCommentBtn.addEventListener('click', function() {
              // Call your deleteComment function here
              // Example: deleteComment(comment.id);
              // If successful, remove the comment div:
              commentDiv.remove();
          });
  
          commentDiv.appendChild(deleteCommentBtn);  // Append it to the main commentDiv
      }
  
      commentsPanel.appendChild(commentDiv);
  });
    cardBody.appendChild(commentsPanel);

    btnComment.addEventListener('click', function() {
        if(commentsPanel.style.display === 'none') {
            commentsPanel.style.display = 'block';
        } else {
            commentsPanel.style.display = 'none';
        }
    });






    container.appendChild(card);
  });
}





