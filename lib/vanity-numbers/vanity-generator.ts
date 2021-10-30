import { T9Search } from "t9-plus";
import { words } from "./words";

const t9 = new T9Search();
t9.setDict(words);

/**
 * Some numbers have limited options (e.g 01100111000) so we may not always get the desired count
 */
export const generateVanityNumbers = (phoneNumber: string, desiredCount: number) => {
    // last 6 are the ones to make vanity section out of
    const lastDigits = phoneNumber.substr(phoneNumber.length - 6);
    const startDigits = phoneNumber.substr(0, phoneNumber.length - 6);

    return getVanityNumbers(lastDigits, desiredCount).map((vanityNumber) => startDigits + vanityNumber);
};

/**
 * The algorithm looks for words that start with the letter options from the passed in words.
 * Shorter words are preferred as this will give more (or all) of the word in the vanity number which should be more recognisable
 * If the desired number of words are not found then a number is removed from the start and the process is repeated
 * The results from the shorter number are then combined with a random letter corresponding to the removed letter from the start
 * This process is repeated until the desired number of options is obtained, or we cannot find enough matches
 */
const getVanityNumbers = (numbers: string, desiredCount: number) => {
    // strip 0 and 1 as they have no letter options
    const searchNumbers = numbers.replace(/[01]/g, "");

    // Get the words that could be made with the numbers and get the shortest first
    const allPredictions = t9.predict(searchNumbers).sort((a, b) => a.length - b.length);
    const predictions: string[] = [];
    while (predictions.length < desiredCount && allPredictions.length > 0) {
        const prediction = allPredictions.shift()?.substr(0, searchNumbers.length).toUpperCase();
        if (prediction && !predictions.includes(prediction)) {
            predictions.push(prediction);
        }
    }

    // Put the 0 and 1 back in
    const vanityNumbers = predictions
        .map((prediction) => [...prediction])
        .map((prediction) =>
            [...numbers].map((number) => (["0", "1"].includes(number) ? number : prediction.shift())).join("")
        );

    // Try to find words without the first letter until we have the desired count
    if (vanityNumbers.length < desiredCount && searchNumbers.length > 1) {
        const shorterWords = getVanityNumbers(numbers.substr(1), desiredCount - vanityNumbers.length);

        const firstNumber = numbers.substr(0, 1);
        const firstNumberOptions = numberToLetters[firstNumber];
        const options = shorterWords.map(
            (word) => firstNumberOptions[Math.floor(Math.random() * firstNumberOptions.length)] + word
        );

        for (let i = 0; i < options.length && vanityNumbers.length < desiredCount; i++) {
            if (!vanityNumbers.includes(options[i])) {
                vanityNumbers.push(options[i]);
            }
        }
    }

    return vanityNumbers;
};

const numberToLetters: { [key: string]: string[] } = {
    "0": ["0"],
    "1": ["1"],
    "2": ["A", "B", "C"],
    "3": ["D", "E", "F"],
    "4": ["G", "H", "I"],
    "5": ["J", "K", "L"],
    "6": ["M", "N", "O"],
    "7": ["P", "Q", "R", "S"],
    "8": ["T", "U", "V"],
    "9": ["W", "X", "Y", "Z"],
};
