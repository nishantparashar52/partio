import L from 'leaflet';
// Fix default icon paths for bundlers
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl, iconUrl, shadowUrl,
});
