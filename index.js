
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
                encryptionExplanation.innerHTML = '<p>The Monoalphabetic Substitution cipher replaces each letter with another letter based on a fixed substitution. This method provides basic encryption by shifting letters uniformly throughout the message, making it easy to implement. However, it is vulnerable to frequency analysis attacks due to its predictable nature.<br><br>key = 3</p>';
                break;
            case 'playfair':
                encryptionExplanation.innerHTML = '<p>The Playfair cipher encrypts pairs of letters using a 5x5 keyword matrix. By operating on digraphs, it increases complexity over simple substitution ciphers. It was historically used for tactical messages but is susceptible to specialized cryptanalysis techniques.<br><br>key = SWE</p>';
                break;
            case 'vigenere':
                encryptionExplanation.innerHTML = '<p>The Vigenère cipher uses a keyword to shift letters, creating a polyalphabetic substitution cipher. This method enhances security by changing the shift for each letter based on the keyword, making it harder to crack using frequency analysis.</p>';
                break;
            case 'keyed':
                encryptionExplanation.innerHTML = '<p>The Keyed Caesar cipher shifts letters based on a keyword, adding complexity to the standard Caesar cipher. This variation uses a keyword to determine the shift sequence, providing better security than a fixed shift value.<br><br>key = 13254</p>';
                break;
            case 'monoalphabetic_playfair':
                encryptionExplanation.innerHTML = '<p>This method combines Monoalphabetic Substitution and Playfair cipher for enhanced security. By applying two encryption methods, it adds layers of complexity, making unauthorized decryption significantly more difficult.</p>';
                break;
            case 'des':
                encryptionExplanation.innerHTML = '<p>DES (Data Encryption Standard) is a symmetric-key algorithm used for secure data encryption. It operates on 64-bit blocks and uses a 56-bit key, providing a foundational approach to modern encryption, though it has been superseded by more secure algorithms.</p>';
                break;
            default:
                encryptionExplanation.innerHTML = '<p>Please choose an encryption method.</p>';
        }
    });

    encryptionInput.addEventListener('input', updateEncryptionOutput);

    function updateEncryptionOutput() {
        const inputText = encryptionInput.value;
        let outputText = '';
        let key  

        switch(selectedEncryptionMethod) {
            case 'monoalphabetic_substitution':
                key= 3
                outputText=monoAlphabeticalEncryption(inputText,key)
                break;
            case 'playfair':
                key="SWE"
                outputText = playfairEncrypt(inputText,key)
                break;
            case 'vigenere':
                outputText = 'Vigenère encryption not implemented.';
                break;
            case 'keyed':
                key= 13254
                outputText = keyedTranspositionCipher(inputText,key)
                break;
            case 'monoalphabetic_playfair':
                outputText = 'Combined encryption not implemented.';
                break;
            case 'des':
                outputText = 'DES encryption not implemented.';
                break;
            default:
                outputText = '';
        }

        encryptionOutput.value = outputText;
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
                decryptionExplanation.innerHTML = '<p>The Monoalphabetic Substitution decryption reverses the substitution to retrieve the original text. This method requires knowledge of the fixed substitution used during encryption. Due to its simplicity, it is relatively easy to decrypt if the substitution pattern is known<br><br>key = 3.</p>';
                break;
            case 'playfair':
                decryptionExplanation.innerHTML = '<p>The Playfair cipher decryption deciphers pairs of letters using the keyword matrix. It requires reconstructing the same matrix used during encryption, and reversing the encryption rules applied to the digraphs, making it more secure than simple substitution ciphers.<br><br>key = SWE</p>';
                break;
            case 'vigenere':
                decryptionExplanation.innerHTML = '<p>The Vigenère cipher decryption uses the keyword to reverse the letter shifts. By applying the inverse shifts dictated by the keyword, the original message is restored. Without the keyword, decryption becomes significantly more challenging.</p>';
                break;
            default:
                decryptionExplanation.innerHTML = '<p>Please choose a decryption method.</p>';
        }
    });

    decryptionInput.addEventListener('input', updateDecryptionOutput);

    function updateDecryptionOutput() {
        const inputText = decryptionInput.value;
        let outputText = '';
        let key

        switch(selectedDecryptionMethod) {
            case 'monoalphabetic_substitution':
                key=3
                outputText = monoAlphabeticalDecryption(inputText,key);
                break;
            case 'playfair':
                key="SWE"
                outputText =playfairDecrypt(inputText,key);
                break;
            case 'vigenere':
                outputText = 'Vigenère decryption not implemented.';
                break;
            default:
                outputText = '';
        }

        decryptionOutput.value = outputText;
    }

    function monoalphabeticDecrypt(text) {
        let result = '';
        const shift = 3; // Caesar cipher shift
        for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            // ~~~~~~~~~~~~~ Uppercase letters ~~~~~~~~~~~~~
            if (c >= 65 && c <= 90) {
                result += String.fromCharCode((c - 65 - shift + 26) % 26 + 65);
            }
            // ~~~~~~~~~~~~~ Lowercase letters ~~~~~~~~~~~~~
            else if (c >= 97 && c <= 122) {
                result += String.fromCharCode((c - 97 - shift + 26) % 26 + 97);
            }
            else {
                result += text.charAt(i);
            }
        }
        return result;
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
   //---------------> Encryption / decryption  methods<------------------------

// -------------------------------------->keyedTranspositionCipher<---------------------------------
//--------------------------------------->key = 13254<---------------------------------------------

 function keyedTranspositionCipher(plainText, key) {
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

// const cipherText = keyedTranspositionCipher(plainText, key);
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

//------------------------>playfair Encryption<------------------------------
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


//------------------------------->DES and vignere methods should be added also<----------------------

})();
