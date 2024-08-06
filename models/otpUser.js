const mongoose = require("mongoose");
const validator = require("validator");

const userOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    otp: {
        type: String,
        required: true
    }
});

const userotp = mongoose.model("userotps", userOtpSchema);

module.exports = userotp;
