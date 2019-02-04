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
if (extname === '.mp4') {
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
} else {
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
}
}).listen(8080, ()=>{
console.log("HTTP server works in 8080 port!\n");
});