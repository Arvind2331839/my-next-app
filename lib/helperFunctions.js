import { NextResponse } from "next/server"


export const response = ( success, statusCode,message, data={})=>{
    return NextResponse.json({
        success,statusCode,message,data
    })
} 

export const catchError= (error, customMessage)=>{
    //handling duplocate key error
    if(error.code === 11000){
        const keys = object.key(error.keyPattern).join(',')
        error.message=`Dupicate field: ${keys}. these fields value must be unique`
    }

    let errorObj = {}
    if(process.env.NODE_ENV === 'development'){
        errorObj={
            message: customMessage || 'intyernal server Error'
        }
    }
    return response(false,error.code, ...errorObj)
}


export const generateOTP=()=>{
    const otp = Math.floor(100000+Math.random()*900000)
    return otp
}