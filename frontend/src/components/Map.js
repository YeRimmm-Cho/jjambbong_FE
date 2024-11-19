import React, { useEffect } from 'react';
const { kakao } = window;

function Map(){
    useEffect(() => {  
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(33.4596128,126.9409073),
            level: 8
        };
        const map = new kakao.maps.Map(container, options);
    }
    , []);

        return (
            <div id="map" style={{width: '800px', height: '500px', margin:"50px"}}></div>
        )

}

export default Map;
