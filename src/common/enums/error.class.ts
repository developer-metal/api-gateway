export enum FeedbackErrorCode {
    ERROR_FIND_PRODUCT = "ERROR_FIND_PRODUCT",
    ERROR_REMOVE_PRODUCT = "ERROR_REMOVE_PRODUCT",
    ERROR_UPDATE_PRODUCT = "ERROR_UPDATE_PRODUCT",
    ERROR_SAVE_PRODUCT = "ERROR_SAVE_PRODUCT",
    DELETE_FEEDBACK_CODE = "DELETE_FEEDBACK_CODE",
    ERROR_CSV_EXPORT = "ERROR_CSV_EXPORT",
    ERROR_VALIDATION_FIELD = "ERROR_VALIDATION_FIELD",
    ERROR_CSV_EXPORT_EMPTY = "ERROR_CSV_EXPORT_EMPTY",
    TOKEN_IVALID = "TOKEN_IVALID"
}
export class ProductError extends Error {
    code: FeedbackErrorCode;
    constructor(code: FeedbackErrorCode, message: string) {
        super(message);
        this.name = "ProductError";
        this.code = code;
    }
}