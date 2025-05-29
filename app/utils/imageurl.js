// constructing URLs for the images from bild-video-ton.ch
// bps for thumbnail https://www.bild-video-ton.ch/publish/videostills/Sozarch_Vid_V_001.jpg

export const baseURL = "https://www.bild-video-ton.ch/publish/videostills/Sozarch_Vid_V_";
//import MissingVideoImage from "../components/MissingVideoImage";

// fetching data from the composed URLs
// give fileNumber as parameter
// add MissingVideoImage as a placeholder for missing files in page return
// ...ad cache for the video files
export async function fetchImage(id) {
    
    // for custom items return placeholder
        if (!id.startsWith("mbr")) {
            return null;
            }
    
    //extract short fileNumber for Video and Image URL
    const fileNumber = id.replace(/^.*Sozarch_Vid_V_/, "");
    console.log("File Number:", fileNumber);

    const jpgURL = `${baseURL}${fileNumber}.jpg`;
    //const m4vURL = `${baseURL}${fileNumber}.m4v`;

    try {
        // Try fetching the .jpg URL first
        const response = await fetch(jpgURL, { method: 'HEAD' });
        if (response.ok) {
            return jpgURL; // Return the URL if it exists
        }
    } catch (error) {
        console.warn(`Error fetching .jpg for file ${fileNumber}: ${error.message}`);
    }

    return null;
}
