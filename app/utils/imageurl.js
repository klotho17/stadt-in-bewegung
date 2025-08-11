export const baseURL = "https://www.bild-video-ton.ch/publish/videostills/Sozarch_Vid_V_";
// ex. thumbnail https://www.bild-video-ton.ch/publish/videostills/Sozarch_Vid_V_001.jpg

// constructing URLs for the images from bild-video-ton.ch
// fetching data from the composed URLs
// give fileNumber as parameter
export async function fetchImage(id) {
    
    // for custom items return placeholder
        if (!id.startsWith("mbr")) {
            return "MISSING";
            }
    
    //extract short fileNumber for Video and Image URL
    const fileNumber = id.replace(/^.*Sozarch_Vid_V_/, "");
    console.log("File Number:", fileNumber);

    const jpgURL = `${baseURL}${fileNumber}.jpg`;

    try {
        // Try fetching the .jpg URL first
        const response = await fetch(jpgURL, { method: 'HEAD' });
        if (response.ok) {
            return jpgURL; // Return the URL if it exists
        }
    } catch (error) {
        console.warn(`Error fetching .jpg for file ${fileNumber}: ${error.message}`);
    }
    
    return "MISSING";
}
