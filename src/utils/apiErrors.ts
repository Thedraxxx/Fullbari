class apiError extends Error{
       statusCode;
       data: null;
       success: boolean;
       error: any;
       stack?: string | undefined;
    constructor(
        statusCode: number,
        message = "Something Went wrong",
        error = [],
        stack = ''
    ){
       super(message);
       this.statusCode = statusCode;
       this.message = message;
       this.data = null;
       this.success = false;
       this.error = error;
       if(stack){
           this.stack = stack;
       }
       Error.captureStackTrace(this,this.constructor);
    }
}

export default apiError;