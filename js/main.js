$(window).load(function() {

  var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'September', 'November', 'December'];
  var icons = {
    'fog': 'haze',
    'clear': 'sun',
    'nt_clear': 'moon',
    'cloudy': 'cloud',
    'partlycloudy': 'cloud',
    'mostlycloudy': 'cloud',
    'snow': 'snow'
  };

  var location = 'Zagreb';
  var weather_data;
  var refresh_interval = 3600000;

  var Weather = {
    el: {
      cols: $('.forecast-col'),
      seconds: $('.seconds'),
      minutes: $('.minutes'),
      hours: $('.hours'),
      date: $('.date'),
      today: $('.today'),
      city: $('.city'),
      loader: $('.loader .compass'),
      time: $('.time')
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
    running: false,
    update: function(data){
      console.log(data);
      if (!Weather.running){
        Weather.displayTimeDate();
        Weather.el.time.addClass('animated fadeInDown');
      }

      if (Weather.el.loader.hasClass('animated')){
        Weather.el.loader.removeClass('rotate').addClass('rotateOut');
      }

      Weather.el.today.find('.temp').text(data.current_observation.feelslike_c);
      Weather.el.today.find('.day-label').text('Now');
      Weather.el.today.find('.climacon').addClass(icons[data.current_observation.icon]);

      if (!Weather.running){
        Weather.el.today.addClass('animated bounceIn');
      }

      var forecast = data.forecast.simpleforecast.forecastday;

      for (var i=0; i<Weather.el.cols.length; i++){
        // console.log(forecast[i]);
        var j = i+1;
        var $el = $(Weather.el.cols[j]);

        $el.find('.temp').html('<span class="high">' + forecast[i].high.celsius + '</span><span class="low">' + forecast[i].low.celsius + '</span>');
        $el.find('.climacon').addClass(icons[forecast[i].icon]);
        $el.find('.day-label').text(forecast[i].date.weekday);
        if (!Weather.running){
          $el.addClass('animated fadeInUp');
        }
      }

      Weather.el.city.text(data.location.city + ', ' + data.location.country_name);
      Weather.running = true;
    },
    init: function(){
      // First start, get user position and weather data
      if (!window.localStorage.getItem('weather')){
        Weather.el.loader.addClass('animated rotate');
        navigator.geolocation.getCurrentPosition(function(pos){
          console.log('getting user position');
          Weather.pos = pos;
          Weather.refreshData();
        });
      }
      // Weather data cached
      else {
        weather_data = JSON.parse(window.localStorage.getItem('weather'));
        var cached_time = new Date(weather_data.timestamp);
        var now = new Date();

        if (now - cached_time > refresh_interval){ //cached data older than 1hr, 3600000ms
          console.log('refresh');
          Weather.el.loader.addClass('animated rotate');
          Weather.pos = weather_data.pos;
          Weather.refreshData();
        }
        else {
          console.log('loading data from storage');
          Weather.update(weather_data.data);
        }
      }
      //Refresh weather data, +1000ms to make sure it doesn't use data from localstorage
      window.setTimeout(Weather.init, refresh_interval+1000);
    }
  };

  Weather.init();

}); //window.load end
