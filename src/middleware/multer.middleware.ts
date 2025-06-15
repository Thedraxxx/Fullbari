
import multer, { Multer } from "multer";

const storage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null,"/server/public/temp");// it says no error save it in this folder
    },
    filename: (req,file,cb)=>{
        cb(null, file.originalname)
    }
}); 
const limits = {
    fileSize: 5 * 1024 * 1024,
}
const upload = multer({
    storage,
    limits
})

export default upload;
