/**
 * Searches for posts that match the given query string and displays the filtered results.
 *
 * @param {string} query - The search query string to match against post author names, titles, and bodies.
 * @param {Function} getPosts - A function that fetches all posts based on specified options.
 * @param {object} options - Options for retrieving posts (e.g., filtering criteria).
 * @param {HTMLElement} feedContainer - The HTML container where the filtered posts will be displayed.
 * @param {Function} generateProfileCards - A function for generating and displaying profile cards for the filtered posts.
 */
export default function searchPosts(query,getPosts,options,feedContainer,generateProfileCards) {
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
  