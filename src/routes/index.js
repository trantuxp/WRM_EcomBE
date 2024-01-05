const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const PostRouter = require("./PostRouter");
const StoreRouter = require("./StoreRouter");
const OrderRouter = require("./OrderRouter");
const CartRouter = require("./CartRouter");
const EvaluateRouter = require("./EvaluateRouter");
const ReplyEvaluateRouter = require("./ReplyEvaluateRouter");
const SearchRouter = require("./SearchRouter");

// const PaymentRouter = require('./PaymentRouter')

const routes = (app) => {
  app.use("/api/user", UserRouter);
  // app.use("/api/user/page", (req, res) => {
  //   res.send("user page");
  // });

  app.use("/api/product", ProductRouter);
  app.use("/api/post", PostRouter);
  app.use("/api/store", StoreRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/evaluate", EvaluateRouter);
  app.use("/api/reply", ReplyEvaluateRouter);
  app.use("/api/search", SearchRouter);
  // app.use('/api/payment', PaymentRouter)
};

module.exports = routes;
