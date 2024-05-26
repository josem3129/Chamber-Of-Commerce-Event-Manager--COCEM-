const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("You don't have access")
    }
    next()
};

const checkLogin = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.redirect('/')
    }
    next()
}

module.exports = {isAuthenticated, checkLogin}