const bcrypt = require('bcrypt');
const users = require("../models/userSchema");
const userotp = require("../models/otpUser");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {

        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

exports.userregister = async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if the email already exists
        const puser = await users.findOne({ email: email });

        if (puser) {
            // If user exists, send error message
            return res.status(400).json({ error: "This user already exists!" });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new users({
                userName: userName,
                email: email,
                password: hashedPassword
            });

            // Save user to database
            const storeData = await user.save();
            res.status(200).json(storeData);
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Data", message: error.message });
    }
};


//send otp 


exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Please Enter Your Email" });
    }

    try {
        const puser = await users.findOne({ email: email });

        if (puser) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existingOtp = await userotp.findOne({ email: email });

            if (existingOtp) {
                const updateData = await userotp.findByIdAndUpdate(
                    { _id: existingOtp._id },
                    { otp: OTP },
                    { new: true }
                );
                await updateData.save();

                const mailSettings = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For OTP Validation",
                    text: `OTP: ${OTP}`
                };

                transporter.sendMail(mailSettings, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "Failed to send OTP" });
                    } else {
                        res.status(200).json({ message: "OTP sent successfully" });
                    }
                });
            } else {
                const saveOtp = new userotp({
                    email,
                    otp: OTP
                });
                await saveOtp.save();

                const mailSettings = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For OTP Validation",
                    text: `OTP: ${OTP}`
                };

                transporter.sendMail(mailSettings, (error, info) => {
                    if (error) {
                        console.log("Failed to send OTP:", error); // Log the full error message
                        res.status(400).json({ error: "Failed to send OTP" });
                    } else {
                        res.status(200).json({ message: "OTP sent successfully" });
                    }
                });
            }
        } else {
            res.status(400).json({ error: "User Not Exist" });
        }
    } catch (error) {
        res.status(400).json({ error: "An error occurred", message: error.message });
    }
    
};

exports.userLogin = async(req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await userotp.findOne({email:email});

        if(otpverification.otp === otp){
            const preuser = await users.findOne({email:email});

            // token generate
            const token = await preuser.generateAuthtoken();
           res.status(200).json({message:"User Login Succesfully Done",userToken:token});

        }else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};