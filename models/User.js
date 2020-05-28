const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

//user 정보
const userSchema = mongoose.Schema({
   name: {
       type: String,
       maxlength: 50
   } ,

    email: {
       type: String,
        trim: true,
        unique: 1
    },

    password: {
       type: String,
        minlength: 8
    },

    role: {
       type: Number,
        default: 0
    },

    image: String,

    token: {
       type: String
    },

    tokenExp: {
       type: Number
    }
});


userSchema.pre('save', function ( next ) {
    //비밀번호 암호화
    const user = this;

    //비밀번호를 바꿀 때만
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, callbck) {
    //
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return callbck(err);
        callbck(null, isMatch);
    })
};

userSchema.methods.generateToken = function (callbck) {
    //jsonwebtoken을 이용하여 token생성
    const user = this;
    const token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token
    user.save(function (err, user) {
        if (err) return callbck(err);
        callbck(null, user);
    })
};

userSchema.statics.findByToken = function (token, callbck) {
    const user = this;

    //token 을 decode
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //user id 를 이용해서 유저를

        user.findOne({"_id": decoded, "token": token}, function (err, user) {
            if (err) return callbck(err);
            callbck(null, user);
        })
    })
};


const User = mongoose.model('User', userSchema);

module.exports = { User };