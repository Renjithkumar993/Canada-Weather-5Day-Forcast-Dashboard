


$(document).ready(function(){
    document.body.style.zoom="80%"
});



var today = dayjs().format('dddd, MMMM D YYYY');



$(".currentWeather").hide();
$(".last5search ").hide();



function openDialog() {
    $("#dialog").removeClass('d-none');
    $("#dialog").dialog({
        width: 500,
        show: {
            effect: "fade",
            duration: 1000
        },

        hide: {
            effect: "blind",
            duration: 500
        },
    });
}



var cityName = $("#cityname");
var APIKey = '9891ab8b2a22eb6de78aa870529a7d04';
var city = "";
var countryCode = "CA";
var lat = '';
var lon = '';
var storeCity = [];

$(".btnsearch").on('click', function () {

    city = cityName.val();
    displyCity();
    cityName.val(" ");
});



function displyCity() {
    $(".currentWeather").hide();
    $(".last5search ").hide();

   


    var currentWether = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey + '&units=metric';

    var locationDetailsFind = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + "," + countryCode + '&appid=' + APIKey;

    if (!city) {
        openDialog();
        $(".last5search .card").remove();


        return;
    } else {

        fetch(locationDetailsFind)
            .then(function (response) {
                return response.json();
            }
            )
            .then(function (data) {

                if (!data || !data[0]) {
                    openDialog();
                    $(".last5search .card").remove();
                    return;
                }

                $(".currentWeather").fadeIn(1000);
                $(".animate").removeClass('animate');
                $(".list-lastfive").show();
                $(".btn-secondary").hide();
                $(".list-lastfive").removeClass('list-lastfivehide');




                function saveCity(storeCity) {
                    storeCity = JSON.parse(localStorage.getItem("storeCity")) || [];

                    storeCity.unshift({
                        cityName: city
                    });
                    if (storeCity.length > 5) {
                        storeCity.pop();
                    }



                    var listsRealTime = $("<li>").addClass("list-group-item list-group-item-action fs-4 text-center").text(storeCity[0].cityName);

                    $(".list-lastfive").prepend(listsRealTime);

                    listsRealTime.hide();
                    listsRealTime.fadeIn(1000);


                    localStorage.setItem("storeCity", JSON.stringify(storeCity));

                    if ($(".list-group-item ").length >= 5) {

                        $(".list-group-item ")[5].remove()
                    }
                    else {
                        return;
                    }


                }


                saveCity();
                function getCities() {
                    storeCity = JSON.parse(localStorage.getItem("storeCity")) || [];


                }
                getCities();


                var lat = data[0].lat;
                var lon = data[0].lon;

                var forecastWether = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey + '&units=metric';

                fetch(forecastWether)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                        $(".last5search .card").remove();



                        for (var i = 0; i <= 40; i += 8) {

                            var imageCodeCast = data.list[i].weather[0].icon;

                            var forcastTime = data.list[i].dt_txt;
                            forcastTime = dayjs(forcastTime).format('dddd, MMMM D')

                            var temp = data.list[i].main.temp;
                          temp = Math.round(temp);

                          var humidity = data.list[i].main.humidity;
                          humidity = Math.round(humidity);

                          var wind = data.list[i].wind.speed;
                          wind = Math.round(wind);
                           

                            var forecast = $("<div>").addClass("card m-3 cardHover ").css("width", "18rem").append(
                                $("<h5>").addClass("card-title fs-5 text card-header").text(forcastTime),

                                

                                $("<img>").addClass("card-img-top").attr("src", "http://openweathermap.org/img/w/" + imageCodeCast + ".png").attr("alt", "weather conditon"),
                                $("<div>").addClass("card-body").append(

                                    $("<p>").addClass("card-text fs-5 ps-0 pe-0").text(data.list[i].weather[0].description + " with " + temp + " °C"),
                                    $("<p>").addClass("card-text fs-5 ps-0 pe-0").text(humidity+ " % Humidity"),
                                    $("<p>").addClass("card-text fs-5 ps-0 pe-0").text("Wind: " + wind+ " M/S")

                                   

                                )
                              



                            );

                           

                            $(".last5search ").append(forecast);
                            $(".last5search ").fadeIn(1500);





                        }

                        var forecast = " ";

                    });




                fetch(currentWether)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {

                     var ctemp = data.main.temp ;
                     ctemp = Math.round(ctemp);

                     var cFeel = data.main.feels_like;
                     cFeel = Math.round(cFeel);

                     var cWind = data.wind.speed ;
                     cWind = Math.round(cWind);



                        $(".card-title").text(data.name + " " + today);
                        $(".card-currenttemp").text("Currenlty " + " " + data.weather[0].description + " " + " with" + " " + ctemp+ " " + " °C");
                        $(".card-feellike").text("Feels like :" + " " + cFeel + " " + " °C");
                        $(".card-humid").text(data.main.humidity + " " + " %" + " " + "Humidity");
                        $(".card-wind").text("Wind :" + " " + cWind + " " + "M/S");
                        var imageCode = data.weather[0].icon;
                        $(".card-img").attr("src", "http://openweathermap.org/img/w/" + imageCode + ".png");

                    });





            })

    }
}



storeCity = JSON.parse(localStorage.getItem("storeCity")) || [];


for (i = 0; i < storeCity.length; i++) {
    var listsRealTime = $("<li>").addClass("list-group-item list-group-item-action fs-4 text-center ").text(storeCity[i].cityName);
    $(".list-lastfive").append(listsRealTime);


}

$(".list-lastfive").hide();


$(".btn-secondary").on('click', function () {
    $(".list-lastfive").slideToggle(1500)
})


$(".list-group-item ").on('click', function () {

    city = $(this).text();
    displyCity();
})









