/**
 * Filters and displays posts based on the specified criteria.
 *
 * @param {string} criteria - The filtering criteria, such as 'all', 'lastThreeDays', 'today', 'withImages', 'withoutImages', 'withComments', 'withoutComments'.
 * @param {Element} feedContainer - The container where the filtered posts will be displayed.
 * @param {Function} generateProfileCards - A function to generate and display profile cards.
 * @param {Function} getPosts - A function to fetch posts.
 * @param {Object} options - Options for fetching posts, including the authorization token.
 * @param {string} userName - The name of the user.
 */
export default function filterPosts(criteria, feedContainer, generateProfileCards,getPosts,options,userName) {
    getPosts(options).then(data => {
        let filteredData;
        switch (criteria) {
            case 'all':
                filteredData = data;
                break;
            case 'lastThreeDays':
                const [startThreeDays, endThreeDays] = getStartAndEndDatesForLastThreeDays();
                filteredData = data.filter(post => {
                    const postDate = new Date(post.created);
                    return postDate >= startThreeDays && postDate <= endThreeDays;
                });
                break;
            case 'today':
                const [startToday, endToday] = getStartAndEndDatesForToday();
                filteredData = data.filter(post => {
                    const postDate = new Date(post.created);
                    return postDate >= startToday && postDate <= endToday;
                });
                break;
            case 'withImages':
                filteredData = data.filter(post => post.media);
                break;
            case 'withoutImages':
                filteredData = data.filter(post => !post.media);
                break;
            case 'withComments':
                filteredData = data.filter(post => post._count.comments > 0);
                break;
            case 'withoutComments':
                filteredData = data.filter(post => post._count.comments === 0);
                break;
            default:
                filteredData = data;
        }
  
        // Clear the existing posts from the container before displaying filtered results
        feedContainer.innerText = '';
  
        generateProfileCards(filteredData, feedContainer, userName);
    });
  }


/**
 * Gets the start and end dates for the last three days.
 *
 * @returns {Array} An array with two Date objects: the start date and end date for the last three days.
 */
   function getStartAndEndDatesForLastThreeDays() {
    const now = new Date();
    
    // Three days ago (from today) at midnight
    const startOfThreeDaysAgo = new Date(now);
    startOfThreeDaysAgo.setDate(now.getDate() - 3);
    startOfThreeDaysAgo.setHours(0, 0, 0, 0);
    
    // End of today (23:59:59.999)
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    
    return [startOfThreeDaysAgo, endOfToday];
}

/**
 * Gets the start and end dates for today.
 *
 * @returns {Array} An array with two Date objects: the start date and end date for today.
 */
 function getStartAndEndDatesForToday() {
    const now = new Date();
    
    // Start of today (midnight)
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    
    // End of today (23:59:59.999)
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    
    return [startOfToday, endOfToday];
}