const moongose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "abcdefghijklmnop"



const userSchema = new moongose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
        
    },
    email:{
        type:String,
        required:true,
        unique:true,

        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
                }
        }
    },
    password:{
        minlenght:6,
        type:String,
        required:true
        },
        
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                }
            }
        ]
})

//hash
userSchema.methods.generateAuthtoken = async function(){
    try {
        let newtoken = jwt.sign({_id:this._id},SECRECT_KEY,{
            expiresIn:"1d"
        });

        this.tokens = this.tokens.concat({token:newtoken});
        await this.save();
        return newtoken;
    } catch (error) {
        res.status(400).json(error)
    }
}

  

     



const users = new moongose.model("users",userSchema);

module.exports = users;

