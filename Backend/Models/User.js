const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

async function GenerateHash(password){
    const COST = 12;
    return bcrypt.hash(password,COST);
}

const UserSchema = mongoose.Schema({
    Name:{type:String, required:true,},
    Apellido:{ type:String, required:true,},
    Cedula:{ type:Number, required:true,},
    Usuario:{ type:String, required:true, unique:true},

});


module.exports = ('User',UserSchema);

/*
const UserSchema = mongoose.Schema({
    username:{
type:{},required:true,index:{unique:true}

    },
    password:{
        type:{},required:true,GenerateHash:true
    },

});

async function GenerateHash(password){
    const COST = 12;
    return bcrypt.hash(password,COST);
}
module.exports = ("PasswordSchema",UserSchema);

*/
