const bodyParser = require(`body-parser`),
    express = require(`express`),
    mongoose = require(`mongoose`),
    priceCon = require(`./controllers/priceCon.js`),
    port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname+ './../public'))

mongoose.connect(`mongodb://localhost/Camels`);
const db = mongoose.connection;
db.on(`error`, err => console.log(err));
db.once(`open`, () => console.log(`Mongoose working!`));

app.post(`/api/product`, priceCon.getProduct);

app.listen(port, () => console.log(`Listening on port ${port}!`));
