const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const TfIdf = require("node-tfidf");
const fs = require("fs");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);
mongoose.set("strictQuery", false);

app.get("/", (req, res) => {
  res.send("Hello world everyone");
});

app.get("/train-model", (req, res) => {
  const dataset = JSON.parse(fs.readFileSync("src/data.json", "utf-8"));
  // console.log(dataset) ;
  // // Chuẩn bị dữ liệu đầu vào và đầu ra
  const idPost = []; // Tiêu đề bài viết dự đoán
  const inputTitles = []; // Tiêu đề bài viết
  dataset.forEach((value) => {
    idPost.push(value._id);
    inputTitles.push(value.title.toLowerCase());
  });
  console.log(inputTitles[0].split(" "));

  const tfidf = new TfIdf();

  inputTitles.forEach((value) => {
    tfidf.addDocument(value);
  });
  var s = JSON.stringify(tfidf);
  console.log("tfidf", tfidf);
  fs.writeFileSync("model.json", s);

  res.send("train model");
});

app.get("/main-train", (req, res) => {
  const aaa = fs.readFileSync("model.json", "utf-8");
  var tfidf = new TfIdf(JSON.parse(aaa));

  const dataset = JSON.parse(fs.readFileSync("src/data.json", "utf-8"));

  let viewed_data = [
    ["product"],

    // ["product", "metrics", "Orchestrator"]
  ];

  let trainData1 = [];
  let data_ = [];
  viewed_data.forEach((value) => {
    tfidf.tfidfs(value, function (i, measure) {
      // console.log('document #' + idPost[i] + ' is ' + measure);
      if (measure > 0) {
        console.log(dataset[i].title);
        console.log(data_.indexOf(dataset[i].title));
        if (data_.indexOf(dataset[i].title) < 0) {
          let dataa = {
            ...dataset[i],
            similarities: measure,
          };

          trainData1.push(dataa);
        }
      }
    });
  });

  // console.log(trainData1);
  // console.log("length ----------------");
  // console.log(trainData1.length);
  // res.send(trainData1);
});
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    //console.log("connect success");
  })
  .catch((err) => {
    //console.log(err);
  });

app.listen(port, () => {
  //console.log("Server is running in port:  ", +port);
});
