const { auth } = require("./middleware/auth");
const { User } = require("../models/User");
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/key');

const app = express();

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());


//회원가입 기능 구현
app.post('/api/users/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        })
    })
});

//login 기능 구현
app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾음
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일이 맞는지 확인해주십시오."
            })
        }

        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({
                loginSuccess: false,
                message: "비밀번호가 맞는지 확인해주십시오."
            })

            //비밀번호가 맞다면 token생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //token 저장(Cookie)
                res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user._id
                })
            })
        })
    });
});

app.get('/api/users/auth', auth, (req, res) => {
    //auth = true
    res.status(200).json({
        _id: req.user_id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    //로그아웃 하려는 유저를 DB에서 검색
    User.findOneAndUpdate({ _id: req.user._id},
        //token 지우기
        { token: "" }
        ,(err, user) => {
        if (err) return res.json({ success: false, err});
        return res.status(200).send({
            success: true
        })
    })
})

const port = 5000;
app.listen(port, () => console.log('Example app listening on port %d', port));