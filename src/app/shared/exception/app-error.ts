export class AppError {
    message: string;
    errorNumber: number;

    constructor( message: string, errorNumber = 1 ) {
        this.message = message;
        this.errorNumber = errorNumber;
    }
}
