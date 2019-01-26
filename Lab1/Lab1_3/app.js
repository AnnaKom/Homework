const http = require('http'); // подключение модуля http
const fs = require('fs'); // подключение модуля для работы с файлом


http.createServer(response).listen(8080);// вызов метода создания http сервера

function response(req, res){
	fs.readFile('Header.html', 'utf8', (err, data)=>{
		if (err){
			console.log('Error');
			res.writeHead(404);
			res.end();
		} else {
			fs.readFile('Body.html','utf8',(err, data)=>{
			if (err){
				console.log('Error');
				res.writeHead(404);
				res.end();			
			} else {
				fs.readFile('Footer.html','utf8',(err, data)=>{
				if (err){
					console.log('Error');
					res.writeHead(404);
					res.end();
						} else {
							res.writeHead(200,{
							'Content-Type':'text/html'
							})
							res.write(data1+data2+data3);
							res.end()
						}
				});
			}
		});
	}
});

	res.writeHead()

}

