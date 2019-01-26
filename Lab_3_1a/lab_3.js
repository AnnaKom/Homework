const http = require('http');
const fs = require('fs');

const lang = process.argv[2];

const server = http.createServer(function(req, res){
	if(lang === 'ru'){
		fs.readFile('ru.html', 'utf8', (err, data)=>{
			if (err) {
				console.log('Error file ru.html');
				res.statusCode = 500;
				res.end();
				return;
			} 
			
			res.writeHead(200, {
				'Content-Type':'text/html'
			});
			res.write(data);
			res.end();
		});
	} else {
		fs.readFile('en.html', 'utf8', (err, data)=>{
			if (err) {
				console.log('Error file ru.html');
				res.statusCode = 500;
				res.end();
				return;
			} 
			
			res.writeHead(200, {
				'Content-Type':'text/html'
			});
			res.write(data);
			res.end();
		});		
	}	
});

server.listen(8080);