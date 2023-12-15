const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const PostRouter = require("./PostRouter");
const StoreRouter = require("./StoreRouter");
const OrderRouter = require("./OrderRouter");
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
  // app.use('/api/payment', PaymentRouter)
};

module.exports = routes;
