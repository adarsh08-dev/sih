/**
 * Location Resolution & Geographic Normalization Service
 * Provides multi-tier geolocation (GPS + Reverse Geocoding + IP Fallback)
 * and canonical state mapping for accurate location detection.
 */

// Known canonical city to state mapping for normalization
const INDIAN_CITY_STATE_MAP: Record<string, string> = {
  bareilly: 'Uttar Pradesh',
  lucknow: 'Uttar Pradesh',
  kanpur: 'Uttar Pradesh',
  noida: 'Uttar Pradesh',
  'greater noida': 'Uttar Pradesh',
  ghaziabad: 'Uttar Pradesh',
  agra: 'Uttar Pradesh',
  varanasi: 'Uttar Pradesh',
  prayagraj: 'Uttar Pradesh',
  allahabad: 'Uttar Pradesh',
  meerut: 'Uttar Pradesh',
  aligarh: 'Uttar Pradesh',
  moradabad: 'Uttar Pradesh',
  gorakhpur: 'Uttar Pradesh',
  jhansi: 'Uttar Pradesh',
  mathura: 'Uttar Pradesh',
  ayodhya: 'Uttar Pradesh',
  faizabad: 'Uttar Pradesh',
  firozabad: 'Uttar Pradesh',
  muzaffarnagar: 'Uttar Pradesh',
  budaun: 'Uttar Pradesh',
  pilibhit: 'Uttar Pradesh',
  shahjahanpur: 'Uttar Pradesh',
  rampur: 'Uttar Pradesh',
  sitapur: 'Uttar Pradesh',
  hardoi: 'Uttar Pradesh',
  unnao: 'Uttar Pradesh',
  raebareli: 'Uttar Pradesh',
  sultanpur: 'Uttar Pradesh',

  // Uttarakhand
  dehradun: 'Uttarakhand',
  haridwar: 'Uttarakhand',
  rishikesh: 'Uttarakhand',
  haldwani: 'Uttarakhand',
  roorkee: 'Uttarakhand',
  nainital: 'Uttarakhand',
  rudrapur: 'Uttarakhand',
  kashipur: 'Uttarakhand',
  pantnagar: 'Uttarakhand',
  almora: 'Uttarakhand',
  mussoorie: 'Uttarakhand',

  // Delhi NCR
  delhi: 'Delhi NCR',
  'new delhi': 'Delhi NCR',
  gurugram: 'Haryana',
  gurgaon: 'Haryana',
  faridabad: 'Haryana',

  // Karnataka
  bengaluru: 'Karnataka',
  bangalore: 'Karnataka',
  mysuru: 'Karnataka',
  mysore: 'Karnataka',
  hubballi: 'Karnataka',
  mangalore: 'Karnataka',

  // Telangana & Andhra Pradesh
  hyderabad: 'Telangana',
  secunderabad: 'Telangana',
  warangal: 'Telangana',
  visakhapatnam: 'Andhra Pradesh',
  vijayawada: 'Andhra Pradesh',

  // Maharashtra
  mumbai: 'Maharashtra',
  pune: 'Maharashtra',
  nagpur: 'Maharashtra',
  nashik: 'Maharashtra',
  navi_mumbai: 'Maharashtra',
  thane: 'Maharashtra',

  // Tamil Nadu
  chennai: 'Tamil Nadu',
  coimbatore: 'Tamil Nadu',
  madurai: 'Tamil Nadu',

  // West Bengal
  kolkata: 'West Bengal',
  howrah: 'West Bengal',
  durgapur: 'West Bengal',

  // Rajasthan
  jaipur: 'Rajasthan',
  jodhpur: 'Rajasthan',
  udaipur: 'Rajasthan',
  kota: 'Rajasthan',

  // Gujarat
  ahmedabad: 'Gujarat',
  surat: 'Gujarat',
  vadodara: 'Gujarat',
  rajkot: 'Gujarat',
  gandhinagar: 'Gujarat',

  // Madhya Pradesh
  indore: 'Madhya Pradesh',
  bhopal: 'Madhya Pradesh',
  gwalior: 'Madhya Pradesh',
  jabalpur: 'Madhya Pradesh',

  // Punjab & Chandigarh
  chandigarh: 'Punjab / Chandigarh',
  mohali: 'Punjab / Chandigarh',
  ludhiana: 'Punjab',
  amritsar: 'Punjab',

  // Kerala
  kochi: 'Kerala',
  cochin: 'Kerala',
  thiruvananthapuram: 'Kerala',
  trivandrum: 'Kerala',
  kozhikode: 'Kerala',

  // Bihar & Jharkhand
  patna: 'Bihar',
  gaya: 'Bihar',
  ranchi: 'Jharkhand',
  jamshedpur: 'Jharkhand',

  // Odisha & Assam
  bhubaneswar: 'Odisha',
  cuttack: 'Odisha',
  guwahati: 'Assam'
};

export interface LocationResult {
  location: string;
  city: string;
  state: string;
  country: string;
  lat?: number;
  lng?: number;
  source: 'gps' | 'ip' | 'fallback';
}

/**
 * Normalizes city and state names to correct geographic administrative boundaries.
 */
