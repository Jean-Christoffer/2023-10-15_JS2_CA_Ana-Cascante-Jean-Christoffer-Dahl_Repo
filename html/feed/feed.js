import timeStamp from "../utils/helpers/timeStamp.js";
import postComment from "../utils/helpers/postComment.js";
import reactToPosts from "../utils/helpers/reactToPosts.js";
import deletePost from "../utils/helpers/deletePost.js";
import editPost from "../utils/helpers/editPost.js";
import getProfile from "../utils/helpers/getProfile.js";
import follow from "../utils/helpers/follow.js";
import createPost from "../utils/helpers/createPosts.js";

let token;
const baseURL = "https://api.noroff.dev/api/v1";
let userName;
token = localStorage.getItem("bearerToken", token);

userName = localStorage.getItem("name", userName);
const options = {
  method: "GET",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};




const cssSelectors =
[
"#feed-container",
"#confirmEdit",
"#modalHeaderImg",
"#modalProfileImg",
"#userBioModalName",
"#followingCount",
"#followersCount",
"#followModalButton",
"#createPostForm"

]
const querySelectors = cssSelectors.map(value => document.querySelector(value))
const
[
 feedContainer,
 confirmEdit,
 modalHeaderImg,
 modalProfileImg,
 userBioModalName,
 followingCount,
 followersCount,
 followModalButton,
 createPostForm
 

] = querySelectors

async function getPosts(headerOptions) {
  try {
    const response = await fetch(
      `${baseURL}/social/posts?_author=true&_comments=true&_reactions=true&limit=100`,
      headerOptions
    );
    const posts = await response.json();

    return posts;
  } catch (err) {
    console.log(err);
  }
}

async function generatePage() {
  const data = await getPosts(options);
  if (data) {
    generateProfileCards(data, feedContainer, userName);
  }
}

function showSnackbar() {
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  setTimeout(() => {
      snackbar.className = snackbar.className.replace("show", "");
  }, 3000); // This will hide the snackbar after 3 seconds
}
createPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const formObject = {};

  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
}

  const response = await createPost(`${baseURL}`, token, formObject);

  if(response.id) { 
    showSnackbar();
    e.target.reset();
}
 return response
});


confirmEdit.addEventListener('click', async function(event) {

  const postId = event.currentTarget.getAttribute('data-post-id');
  let modal = bootstrap.Modal.getInstance(document.querySelector('#editPostModal'));
  let updatedTitle = document.querySelector('#editTitle').value;
  let updatedBody = document.querySelector('#editBody').value;

  const response = await editPost(baseURL,postId,updatedTitle,updatedBody, token);

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



//userModal from hell
async function userModal(element) {
  const userBio = await getProfile(baseURL, element.author?.name, options);
  const modal = new bootstrap.Modal(
    document.getElementById("userProfileModal")
  );


  followModalButton.textContent = "Follow";
  followModalButton.disabled = false;

  modalHeaderImg.src = element.author?.header ?? "/img/lion2.jpg";
  modalProfileImg.src = element.author?.avatar ?? "/img/lion2.jpg";
  userBioModalName.textContent = `@${element.author?.name}`;
  followingCount.textContent = userBio.following.length;
  followersCount.textContent = userBio.followers.length;

  modal.show();

  const followClickListener = handleFollowButtonClick(element.author?.name);

  followModalButton.addEventListener("click", followClickListener);

  modal._element.addEventListener("hidden.bs.modal", function () {
    followModalButton.removeEventListener("click", followClickListener);
  });
}
function handleFollowButtonClick(authorName) {
  return function (event) {
    follow(baseURL, authorName, token, event.currentTarget);
  };
}
// will be moved to utilsFolder
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
// will be moved to utilsFolder
function appendCommentsToModal(comments, commentSectionModal) {
  comments.forEach(comment => {
      const [author, commentElem] = createCommentElement(comment);
      commentSectionModal.append(author, commentElem);
  });
}
// will be moved to utilsFolder
function createCommentElement(comment) {
  const commentElem = document.createElement("p");
  const authorElem = document.createElement("h6");

  commentElem.textContent = comment.body;
  authorElem.textContent = comment.owner + ":";

  return [authorElem, commentElem];
}


document.getElementById("searchInput").addEventListener("input", function() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  searchPosts(searchValue);
});
function searchPosts(query) {
  getPosts(options).then(data => {
      const filteredData = data.filter(post => 
          post.author?.name.toLowerCase().includes(query) ||
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );

      // Clear the existing posts from the container before displaying filtered results
      feedContainer.textContent = '';

      generateProfileCards(filteredData, feedContainer);
  });
}

function generateProfileCards(data, container) {
  
  data.forEach((element) => {
    //cardContainer
    const card = document.createElement("div");
    card.className = "card";
    card.id = element.id;

    //container for card header
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
     //eventListeners for header
     if(userName !== element.author?.name){
      cardHeader.addEventListener("click", () => {
        userModal(element);
      });
      
  
     }

    //authorAvatar
    const cardProfileImage = document.createElement("img")
    cardProfileImage.className = "card-profile-img"
    cardProfileImage.src= element.author?.avatar ?? "../../img/lion2.jpg";

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
  
      modalProfileImg.src = element.author?.avatar ?? "../../img/lion2.jpg";
      modalUserName.textContent = element.author?.name
      modalHandle.textContent = "@ "+ element.author?.name
      modalPostImg.src = element.media ?? "../../img/lion2.jpg";
      modalTitle.textContent = element.title;
      modalBody.textContent = element.body;
      commentCountModal.textContent = element._count.comments;
      commentSectionModal.textContent = '';

      appendCommentsToModal(element.comments, commentSectionModal);
  
      commentForm.removeEventListener("submit", (e) => handleFormSubmit(e, element,spanComment,commentCountModal,commentSectionModal));
      commentForm.addEventListener("submit", (e) => handleFormSubmit(e, element, spanComment, commentCountModal, commentSectionModal));
    
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

generatePage();