let http = require('http'); // подключение модуля для работы с http
let fs = require('fs'); // подключение модуля для работы с файлом
let path = require('path'); //подключение модуля для работы с путями

let mimeTypes = {
'.html': 'text/html',
'.mp4': 'video/mp4' //mime тип для файлов формата .mp4
};

http.createServer((request, response) => {// вызов метода создания http сервера
let pathname, extname, mimeType;
console.log("Request: " + request.url);
console.log("Request: " + request.headers.range);
if (request.url === '/')
pathname = 'site/index.html';
else
pathname = 'site' + request.url;
extname = path.extname(pathname);
mimeType = mimeTypes[extname];


/*if (extname === '.mp4') {
fs.readFile(pathname, (err, data) => {
if (err) {
console.log('Could not find or open file for reading\n');
response.statusCode = 404;
response.end();
} else {
console.log(`The file ${pathname} is read and sent to the client\n`);
response.writeHead(200, {
'Content-Type':mimeType
});
response.end(data);
}
});
}*/ /*else {
fs.readFile(pathname, 'utf8', (err, data) => {
if (err) {
console.log('Could not find or open file for reading\n');
response.statusCode = 404;
response.end();
} else {
console.log(`The file ${pathname} is read and sent to the client\n`);
response.writeHead(200, {
'Content-Type':mimeType
});
response.end(data);
}
});
}*/



if (!fs.existsSync(pathname)) {//Функция existsSync проверяет существование запрашиваемого файла
console.log('Could not find or open file for reading\n');
response.statusCode = 404;
response.end();
return null;
}
//создаем пустой объект для будущего хранения заголовков ответа сервера
let responseHeaders = {};
//Функция statSync возвращает описание файла.
let stat = fs.statSync(pathname);
//Разбираем содержимое заголовка Range в запросе от браузера
let rangeRequest = readRangeHeader(request.headers['range'], stat.size); //stat.size – размер файла
//Проверяем, а был ли заголовок Range в запросе от браузера
if (rangeRequest == null) {
//Заголовка Range не было в запросе от браузера, а значит сразу полностью возвращаем
//файл
//Формируем заголовки ответа
responseHeaders['Content-Type'] = mimeType;
responseHeaders['Content-Length'] = stat.size; //Говорим размер файла
responseHeaders['Accept-Ranges'] = 'bytes'; //Говорим, что можем отдавать диапазонами
//Читаем и возвращаем файл с кодом 200
let video = fs.readFileSync(pathname);
console.log(`The file ${pathname} is read and sent to the client\n`);
response.writeHead(200, responseHeaders);
response.end(video);
return null;
}
let start = rangeRequest.start;
let end = rangeRequest.end;
//Проверяем соответствует ли запрашиваемый браузером диапазон размеру файла
if (start >= stat.size || end >= stat.size) {
// Запрашиваемый диапазон больше файла возвращаем код 416
responseHeaders['Content-Range'] = 'bytes */' + stat.size; //Размер файла
console.log("Return the 416 'Requested Range Not Satisfiable'");
response.writeHead(416, responseHeaders);
response.end();
return null;
}
let maxsize = 10240; /*Максимальный размер частичного контента 10KB (это значение выбрано для
примера, может быть задано другое из соображений производительности)*/
//Проверяем превышает ли запрашиваемый браузером диапазон максимальному размеру
if (end - start >= maxsize){
//Превышает, поэтому изменяем конечную границу диапазона
end = start + maxsize - 1;
}
//Формируем заголовки ответа с частичным контентом
responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;/*Отправляемый диапазон
с байтами */
responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
responseHeaders['Content-Type'] = mimeType;
responseHeaders['Accept-Ranges'] = 'bytes'; //Говорим, что отдаем диапазон с байтами
responseHeaders['Cache-Control'] = 'no-cache'; //не кешировать результат
//Считываем дескриптор файла, необходим для чтения части файла
const fd = fs.openSync(pathname, 'r'); //'r' – режим работы с файлом только чтение
/*Создаем буфер (специализированный числовой массив) для хранения прочитанных из файлов
байтов*/
let buf = Buffer.alloc(responseHeaders['Content-Length']);
/*Читаем часть файла. Вызываем функцию чтения со следующими аргументами: fd – дискриптор
файла, buf – буфер куда сохранить почитанные байты, 0 – позиция с которой надо писать в буфер,
buf.length – количество байтов для прочтения из файла, start – это позция в файле с которой читать
байты */
fs.read(fd, buf, 0, buf.length, start, (err, bytes) => {
if(err){
console.log(err);
response.statusCode = 500; //Отдаём ошибку в ответ клиенту
response.end();
} else {
//Отдаем часть файла и соответствующий статус 206
response.writeHead(206, responseHeaders);
response.end(buf);
}
});



}).listen(8080, ()=>{
console.log("HTTP server works in 8080 port!\n");
});



function readRangeHeader(range, totalLength) {
//range – содержимое заголовка «Range»
// totalLength – размер запрашиваемого файла
//проверяем задано ли содержимое заголовка «Range»
if (range == null || range.length == 0)
return null;
//с помощью регулярного выражения разбиваем строку из заголовка «Range»
//на массив из четырех значений
let array = range.split(/bytes=([0-9]*)-([0-9]*)/);
//забираем начальную позицию
let startRange = parseInt(array[1]);
//забираем конечную позицию
let endRange = parseInt(array[2]);
//формируем результирующий объект с двумя свойствами начало и конец диапозона:
let result = {
//если не указан начало диапазона, то присваиваем в качестве его значения 0
start: isNaN(startRange) ? 0 : startRange,
//если не указан конец диапазона, то присваиваем в качестве его значение конца
//запрашиваемого файла
end: isNaN(endRange) ? (totalLength - 1) : endRange
};
//Проверяем случай: начало не указано, а конец указан – значит запрашиваются данные с
//конца файла
if (isNaN(startRange) && !isNaN(endRange)) {
result.start = totalLength - endRange;
result.end = totalLength - 1;
}
return result;
}