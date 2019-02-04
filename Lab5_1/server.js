let express = require('express'); //подключаем модуль express
let app = express(); //создаем приложение express
let route = require('./routes/products.js'); //подключаем файл с роутом
app.use('/products', route); /*регистрируем роут, все url начинающиеся с /products будут
передаваться в обработку в этот роут*/
app.listen(3000);