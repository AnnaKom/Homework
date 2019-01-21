$(document).ready(function(){

//функция, которая перемешивает массив
	function mix(mixArray) {
	  var index, valueIndex; 
	  for (var i=0; i<=mixArray.length-1; i++) {
		index = Math.floor(Math.random()*i);
		valueIndex = mixArray[index];
		mixArray[index] = mixArray[i];
		mixArray[i] = valueIndex;
	  }
	  return mixArray;
	}

	var img_opened; //открытая ячейка
	var img_root = 'pic/'; //Путь к папке с картинками
	var click_flag = 1;
	var moves = 0; //Кол-во кликов
	var game_array = [1,1,1,2,2,2,3,3,3,4,4,4]
/*	var game_array = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]*/ //Массив расположения картинок
	var img_num = 0;
	var second = 0, minute = 0; hour = 0;
	var timer = document.querySelector(".timer");
	var interval;
    var hasGameStarted = false;


//перемешиваем массив (картинки)
	mix(game_array);
	

//присваиваем каждому div id сгенерированный и класс=0
	$('.game div').each(function(){
		$(this).attr({'id':'num'+game_array[img_num],'class':'0'}); 
		img_num++;
	});	

//функция закрытия картинок, если они не одинаковые с задержкой
	function close(){
		setTimeout(function(){
		click_flag = 1; //разблокирываем обработку кликов
		$('.game div[class="1"]').css('backgroundImage', 'none'); //закрываем все картинки
		$('.game div[class="1"]').attr('class',0); //возвращаем класс в 0
		moves = 0; //сбрасываем счётчик кликов
		}, 1500);
	}

//функция таймер	
	function startTimer(){
        if (hasGameStarted !== true){

	    	interval = setInterval(function(){
	        timer.innerHTML = minute+" mins "+second+" secs";
	        second++;
	        	if(second == 60){
	            	minute++;
	            	second=0;
		        }
		        if(minute == 60){
		            hour++;
		            minute = 0;
		        }
	    	},1000);
            hasGameStarted = true;	    	
	   }
	}



//функция завершение игры
function endGame(){
	$('.game div').each(function(){	
		if($('.game div').attr('class') == 3){
		clearInterval(interval);
        document.querySelector(".totalTime").innerHTML = "Игра окончена! <br> Ваше время:<br>" + timer.innerHTML;
        document.querySelector(".totalTime").style.display = 'block';        
        document.querySelector(".timer").style.display = 'none';
        document.querySelector(".game").style.display = 'none';       
	}
});
}


	$('.game div').click(function(){ //Клик на игровом поле и открываем ячейку
	//Проверяем, надо ли обрабатывать нажатие
	startTimer();
		if (click_flag == 1){
			moves++; //Увеличивем счётчик нажатий
			//Открываем картинку
			$(this).attr('class',1).css('backgroundImage', 'url(' + img_root + $(this).attr('id').substr(3,1) + '.jpg)');
			if (moves === 1) {
				//Обработка открытия первой картинки (первый клик)  
				img_opened = $(this).attr('id'); //присваиваем открытой ячейке, номер который у div в id
			} else if (moves === 2) {
				//Обработка открытия второй картинки (второй клик)  
				//Проверяем открыта таже картинками
				if (img_opened != $(this).attr('id')){
					//Открыли не ту картинку, поэтому закрываем все открытые картинки через одну секунду
					click_flag = 0; //блокируем обработку кликов
					close();
				}
			} else {
				//Обработка открытия третей картинки (третий клик)
				//Проверяем открыта таже картинками
				if (img_opened != $(this).attr('id')){
					//Открыли не ту картинку, поэтому закрываем все открытые картинки через одну секунду
					click_flag = 0; //блокируем обработку кликов
					close();
				} else {
					//все три картинки нужные, поэтому присваиваем им класс 3, как правильные
					$('.game div[class="1"]').attr('class',3);		
					moves = 0; //сбрасываем счётчик кликов
				}

			}
					endGame();				
		}
	});

});
