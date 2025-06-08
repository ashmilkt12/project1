const User = require('../model/user');

const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.admin) {
        return res.redirect("/admin/login")
    }
    next();
};

const preventAuthAccess = (req, res, next) => {
    if (req.session && req.session.admin) {
        return res.redirect("/admin/dashboard");
    }
    next();
};
module.exports = { authMiddleware, preventAuthAccess };
