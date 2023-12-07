const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = (req, res, next) => {
  // const token = req.headers.token.split(" ")[1];
  jwt.verify(req.query.token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR",
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleWare = (req, res, next) => {
  // const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;
  //console.log("adasdsad", req.query.token, "sad", userId);

  jwt.verify(req.query.token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      // //console.log(err, "asdasd,", req.headers.token);
      return res.json(false);
    }
    if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR",
      });
    }
  });
};

module.exports = {
  authMiddleWare,
  authUserMiddleWare,
};
