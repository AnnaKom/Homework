const http = require('http'); // подключение модуля для работы с http
const fs = require('fs'); // подключение модуля для работы с файлом
const path = require('path'); // подключение модуля для работы с путями в файловой системе
const lang = process.argv[2];
const cp = require('child_process');
const child = cp.fork('./child.js');

http.createServer((request, response)=>{
	
	response.statusCode = 200;
	child.send({ //методу send передается объект, который будет передан дочернему процессу
		method: request.method, //свойство хранит http метод присланного запроса
		params: request.url //свойство хранит url присланного запроса
});
	response.end();
}).listen(8080, ()=>{
		console.log('Server run in 8080 port!');
	});

