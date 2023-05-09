// Homepage displaying all the info about a single place.

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import PhotoGallery from "../PhotoGallery";
import PerksGrid from "../PerksGrid";

function PlaceHomePage() {
    const {id} = useParams();
    const [place, setPlace] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) return '';

    return (
        <div className="mt-4 bg-gray-100 mx-8 px-8 py-8 max-w-6xl self-center">
            <h1 className="text-3xl">{place.title}</h1>
            <a className="flex gap-1 my-3 block font-semibold underline" target='_blank' href={'https://maps.google.com/?q=' + place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {place.address}
            </a>

            {/* slideshow for photos */}
            <PhotoGallery place={place}/>
            <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4 text-[17px]">
                        <h2 className="font-semibold text-2xl mb-2">About the place</h2>
                        {place.description}
                    </div>
                    <div>
                        <b>Check-in after:</b> {place.checkIn}<br />
                        <b>Check-out before:</b> {place.checkOut}<br />
                        <b>Max guests:</b> {place.maxGuests}
                    </div>
                    <div className="mt-4">
                        <span className="text-[23px] text-primary font-bold tracking-tight">Hosted By {place.name}</span>
                    </div>
                    <div className="mt-4 pt-4 text-gray-700 border-t-[1px] border-gray-300">

                        <div>
                            <h2 className="font-semibold text-xl">What this place offers</h2>
                            <PerksGrid perks={place.perks} classes="my-4 grid grid-cols-2 gap-6"/>
                        </div>

                        <h2 className="mt-14 mb-2 font-semibold text-xl">Extra Info</h2>
                        {place.extraInfo}
                    </div>
                </div>

                <div>
                   <BookingWidget place={place}/>
                </div>
            </div>
        </div>
    );
}

export default PlaceHomePage;