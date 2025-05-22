// function to correct all years to YYYY format, 
// convert to integer and account for objects with several years

export function yearCorrection(yearInput) {
    if (!yearInput) return [0];

    let years = [];

    // Case: array of objects with normalizedDateValue
    if (Array.isArray(yearInput) && yearInput.length && typeof yearInput[0] === "object" && yearInput[0].normalizedDateValue) {
        years = yearInput.map(obj => {
            const match = String(obj.normalizedDateValue).match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        });
    }
    // Case: single object with normalizedDateValue
    else if (typeof yearInput === "object" && yearInput.normalizedDateValue) {
        const match = String(yearInput.normalizedDateValue).match(/\d{4}/);
        years = match ? [parseInt(match[0], 10)] : [0];
    }
    // Case: array of strings
    else if (Array.isArray(yearInput)) {
        years = yearInput.map(str => {
            const match = String(str).match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        });
    }
    // Case: string with slash
    else if (typeof yearInput === "string" && yearInput.includes("/")) {
        years = yearInput.split("/").map(str => {
            const match = str.match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        });
    }
    // Case: single string or number
    else {
        const match = String(yearInput).match(/\d{4}/);
        years = match ? [parseInt(match[0], 10)] : [0];
    }

    // Sort years from smallest to largest, filter out 0s
    years = years.filter(y => y > 0).sort((a, b) => a - b);
    return years.length > 0 ? years : [0];
}



/* 
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
} */