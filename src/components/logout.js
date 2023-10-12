//function that handles logout, will take you  to loginPage and remove localStorageItems
// have not applied clickhandles to use this function yet, will do so after the headers are the same for every page : ) 
/** @type {Element} */
const logOut = document.querySelector("#logOut")
/**
 * Function that handles user logout.
 *
 * This function removes specific items from local storage and redirects the user to the login page.
 */
function logout(){
    /** 
    * Remove the user's bearer token from local storage.
    */
    localStorage.removeItem('bearerToken');
    /** 
    * Remove the user's name from local storage.
    */
    localStorage.removeItem('name');
    /** 
    * Redirect the user to the login page (index.html).
    */
    window.location.href = "../src/index.html";

}

/**
 * Event listener for the "logOut" button click.
 *
 * When the "logOut" button is clicked, it triggers the logout function.
 */
logOut.addEventListener("click",logout)
console.log(logOut)