export function normalizeLocationString(rawCity?: string, rawState?: string, rawCountry?: string): string {
  let city = (rawCity || '').trim();
  let state = (rawState || '').trim();
  let country = (rawCountry || 'India').trim();

  // Strip generic suffixes like "District", "Tehsil", "Division", "Cantonment"
  city = city.replace(/\s*(District|Tehsil|Division|Cantonment|Sub-district|Mandal|Nagar Nigam|City)$/i, '').trim();

  const cityLower = city.toLowerCase();

  // Check known mapping for correct state
  if (cityLower && INDIAN_CITY_STATE_MAP[cityLower]) {
    state = INDIAN_CITY_STATE_MAP[cityLower];
  }

  // If city is empty, fallback gracefully
  if (!city) city = 'Bareilly';
  if (!state) state = 'Uttar Pradesh';
  if (!country) country = 'India';

  return `${city}, ${state}, ${country}`;
}

/**
 * Multi-tier Geolocation resolver:
 * 1. High/Low Accuracy HTML5 GPS
 * 2. BigDataCloud / Nominatim Reverse Geocoding
 * 3. IP Geolocation Fallback (for iframes or disabled GPS)
 */
export async function detectAccurateLocation(): Promise<LocationResult> {
  // Step 1: Try GPS with reverse geocoding
  if (typeof window !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (err) => {
            if (err.code === 3 || err.code === 2) {
              // Try fallback low accuracy
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
                timeout: 6000,
                maximumAge: 60000
              });
            } else {
              reject(err);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 7000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = pos.coords;

      // Tier 1A: BigDataCloud Reverse Geocode Client (fast & accurate)
      try {
        const bdcRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (bdcRes.ok) {
          const bdcData = await bdcRes.json();
          const city = bdcData.locality || bdcData.city || bdcData.principalSubdivisionDistrict || 'Bareilly';
          const state = bdcData.principalSubdivision || 'Uttar Pradesh';
          const country = bdcData.countryName || 'India';
          const loc = normalizeLocationString(city, state, country);

          return {
            location: loc,
            city,
            state,
            country,
            lat: latitude,
            lng: longitude,
            source: 'gps'
          };
        }
      } catch {
        // Fall through to Nominatim
      }

      // Tier 1B: OpenStreetMap Nominatim
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
      );
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        const address = nomData.address || {};
        const city = address.city || address.town || address.village || address.suburb || address.city_district || address.county || 'Bareilly';
        const state = address.state || 'Uttar Pradesh';
        const country = address.country || 'India';
        const loc = normalizeLocationString(city, state, country);

        return {
          location: loc,
          city,
          state,
          country,
          lat: latitude,
          lng: longitude,
          source: 'gps'
        };
      }
    } catch {
      // GPS failed or permission denied in preview iframe, proceed to IP fallback
    }
  }

  // Step 2: IP-Based Geolocation Fallback (works across iframes and sandboxes)
  try {
    const ipRes = await fetch('https://ipapi.co/json/');
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.city && ipData.region) {
        const city = ipData.city;
        const state = ipData.region;
        const country = ipData.country_name || 'India';
        const loc = normalizeLocationString(city, state, country);

        return {
          location: loc,
          city,
          state,
          country,
          lat: ipData.latitude,
          lng: ipData.longitude,
          source: 'ip'
        };
      }
    }
  } catch {
    // Fall through to secondary IP provider
  }

  try {
    const ipWhoRes = await fetch('https://ipwho.is/');
    if (ipWhoRes.ok) {
      const whoData = await ipWhoRes.json();
      if (whoData.success && whoData.city) {
        const city = whoData.city;
        const state = whoData.region || 'Uttar Pradesh';
        const country = whoData.country || 'India';
        const loc = normalizeLocationString(city, state, country);

        return {
          location: loc,
          city,
          state,
          country,
          lat: whoData.latitude,
          lng: whoData.longitude,
          source: 'ip'
        };
      }
    }
  } catch {
    // All remote methods failed
  }

  // Step 3: Default Safe Fallback
  const defaultLoc = normalizeLocationString('Bareilly', 'Uttar Pradesh', 'India');
  return {
    location: defaultLoc,
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    source: 'fallback'
  };
}

/**
 * Synchronizes updated location to all storage keys and dispatches
 * real-time events to update all mounted views simultaneously.
 */
export function syncLocationAcrossApp(newLocation: string, lat?: number, lng?: number) {
  if (!newLocation || !newLocation.trim()) return;

  const trimmed = newLocation.trim();

  // 1. Direct location key
  localStorage.setItem('userLocation', trimmed);

  // 2. User profile storage
  try {
    const rawProfile = localStorage.getItem('userProfile');
    let profile = rawProfile ? JSON.parse(rawProfile) : {};
    profile.location = trimmed;
    if (lat !== undefined) profile.lat = lat;
    if (lng !== undefined) profile.lng = lng;
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (e) {
    console.warn('Error updating userProfile location:', e);
  }

  // 3. Fallback sb_user_profile storage
  try {
    const rawSb = localStorage.getItem('sb_user_profile');
    if (rawSb) {
      const sb = JSON.parse(rawSb);
      sb.location = trimmed;
      localStorage.setItem('sb_user_profile', JSON.stringify(sb));
    }
  } catch (e) {
    // ignore
  }

  // 4. Custom portfolio data storage
  try {
    const rawPortfolio = localStorage.getItem('ladder_student_portfolio_custom');
    if (rawPortfolio) {
      const portfolio = JSON.parse(rawPortfolio);
      portfolio.location = trimmed;
      localStorage.setItem('ladder_student_portfolio_custom', JSON.stringify(portfolio));
    }
  } catch (e) {
    // ignore
  }

  // 5. Broadcast real-time custom event to all React components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ladder_location_updated', {
        detail: { location: trimmed, lat, lng }
      })
    );
    window.dispatchEvent(new Event('storage'));
  }
}
