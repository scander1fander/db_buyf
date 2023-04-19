const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("../model/model");
const auth = require('../routes/auth.routes');
const path = require("path");
const fileUploads = require("express-fileupload");

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", auth);

//Таблица товары//
app.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await db.product.findByPk(productId);
  
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
  
    return res.json(product);
  });
app.get("/products", async (req, res) => {
    try {
        const products = await db.product.findAll();
        res.json(products);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});
app.get("/products/:catId", async (req, res) => {
  const category = req.params.catId;
  try {
      const products = await db.product.findAll({ where: { catid: category } });
      res.json(products);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

app.post('/product', async (req, res) => {
  const { name, price, amount } = req.body;

  try {
    const existingProduct = await db.product.findOne({ where: { name } });

    if (existingProduct) {
      return res.status(409).send('Товар уже существует');
    }

    const newProduct = await db.product.create({ name, price, amount });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Ошибка сервера');
  }
});


app.post(
  "/photo/create",
  fileUploads({tempFileDir: true}),
  (req, res) => {
      console.log(req)
      if(!req.files.photo){
          res.send({success: false});
          return;
      }

      const Id="kkkk00"+ ".jpg";


      const Path = path.join(
          __dirname,
          "..",
          "/img",
          Id
      );
      req.files.photo.mv(Path);
      console.log(path)

      const type = req.files.photo.mimetype;

      
      db.photo.create({path:Path, type});

  

      res.send({success: true, Id})
  }

);

app.get("/photo/:photoId",async (req,res) =>{
  const id = req.params.photoId;
  const photo= await db.photo.findByPk(id)
  console.log(photo)
  if (!photo){
      res.sendStatus(404);
      return;
  
  }
  res.setHeader("Content-Type", photo.type)
  res.sendFile(photo.path);
})
const PORT = process.env.PORT || 8081;
db.sequelize.sync({ alter: true });
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

