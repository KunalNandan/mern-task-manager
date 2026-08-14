const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `Task Manager <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("Gmail email error:", error);
        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;