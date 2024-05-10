const ERROR = {
    IS_INVALID: 1,
    IS_NOT_ALPHANUMERIC: 2,
    IS_SHORT: 3,
    NO_DIGIT: 4,
    NO_LOWERCASE: 5,
    NO_UPPERCASE: 6,
    NO_SPECIAL_CHAR: 7,
    USER_ALLREADY_EXIST: 8
}

const VALID = 0;


const isUsernameValid = (username) => {
    const errors = [];

    if (!username || typeof username !== 'string') {
        errors.push(ERROR.IS_INVALID);
        return;
    }

    if (!(/^[a-zA-Z0-9]+$/.test(username))){
        errors.push(ERROR.IS_NOT_ALPHANUMERIC);
    }

    if (username.length < 3){
        errors.push(ERROR.IS_SHORT);
    }

    return (errors.length != 0 )? errors: VALID;
}


const isPasswordValid = (password) => {
    const errors = [];

    if (password === null || password === undefined) {
        return errors.push(ERROR.IS_INVALID);;
    }

    if (!/[A-Z]/.test(password)) {
        errors.push(ERROR.NO_UPPERCASE);
    }

    if (!/[a-z]/.test(password)) {
        errors.push(ERROR.NO_LOWERCASE);
    }

    if (!/\d/.test(password)) {
        errors.push(ERROR.NO_DIGIT);
    }

    if (password.length < 8) {
        errors.push(ERROR.IS_SHORT);
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
        errors.push(ERROR.NO_SPECIAL_CHAR);
    }

    return (errors.length != 0 )? errors: VALID;

}


module.exports = {
    ERROR,
    VALID,
    isPasswordValid,
    isUsernameValid
}