const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
const apiKey = '7dbb8d70285b4bf4b92067b93cd1ac7d';
//change the days from numbers to the name of the days
const weekdays = {
	0: 'Dom',
	1: 'Seg',
	2: 'Ter',
	3: 'Qua',
	4: 'Qui',
	5: 'Sex',
	6: 'Sab',
}
//standard city for getting the weather forecast
getForecast('Recife');
	
//change temperature
var temp = "c";
var tempEl = $('#current-temperature');
var Init = true;

//function to apply when switching the toggle from celsius to farehnheit
$("#tempToggle").on("click",function(){
	calcularTemp();
});

function calcularTemp(){
	// Get actual shown temperature
	var tempVal = parseFloat(tempEl.text());
	//console.log(tempEl.text());
	//console.log(tempVal);
	if(temp=="f"){
		temp="c";
		// Calculate
		var converted = (tempVal-32)/(9/5);
		// Set
		tempEl.text(converted.toFixed(1));
	}else{
		temp="f";
		// Calculate
		var converted = (tempVal*1.8)+32;
		// Set
		tempEl.text(converted.toFixed(1));
	}
//function to apply when switching the toggle from celsius to farehnheit to the next-days		
	$(".temperatures > span").each(function(idx, item){ 
			var tempWeek = $(item).text().replace('°','');
			if(temp!="f"){
				var converted = (parseFloat(tempWeek) - 32)/(9/5);
				$(item).text(converted.toFixed(1) + '°');
			}else{
				var converted = (parseFloat(tempWeek) * 1.8)+32;
				$(item).text(converted.toFixed(1) + '°');
			}
		});
}

//getting the full aspects of temperature by clicking the 'seach' button
$('#search').click(function(event){
	event.preventDefault();
	const newCity = $('#city').val();
	
	getForecast(newCity);
})

//function for getting items of forecast via API from the weather web-site
function getForecast(city){
	//using a loader icon as the script are requiring the information via API from the weather web-site
	$('#loader').css('display', '');
	$('#forecast').css('display', 'none');
	clearFields();

	$.ajax({
		url: baseURL,
		data: {
			key: apiKey,
			city: city,
			lang: 'pt'
		},
		success: function(result){
			//give the information back and empty the loader icon from our work space
			$('#loader').css('display', 'none');
			$('#forecast').css('display', '');
			$('#city-name').text(result.city_name);

			const forecast = result.data;
			
			const today = result.data[0];
			displayToday(today);
			const nextDays = forecast.slice(1);
			displayNextDays(nextDays);
			if(!Init){
				if(temp == "f"){
				temp="c";
				calcularTemp();
				}
			}
			Init = false;
		},
		error: function(error){
		}
	});
}
//empty the 15 next days information when we request a new city at the seach button
function clearFields() {
	$('#next-days').empty();
}
//stablish constants of all the information items get via API from weather forecast web-site to show currentday forecast
function displayToday(today) {
	const temperature = Math.round(today.temp);
	const weather = today.weather.description;
	const windSpeed = Math.round(today.wind_spd);
	const humidity = today.rh;
	const icon = today.weather.icon;
	const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
	

	
	$('#current-temperature').text(temperature);
	$('#current-weather').text(weather);
	$('#current-wind').text(windSpeed);
	$('#current-humidity').text(humidity);
	$('#weather-icon').attr('src', iconURL);
}
//stablish constants of all the information items get via API from weather forecast web-site to show next 15 days forecast
function displayNextDays(nextDays){
	$("#next-days").empty();
	for (i = 0; i < nextDays.length; i = i + 1) {
		const day = nextDays[i];
		const min = Math.round(day.min_temp);
		const max = Math.round(day.max_temp);
		const date = new Date(day.valid_date);
		const weekday = weekdays[date.getUTCDay()];

		const card = $(`<div class="day-card">
	          <div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
	          <div class="weekday">${weekday}</div>
	          <div class="temperatures">
	            <span class="max">${max}°</span>
	            <span class="min">${min}°</span>
	          </div>
	        </div>`);
		card.appendTo('#next-days');
	}	
}	





