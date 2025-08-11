export const baseURL = "https://www.bild-video-ton.ch/ansicht/media/Sozarch_Vid_V_";
//f.ex. https://www.bild-video-ton.ch/ansicht/media/Sozarch_Vid_V_001.mp4

// composing URLs with the fileNumber to embed the videos 
export async function fetchVideo(id) {

    // for custom items return placeholder
    if (!id.startsWith("mbr")) {
        return null;
        }

    // extract short fileNumber for Video and Image URL
    const fileNumber = id.replace(/^.*Sozarch_Vid_V_/, "");
    console.log("File Number:", fileNumber);

    const mp4URL = `${baseURL}${fileNumber}.mp4`;
    const m4vURL = `${baseURL}${fileNumber}.m4v`;
    
try {
        // try fetching the .mp4 URL first
        const response = await fetch(mp4URL, { method: 'HEAD' });
        if (response.ok) {
            return mp4URL; // return the .mp4 URL if it exists
        }
    } catch (error) {
        console.warn(`Error fetching .mp4 for file ${fileNumber}: ${error.message}`);
    }

    try {
        // try fetching the .m4v URL as a fallback
        const response = await fetch(m4vURL, { method: 'HEAD' });
        if (response.ok) {
            return m4vURL; // return the .m4v URL if it exists
        }
    } catch (error) {
        console.error(`Error fetching .m4v for file ${fileNumber}: ${error.message}`);
    } 

    // placeholder image is inserted if neither .mp4 nor .m4v is available
    return null;
}
