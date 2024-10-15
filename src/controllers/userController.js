import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/user.models.js";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
    const {fullname,email,username,password} = req.body
    //validation
    if(
        [fullname,email,username,password].some((field)=> field?.trim==="")
    ){
        throw new ApiError(404, 'all fields are required')
    }
    // checking the user alreay exist or not
    const existingUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existingUser){
        throw new ApiError(409,'username or email already exists')
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path
    
    if(!avatarLocalPath){
        throw new ApiError(400,'avatar not found')
    }
    
    // let avatar =""
    // if(avatarLocalPath){
    //     avatar =await  uploadOnCloudinary(avatarLocalPath)
    // }
    // let coverImage =""
    // if(coverLocalPath){
    //     coverImage = await uploadOnCloudinary(coverLocalPath)
    // }

    // code refactoring
    let avatar
    try{
     avatar = await uploadOnCloudinary(avatarLocalPath)
     console.log('uploaded avatar',avatar);
     
    }catch(error){
       console.log('error uploading avatar',error);
       throw new ApiError(509,'error while uploading avatar')
       
    }

    let coverImage
    try{
        coverImage = await uploadOnCloudinary(coverLocalPath)
     console.log('uploaded avatar',coverImage);
     
    }catch(error){
       console.log('error uploading avatar',error);
       throw new ApiError(509,'error while uploading coverImage')
       
    }
    try {
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase() 
        })
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if(!createdUser){
            throw new ApiError(500,'something went wrong')
        }
    
        return res.status(201).json(new ApiResponse(200,createdUser, "user registered successfully"))
    } catch (error) {
        console.log('user creation failed');
        if(avatar){
            await deleteFromCloudinary(avatar.public_id)
        }
        if (coverImage) {
            await deleteFromCloudinary(coverImage.public_id)
        }

        throw new ApiError(500,'something went wrong while registering user and images were deleted')
    }
   
})

export {
registerUser
}