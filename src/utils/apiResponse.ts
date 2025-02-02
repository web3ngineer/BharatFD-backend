class ApiResponse {
    status: number;
    message: string;
    data: any;
    success: boolean;

    constructor(statusCode: number, data: any, message: string = "Success") {
        this.status = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
