const { v2 } =require('cloudinary');
const fs=require('fs');



    // Configuration
    v2.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const uploadOnCloudinary=async (localfilepath)=>{
        try {
            if(!localfilepath) return null
            const responce=await v2.uploader.upload(localfilepath,{
                resource_type: "auto",
                
            });
            console.log('File Uplode Successfully',responce.url)

            return responce
            
        }catch(err)
        {
            fs.unlinkSync(localfilepath)//remove local save temp file
            return null;
        }
    }

module.exports={uploadOnCloudinary}
