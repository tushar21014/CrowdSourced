const jwt = require("jsonwebtoken");
// const { JWT_SECRET, WORKER_JWT_SECRET } = require("./config");

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];

        console.log("authHeader", authHeader);
        if (!authHeader) {
            console.log("Authorization header missing");
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1]; // Assuming the format is "Bearer <token>"
        
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded && decoded.userId) {
            req.userId = decoded.userId; // Attach userId to the request object
            next();
        } else {
            return res.status(403).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error("Error in authMiddleware", error);
        res.status(403).json({ message: "You are not logged in" });
    }
}

function workerMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"] || "";

    console.log(authHeader);
    try {
        const decoded = jwt.verify(authHeader, WORKER_JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            });
        }
    } catch (e) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }
}

module.exports = {
    authMiddleware,
    workerMiddleware
};
