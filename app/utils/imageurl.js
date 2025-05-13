// constructing URLs for the images from bild-video-ton.ch
// bps for thumbnail https://www.bild-video-ton.ch/publish/videostills/Sozarch_Vid_V_001.jpg

export const baseURL = "https://www.bild-video-ton.ch/publish/videostills/Sozarch_Vid_V_";
import MissingVideoImage from "../components/MissingVideoImage";

// fetching data from the composed URLs
// give fileNumber as parameter
// add MissingVideoImage as a placeholder for missing files
// ...ad cache for the video files
export async function fetchImage(fileNumber) {
    const jpgURL = `${baseURL}${fileNumber}.jpg`;
    //const m4vURL = `${baseURL}${fileNumber}.m4v`;

    try {
        // Try fetching the .jpg URL first
        const response = await fetch(jpgURL, { method: 'HEAD' });
        if (response.ok) {
            return jpgURL; // Return the .mp4 URL if it exists
        }
    } catch (error) {
        console.warn(`Error fetching .jpg for file ${fileNumber}: ${error.message}`);
    }

/*     try {
        // Try fetching the .m4v URL as a fallback
        const response = await fetch(m4vURL, { method: 'HEAD' });
        if (response.ok) {
            return m4vURL; // Return the .m4v URL if it exists
        }
    } catch (error) {
        console.error(`Error fetching .m4v for file ${fileNumber}: ${error.message}`);
    } */

    // Return the placeholder image if neither .mp4 nor .m4v is available
    return MissingVideoImage;
}

// Check if a given URL is a video file.
/* export function isVideoURL(url) {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.m4v');
}
 */