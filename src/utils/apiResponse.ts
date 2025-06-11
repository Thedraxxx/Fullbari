class apiResponse{
    statusCode: number;
    data: any;
    success: boolean;
    message: string;
    constructor(
        statusCode: number,
        data: any,
        message: string,
    ){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;

    }
}

export default apiResponse;