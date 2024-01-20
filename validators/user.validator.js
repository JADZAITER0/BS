const ERROR = {
    IS_INVALID: 1,
    IS_NOT_ALPHANUMERIC: 2,
    IS_SHORT: 3,
    NO_DIGIT: 4,
    NO_LOWERCASE: 5,
    NO_UPPERCASE: 6,
    NO_SPECIAL_CHAR: 7
}

const VALID = 0;

const isUsernameValid = (username) => {
    if (!username || typeof username !== 'string') {
        return ERROR.IS_INVALID;
    }

    if (!(/^[a-zA-Z0-9]+$/.test(username))){
        ERROR.IS_NOT_ALPHANUMERIC;
    }

    if (username.length < 3){
        ERROR.IS_SHORT;;
    }
    
    return VALID;
}


const isPasswordValid = (password) => {

    if (password === null || password === undefined) {
        return false;
    }

    if (!/[A-Z]/.test(password)) {
        return ERROR.NO_UPPERCASE;
    }

    if (!/[a-z]/.test(password)) {
        return ERROR.NO_LOWERCASE;
    }

    if (!/\d/.test(password)) {
        return ERROR.NO_DIGIT;
    }

    if (password.length < 8) {
        return ERROR.IS_SHORT;
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
        return ERROR.NO_SPECIAL_CHAR;
    }

    return VALID;
}


module.exports = {
    ERROR,
    isPasswordValid,
    isUsernameValid
}