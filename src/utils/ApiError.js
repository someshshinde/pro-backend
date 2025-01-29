class ApiError extends Error {
    constructor(
        statusCode,
        message="somthing went Wrong",
        errors=[],
        stack="",
        name="ApiError"
    )
     {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.data=null;
        this.errors=errors;
        this.success=false;

        if(stack){
            this.stack=stack

        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

module.exports={ApiError}
