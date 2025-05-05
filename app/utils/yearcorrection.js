// function to correct all years to YYYY format and converto to integer
export const yearCorrection = (dataArray) => {
    dataArray.forEach(item => {
        if (item && item.year) {
            const yearMatch = item.year.match(/\d{4}/); // Extract the year in YYYY format
            item.year = yearMatch ? parseInt(yearMatch[0], 10) : null; // Convert to integer or set to null
        }
    });
};