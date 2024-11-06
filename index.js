(function() {
    /* ~~~~~~~~~~~~~ Smooth Scrolling for Navbar Links ~~~~~~~~~~~~~ */
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ~~~~~~~~~~~~~ Navbar highlighting ~~~~~~~~~~~~~ */
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(function(section) {
            const top = window.scrollY;
            const offset = section.offsetTop - 150;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* ================== Encryption Section ================== */
    const encryptionMethodsSelect = document.getElementById('encryption_methods');
    const encryptionExplanation = document.getElementById('encryption_explanation');
    const encryptionInput = document.getElementById('encryption_input');
    const encryptionOutput = document.getElementById('encryption_output');
    const encryptionPasteButton = document.getElementById('encryption_paste_button');
    const encryptionCopyButton = document.getElementById('encryption_copy_button');

    let selectedEncryptionMethod = '';

    encryptionMethodsSelect.addEventListener('change', function() {
        selectedEncryptionMethod = this.value;
        encryptionInput.disabled = false;
        encryptionPasteButton.disabled = false;
        updateEncryptionOutput();

        // ~~~~~~~~~~~~~ Add fade-in animation ~~~~~~~~~~~~~
        encryptionExplanation.classList.remove('fade-in');
        void encryptionExplanation.offsetWidth; // Trigger reflow to restart animation
        encryptionExplanation.classList.add('fade-in');

        switch(selectedEncryptionMethod) {
            case 'monoalphabetic_substitution':
                encryptionExplanation.innerHTML = `
                    <p>The Monoalphabetic Substitution is a type of cipher where each letter in the plaintext is replaced by a corresponding letter from a fixed substitution alphabet. This means that the same letter will always be replaced by the same letter in the ciphertext.</p>
                    <div class="key-display">Key = 3</div>
                `;
                break;
            case 'playfair':
                encryptionExplanation.innerHTML = `
                    <p>The Playfair is a digraph substitution cipher, meaning it encrypts pairs of letters instead of single letters. It uses a 5x5 grid of letters constructed from a keyword, which removes repeated letters and combines "I" and "J" into a single position.</p>
                    <div class="key-display">Key = SWE</div>
                `;
                break;
            case 'vigenere':
                encryptionExplanation.innerHTML = `
                    <p>The Vigenère cipher is a method of encrypting alphabetic text by using a simple form of polyalphabetic substitution. It uses a keyword to shift letters in the plaintext by different amounts based on the position of the letter in the keyword.</p>
                    <div class="key-display">Key = KSU</div>
                `;
                break;
            case 'keyed':
                encryptionExplanation.innerHTML = `
                    <p>The Keyed Caesar cipher shifts letters based on a keyword, adding complexity to the standard Caesar cipher. This variation uses a keyword to determine the shift sequence, providing better security than a fixed shift value.</p>
                    <div class="key-display">Key = 13254</div>
                `;
                break;
            case 'monoalphabetic_playfair':
                encryptionExplanation.innerHTML = `
                    <p>This method combines Monoalphabetic Substitution and Playfair cipher for enhanced security. By applying two encryption methods, it adds layers of complexity, making unauthorized decryption significantly more difficult.</p>
                    <div class="key-display">Monoalphabetic Key = 3<br></br>Playfair Key = SWE</div>
                `;
                break;
            case 'des':
                encryptionExplanation.innerHTML = `
                    <p>DES (Data Encryption Standard) is a symmetric-key algorithm used for secure data encryption. It operates on 64-bit blocks and uses a 56-bit key, providing a foundational approach to modern encryption, though it has been superseded by more secure algorithms.</p>
                    <div class="key-display">Key = Security<br></br>IV= 12345678</div>
                `;
                break;
            default:
                encryptionExplanation.innerHTML = '<p>Please choose an encryption method.</p>';
        }
    });

    encryptionInput.addEventListener('input', updateEncryptionOutput);

    function updateEncryptionOutput() {
        const inputText = encryptionInput.value;
        let outputText = '';
        let key;
        const errorMessage = document.getElementById('encryption_error_message');

        if (containsNonEnglishCharacters(inputText) && (selectedEncryptionMethod!="des")) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Please use English letters only.';
            encryptionOutput.value = '';
            encryptionCopyButton.disabled = true;
            return;
        } else {
            errorMessage.style.display = 'none';
        }

        if (inputText.trim() === '') {
            outputText = '';
        } else {
            switch(selectedEncryptionMethod) {
                case 'monoalphabetic_substitution':
                    key= 3;
                    outputText=monoAlphabeticalEncryption(inputText,key);
                    break;
                case 'playfair':
                    key="SWE";
                    outputText = playfairEncrypt(inputText,key);
                    break;
                case 'vigenere':
                    key="KSU";
                    outputText = encryptVigenere(inputText,key);
                    break;
                case 'keyed':
                    key= 13254;
                    outputText = keyedTranspositionEncryption(inputText,key);
                    break;
                case 'monoalphabetic_playfair':
                    outputText = playfairEncrypt(monoAlphabeticalEncryption(inputText,3),"SWE");
                    break;
                case 'des':
                    key = "Security";
                    outputText = desEncrypt(inputText, key);
                    break;
                default:
                    outputText = '';
            }
        }

        encryptionOutput.value = outputText;
        encryptionCopyButton.disabled = outputText.trim() === '';
    }

    // ~~~~~~~~~~~~~ Copy Encryption Output ~~~~~~~~~~~~~
    encryptionCopyButton.addEventListener('click', function() {
        const outputText = encryptionOutput.value;
        if (!outputText) return;
        navigator.clipboard.writeText(outputText).then(function() {
            showMessage('encryption_copy_message');
        }).catch(function(err) {
            console.error('Failed to copy text: ', err);
        });
    });

    // ~~~~~~~~~~~~~ Paste into Encryption Input ~~~~~~~~~~~~~
    encryptionPasteButton.addEventListener('click', function() {
        if (selectedEncryptionMethod === '') {
            alert('Please select an encryption method first.');
            return;
        }
        navigator.clipboard.readText().then(function(text) {
            encryptionInput.value = text;
            updateEncryptionOutput();
            showMessage('encryption_paste_message');
        }).catch(function(err) {
            console.error('Failed to read clipboard contents: ', err);
        });
    });

    /* ================== Decryption Section ================== */
    const decryptionMethodsSelect = document.getElementById('decryption_methods');
    const decryptionExplanation = document.getElementById('decryption_explanation');
    const decryptionInput = document.getElementById('decryption_input');
    const decryptionOutput = document.getElementById('decryption_output');
    const decryptionPasteButton = document.getElementById('decryption_paste_button');
    const decryptionCopyButton = document.getElementById('decryption_copy_button');

    let selectedDecryptionMethod = '';

    decryptionMethodsSelect.addEventListener('change', function() {
        selectedDecryptionMethod = this.value;
        decryptionInput.disabled = false;
        decryptionPasteButton.disabled = false;
        updateDecryptionOutput();

        // ~~~~~~~~~~~~~ Add fade-in animation ~~~~~~~~~~~~~
        decryptionExplanation.classList.remove('fade-in');
        void decryptionExplanation.offsetWidth; // Trigger reflow to restart animation
        decryptionExplanation.classList.add('fade-in');

        switch(selectedDecryptionMethod) {
            case 'monoalphabetic_substitution':
                decryptionExplanation.innerHTML = `
                    <p>The Monoalphabetic Substitution decryption is a process of reversing the encryption by replacing each letter in the ciphertext with the corresponding letter from the original alphabet used in encryption.</p>
                    <div class="key-display">Key = 3</div>
                `;
                break;
            case 'playfair':
                decryptionExplanation.innerHTML = `
                    <p>The Playfair cipher decryption is the reverse of the Playfair encryption process. It involves using the same 5x5 grid created with the keyword to decrypt the ciphertext pairs back into plaintext.</p>
                    <div class="key-display">Key = SWE</div>
                `;
                break;
            case 'vigenere':
                decryptionExplanation.innerHTML = `
                    <p>The Vigenère cipher decryption is the reverse process of the Vigenère encryption. It uses the same keyword to revert the ciphertext back to the original plaintext by reversing the shifting process.</p>
                    <div class="key-display">Key = KSU</div>
                `;
                break;
            case 'keyed':
                decryptionExplanation.innerHTML = `
                <p>The Keyed Caesar cipher decrypts by reversing the shifts applied during encryption, based on the same keyword. This method ensures that the correct keyword is needed to restore the original message, enhancing the security compared to simple fixed-shift ciphers.</p>
                <div class="key-display">Key = 13254</div>
            `;
                break;
            case 'monoalphabetic_playfair':
                decryptionExplanation.innerHTML = `
                <p>This method decrypts using the reverse process of the Monoalphabetic Substitution and Playfair cipher. By first applying the Playfair decryption followed by Monoalphabetic substitution, the original message is restored, requiring both keys for successful decryption.</p>
                <div class="key-display">Monoalphabetic Key = 3<br></br>Playfair Key = SWE</div>
            `;
                break;
            case 'des':
                decryptionExplanation.innerHTML = `
                <p>DES (Data Encryption Standard) decrypts data by reversing the encryption process using the same 56-bit key. It operates on 64-bit blocks, restoring the original data when the correct key and initialization vector (IV) are provided.</p>
                 <div class="key-display">Key = Security<br></br>IV = 12345678</div>
            `;
                break;
            default:
                decryptionExplanation.innerHTML = '<p>Please choose a decryption method.</p>';
        }
    });

    decryptionInput.addEventListener('input', updateDecryptionOutput);

    function updateDecryptionOutput() {
        const inputText = decryptionInput.value;
        let outputText = '';
        let key;
        const errorMessage = document.getElementById('decryption_error_message');

        if (containsNonEnglishCharacters(inputText)&& selectedDecryptionMethod!="des") {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Please use English letters only.';
            decryptionOutput.value = '';
            decryptionCopyButton.disabled = true;
            return;
        } else {
            errorMessage.style.display = 'none';
        }

        if (inputText.trim() === '') {
            outputText = '';
        } else {
            switch(selectedDecryptionMethod) {
                case 'monoalphabetic_substitution':
                    key=3;
                    outputText = monoAlphabeticalDecryption(inputText,key);
                    break;
                case 'playfair':
                    key="SWE";
                    outputText =playfairDecrypt(inputText,key);
                    break;
                case 'vigenere':
                    key="KSU";
                    outputText = decryptVigenere(inputText,key);
                    break;
                case 'keyed':
                    key= 13254;
                    outputText = keyedTranspositionDecryption(inputText,key);
                    break;
                case 'monoalphabetic_playfair':
                    outputText = monoAlphabeticalDecryption(playfairDecrypt(inputText,"SWE"),3);                    break;   
                case 'des':
                    key = "Security";
                    outputText = desDecrypt(inputText, key);
                    break;       
                default:
                    outputText = '';
            }
        }

        decryptionOutput.value = outputText;
        decryptionCopyButton.disabled = outputText.trim() === '';
    }

    // ~~~~~~~~~~~~~ Copy Decryption Output ~~~~~~~~~~~~~
    decryptionCopyButton.addEventListener('click', function() {
        const outputText = decryptionOutput.value;
        if (!outputText) return;
        navigator.clipboard.writeText(outputText).then(function() {
            showMessage('decryption_copy_message');
        }).catch(function(err) {
            console.error('Failed to copy text: ', err);
        });
    });

    // ~~~~~~~~~~~~~ Paste into Decryption Input ~~~~~~~~~~~~~
    decryptionPasteButton.addEventListener('click', function() {
        if (selectedDecryptionMethod === '') {
            alert('Please select a decryption method first.');
            return;
        }
        navigator.clipboard.readText().then(function(text) {
            decryptionInput.value = text;
            updateDecryptionOutput();
            showMessage('decryption_paste_message');
        }).catch(function(err) {
            console.error('Failed to read clipboard contents: ', err);
        });
    });

    // ~~~~~~~~~~~~~ Function to show messages ~~~~~~~~~~~~~
    function showMessage(elementId) {
        const messageElement = document.getElementById(elementId);
        messageElement.style.display = 'block';
        setTimeout(function() {
            messageElement.style.display = 'none';
        }, 2000);
    }

    // ~~~~~~~~~~~~~ Function to check for non-English characters ~~~~~~~~~~~~~
    function containsNonEnglishCharacters(text) {
        // Matches any character that is not a-z or A-Z or common punctuation and space
        return /[^a-zA-Z\s.,!?;:'"-]/.test(text);
    }

    //---------------> Encryption / decryption  methods<------------------------

    // -------------------------------------->keyedTranspositionCipher encryption<---------------------------------
    //--------------------------------------->key = 13254<---------------------------------------------

     function keyedTranspositionEncryption(plainText, key) {
        const keyLength = key.toString().length;
        plainText = plainText.toUpperCase().replace(/\s+/g,"");

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
        const cipherText = cipherList.join(" ");
        return cipherText;
    }
// -------------------------------------->keyedTranspositionCipher decryption<---------------------------------
//--------------------------------------->key = 13254<---------------------------------------------

function keyedTranspositionDecryption(cipherText, key) {
    const keyLength = key.toString().length;
    while (cipherText.length%keyLength){
        cipherText+="X";
    }
    const cipherChunks = cipherText.split(" ");

    // Convert key into an array of 0-based indices
    const keyList = key.toString().split('').map(digit => parseInt(digit) - 1);
    
    // Create an inverse key array to map the cipher text back to its original order
    const inverseKeyList = [];
    for (let i = 0; i < keyLength; i++) {
        inverseKeyList[keyList[i]] = i;
    }

    const plainList = [];

    // Rearrange each chunk back to its original order according to the inverse key
    for (const chunk of cipherChunks) {
        let originalChunk = '';
        for (let i = 0; i < keyLength; i++) {
            originalChunk += chunk[inverseKeyList[i]];
        }
        plainList.push(originalChunk);
    }

    // Combine all chunks to form the final plain text and remove trailing padding 'X'
    const plainText = plainList.join("").replace(/X+$/, '');

    return plainText;
}

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

    //------------------------>playfair Encryption<------------------------------
    function playfairEncrypt(plainText, key) {
        const matrix = generatePlayfairMatrix(key);
        plainText = plainText.toUpperCase().replace(/J/g, "I").replace(" ","");
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
        let decryptedText = plainText.join('');
        
        const vowels = "AEIOU";// because we don't want to remove X if it has a meaning
        let Result="";//to store the decrypted text after modyfiying
for (let i = 0; i < decryptedText.length; i++) {
    if (decryptedText[i] === "X" && !vowels.includes(decryptedText[i - 1])) {
        continue;
    }
    Result+=decryptedText[i];//we want to skip any non meaningful "X"
}
        decryptedText=Result;
        return decryptedText

    }

    //-------------------------------> Vigenère Encryption <----------------------
    //------------------------------->key = "KEY" <------------------

    // Function to encrypt using Vigenère Cipher
    function encryptVigenere(plainText, key) {
        let cipherText = '';
        let keyIndex = 0;

        for (let i = 0; i < plainText.length; i++) {
            let char = plainText[i];
            if (isAlpha(char)) {
                let isLowerCase = char === char.toLowerCase();
                let charCode = char.toUpperCase().charCodeAt(0);
                let keyChar = key[keyIndex % key.length].toUpperCase();
                let keyCode = keyChar.charCodeAt(0);

                // Encryption formula
                let encryptedCharCode = ((charCode + keyCode - 2 * 65) % 26) + 65;
                let encryptedChar = String.fromCharCode(encryptedCharCode);

                cipherText += isLowerCase ? encryptedChar.toLowerCase() : encryptedChar;
                keyIndex++; // Only increment keyIndex for alphabetic characters
            } else {
                cipherText += char; // Non-alphabet characters are not encrypted
            }
        }
        return cipherText;
    }

    //-------------------------------> Vigenère Decryption <----------------------
    //------------------------------->key = "KEY" <------------------

    // Function to decrypt using Vigenère Cipher
    function decryptVigenere(cipherText, key) {
        let plainText = '';
        let keyIndex = 0;

        for (let i = 0; i < cipherText.length; i++) {
            let char = cipherText[i];
            if (isAlpha(char)) {
                let isLowerCase = char === char.toLowerCase();
                let charCode = char.toUpperCase().charCodeAt(0);
                let keyChar = key[keyIndex % key.length].toUpperCase();
                let keyCode = keyChar.charCodeAt(0);

                // Decryption formula
                let decryptedCharCode = ((charCode - keyCode + 26) % 26) + 65;
                let decryptedChar = String.fromCharCode(decryptedCharCode);

                plainText += isLowerCase ? decryptedChar.toLowerCase() : decryptedChar;
                keyIndex++; // Only increment keyIndex for alphabetic characters
            } else {
                plainText += char; // Non-alphabet characters are not decrypted
            }
        }
        return plainText;
    }

    // Helper function to check if a character is an alphabet letter
    function isAlpha(char) {
        return /^[A-Za-z]$/.test(char);
    }

    //------------------------------->DES Encryption<----------------------

    // DES Encryption in JavaScript with CBC Mode and PKCS#5 Padding

    function desEncrypt(plaintext, key) {
        // Fixed IV
        let iv = "12345678";  // 8 ASCII characters

        // Ensure key is 8 characters long
        if (key.length !== 8) {
            throw new Error("Key must be 8 characters long for DES.");
        }

        // Convert plaintext to bytes
        let plaintextBytes = asciiToBytes(plaintext);

        // Apply PKCS#5 padding
        let paddedPlaintext = pkcs5Pad(plaintextBytes);

        // Split plaintext into 8-byte blocks
        let blocks = [];
        for (let i = 0; i < paddedPlaintext.length; i += 8) {
            blocks.push(paddedPlaintext.slice(i, i + 8));
        }

        // Convert key and IV to binary
        let keyBin = bytesToBin(asciiToBytes(key));
        let ivBin = bytesToBin(asciiToBytes(iv));

        let previousCipherBlock = ivBin;
        let ciphertext = '';

        // Encrypt each block
        for (let block of blocks) {
            let blockBin = bytesToBin(block);

            // XOR with previous cipher block (CBC mode)
            let xorBlock = xor(blockBin, previousCipherBlock);

            // Encrypt block using DES
            let cipherBlockBin = desEncryptBlock(xorBlock, keyBin);

            // Update previous cipher block
            previousCipherBlock = cipherBlockBin;

            // Append cipher block to ciphertext
            ciphertext += binToHex(cipherBlockBin);
        }

        return ciphertext.toLowerCase();
    }

    // Convert ASCII string to byte array
    function asciiToBytes(str) {
        return str.split('').map(char => char.charCodeAt(0));
    }

    // PKCS#5 Padding
    function pkcs5Pad(bytes) {
        let padLen = 8 - (bytes.length % 8);
        if (padLen === 0) padLen = 8;
        return bytes.concat(Array(padLen).fill(padLen));
    }

    // Convert byte array to binary string
    function bytesToBin(bytes) {
        return bytes
            .map(byte => byte.toString(2).padStart(8, '0'))
            .join('');
    }

    // Convert binary string to hexadecimal string
    function binToHex(binStr) {
        let hex = '';
        for (let i = 0; i < binStr.length; i += 4) {
            let chunk = binStr.substr(i, 4);
            hex += parseInt(chunk, 2).toString(16);
        }
        return hex;
    }

    // XOR two binary strings
    function xor(a, b) {
        let result = '';
        for (let i = 0; i < a.length; i++) {
            result += (a[i] ^ b[i]);
        }
        return result;
    }

    // DES block encryption
    function desEncryptBlock(blockBin, keyBin) {
        // Initial permutation
        let permutedText = permute(blockBin, initialPermutationTable);

        // Generate 16 subkeys
        let subKeys = generateSubKeys(keyBin);

        // Split text into left and right halves
        let left = permutedText.substring(0, 32);
        let right = permutedText.substring(32, 64);

        // 16 rounds of DES
        for (let i = 0; i < 16; i++) {
            let expandedRight = permute(right, expansionTable);
            let xored = xor(expandedRight, subKeys[i]);
            let substituted = sBoxSubstitution(xored);
            let permuted = permute(substituted, permutationTable);
            let temp = xor(left, permuted);
            left = right;
            right = temp;
        }

        // Combine left and right halves
        let combined = right + left;

        // Final permutation
        let cipherBin = permute(combined, finalPermutationTable);

        return cipherBin;
    }

    // Permutation function
    function permute(input, table) {
        let output = '';
        for (let i = 0; i < table.length; i++) {
            output += input[table[i] - 1];
        }
        return output;
    }

    // Generate 16 subkeys
    function generateSubKeys(key) {
        // Initial key permutation
        let permutedKey = permute(key, pc1);
        let left = permutedKey.substring(0, 28);
        let right = permutedKey.substring(28, 56);

        let subKeys = [];
        for (let i = 0; i < 16; i++) {
            // Left shifts
            left = leftShift(left, shiftTable[i]);
            right = leftShift(right, shiftTable[i]);

            // Combine halves and apply PC-2 permutation
            let combinedKey = left + right;
            let subKey = permute(combinedKey, pc2);
            subKeys.push(subKey);
        }
        return subKeys;
    }

    // Left shift function
    function leftShift(keyHalf, shifts) {
        return keyHalf.slice(shifts) + keyHalf.slice(0, shifts);
    }

    // S-Box substitution
    function sBoxSubstitution(input) {
        let output = '';
        for (let i = 0; i < 8; i++) {
            let chunk = input.substr(i * 6, 6);
            let row = parseInt(chunk[0] + chunk[5], 2);
            let col = parseInt(chunk.substring(1, 5), 2);
            let sboxValue = sBoxes[i][row][col].toString(2).padStart(4, '0');
            output += sboxValue;
        }
        return output;
    }

    // Initial Permutation Table
    const initialPermutationTable = [
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17,  9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7
    ];

    // Final Permutation Table
    const finalPermutationTable = [
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41,  9, 49, 17, 57, 25
    ];

    // Expansion Table
    const expansionTable = [
        32,  1,  2,  3,  4,  5,
         4,  5,  6,  7,  8,  9,
         8,  9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32,  1
    ];

    // Permutation Table
    const permutationTable = [
        16,  7, 20, 21,
        29, 12, 28, 17,
         1, 15, 23, 26,
         5, 18, 31, 10,
         2,  8, 24, 14,
        32, 27,  3,  9,
        19, 13, 30,  6,
        22, 11,  4, 25
    ];

    // PC-1 Table (Key Permutation)
    const pc1 = [
        57, 49, 41, 33, 25, 17,  9,
         1, 58, 50, 42, 34, 26, 18,
        10,  2, 59, 51, 43, 35, 27,
        19, 11,  3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15,
         7, 62, 54, 46, 38, 30, 22,
        14,  6, 61, 53, 45, 37, 29,
        21, 13,  5, 28, 20, 12,  4
    ];

    // PC-2 Table (Key Compression)
    const pc2 = [
        14, 17, 11, 24,  1,  5,
         3, 28, 15,  6, 21, 10,
        23, 19, 12,  4, 26,  8,
        16,  7, 27, 20, 13,  2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    ];

    // Shift Table
    const shiftTable = [
        1, 1, 2, 2,
        2, 2, 2, 2,
        1, 2, 2, 2,
        2, 2, 2, 1
    ];

    // S-Boxes
    const sBoxes = [
        // S1
        [
            [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
            [0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
            [4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
            [15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]
        ],
        // S2
        [
            [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],
            [3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],
            [0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],
            [13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]
        ],
        // S3
        [
            [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],
            [13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],
            [13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],
            [1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]
        ],
        // S4
        [
            [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],
            [13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],
            [10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],
            [3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]
        ],
        // S5
        [
            [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],
            [14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],
            [4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],
            [11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]
        ],
        // S6
        [
            [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],
            [10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],
            [9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],
            [4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]
        ],
        // S7
        [
            [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],
            [13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],
            [1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],
            [6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]
        ],
        // S8
        [
            [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],
            [1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],
            [7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],
            [2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]
        ]
    ];
    
    

        //------------------------->DES decyption<---------------------------
        // DES Decryption in JavaScript with CBC Mode and PKCS#5 Padding
        function desDecrypt(ciphertext, key) {
            let iv = "12345678";  // 8 ASCII characters for IV

            if (key.length !== 8) {
                throw new Error("Key must be 8 characters long for DES.");
            }

            // Convert key and IV to binary
            let keyBin = bytesToBin(asciiToBytes(key));
            let ivBin = bytesToBin(asciiToBytes(iv));

            let previousCipherBlock = ivBin;
            let plaintext = [];

            // Split ciphertext into blocks of 16 hex characters (64 bits)
            let blocks = [];
            for (let i = 0; i < ciphertext.length; i += 16) {
                blocks.push(ciphertext.substr(i, 16));
            }

            // Decrypt each block
            for (let blockHex of blocks) {
                // Convert hex block to binary string
                let blockBin = hexToBin(blockHex);

                // Decrypt block using DES with reversed subkeys
                let plainBlockBin = desDecryptBlock(blockBin, keyBin);

                // XOR with previous cipher block (CBC mode)
                let decryptedBlock = xor(plainBlockBin, previousCipherBlock);

                // Update previous cipher block
                previousCipherBlock = blockBin;

                // Append decrypted block to plaintext
                plaintext.push(...binToBytes(decryptedBlock));
            }

            // Remove PKCS#5 padding
            return bytesToAscii(pkcs5Unpad(plaintext));
        }

        // Convert hexadecimal string to binary string
        function hexToBin(hexStr) {
            let binStr = '';
            for (let i = 0; i < hexStr.length; i++) {
                let binDigit = parseInt(hexStr[i], 16).toString(2).padStart(4, '0');
                binStr += binDigit;
            }
            return binStr;
        }

        // PKCS#5 Unpadding
        function pkcs5Unpad(bytes) {
            let padLen = bytes[bytes.length - 1];
            return bytes.slice(0, bytes.length - padLen);
        }

// Convert binary string to byte array
function binToBytes(binStr) {
    let bytes = [];
    for (let i = 0; i < binStr.length; i += 8) {
        bytes.push(parseInt(binStr.substr(i, 8), 2));
    }
    return bytes;
}

// Convert byte array to ASCII string
function bytesToAscii(bytes) {
    return bytes.map(byte => String.fromCharCode(byte)).join('');


}
// DES block decryption (reversed encryption)
function desDecryptBlock(blockBin, keyBin) {
    // Initial permutation
    let permutedText = permute(blockBin, initialPermutationTable);

    // Generate 16 subkeys and reverse them
    let subKeys = generateSubKeys(keyBin).reverse();

    // Split text into left and right halves
    let left = permutedText.substring(0, 32);
    let right = permutedText.substring(32, 64);

    // 16 rounds of DES decryption
    for (let i = 0; i < 16; i++) {
        let expandedRight = permute(right, expansionTable);
        let xored = xor(expandedRight, subKeys[i]);
        let substituted = sBoxSubstitution(xored);
        let permuted = permute(substituted, permutationTable);
        let temp = xor(left, permuted);
        left = right;
        right = temp;
    }

    // Combine left and right halves
    let combined = right + left;

    // Final permutation
    let plainBin = permute(combined, finalPermutationTable);

    return plainBin;
}


})();

