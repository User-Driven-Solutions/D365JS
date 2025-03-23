/**   
 * Confirm a provided string, or array of strings, is a valid NZ bank account number.
 * @method isValidAccountNumber
 * @param {string} accountText A string specifying the account number to be validated
 * @param {boolean} westpacOnly Only accepts Westpac account numbers, defaults to false
 * @return {boolean}
 * The parameter must be either
 * a 16 digit string
 * a string of 2,4,7 then 3 digits separated by a hyphen
 * an array consisting of strings of 2, 4, 7 then 3 digits
 */   
function isValidAccountNumber(accountText, westpacOnly=false) {
    const algorithms = new Map()
    algorithms.set('A', { mulitiplier : [0, 0, 6, 3, 7, 9, 0, 10, 5, 8, 4, 2, 1, 0, 0, 0], modulo : 11})
    algorithms.set('B', { mulitiplier : [0, 0, 0, 0, 0, 0, 0, 10, 5, 8, 4, 2, 1, 0, 0, 0], modulo : 11})
    algorithms.set('D', { mulitiplier : [0, 0, 0, 0, 0, 0, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0], modulo : 11})
    algorithms.set('E', { mulitiplier : [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 3, 2, 0, 0, 0], modulo : 11})
    algorithms.set('F', { mulitiplier : [0, 0, 0, 0, 0, 0, 1, 7, 3, 1, 7, 3, 1, 0, 0, 0], modulo : 10})
    algorithms.set('G', { mulitiplier : [0, 0, 0, 0, 0, 0, 1, 3, 7, 1, 3, 7, 1, 0, 0, 0], modulo : 10})
    algorithms.set('X', { mulitiplier : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], modulo : 1})

    if(!accountText || (typeof accountText !== 'string' && !Array.isArray(accountText)))
    {
        return false;
    }

    if (Array.isArray(accountText))
    {
        accountText = accountText.join('')
    }

    if (westpacOnly && accountText.substring(0, 2) !== "03")
    {
        return false;
    }

    // Remove non-numeric characters using regex
    const numericAccountText = accountText.replace(/\D/g, '');
    if (numericAccountText.length < 15 || numericAccountText.length > 16)
    {
        return false;
    }

    let accSum = 0;
    let algorithm;

    switch (numericAccountText.substring(0,2))
    {
        case "08" : 
            algorithm = algorithms.get('D');
            break;
        case "09" :
             algorithm = algorithms.get('E');
             break;
        case "25" : 
        case "33" :
            algorithm = algorithms.get('F');
            break;
        case "26" : 
        case "28" : 
        case "29" : 
            algorithm = algorithms.get('G');
            break;
        case "31" : 
            algorithm = algorithms.get('X');
            break;
        default : 
            if (parseInt(numericAccountText.substring(7,9)) < 99)
            {
                algorithm = algorithms.get('A');
            } else 
            {
                algorithm = algorithms.get('B');
            }            
    }

    const accnoDigits = numericAccountText.split('').map(x => parseInt(x));    

    for (let index = 2; index < 13; index++) {
        accSum += accnoDigits[index] * algorithm.mulitiplier[index];
    }

    const remainder = accSum % algorithm.modulo;

    return remainder === 0;
}

function isValidCreditCardNumber(cardNumberText) {

    // Remove non-numeric characters using regex
    if (cardNumberText.match(/^(?:\d{16}|\d{4}[-]\d{4}[-]\d{4}[-]\d{4})$/) === null) {
        return false;
    }

    const cardNumber = cardNumberText.replace(/\D/g, '');

    let sum = 0;
    let shouldDouble = false;
    for (let index = cardNumber.length - 1; index >= 0; index--) {
        let digit = parseInt(cardNumber.charAt(index), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

function isValidCardAccountNumber(cardAccountNumberText) {
    return cardAccountNumberText.match(/^(?:\d{12}|\d{4}[-]\d{4}[-]\d{4})$/) !== null;
}

function maskCreditCardNumber(cardNumberText) {
    if(!cardNumberText || typeof cardNumberText !== 'string' || cardNumberText.length < 16)
    {
        return ''
    } else {
        return cardNumberText.substring(0,4) + '-XXXX-XXXX-' + cardNumberText.slice(-4);
    }    
}

function formatAccountNumber(accountNumber) {
    if(!accountNumber || (typeof accountNumber !== 'string' && !Array.isArray(accountNumber)))
    {
        return ''
    }

    if (Array.isArray(accountNumber))
    {
        accountNumber = accountNumber.join('')
    }

    const accountNumberDigits = accountNumber.replace(/\D/g, '');

    if(accountNumberDigits.length < 15 || accountNumberDigits.length > 16)
    {
        return '';
    }

    const bank = accountNumberDigits.substring(0,2);
    const branch = accountNumberDigits.substring(2,6);
    const account = accountNumberDigits.substring(6,13);
    const suffix = accountNumberDigits.length === 15 ? '0' + accountNumberDigits.slice(-2) : accountNumberDigits.slice(-3);

    return `${bank}-${branch}-${account}-${suffix}`;        
}

export { isValidAccountNumber , isValidCreditCardNumber, isValidCardAccountNumber, maskCreditCardNumber, formatAccountNumber}
