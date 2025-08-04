import { connectDB } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";



export async function GET(){
 await connectDB()
 return NextResponse.json({
    sucess:true,
    message:"DataBase connected successfully"
 })
}