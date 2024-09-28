//-------------------------------->exporting all the methods to index.js<-----------------------------------
const {
    keyedTranspositionCipher,
    monoAlphabeticalEncryption,
    monoAlphabeticalDecryption,
    generatePlayfairMatrix,
    findPosition,
    playfairEncrypt,
    playfairDecrypt
} = require('enc_dec_Methods.js');


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
                encryptionExplanation.innerHTML = '<p>The Monoalphabetic Substitution cipher replaces each letter with another letter based on a fixed substitution. This method provides basic encryption by shifting letters uniformly throughout the message, making it easy to implement. However, it is vulnerable to frequency analysis attacks due to its predictable nature.</p>';
                break;
            case 'playfair':
                encryptionExplanation.innerHTML = '<p>The Playfair cipher encrypts pairs of letters using a 5x5 keyword matrix. By operating on digraphs, it increases complexity over simple substitution ciphers. It was historically used for tactical messages but is susceptible to specialized cryptanalysis techniques.</p>';
                break;
            case 'vigenere':
                encryptionExplanation.innerHTML = '<p>The Vigenère cipher uses a keyword to shift letters, creating a polyalphabetic substitution cipher. This method enhances security by changing the shift for each letter based on the keyword, making it harder to crack using frequency analysis.</p>';
                break;
            case 'keyed':
                encryptionExplanation.innerHTML = '<p>The Keyed Caesar cipher shifts letters based on a keyword, adding complexity to the standard Caesar cipher. This variation uses a keyword to determine the shift sequence, providing better security than a fixed shift value.</p>';
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

        switch(selectedEncryptionMethod) {
            case 'monoalphabetic_substitution':
                outputText = monoalphabeticEncrypt(inputText);
                break;
            case 'playfair':
                outputText = 'Playfair encryption not implemented.';
                break;
            case 'vigenere':
                outputText = 'Vigenère encryption not implemented.';
                break;
            case 'keyed':
                outputText = 'Keyed Caesar encryption not implemented.';
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

    function monoalphabeticEncrypt(text) {
        let result = '';
        const shift = 3; // Caesar cipher shift
        for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            // ~~~~~~~~~~~~~ Uppercase letters ~~~~~~~~~~~~~
            if (c >= 65 && c <= 90) {
                result += String.fromCharCode((c - 65 + shift) % 26 + 65);
            }
            // ~~~~~~~~~~~~~ Lowercase letters ~~~~~~~~~~~~~
            else if (c >= 97 && c <= 122) {
                result += String.fromCharCode((c - 97 + shift) % 26 + 97);
            }
            else {
                result += text.charAt(i);
            }
        }
        return result;
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
                decryptionExplanation.innerHTML = '<p>The Monoalphabetic Substitution decryption reverses the substitution to retrieve the original text. This method requires knowledge of the fixed substitution used during encryption. Due to its simplicity, it is relatively easy to decrypt if the substitution pattern is known.</p>';
                break;
            case 'playfair':
                decryptionExplanation.innerHTML = '<p>The Playfair cipher decryption deciphers pairs of letters using the keyword matrix. It requires reconstructing the same matrix used during encryption, and reversing the encryption rules applied to the digraphs, making it more secure than simple substitution ciphers.</p>';
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

        switch(selectedDecryptionMethod) {
            case 'monoalphabetic_substitution':
                outputText = monoalphabeticDecrypt(inputText);
                break;
            case 'playfair':
                outputText = 'Playfair decryption not implemented.';
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
})();
