class customError extends Error {
    constructor(errorMessages, status, message) {
        super(message);
        this.data = errorMessages;
        this.status = status;
    }
}

module.exports = customError;