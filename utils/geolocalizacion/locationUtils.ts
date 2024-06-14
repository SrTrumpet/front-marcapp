// Función para convertir grados a radianes
function deg2rad(deg) {
    return deg * (Math.PI/180);
}

  // Función para calcular la distancia entre dos coordenadas geográficas
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la tierra en km
    const dLat = deg2rad(lat2 - lat1); // Convertir delta de latitud de grados a radianes
    const dLon = deg2rad(lon2 - lon1); // Convertir delta de longitud de grados a radianes
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distancia en km
    return d * 1000; // Convertir distancia a metros
}

export { getDistanceFromLatLonInM };
