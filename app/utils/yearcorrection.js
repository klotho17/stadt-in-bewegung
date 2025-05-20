// function to correct all years to YYYY format, 
// convert to integer and account for objects with several years

// Example: "1981-08-18/1983-05-01" or ["1981-08-18", "1983-05-01"]
export function yearCorrection(yearInput) {
    if (!yearInput) return [0];

    // Case: array of objects with normalizedDateValue
    if (Array.isArray(yearInput) && yearInput.length && typeof yearInput[0] === "object" && yearInput[0].normalizedDateValue) {
        return yearInput.map(obj => {
            const match = String(obj.normalizedDateValue).match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        });
    }

    // Case: single object with normalizedDateValue
    if (typeof yearInput === "object" && yearInput.normalizedDateValue) {
        const match = String(yearInput.normalizedDateValue).match(/\d{4}/);
        return match ? [parseInt(match[0], 10)] : [0];
    }

    // Case: array of strings
    if (Array.isArray(yearInput)) {
        return yearInput.map(str => {
            const match = String(str).match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        });
    }

    // Case: string with slash
    if (typeof yearInput === "string" && yearInput.includes("/")) {
        return yearInput.split("/").map(str => {
            const match = str.match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        });
    }

    // Case: single string or number
    const match = String(yearInput).match(/\d{4}/);
    return match ? [parseInt(match[0], 10)] : [0];
}