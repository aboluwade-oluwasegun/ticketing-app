export abstract class CustomError extends Error {
    abstract statusCode: number

    constructor(message: string) {
        super(message) // super here is like calling new Error()
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    //signature (classes extending this class must have serializeErrors 
    // returning defined object)
    abstract serializeErrors(): { message: string; field?: string }[] 
}