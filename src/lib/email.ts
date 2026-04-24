import nodemailer from "nodemailer";
import config from "../app/config";

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // TLS ব্যবহার করলে false হয়
        auth: {
            user: config.email_user,
            pass: config.email_pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        await transporter.sendMail({
            from: `"Cooking With Reina" <${config.email_user}>`,
            to,
            subject,
            html,
        });
        
        console.log(`✅ Email successfully sent to: ${to}`);
    } catch (error) {
        console.error("❌ Nodemailer Error:", error);
        throw new Error("Failed to send email");
    }
};