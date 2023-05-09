// root page that lists all the places from all the hosts. 
// places are fetched from the 'places' collection.

import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function IndexPage () {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div className="mt-8 px-4 lg:px-20 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {places.length > 0 && places.map(place => (
        <Link to={'/places/' + place._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/' + place.photos?.[0]} alt="" />
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm truncate text-gray-500 leading-4">{place.title}</h3>
          <div className="mt-1">
            <div className="underline">
              <span className="font-bold">&#8377;{place.price}</span> per night
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default IndexPage;