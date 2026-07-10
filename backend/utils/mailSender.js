const nodemailer=require("nodemailer");
require("dotenv").config();

const mailSender=async(email,title,body)=>{
    try {
        const transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.MAIL_PORT || 587,
            secure:process.env.MAIL_SECURE === "true",
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        const info=await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        }) 

        return info;


    } catch (error) {
        console.error("Error occurred while sending email:", error.message);
        throw error;
    }
}

module.exports=mailSender;