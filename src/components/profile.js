// Import statements for various utility functions
import getProfile  from "../utils/getProfile.js"
import postComment from "../utils/postComment.js";
import updateMedia from "../utils/updateMedia.js";
import getPostByProfile from "../utils/getPostsByProfile.js";
import timeStamp from "../utils/timeStamp.js";
import getPostsByProfile from "../utils/getPostsByProfile.js";
import reactToPosts from "../utils/reactToPosts.js";
import deletePost from "../utils/deletePost.js";
import editPost from "../utils/editPost.js";
import follow from "../utils/follow.js";


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
    "#confirmEdit",
    "#followingList"
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
    confirmEdit,
    followingListContainer

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

/**
 * Generates HTML for the user profile page.
 */
async function generateHTML() {
  try {
    // Your profile
    const data = await getProfile(baseURL, userName, options);
    
    // Your posts
    const getUserPosts = await getPostByProfile(baseURL, userName, options);
    
    // Get posts by followed users
    const userPostsFollow = data.following.map(async (n) => {
      return await getPostsByProfile(baseURL, n.name, options);
    });

    const resultsUserPosts = await Promise.all(userPostsFollow);
    
    // Flatten the results into a single array
    const mergedPosts = [].concat(...resultsUserPosts);
    
    // Get userBio by followed users
    const userBio = data.following.map(async (n) => {
      return await getProfile(baseURL, n.name, options);
    });

    const userBioResult = await Promise.all(userBio);
    
    profileName.textContent = data.name;
    followingCount.textContent = data._count.following;
    followersCount.textContent = data._count.followers;

    headerImg.src = data.banner ?? "./img/avatar.jpg";
    profileImg.src = data.avatar ?? "./img/avatar.jpg";
    
    // My posts
    generateProfileCards(getUserPosts, yourPosts, data);
    // People I follow posts
    generateProfileCards(mergedPosts, followerPostsContainer, userBioResult);

  } catch (error) {
    console.error("Error generating HTML:", error);
    window.alert("Sorry, something went wrong while loading the profile. Please try again later.");
  }
}
// edit function for editing post, uses data-attributes to get the post id from your posts

confirmEdit.addEventListener('click', async function(event) {

  const postId = event.currentTarget.getAttribute('data-post-id');
  let modal = bootstrap.Modal.getInstance(document.querySelector('#editPostModal'));
  let updatedTitle = document.querySelector('#editTitle').value;
  let updatedBody = document.querySelector('#editBody').value;

  const response = await editPost(baseURL,postId,updatedTitle,updatedBody, token);
  console.log(response)
  if(response.updated > response.created) {

    const postCard = document.getElementById(postId);
    const titleElement = postCard.querySelector('.card-body-content h5');
    const bodyElement = postCard.querySelector('.card-body-content p');

    titleElement.textContent = updatedTitle;
    bodyElement.textContent = updatedBody;
    updatedTitle = "";
    updatedBody = "";
    modal.hide(); 
  }

  

});
/**
 * Handles the form submission for posting comments.
 *
 * @param {Event} e - The event object.
 * @param {HTMLElement} element - The target element.
 * @param {HTMLElement} spanComment - The comment count element.
 * @param {HTMLElement} commentCountModal - The comment count in the modal.
 * @param {HTMLElement} commentSectionModal - The comment section in the modal.
 */
async function handleFormSubmit(e, element, spanComment, commentCountModal, commentSectionModal) {
  e.preventDefault();

  const commentInputElement = document.getElementById("modalCommentInput");
  const commentTextValue = commentInputElement.value; // get the value from the input element

  if (commentTextValue) {
      const data = await postComment(baseURL, element.id, commentTextValue, token); // pass the value, not the element
      if (data) {
          // Update the local dataset with the new comment
          const newComment = {
              body: commentTextValue,
              owner: userName
          };
          element.comments.push(newComment);

          // Create and display the new comment in the modal
          const [author, commentElem] = createCommentElement(newComment);
          commentSectionModal.append(author, commentElem);

          // Clear the input field for the next comment
          commentInputElement.value = ''; // clear the input's value
          
          // Update the comments count
          let currentCount = parseInt(spanComment.textContent, 10);
          commentCountModal.textContent = currentCount + 1;
          spanComment.textContent = currentCount + 1;
      } else {
          console.error("Failed to post the comment.");
      }
  }
}

