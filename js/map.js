var map;
var client_id="LHS3XITKSNVUUFTTL1H00KFPKGUXEOAKXWSGHYH4YLS2K4ME";
var client_secret="GA533VGUKR3VZOAU2MJJNNLPGCVPAF1MEMDLEVHILDB2MRMH";

// Breakfast Locations
var default_markers_arr = [
    {
        name: 'Zeit für Brot',
        lat: 52.5280121,
        lng: 13.4064094
    },
    {
        name: 'Ampelmann Restaurant',
        lat: 52.522178,
        lng: 13.3960306
    },
    {
        name: 'Barcomis Deli',
        lat: 52.5261981,
        lng: 13.3986956
    },
    {
        name: 'Alpenstueck Bäckerei',
        lat: 52.53003,
        lng: 13.390146
    },
    {
        name: 'Rose Garden Berlin',
        lat: 52.5285732,
        lng: 13.4072638
    },
    {
        name: 'Neumond Restaurant',
        lat: 52.5295541,
        lng: 13.387394
    },
    {
        name: 'Agon Backstube',
        lat: 52.5243932,
        lng: 13.4178797
    },
    {
        name: 'Beakers',
        lat: 52.5451882,
        lng: 13.4207497
    },
    {
        name: 'Factory Girl',
        lat: 52.5272992,
        lng: 13.3966694
    }
];

$(document).ready(function() 
{
    function set_layout_height() 
    {
        var window_height = $(window).innerHeight();
        $('#map').css('min-height', window_height);
        $('#search_sidebar').css('min-height', window_height);
    }

    set_layout_height();
    
    // When the window resizes set the layout height again
    $(window).resize(function() {
        set_layout_height();
    });

});

function application_view_model() 
{
    var curr_instance = this;

    this.search_option = ko.observable("");
    this.marker_arr = [];

    // Show infoWindow
    this.show_marker_info_window = function(marker, infowindow) 
    {
        if (infowindow.marker != marker) {

            infowindow.setContent('');
            infowindow.marker = marker;

            // Marker Information from Foursquare
            var url = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + client_id +
                '&client_secret=' + client_secret + '&query=' + marker.title +
                '&v=20170915' + '&m=foursquare';

            $.getJSON(url).done(function(marker) 
            {
                var _content='<h5 style="display: inline-block;"> Category : </h5><p style="display: inline-block;padding-left: 5px;">' + marker.response.venues[0].categories[0].shortName + '</p><div>' +
                '<h5 style="margin-top: 0px;"> Address: </h5>' +
                '<p>' + marker.response.venues[0].location.formattedAddress[0]  + '</p>' +
                '<p>' + marker.response.venues[0].location.formattedAddress[1]  + '</p>';

                if(marker.response.venues[0].location.formattedAddress[3] != null)
                    _content = _content + '<p>' + marker.response.venues[0].location.formattedAddress[3] + '</p>';
                
                if(marker.response.venues[0].location.formattedAddress[4] != null)
                    _content = _content +'<p>' + marker.response.venues[0].location.formattedAddress[4]  + '</p>';

                _content = _content + '</div></div>';

                infowindow.setContent(curr_instance.info_window_title + _content);
                
            }).fail(function() {
                alert("Unable to load Foursquare API. Please refresh your page to try again!");
            });

            this.info_window_title = '<div><h4>' + marker.title + '</h4>';
            infowindow.open(map, marker);
        }
    };

    this.stop_marker_animation = function(marker){
        marker.setAnimation(null);
    };

    this.show_marker_details = function() 
    {
        curr_instance.show_marker_info_window(this, curr_instance.info_window);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(curr_instance.stop_marker_animation,500,this);
    };

    this.initialize_google_map = function() 
    {
        var map_canvas = document.getElementById('map');
        var map_options = {
            center: new google.maps.LatLng(52.520645, 13.409779),
            zoom: 13,
            styles: [
                      {
                        "featureType": "administrative.land_parcel",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "administrative.neighborhood",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi",
                        "elementType": "labels.text",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.business",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.park",
                        "elementType": "labels.text",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "road",
                        "elementType": "labels",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "road.arterial",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "road.highway",
                        "elementType": "labels",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "road.local",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "water",
                        "elementType": "labels.text",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      }
                    ]
        };
        map = new google.maps.Map(map_canvas, map_options);

        this.info_window = new google.maps.InfoWindow();
        for (var k = 0; k < default_markers_arr.length; k++) 
        {   
            this.marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(default_markers_arr[k].lat,default_markers_arr[k].lng),
                lat: default_markers_arr[k].lat,
                lng: default_markers_arr[k].lng,
                animation: google.maps.Animation.DROP,
                title: default_markers_arr[k].name,
                id: k,
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });
            this.marker.setMap(map);
            this.marker_arr.push(this.marker);
            this.marker.addListener('click', curr_instance.show_marker_details);
        }
    };

    this.initialize_google_map();

    this.filter_locations = ko.computed(function() 
    {
        var data = [];
        for (var j = 0; j < this.marker_arr.length; j++) 
        {
            var temp = this.marker_arr[j];
            if (temp.title.toLowerCase().includes(this.search_option().toLowerCase())) 
            {
                data.push(temp);
                this.marker_arr[j].setVisible(true);
            } 
            else 
                this.marker_arr[j].setVisible(false);
        }
        return data;
    }, this);
}

function google_map_error() 
{
    alert('Unable to load Google Maps. Please refresh the page and try again!');
}

function initialize_application() 
{
    ko.applyBindings(new application_view_model());
}
