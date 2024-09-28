// -------------------------------------->keyedTranspositionCipher<---------------------------------
//--------------------------------------->key = 13254<---------------------------------------------
function keyedTranspositionCipher(key, plainText) {
    const keyLength = key.toString().length;
    plainText = plainText.toUpperCase();

    // Padding with 'X' if the plain text isn't divisible by the key length
    while (plainText.length % keyLength !== 0) {
        plainText += "X";
    }

    // Create an array of chunks (each chunk is as long as the key length)
    const plainTextChunks = [];
    for (let i = 0; i < plainText.length; i += keyLength) {
        plainTextChunks.push(plainText.slice(i, i + keyLength));
    }

    // Convert key into an array of 0-based indices
    const keyList = key.toString().split('').map(digit => parseInt(digit) - 1);
    // console.log(keyList);
    
    const cipherList = [];

    // Rearrange each chunk according to the key
    for (const chunk of plainTextChunks) {
        let transposedChunk = '';
        for (let i = 0; i < keyLength; i++) {
            transposedChunk += chunk[keyList[i]];
        }
        cipherList.push(transposedChunk);
    }

    // Combine all chunks to form the final cipher text
    const cipherText = cipherList.join('');
    return cipherText;
}
////----------------------------->for testing purposes<-----------------------------------
// const key = 13254;
// const plainText = "Salma";

// const cipherText = keyedTranspositionCipher(key, plainText);
// console.log(`Cipher text: ${cipherText}`);
//------------------------------------------> monoAlphabetical Encryption <--------------------------------------
//------------------------------------------>key = 3<--------------------------------------
function monoAlphabeticalEncryption(plainText, key) {
    const letters = [];
    for (let i = 65; i <= 90; i++) {
        letters.push(String.fromCharCode(i));  // Generates a list of characters from 'A' to 'Z'
    }

    let cipherText = "";

    for (let i = 0; i < plainText.length; i++) {
        for (let j = 0; j < letters.length; j++) {
            if (plainText[i].toUpperCase() === letters[j]) {
                let cipherIndex = (j + key) % 26;
                let character = letters[cipherIndex];
                cipherText += character;
            }
        }
    }

    return cipherText;
}

// // ------------------------------->for testing purposes<-----------------------------
// const plainText1= "aboJan";
// const key1 = 3;
// const cipherText = monoAlphabeticalEncryption(plainText1, key1);
// console.log(`Cipher text: ${cipherText}`);


//------------------------------------------> monoAlphabetical Decryption <--------------------------------------
//------------------------------------------>key = 3<--------------------------------------
function monoAlphabeticalDecryption(plainText, key) {
    const letters = [];
    for (let i = 65; i <= 90; i++) {
        letters.push(String.fromCharCode(i));  // Generates a list of characters from 'A' to 'Z'
    }

    let cipherText = "";

    for (let i = 0; i < plainText.length; i++) {
        for (let j = 0; j < letters.length; j++) {
            if (plainText[i].toUpperCase() === letters[j]) {
                let cipherIndex = (j - key + 26) % 26; // Ensure positive index
                let character = letters[cipherIndex];
                cipherText += character;
            }
        }
    }

    return cipherText;
}

// // ------------------------------->for testing purposes<-----------------------------
// const plainText = "DERMDQ"; // Encrypted version of "HELLO" with key 3
// const key = 3;
// const decryptedText = monoAlphabeticalDecryption(plainText, key);
// console.log(`Decrypted text: ${decryptedText}`);


//------------------------->Playfair enc/dec<-----------------------------
//------------------------------->key = SWE<------------------
function generatePlayfairMatrix(key) {
    key = key.toUpperCase().replace(/J/g, "I");  // J is typically replaced by I in Playfair cipher
    const matrix = [];
    const seen = new Set();

    // Remove duplicates from key and add to matrix
    for (let char of key) {
        if (!seen.has(char) && /[A-Z]/.test(char)) {
            seen.add(char);
            matrix.push(char);
        }
    }

    // Fill the rest of the matrix with remaining letters
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    for (let char of alphabet) {
        if (!seen.has(char)) {
            matrix.push(char);
        }
    }

    // Convert to 5x5 matrix
    return Array.from({ length: 5 }, (_, i) => matrix.slice(i * 5, i * 5 + 5));
}