/**
 * Appends comments to the comment section of a modal.
 * @param {Array} comments - The comments to be appended.
 * @param {HTMLElement} commentSectionModal - The comment section in the modal.
 */
function appendCommentsToModal(comments, commentSectionModal) {
  comments.forEach(comment => {
      const [author, commentElem] = createCommentElement(comment);
      commentSectionModal.append(author, commentElem);
  });
}

/**
 * Creates an HTML element for a comment.
 *
 * @param {Object} comment - The comment data.
 * @returns {Array} An array containing the author element and comment element.
 */
function createCommentElement(comment) {
  const commentElem = document.createElement("p");
  const authorElem = document.createElement("h6");

  commentElem.textContent = comment.body;
  authorElem.textContent = comment.owner + ":";

  return [authorElem, commentElem];
}


// Call the function to generate the initial HTML
generateHTML()

// function from hell
/**
 * Generates profile cards for user posts and following users.
 *
 * @param {Array} data - The data for the profile cards.
 * @param {HTMLElement} container - The container where the cards will be appended.
 * @param {Object} userProfile - The user profile data.
 */
function generateProfileCards(data, container, userProfile) {

  if(userProfile.name === userName){
 
    userProfile.following.forEach(follower => {
      const userCard = document.createElement("div")
      userCard.classList.add("userCard")
      const imgContainer = document.createElement("div")
      imgContainer.classList.add("img-container")
      const avatar = document.createElement("img")
      avatar.src = follower.avatar ?? "./img/avatar.jpg"
      imgContainer.append(avatar)
  
      const userName = document.createElement("p")
      userName.classList.add("userName")
      userName.textContent = follower.name
      userName.classList.add("text-white")
  
      const followButton = document.createElement("button")
      followButton.classList.add("followBtnUser")
      followButton.textContent = "Unfollow"
  
      followButton.id = follower.name
  
      followButton.addEventListener("click", (e)=> {
        console.log(e.currentTarget)
        follow(baseURL,follower.name,token,e.currentTarget,"unfollow")
        userCard.remove()
        followingCount.textContent --
      } )
  
      userCard.append(imgContainer,userName,followButton)
      followingListContainer.append(userCard)
    })
  }

  

  data.forEach((element) => {
    //cardContainer
    const card = document.createElement("div");
    card.className = "card";
    card.id = element.id;

    //container for card header
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";


    //authorAvatar
    const cardProfileImage = document.createElement("img")
    cardProfileImage.className = "card-profile-img"
    cardProfileImage.src= element.author?.avatar ?? "./img/avatar.jpg";
    cardProfileImage.setAttribute("aria-label", "Profile Image");

    //Author
    const cardName = document.createElement("p")
    cardName.className = "name"
    cardName.textContent = element.author?.name.charAt(0).toUpperCase() +
    element.author?.name.slice(1);

    //Handle
    const userHandle = document.createElement("p")
    userHandle.className = "handle"
    userHandle.textContent = "@" + element.author?.name

    //timeStamp
    const timeStampCreated  = document.createElement("p")
    timeStampCreated.className = "time"
    timeStampCreated.textContent = timeStamp(element.created);

    //container for time,name,handle
    const userInfo = document.createElement("div")
    userInfo.className = "userInfo"

    //Container for CardBody
    const cardBodyContainer = document.createElement("div")
    cardBodyContainer.className = "card-body"

    //Content for cardBody
    const cardBodyContent = document.createElement("article")
    cardBodyContent.className = "card-body-content"

    //postTitle
    const cardTitle = document.createElement("h5")
    cardTitle.textContent = element.title

    //postContent
    const cardContentPost = document.createElement("p")
    cardContentPost.textContent =  element.body

    //mediaPostContainer
    const postImgContainer = document.createElement("div")
    postImgContainer.className = "card-content-img-container"   
    if(element.media){

    //postImg
    const postImg = document.createElement("img")
    postImg.src = element.media
    postImgContainer.append(postImg)
    }

    const reactionContainer = document.createElement("div")
    reactionContainer.className = "reaction-container"

    //likeButton
    const likeBtn = document.createElement("button")
    const iLike = document.createElement("i")
    iLike.className = "fas fa-heart"
  

    //likeCount
    const spanLike = document.createElement("span");
    spanLike.id = `likeCount${element.id}`;

    const thumbReaction = element?.reactions?.find(
          (reaction) => reaction.symbol === "👍"
    );
    const count = thumbReaction?.count;
    spanLike.textContent = count;
    

    likeBtn.addEventListener("click", (e) => {
      reactToPosts(baseURL, element.id, token, spanLike);
    });

  
    //commentButton, this will open the postId : (
    const commentButton = document.createElement("button")
    commentButton.setAttribute("data-bs-toggle", "modal");
    commentButton.setAttribute("data-bs-target", "#postId");

    //modal for post with commentSection

    function submitHandler(e, element, spanComment, commentCountModal, commentSectionModal) {
      e.preventDefault();
      handleFormSubmit(e, element, spanComment, commentCountModal, commentSectionModal);
  }
      //modal for post with commentSection
      commentButton.addEventListener('click', function() {
        const modal = document.querySelector('#postId');
        const modalProfileImg = modal.querySelector('#post-card-modal-img');
        const modalUserName = modal.querySelector("#modalUserName")
        const modalHandle = modal.querySelector("#modalUserHandle")
        const modalPostImg = modal.querySelector('#modalImageSrc');
        const modalTitle = modal.querySelector('#modalTitle');
        const modalBody = modal.querySelector('#modalBody');
        const commentCountModal = modal.querySelector("#commentCount");
        const commentForm = modal.querySelector("#modalCommentForm");
        const commentSectionModal = modal.querySelector("#commentSectionModal");
    
        modalProfileImg.src = element.author?.avatar ?? "./img/avatar.jpg";
        modalUserName.textContent = element.author?.name
        modalHandle.textContent = "@ "+ element.author?.name
        modalPostImg.src = element.media;
        modalTitle.textContent = element.title;
        modalBody.textContent = element.body;
        commentCountModal.textContent = element._count.comments;
        commentSectionModal.textContent = '';
  
        appendCommentsToModal(element.comments, commentSectionModal);
        if (commentForm.localSubmitHandler) {
          commentForm.removeEventListener("submit", commentForm.localSubmitHandler);
      }
      commentForm.localSubmitHandler = (e) => submitHandler(e, element, spanComment, commentCountModal, commentSectionModal);
  
      
        commentForm.addEventListener("submit", commentForm.localSubmitHandler);
      
    });
    //commentIcon
    const iComment = document.createElement("i");
    iComment.className = "fas fa-comment";

    //commentCount
    const spanComment = document.createElement("span");
    spanComment.textContent = element._count.comments;

    //extraFuncs if you are the author    
    const specialFunctions = document.createElement("div")
    specialFunctions.className="user-buttons"

    if (userName === element.author?.name) {

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "deletePostBtn"

      const iTrash = document.createElement("i");
      iTrash.className = "fas fa-trash";
      deleteBtn.append(iTrash);
      specialFunctions.append(deleteBtn)

      deleteBtn.addEventListener("click", async function () {
        const response = await deletePost(baseURL, element.id, token);
        if (response && response.ok) {
          card.remove();
        }
      });

    }

    if (userName === element.author.name) {
      const btnEdit = document.createElement("button");
      btnEdit.className = "edit-post-btn";
      btnEdit.textContent = "Edit"

      btnEdit.setAttribute("data-post-id", element.id);
      confirmEdit.setAttribute("data-post-id", element.id);

      // Listener to handle post editing
      btnEdit.addEventListener("click", function () {
        document.getElementById("editTitle").value = element.title;
        document.getElementById("editBody").value = element.body;

        var modal = new bootstrap.Modal(
          document.getElementById("editPostModal")
        );
        modal.show();
      });
      specialFunctions.append(btnEdit);
    }
    //everyone gets a appending :s
    likeBtn.append(iLike,spanLike)
    commentButton.append(iComment,spanComment);

    userInfo.append(cardName,userHandle)
    cardBodyContent.append(cardTitle,cardContentPost)

    reactionContainer.append(likeBtn, commentButton)
    cardBodyContainer.append(cardBodyContent)
    cardHeader.append(cardProfileImage,userInfo,timeStampCreated,specialFunctions)

    //append the containers
    card.append(cardHeader,cardBodyContainer,postImgContainer,reactionContainer)

    container.appendChild(card);
  });
}
