import timeStamp from "../utils/helpers/timeStamp.js";
import postComment from "../utils/helpers/postComment.js";
import reactToPosts from "../utils/helpers/reactToPosts.js";
import deletePost from "../utils/helpers/deletePost.js";
import editPost from "../utils/helpers/editPost.js";
import getProfile from "../utils/helpers/getProfile.js";
import follow from "../utils/helpers/follow.js";

const feedContainer = document.querySelector("#feed-container");
const confirmEditBtn = document.querySelector("#confirmEdit");
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
async function getPosts(headerOptions) {
  try {
    const response = await fetch(
      `${baseURL}/social/posts?_author=true&_comments=true&_reactions=true`,
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

confirmEditBtn.addEventListener("click", async function (event) {
  const postId = event.currentTarget.getAttribute("data-post-id");
  let modal = bootstrap.Modal.getInstance(
    document.querySelector("#editPostModal")
  );
  let updatedTitle = document.querySelector("#editTitle").value;
  let updatedBody = document.querySelector("#editBody").value;

  const response = await editPost(
    baseURL,
    postId,
    updatedTitle,
    updatedBody,
    token
  );

  if (response.updated > response.created) {
    const postCard = document.getElementById(postId);
    const titleElement = postCard.querySelector("span");
    const bodyElement = postCard.querySelector(".card-text");

    titleElement.textContent = updatedTitle;
    bodyElement.textContent = updatedBody;
    updatedTitle = "";
    updatedBody = "";
    modal.hide();
  }
});

generatePage();

//userModal from hell
async function userModal(element) {
  const userBio = await getProfile(baseURL, element.author?.name, options);
  console.log(userBio);
  const modal = new bootstrap.Modal(
    document.getElementById("userProfileModal")
  );

  const modalHeaderImg = document.getElementById("modalHeaderImg");
  const modalProfileImg = document.getElementById("modalProfileImg");
  const userBioModalName = document.getElementById("userBioModalName");
  const followingCount = document.getElementById("followingCount");
  const followersCount = document.getElementById("followingCount");
  const followModalButton = document.getElementById("followModalButton");

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

function generateProfileCards(data, container, userProfile) {
  // this is a big drawback for using vanilla js to create medium-large webapps, it will be much easier working with html and js when you start with frameworks so dont get scared by this horrible long document.create
  data.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card mb-3 w-100 p-2";
    card.id = element.id;

    const row = document.createElement("div");
    row.className = "row g-0";

    const colImage = document.createElement("div");
    colImage.className = "col-md-auto py-2 pl-3";
    const userImg = document.createElement("img");
    userImg.src = element.author?.avatar ?? "../../img/lion2.jpg";
    userImg.className = "rounded-circle img-fluid";
    userImg.style =
      "width: 50px; height: 50px; display: block; cursor:pointer;";
    colImage.appendChild(userImg);

    const colContent = document.createElement("div");
    colContent.className = "col-md-10";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Username and Timestamp
    const usernameAndTimeDiv = document.createElement("div");
    usernameAndTimeDiv.className =
      "d-flex justify-content-start align-items-center mb-2";

    const usernameSpan = document.createElement("h6");
    usernameSpan.textContent =
      element.author?.name.charAt(0).toUpperCase() +
      element.author?.name.slice(1);
    usernameSpan.className = "font-weight-bold mr-2";
    usernameSpan.style.marginRight = "auto";
    usernameSpan.style.cursor = "pointer";
    const smallTime = document.createElement("small");
    smallTime.className = "text-muted";
    smallTime.textContent = timeStamp(element.created);
    smallTime.style.marginRight = "10px";
    usernameAndTimeDiv.appendChild(usernameSpan);
    usernameAndTimeDiv.appendChild(smallTime);

    colImage.addEventListener("click", () => {
      userModal(element);
    });
    usernameSpan.addEventListener("click", () => {
      userModal(element);
    });

    //deleteButtonPost

    if (userName === element.author?.name) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className =
        "btn btn-link btn-sm text-muted ml-auto delete-post-btn";
      const iTrash = document.createElement("i");
      iTrash.className = "fas fa-trash";
      deleteBtn.appendChild(iTrash);
      usernameAndTimeDiv.appendChild(deleteBtn);

      // Optionally, you can add an event listener to the delete button to perform an action.
      deleteBtn.addEventListener("click", async function () {
        const response = await deletePost(baseURL, element.id, token);
        if (response && response.ok) {
          card.remove();
        }
      });
    }

    cardBody.appendChild(usernameAndTimeDiv);

    // Post Title
    const pTitle = document.createElement("p");
    pTitle.className = " d-flex justify-content-between";
    const spanTitle = document.createElement("span");
    spanTitle.textContent = element.title;
    pTitle.appendChild(spanTitle);
    cardBody.appendChild(pTitle);

    // Post Body
    const p = document.createElement("p");
    p.className = "card-text ";
    p.textContent = element.body;

    if (element.media) {
      const mediaWrapper = document.createElement("div");
      mediaWrapper.className = "w-100";

      const postMedia = document.createElement("img");
      postMedia.src = element.media ?? "";
      postMedia.className = "rounded img-fluid";

      mediaWrapper.appendChild(postMedia);
      cardBody.appendChild(mediaWrapper);
    }
    cardBody.append(p);

    //more buttons
    const btnGroup = document.createElement("div");
    btnGroup.className = "d-flex";

    const btnComment = document.createElement("button");
    btnComment.className = "btn btn-link btn-sm text-muted";
    const iComment = document.createElement("i");
    iComment.className = "fas fa-comment";
    btnComment.appendChild(iComment);
    const spanComment = document.createElement("span");
    spanComment.id = "commentCount";
    spanComment.textContent = element._count.comments;
    btnComment.appendChild(spanComment);

    const btnLike = document.createElement("button");
    btnLike.className = "btn btn-link btn-sm text-muted";
    const iLike = document.createElement("i");
    iLike.className = "fas fa-heart text-danger";
    btnLike.appendChild(iLike);

    const spanLike = document.createElement("span");
    spanLike.id = `likeCount${element.id}`;

    const thumbReaction = element?.reactions?.find(
      (reaction) => reaction.symbol === "👍"
    );
    const count = thumbReaction?.count;

    spanLike.textContent = count;

    btnLike.appendChild(spanLike);

    //edit btn
    if (userName === element.author.name) {
      const btnEdit = document.createElement("button");
      btnEdit.className = "btn btn-link btn-sm text-muted";
      const iEdit = document.createElement("i");
      iEdit.className = "fas fa-edit"; // Font Awesome icon for edit
      btnEdit.appendChild(iEdit);
      const spanEdit = document.createElement("span");
      spanEdit.textContent = " Edit";
      btnEdit.setAttribute("data-post-id", element.id);
      confirmEditBtn.setAttribute("data-post-id", element.id);
      btnEdit.appendChild(spanEdit);

      // Add an event listener to handle post editing
      btnEdit.addEventListener("click", function () {
        document.getElementById("editTitle").value = element.title;
        document.getElementById("editBody").value = element.body;

        var modal = new bootstrap.Modal(
          document.getElementById("editPostModal")
        );
        modal.show();
      });
      btnGroup.appendChild(btnEdit);
    }

    //likeButton eventListener
    btnLike.addEventListener("click", (e) => {
      reactToPosts(baseURL, element.id, token, spanLike);
      console.log(element);
    });

    btnGroup.appendChild(btnComment);
    btnGroup.appendChild(btnLike);

    cardBody.appendChild(btnGroup);

    colContent.appendChild(cardBody);

    row.appendChild(colImage);
    row.appendChild(colContent);

    card.appendChild(row);

    //commentSection
    const commentCollapse = document.createElement("div");
    commentCollapse.className = "collapse mt-3";
    commentCollapse.id = `commentCollapse${element.id}`;

    // Create the form
    const commentForm = document.createElement("form");

    const commentInput = document.createElement("input");
    commentInput.className = "form-control";
    commentInput.type = "text";
    commentInput.placeholder = "Write a reply...";
    commentForm.appendChild(commentInput); // Append to form instead

    // Add a hidden submit button. This allows users to press Enter to submit.
    const hiddenSubmitButton = document.createElement("button");
    hiddenSubmitButton.style.display = "none";
    commentForm.appendChild(hiddenSubmitButton);

    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const commentText = commentInput.value;
      if (commentText) {
        postComment(
          baseURL,
          element.id,
          commentText,
          token,
          spanComment,
          element
        );

        commentInput.value = "";
      }
    });
    commentCollapse.appendChild(commentForm);

    // Modify btnComment to control the collapse of comment section
    btnComment.setAttribute("data-bs-toggle", "collapse");
    btnComment.setAttribute("data-bs-target", `#commentCollapse${element.id}`);
    btnComment.setAttribute("aria-expanded", "false");
    btnComment.setAttribute("aria-controls", `commentCollapse${element.id}`);

    cardBody.appendChild(commentCollapse);

    //commentSectionPanel to store comments..

    const commentsPanel = document.createElement("div");
    commentsPanel.className = "comments-panel border-top mt-2";
    commentsPanel.style.display = "none"; // Initially hide the panel

    element.comments.forEach((comment) => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment py-2 d-flex gap-2 align-items-center"; // Make it a flex container

      const commentUser = document.createElement("strong");
      commentUser.textContent = comment.author.name + ": ";
      commentDiv.appendChild(commentUser);

      const commentText = document.createElement("span");
      commentText.textContent = comment.body;
      commentDiv.appendChild(commentText);

      commentsPanel.appendChild(commentDiv);
    });
    cardBody.appendChild(commentsPanel);

    btnComment.addEventListener("click", function () {
      if (commentsPanel.style.display === "none") {
        commentsPanel.style.display = "block";
      } else {
        commentsPanel.style.display = "none";
      }
    });

    container.appendChild(card);
  });
}

