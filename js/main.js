

$(document).ready(function(){

	//var key = 'AIzaSyDIOBqiDX7Ef9XBAKNJscUS0hbr00W0z3Y';
	var locat;
	var map;
	var service;
	var radius = '5000';

	function show_history(place,status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			console.log(place);
			var photo = place.photos;
			if(photo){
				var url = photo[0].getUrl({'maxWidth':2000,'maxHeight': 2000});
			}
			else {
				var url = '../images/1.jpg';
			}

			var add = `<div class="card">
					    <div class="blurring dimmable image">
					    	<img src="`+ url + `">
					    </div>
					    <div class="content">
					      <a class="header getId" id="`+ place.place_id +`">` + place.name + `</a>
					      <div class="meta">
					        <span class="date">` + place.vicinity + `</span>
					      </div>
					    </div>
					    <div class="extra content">
					      <a>
					        <img src="` + place.icon + `"/><p><b>
					        `+ place.types[0] + `</b></p>
					      </a>
					    </div>
			  		</div>`;
			$(add).insertBefore($('.addHCards'));
		}
	}

	function loadHistory() {
		var id = getCookie('ID');
		id = id.split(',');
		for(x in id) {
			var request = {
			  placeId: id[x],
			};

			service = new google.maps.places.PlacesService(map);
			service.getDetails(request, show_history);
		}
	}

	$('.history').on('click',function(){
		if($('#history').css('display')== 'none'){
			$('#history').show();
		}
		if($('#refresh').css('display')!= 'none'){
			$('#refresh').hide();
		}
		loadHistory();
	});

	function setCookie(id) {
		var d = new Date();
		d.setTime(d.getTime()+(1*24*60*60*1000));
		var expire = "expire="+d.toUTCString();
		document.cookie = "ID="+id+"; "+expire;
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	}

	function checkCookie() {
	    var user = getCookie("ID");
	    if(user!=''){
	    	return user;
	    }
	    else {
	    	return 0;
	    }
	}

	function show_modal(place,status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			console.log(place);
			console.log(place.name);
			var photo = place.photos;
			if(photo){
				var url = photo[0].getUrl({'maxWidth':2000,'maxHeight': 2000});
			}
			else {
				var url = '../images/1.jpg';
			}

			var details = `<b>PHONE NUMBER : </b>`+place.formatted_phone_number+`<br><b>INTERNATIONL NUMBER : </b>`+place.international_phone_number+`<br><b>WEBSITE : </b><a href="`+ place.website +`">`+ place.website +`</a><br><b>TYPE : </b>`+ place.types[0]+`<br>`;
			$('#name').html(place.name);
			$('#rating').attr("data-rating",Math.floor(place.rating));
			$('#image').attr("src",url);
			$('#main_description').html(place.formatted_address);
			$('#details').html(details);
			$('.rating').rating('disable');

			$('.modal').modal('show');
		}
	}

	$(document.body).on('click','.getId',function(){
		var id = $(this).attr('id');
		var flag =0;
		if(checkCookie()) {
			var all = getCookie('ID');
			//alert(all);
			var al = all.split(',');
			for(x in al) {
				if(al[x] == id) {
					flag = 1;
					break;
				}
			}
			if(flag == 0){
				all = id +','+all;
				setCookie(all);
			}
		}
		else{
			setCookie(id);
		}
		var request = {
		  placeId: id,
		};

		service = new google.maps.places.PlacesService(map);
		service.getDetails(request, show_modal);
	});

	function callback(result,status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			console.log(result);
			for(x in result) {
				//console.log(result[x].name);
				var photo = result[x].photos;
				if(photo){
					var url = photo[0].getUrl({'maxWidth':2000,'maxHeight': 2000});
				}
				else {
					var url = '../images/1.jpg';
				}

				var add = `<div class="card">
						    <div class="blurring dimmable image">
						    	<img src="`+ url + `">
						    </div>
						    <div class="content">
						      <a class="header getId" id="`+ result[x].place_id +`">` + result[x].name + `</a>
						      <div class="meta">
						        <span class="date">` + result[x].vicinity + `</span>
						      </div>
						    </div>
						    <div class="extra content">
						      <a>
						        <img src="` + result[x].icon + `"/><p><b>
						        `+ result[x].types[0] + `</b></p>
						      </a>
						    </div>
				  		</div>`;
				$(add).insertBefore($('.addCards'));
			}
		}
		else {
			console.log('some error');
			var add = `<div class="row">
							<p>Some error occured. Please try later.</p>
						</div>`;
		}
	}

	function get_details(latitude,longitude) {
	  	console.log(latitude);
		console.log(longitude);
		
		locat = new google.maps.LatLng(latitude,longitude);

		map = new google.maps.Map(document.getElementById('map'), {
	      center: location,
	      zoom: 15
	    });

	    var request = {
			location: locat,
			radius: radius,
			types: []
		};

		service = new google.maps.places.PlacesService(map);
  		service.nearbySearch(request, callback);

	}


	function onPageLoad() {
		navigator.geolocation.getCurrentPosition(function(location) {
			var latitude = location.coords.latitude;
			var longitude = location.coords.longitude;
			get_details(latitude,longitude);
		});
	}

	onPageLoad();

	$('.refresh').click(function() {	
	    if($('#history').css('display')!= 'none'){
			$('#history').hide();
		}
		if($('#refresh').css('display')== 'none'){
			$('#refresh').show();
		}
	});

});