function findPosition(matrix, char) {
    for (let row = 0; row < 5; row++) {
        const index = matrix[row].indexOf(char);
        if (index !== -1) {
            return [row, index];
        }
    }
    return null;
}
//------------------------>playfair Encyption<------------------------------
function playfairEncrypt(plainText, key) {
    const matrix = generatePlayfairMatrix(key);
    plainText = plainText.toUpperCase().replace(/J/g, "I");
    const plainList = [];

    // Split into digraphs and add padding if necessary
    let i = 0;
    while (i < plainText.length) {
        let a = plainText[i];
        let b = (i + 1 < plainText.length) ? plainText[i + 1] : 'X';

        if (a === b) {
            b = 'X';
            i++;
        } else {
            i += 2;
        }
        plainList.push(a + b);
    }

    const cipherText = [];

    for (let pair of plainList) {
        const [a, b] = pair;
        const [row1, col1] = findPosition(matrix, a);
        const [row2, col2] = findPosition(matrix, b);

        if (row1 === row2) {
            // Same row, shift right
            cipherText.push(matrix[row1][(col1 + 1) % 5]);
            cipherText.push(matrix[row2][(col2 + 1) % 5]);
        } else if (col1 === col2) {
            // Same column, shift down
            cipherText.push(matrix[(row1 + 1) % 5][col1]);
            cipherText.push(matrix[(row2 + 1) % 5][col2]);
        } else {
            // Rectangle, swap columns
            cipherText.push(matrix[row1][col2]);
            cipherText.push(matrix[row2][col1]);
        }
    }

    return cipherText.join('');
}

//------------------------>playfair Decryption<------------------------------
function playfairDecrypt(cipherText, key) {
    const matrix = generatePlayfairMatrix(key);
    cipherText = cipherText.toUpperCase();
    const plainList = [];

    // Process the ciphertext into digraphs
    for (let i = 0; i < cipherText.length; i += 2) {
        plainList.push(cipherText.slice(i, i + 2));
    }

    const plainText = [];

    for (let pair of plainList) {
        const [a, b] = pair;
        const [row1, col1] = findPosition(matrix, a);
        const [row2, col2] = findPosition(matrix, b);

        if (row1 === row2) {
            // Same row, shift left
            plainText.push(matrix[row1][(col1 - 1 + 5) % 5]);
            plainText.push(matrix[row2][(col2 - 1 + 5) % 5]);
        } else if (col1 === col2) {
            // Same column, shift up
            plainText.push(matrix[(row1 - 1 + 5) % 5][col1]);
            plainText.push(matrix[(row2 - 1 + 5) % 5][col2]);
        } else {
            // Rectangle, swap columns
            plainText.push(matrix[row1][col2]);
            plainText.push(matrix[row2][col1]);
        }
    }

    return plainText.join('');
}

// //------------------------->Testing purposes<------------------------
// const key = "SWE";
// const plainText = "wordle";
// const cipherText = playfairEncrypt(plainText, key);
// const decryptedText = playfairDecrypt(cipherText, key);

// console.log("Encrypted text:", cipherText);
// console.log("Decrypted text:", decryptedText);





//---------------------------->exporting all the methods to index.js<------------------------
//------------------------------->DES and vignere should be added also<----------------------
// Export all functions
module.exports = {
    keyedTranspositionCipher,
    monoAlphabeticalEncryption,
    monoAlphabeticalDecryption,
    generatePlayfairMatrix,
    findPosition,
    playfairEncrypt,
    playfairDecrypt
};