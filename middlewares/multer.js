import multer from "multer"

const storage=multer.memoryStorage();//when ref is over from req.file,it deletes file

const singleupload=multer({storage}).single("file");

export default singleupload;