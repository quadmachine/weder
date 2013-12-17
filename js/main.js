$(window).load(function() {

  var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'September', 'November', 'December'];
  var icons = {
    'fog': 'haze',
    'clear': 'sun',
    'nt_clear': 'moon',
    'partlycloudy': 'cloud',
    'mostlycloudy': 'cloud'
  };

  var location = 'Zagreb';
  var weather_data;

  var Weather = {
    el: {
      cols: $('.forecast-col'),
      seconds: $('.seconds'),
      minutes: $('.minutes'),
      hours: $('.hours'),
      date: $('.date'),
      today: $('.today'),
      city: $('.city')
    },
    displayTimeDate: function(){
      var today = new Date();
      Weather.el.hours.text(((today.getHours() < 10) ? '0' : '') + today.getHours());
      Weather.el.minutes.text(((today.getMinutes() < 10) ? '0' : '') + today.getMinutes());
      Weather.el.seconds.text(((today.getSeconds() < 10) ? '0' : '') + today.getSeconds());
      Weather.el.date.text(weekday[today.getDay()] + ', ' +  month[today.getMonth()] + ' ' + today.getDate());
      window.setTimeout(Weather.displayTimeDate, 1000);
    },
    refreshData: function(){
      $.ajax({
        // url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + location + '&mode=json&units=metric&cnt=5',
        url: 'http://api.wunderground.com/api/f73f87cbdbefb320/conditions/geolookup/forecast10day/q/' + Weather.pos.coords.latitude + ',' + Weather.pos.coords.longitude + '.json',
        success: function(data){
          weather_data = {
            timestamp: new Date(),
            pos: Weather.pos,
            data: data
          };
          localStorage.setItem('weather', JSON.stringify(weather_data));
          console.log('saved weather data');

          Weather.update(data);
        },
        dataType: 'jsonp'
      });
    },
    update: function(data){
      console.log(data);
      Weather.displayTimeDate();

      Weather.el.today.find('.temp').text(data.current_observation.feelslike_c);
      Weather.el.today.find('.climacon').addClass(icons[data.current_observation.icon]);

      var forecast = data.forecast.simpleforecast.forecastday;

      for (var i=0; i<Weather.el.cols.length; i++){
        // console.log(forecast[i]);
        var j = i+1;
        var $el = $(Weather.el.cols[j]);

        $el.find('.temp').html('<span class="high">' + forecast[i].high.celsius + '</span><span class="low">' + forecast[i].low.celsius + '</span>');
        $el.find('.climacon').addClass(icons[forecast[i].icon]);
        $el.find('.day-label').text(forecast[i].date.weekday);
      }

      Weather.el.city.text(data.location.city + ', ' + data.location.country_name);
    },
    init: function(){
      if (!window.localStorage.getItem('weather')){
        navigator.geolocation.getCurrentPosition(function(pos){
          console.log('getting user position');
          Weather.pos = pos;
          Weather.refreshData();
        });
      }
      else {
        weather_data = JSON.parse(window.localStorage.getItem('weather'));
        var cached_time = new Date(weather_data.timestamp);
        var now = new Date();

        if (now - cached_time > 3600000){ //cached data older than 1hr, 3600000ms
          console.log('refresh');
          Weather.pos = weather_data.pos;
          Weather.refreshData();
        }
        else {
          console.log('loading data from storage');
          Weather.update(weather_data.data);
        }
      }
    }
  };

  Weather.init();

}); //window.load end
