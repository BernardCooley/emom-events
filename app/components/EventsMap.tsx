import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { EventDetails } from "@/types";
import { useRouter } from "next/navigation";

const containerStyle = {
    width: "100%",
    height: "100%",
};

interface Props {
    events: EventDetails[];
    itemHovered: string;
}

const EventsMap = ({ events, itemHovered }: Props) => {
    const [hoveredId, setHoveredId] = useState<string | null>(itemHovered);
    const router = useRouter();
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [libraries] = useState<Library[]>(["places"]);
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: libraries,
    });

    useEffect(() => {
        setHoveredId(itemHovered);
    }, [itemHovered]);

    useEffect(() => {
        if (map) getNewBounds(events, map);
    }, [events, map]);

    const getNewBounds = (events: EventDetails[], map: google.maps.Map) => {
        const bounds = new google.maps.LatLngBounds();

        events
            .map((event) => {
                return {
                    lat: event.venue.latitude,
                    lng: event.venue.longitude,
                };
            })
            .forEach((marker) => {
                const newPoint = new google.maps.LatLng(marker.lat, marker.lng);
                bounds.extend(newPoint);
            });

        const newBounds = new window.google.maps.LatLngBounds(
            {
                lat: bounds.getSouthWest().lat(),
                lng: bounds.getSouthWest().lng(),
            },
            {
                lat: bounds.getNorthEast().lat(),
                lng: bounds.getNorthEast().lng(),
            }
        );

        map.fitBounds(newBounds);
        if (events.length === 1) {
            setTimeout(() => {
                map.setZoom(10);
            }, 10);
        }

        return newBounds;
    };

    const onLoad = React.useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback() {
        setMap(null);
    }, []);

    return (
        isLoaded && (
            <GoogleMap
                mapContainerStyle={containerStyle}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {events.map((event) => (
                    <Marker
                        onMouseOver={() => {
                            setHoveredId(event.id);
                        }}
                        onMouseOut={() => {
                            setHoveredId(null);
                        }}
                        animation={
                            hoveredId === event.id
                                ? google.maps.Animation.BOUNCE
                                : undefined
                        }
                        key={event.id}
                        title={`${event.name} at ${event.venue.name}`}
                        position={{
                            lat: Number(event.venue.latitude),
                            lng: Number(event.venue.longitude),
                        }}
                        onRightClick={() => {
                            console.log("right click");
                        }}
                        onDblClick={() => {
                            console.log("double click");
                        }}
                        onClick={() => router.push(`/events/${event.id}`)}
                    ></Marker>
                ))}
            </GoogleMap>
        )
    );
};

export default EventsMap;
