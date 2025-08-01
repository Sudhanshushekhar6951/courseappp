import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

export const  createCourse = async(req,res)=>{
    const adminId = req.adminId
   const{title,description,price}=req.body; 
   console.log(title,description,price);
   
   try {
    if(!title || !description || !price){
        return res.status(400).json({errors:"All field are required"})
    
    }
    const {image} = req.files
    if(!req.files || Object.keys(req.files).length===0) {
        return res.status(400).json({errors :"NO file uploaded"});
       
    }
   const allowedFormat = ["image/png", "image/jpeg"]
   if(!allowedFormat.includes(image.mimetype)){
    return res.status(400).json({errors:"Invalid file format. Only PNG and JPG are allowed"})
   }

   // cloudanary Code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if(!cloud_response || cloud_response.error){
            return res.status(400).json({errors : "Error uploading file to cloudinary" });

        }





    const courseData={
        title,
        description,
        price,
        image:{
            public_id: cloud_response.public_id,
            url: cloud_response.url,
        },
        creatorId:adminId
    }
    const course = await Course.create(courseData);
    res.json({
        message : "Course created successfully",
        course,
    });
   } 
   catch (error) {
    console.log(error);
    res.status(500).json({error:"Error creating course"});
    
    
   }
};
export const updateCourse = async(req,res)=>{
    const adminId = req.adminId
    const {courseId} = req.params;
    const{title,description,price,image} = req.body;
    try {
        const course = await Course.findOneAndUpdate({
            _id:courseId,
            creatorId:adminId,
        },{
            title,
            description,
            price,
            image: { 
                public_id: image?.public_id,
                url: image?.url,
            }
            
        });

        if(!course){
            return res.status(404).json({errors:"Can not update, created by other admin "})
        }
        res.status(201).json({message:"course udated successfully",course});

        
    } catch (error) {
        res.status(500).json({error:"Error in course updating"});
        console.log("Error in course updating" ,error);
        
        
    }
};
export const deleteCourse = async(req,res) =>{
    const adminId= req.adminId
    const {courseId} = req.params;
    try {
        const coures = await Course.findOneAndDelete({
            _id:courseId,
            creatorId: adminId,
        });
        if(!coures){
            return res.status(404).json({error:"can not delete created by other admin"})

        }
        res.status(200).json({message:"course deleted successfully"})
        
    } catch (error) {
        res.status(500).json({errors:"Error in course deleting"})
        console.log("Error in course  deleting",error);
        
    }
};
export const getCourses = async(req,res) =>{

    try {
        const courses = await Course.find({})
        res.status(201).json({ courses });

    } catch (error) {
        res.status(500).json({errors: "Errors in getting courses"})
        console.log("Error in getting course",error);
        
        
    }
};
export const courseDetails = async(req,res) =>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({error:"Courses not found" });
        }
        res.status(200).json({course});
        
    } catch (error) {
        res.status(500).json({errors:"Error in getting courses"});
        console.log("error to get courses", error);
        
        
    }
};
import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY) 
console.log(config.STRIPE_SECRET_KEY);



export const buyCourses = async(req,res) =>{
    const {userId} = req;
    const{courseId} = req.params;

   
    try {
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({errors:"Course not found"});
        }
        const existingPurchase=await Purchase.findOne({userId,courseId});
        if(existingPurchase){
            return res.status(400).json({errors:"User already puchased this course" });

        }

        // stripe payment code
        const amount = course.price; // Stripe expects amount in cents

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"]
        });
       

        res.status(201).json({message:"course purchased successfully" ,
            course,
            clientSecret: paymentIntent.client_secret, });



        
    } catch (error) {
        res.status(500).json({errors:"Error in course buying"});
        console.log("error in course buying",error)
 
    }
};
