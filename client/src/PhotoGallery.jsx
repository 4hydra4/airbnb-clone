import { useState } from "react";

function PhotoGallery({place}) {
    
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-white text-black min-h-screen">
                <div className="bg-white p-8 grid gap-8">
                    <div>
                        <h2 className="text-3xl mr-48">{place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className=" fixed right-12 top-40 flex gap-1 py-2 px-4 rounded-2xl bg-primary text-white shadow shadow-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div className="max-w-5xl mx-auto">
                            <img src={'http://localhost:4000/uploads/' + photo} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
                <div>
                    {place.photos?.[0] && (
                        <div>
                            <img onClick={() => setShowAllPhotos(true)} className="aspect-square object-cover cursor-pointer" src={'http://localhost:4000/uploads/' + place.photos[0]} alt="" />
                        </div>
                    )}
                </div>
                <div className="grid">
                    {place.photos?.[1] && (
                        <img onClick={() => setShowAllPhotos(true)} className="aspect-square object-cover cursor-pointer" src={'http://localhost:4000/uploads/' + place.photos[1]} alt="" />
                    )}
                    <div className="overflow-hidden">
                        {place.photos?.[2] && (
                            <img onClick={() => setShowAllPhotos(true)} className="aspect-square object-cover cursor-pointer relative top-2" src={'http://localhost:4000/uploads/' + place.photos[2]} alt="" />
                        )}
                    </div>
                </div>
            </div>
            
            <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-1 px-3 bg-white rounded-xl shadow shadow-md shadow-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Show more photos
            </button>
        </div>
    );
}

export default PhotoGallery;