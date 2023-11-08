// logout.js

/**
 * Function that handles user logout.
 *
 * This function removes specific items from local storage and redirects the user to the login page.
 */
export default function logout() {
  /**
   * Remove the user's bearer token from local storage.
   */
  localStorage.removeItem("bearerToken");
  /**
   * Remove the user's name from local storage.
   */
  localStorage.removeItem("name");
  /**
   * Redirect the user to the login page (index.html).
   */
  window.location.href = "./index.html";
}

/** @type {Element | null} */
const logOut = document.querySelector("#logOut");

/**
 * Event listener for the "logOut" button click.
 *
 * When the "logOut" button is clicked, it triggers the logout function.
 */
if (logOut) {
  logOut.addEventListener("click", logout);
}
