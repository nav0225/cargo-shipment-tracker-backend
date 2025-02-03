exports.calculateETA = (shipment) => {
    const toRad = x => x * Math.PI / 180;
    const R = 6371; // Earth radius in km
  
    const getDistance = (from, to) => {
      const dLat = toRad(to[1] - from[1]);
      const dLon = toRad(to[0] - from[0]);
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(from[1])) * Math.cos(toRad(to[1])) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
        
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };
  
    try {
      const route = shipment.route;
      const currentIndex = route.findIndex(p => p.location === shipment.currentLocation);
      
      if(currentIndex === -1 || currentIndex >= route.length - 1) {
        return shipment.currentEta; // No change if invalid position
      }
  
      let totalDistance = 0;
      for(let i = currentIndex; i < route.length - 1; i++) {
        totalDistance += getDistance(
          route[i].coordinates,
          route[i+1].coordinates
        );
      }
  
      const hoursNeeded = totalDistance / (shipment.averageSpeed || 50);
      return new Date(Date.now() + hoursNeeded * 60 * 60 * 1000);
    } catch(err) {
      return shipment.currentEta;
    }
  };