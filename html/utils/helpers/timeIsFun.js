export function getStartAndEndDatesForLastThreeDays() {
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

export function getStartAndEndDatesForToday() {
    const now = new Date();
    
    // Start of today (midnight)
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    
    // End of today (23:59:59.999)
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    
    return [startOfToday, endOfToday];
}