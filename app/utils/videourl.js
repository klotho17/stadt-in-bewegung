// constructing URLs for the videos from bild und ton
//bsp https://www.bild-video-ton.ch/ansicht/media/Sozarch_Vid_V_001.mp4
// bps for thumbnail https://www.bild-video-ton.ch/publish/videostills/Sozarch_Vid_V_001.jpg

export const baseURL = "https://www.bild-video-ton.ch/ansicht/media/Sozarch_Vid_V_";

// fetching data from the composed URLs
// give fileNumber as parameter in ...
// Missing files don't have a video file
// ...ad cache for the video files
export async function fetchVideo(fileNumber) {
    const mp4URL = `${baseURL}${fileNumber}.mp4`;
    const m4vURL = `${baseURL}${fileNumber}.m4v`;
    const placeholderImage = "https://upload.wikimedia.org/wikipedia/commons/c/c7/ISO_7010_P029.svg"; 

    try {
        // Try fetching the .mp4 URL first
        const response = await fetch(mp4URL, { method: 'HEAD' });
        if (response.ok) {
            return mp4URL; // Return the .mp4 URL if it exists
        }
    } catch (error) {
        // Log only unexpected errors
        console.warn(`Unexpected error fetching .mp4 for file ${fileNumber}: ${error.message}`);
    }

    try {
        // Try fetching the .m4v URL as a fallback
        const response = await fetch(m4vURL, { method: 'HEAD' });
        if (response.ok) {
            return m4vURL; // Return the .m4v URL if it exists
        }
    } catch (fallbackError) {
        // Log only unexpected errors
        console.error(`Unexpected error fetching .m4v for file ${fileNumber}: ${fallbackError.message}`);
    }

    // Return the placeholder image if neither .mp4 nor .m4v is available
    return placeholderImage;
}
