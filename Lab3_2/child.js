const fs = require('fs');
const settings = require('./config.json');
process.on('message', (obj) => { // obj – переменная содержащая объект отправленный родителем
		logData = (new Date()).toString()+ " " + obj.method + " " + obj.params + "/n";//Код обработки сообщений от родительского процесса 
		fs.writeFile(settings.logFile, logData, {
			encoding:'utf8',
				flag:'a'
		}, (err)=>{
				if(err){
				console.log('Child: Can`t save log');
				} else {
				console.log('Child: Log save');
				}
		});
});