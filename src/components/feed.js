/**
 * Import module for getting the timestamp.
 * @module timeStamp
 */
import timeStamp from "../utils/timeStamp.js";
/**
 * Import module for posting comments.
 * @module postComment
 */
import postComment from "../utils/postComment.js";
/**
 * Import module for reacting to posts.
 * @module reactToPosts
 */
import reactToPosts from "../utils/reactToPosts.js";
/**
 * Import module for deleting posts.
 * @module deletePost
 */
import deletePost from "../utils/deletePost.js";
/**
 * Import module for editing posts.
 * @module editPost
 */
import editPost from "../utils/editPost.js";
/**
 * Import module for getting user profiles.
 * @module getProfile
 */
import getProfile from "../utils/getProfile.js";
/**
 * Import module for following other users.
 * @module follow
 */
import follow from "../utils/follow.js";
/**
 * Import module for creating posts.
 * @module createPosts
 */
import createPost from "../utils/createPosts.js";
/**
 * Import module for filtering posts.
 * @module filterPost
 */
import filterPosts from "../utils/filterPost.js";
/**
 * Import module for searching posts.
 * @module search
 */
import searchPosts from "../utils/search.js";
/** @type {string} */
let token;
/** @type {string} */
const baseURL = "https://api.noroff.dev/api/v1";
/** @type {string} */
let userName;
token = localStorage.getItem("bearerToken", token);

userName = localStorage.getItem("name", userName);
/** @type {RequestInit} */
const options = {
  method: "GET",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

/** @type {string[]} */
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
/** @type {Element[]} */
const querySelectors = cssSelectors.map(value => document.querySelector(value))
/** @type {Element[]} */
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

/**
 * Fetch posts using the provided header options.
 *
 * @param {RequestInit} headerOptions - Request headers and options.
 * @returns {Promise<any>} - A promise that resolves to the retrieved posts.
 */
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

/**
 * Generates the page by fetching posts and displaying them in the feed container.
 */
async function generatePage() {
  const data = await getPosts(options);
  if (data) {
    generateProfileCards(data, feedContainer, userName);
  }
}

/**
 * Displays a snackbar notification.
 */
function showSnackbar() {
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  setTimeout(() => {
      snackbar.className = snackbar.className.replace("show", "");
  }, 3000); // This will hide the snackbar after 3 seconds
}

/**
 * Event listener for form submission when creating a post.
 *
 * @param {Event} e - The form submission event.
 * @returns {Promise<any>} - A promise that resolves to the response from creating the post.
 */
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

/**
 * Event listener for editing a post.
 *
 * @param {Event} event - The click event on the edit button.
 */

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
/**
 * Opens a user profile modal.
 *
 * @param {object} element - The post element.
 */
async function userModal(element) {
  const userBio = await getProfile(baseURL, element.author?.name, options);
  const modal = new bootstrap.Modal(
    document.getElementById("userProfileModal")
  );


  followModalButton.textContent = "Follow";
  followModalButton.disabled = false;

  modalHeaderImg.src = element.author?.header ?? "./img/avatar.jpg" ;
  modalProfileImg.src = element.author?.avatar ?? "./img/avatar.jpg" ;
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
/**
 * Event listener for handling the "Follow" button click.
 *
 * @param {string} authorName - The name of the author to follow.
 * @returns {function} - A function to handle the "Follow" button click event.
 */
function handleFollowButtonClick(authorName) {
  return function (event) {
    follow(baseURL, authorName, token, event.currentTarget);
  };
}
// will be moved to utilsFolder
/**
 * Event listener for submitting a comment form.
 *
 * @param {Event} e - The form submission event.
 * @param {object} element - The post element.
 * @param {HTMLElement} spanComment - The span for comment count.
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
// will be moved to utilsFolder
/**
 * Appends comments to the comment section in the modal.
 * @param {object[]} comments - An array of comment objects.
 * @param {HTMLElement} commentSectionModal - The element representing the comment section in the modal.
 */
function appendCommentsToModal(comments, commentSectionModal) {
  comments.forEach(comment => {
      const [author, commentElem] = createCommentElement(comment);
      commentSectionModal.append(author, commentElem);
  });
}
// will be moved to utilsFolder
/**
 * Creates a comment element for display in the modal.
 * @param {object} comment - The comment object.
 * @returns {Array<HTMLElement>} An array containing the author and comment elements.
 */
function createCommentElement(comment) {
  const commentElem = document.createElement("p");
  const authorElem = document.createElement("h6");

  commentElem.textContent = comment.body;
  authorElem.textContent = comment.owner + ":";

  return [authorElem, commentElem];
}

//search
// Event listener for the search input
document.getElementById("searchInput").addEventListener("input", function() {
  /**
   * Handles input changes in the search input field and triggers a search.
   * @param {Event} event - The input change event.
   */
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  searchPosts(searchValue,getPosts,options,feedContainer,generateProfileCards);
});

//filter
// Event listener for the filter select
document.getElementById("filterSelect").addEventListener("change", function() {
  /**
   * Handles changes in the filter selection and applies the selected filter.
   * @param {Event} event - The change event of the filter selection.
   */
  const filterValue = this.value;
  filterPosts(filterValue,feedContainer,generateProfileCards,getPosts,options,userName);
});




/**
 * Generates profile cards for the posts and appends them to the container.
 *
 * @param {object[]} data - An array of post data.
 * @param {HTMLElement} container - The container element to which profile cards will be appended.
 */
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
    cardProfileImage.src= element.author?.avatar ?? "./img/avatar.jpg";

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

generatePage();
