const socket = io();


if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('sendLocation', { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}

const myMap = L.map("map").setView([0, 0], 14);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

const marker = L.marker([0, 0]).addTo(myMap);

socket.on('receiveLocation', (location) => {
    const {id, latitude, longitude } = location;
    myMap.setView([latitude, longitude], 14);
    if (marker[id]){
    marker[id].setLatLng([latitude, longitude]);
    }
    else{
        marker[id] = L.marker([latitude, longitude]).addTo(myMap);
    }
});

socket.on('userDisconnect', (id) => {
    if(marker[id]){
        myMap.removeLayer(marker[id]);
        delete marker[id];
    }
});