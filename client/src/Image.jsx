function Image({src, ...properties}) {
    src = src && src.includes('https://') ? src : 'http://localhost:4000/uploads/' + src;

    return (
        <img {...properties} src={src} alt={''} />
    );
}

export default Image;