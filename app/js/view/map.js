import React, {Component} from 'react';
import {Alert, Image, TouchableOpacity, View} from 'react-native';

import MapView from 'react-native-maps';

// import Gestures from 'react-native-touch-gestures';

import {styles} from '../styles/styles';
import {images} from '../utils/images';

import {playSound} from '../actions';
import {sendLocation} from '../client';

//'59.9547';
//'30.3275';

let delta = 0.005;
// let delta = 0.05;
// let delta = 3;

export let map = {};

export class Map extends Component {

    constructor(props) {

        super(props);

        map.setUser = (user) => {

            let markers = this.getMarkers();

            let place = markers.place(user);

            if (place > -1)
                markers[place] = user;

            else
                markers.push(user);

            this.setState({
                markers: markers
            });
        };

        map.removeUser = (id) => {

            let markers = this.getMarkers();

            let place = markers.place({id: id});

            //TODO check this, may be bug
            if (place > -1)
                markers.remove(id);

            this.setState({
                markers: markers
            });
        };

        map.zoom = (bias) => {

            delta *= bias;

            if (delta < 0.005)
                delta = 0.005;

            if (delta > 1)
                delta = 1;

            this.setState({
                region: {
                    latitude: this.getRegion().latitude,
                    longitude: this.getRegion().longitude,
                    latitudeDelta: delta,
                    longitudeDelta: delta
                }
            });
        };

        map.play = () => {

            this.setState({
                style: styles.gameMap,
                opacity: styles.opacity7,
            });
        };

        map.main = () => {

            this.setState({
                style: styles.map,
                opacity: styles.opacity2,
            });
        };

        this.state = {
            style: styles.map,
            opacity: styles.opacity2,
            region: {
                latitude: 59.9547,
                longitude: 30.3275,
                latitudeDelta: delta,
                longitudeDelta: delta
            },
            markers: []
        };

        this.setLocation = this.setLocation.bind(this);
        this.getRegion = this.getRegion.bind(this);
        this.getMarkers = this.getMarkers.bind(this);

        navigator.geolocation.watchPosition(this.setLocation, (error) => {

            }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    getRegion() {
        return this.state.region;
    }

    getMarkers() {
        return this.state.markers;
    }

    setLocation(position) {

        const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: delta,
            longitudeDelta: delta
        };

        //TODO
        if (region === this.getRegion())
            return;

        // playSound();

        sendLocation(region);

        this.setState({
            region: region
        });
    }

    render() {
        return (
            <View
                style={this.state.opacity}>

                <MapView
                    style={this.state.style}
                    region={this.state.region}
                >
                    {this.state.markers.map(marker => (

                        <MapView.Marker
                            coordinate={marker.region}
                            key={marker.id}
                            title={marker.title}
                            description={marker.description}
                        >
                            <Image source={images.goose}
                                   style={styles.gameUser}/>

                        </MapView.Marker>

                    ))}

                </MapView>

            </View>
        );
    }
}

export function placeUser(user) {

    user.region = {
        latitude: user.latitude,
        longitude: user.longitude,
    };

    map.setUser(user);
}


export function removeUser(id) {
    map.removeUser(id);
}

export function changeUserImage() {

}

export function buildMap(map) {

    // let home = map.home;

    console.log(map);

    let users = map.users;

    console.log('users');
    console.log(users);

    for (let id in users) {
        // placeUser(users[id]);
        // Alert.alert(id);
    }

    let npc = map.npc;

    let arrayLength = npc.length;
    for (let i = 0; i < arrayLength; i++) {
        setNPC(npc[i]);
        // Alert.alert(npc[i]);
    }

    // let items = map.items;

    // let stores = map.stores;
}

//yes, this is ducks. users is a ducks too. everything is a duck. its a DuckScript
//this is npc
function setNPC(duck) {

    // console.log("NPC")
    placeUser(duck);
}

Array.prototype.place = function (obj) {

    let i = this.length;
    while (i--) {

        if (this[i].id == obj.id) {
            return i;
        }
    }
    return -1;
};


Array.prototype.remove = function (id) {

    let i = this.length;
    while (i--) {

        if (this[i].id == id) {
            this.splice(i, 1);
        }
    }
};