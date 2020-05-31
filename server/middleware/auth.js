const {User} = require("../../models/User");

let auth = (req, res, next) => {
    //인증 처리

    //client 쿠키에서 token 을 가져옴
    let token = req.cookies.x_auth;
    //token 복호화후 user 를 찾음
    //user 가 있으면 인증 O
    //user 가 없으면 인증 X
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({isAuth: false, error: true});
        req.token = token;
        req.user = user;
        next();
    })
};

module.exports = { auth };