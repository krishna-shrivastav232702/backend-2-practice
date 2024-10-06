import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const registerUser = asyncHandler(async (req, res) => {
    // get user details from front end
    // validation - not empty
    // check if user already exists:username,email
    // check for images ,check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response 
    // check for response creation 
    // return response 


    const { fullname,email,username,password } = req.body

    // if(fullname===""){
    //     throw new ApiError(400,"Full Name is Required")        
    // }

    if([fullname,email,username,password].some((field)=>(field?.trim()===""))){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({
        $or:[{ username },{ email }]
    })
    console.log(existedUser)

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }
    console.log("avatar local path");

    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;

    console.log("cover local path");
    //const coverImageLocalPath =  req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

    // if(!avatar){
    //     throw new ApiError(400,"Avatar file is required");
    // }

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while regestring the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req,res)=>{
    //req body -> body
    //username or email
    //find the user
    //authenicate using password
    //access and refresh token generate
    //send using cookies
    //check mail  in database if present then show login form



})

export {registerUser,loginUser} 