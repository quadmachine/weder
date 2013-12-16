$(window).load(function() {

  var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'September', 'November', 'December'];
  var icons = {
    '01d': 'sun',
    '02d': 'cloud sun',
    '03d': 'cloud',
    '04d': 'cloud',
    '09d': 'showers',
    '10d': 'showers sun',
    '11d': 'lightning',
    '13d': 'snow',
    '50d': 'fog',
    '01n': 'moon',
    '02n': 'cloud moon',
    '03n': 'cloud',
    '04n': 'cloud',
    '09n': 'showers',
    '10n': 'showers moon',
    '11n': 'lightning',
    '13n': 'snow',
    '50n': 'fog'
  };

  var location = 'Zagreb';

  var Weather = {
    el: {
      cols: $('.forecast-col'),
      seconds: $('.seconds'),
      minutes: $('.minutes'),
      hours: $('.hours'),
      date: $('.date')
    },
    displayTimeDate: function(){
      var today = new Date();
      Weather.el.hours.text(today.getHours());
      Weather.el.minutes.text(((today.getMinutes() < 10) ? '0' : '') + today.getMinutes());
      Weather.el.seconds.text(((today.getSeconds() < 10) ? '0' : '') + today.getSeconds());
      Weather.el.date.text(weekday[today.getDay()] + ', ' +  month[today.getMonth()] + ' ' + today.getDate());
      window.setTimeout(Weather.displayTimeDate, 1000);
    },
    refresh: function(){
      Weather.displayTimeDate();
      $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + location + '&mode=json&units=metric&cnt=5',
        success: function(data){
          console.log(data);
          for (var i=0; i<data.list.length; i++){
            $(Weather.el.cols[i]).find('.temp').text(data.list[i].temp.day.toFixed(1));
            var day = new Date();
            day.setTime(data.list[i].dt + '000');
            wday = day.getDay();
            $(Weather.el.cols[i]).find('.day-label').text(weekday[wday]);
            $(Weather.el.cols[i]).find('.climacon').addClass(icons[data.list[i].weather[0].icon]);
          }
        },
        dataType: 'jsonp'
      });
    },
    init: function(){
      Weather.refresh();
    }
  };

  Weather.init();

}); //window.load end
