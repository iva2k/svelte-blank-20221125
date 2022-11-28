<script lang="ts">
  import { Geolocation, type Position } from '@capacitor/geolocation';

  let loc: Position | null = null;
  async function getCurrentPosition() {
    const res = await Geolocation.getCurrentPosition();
    loc = res;
  }
  // TODO: (now) When geolocation fails, help user to enable it on their browser / device:
  // vivaldi://flags/#enable-winrt-geolocation-implementation
  // On Windows > Settings > Location Privacy >
  //   "Allow access to location on this device" = On,
  //   "Alolow apps to access your location" = On
  // Android / Chrome:
  // Change your default location settings
  //   1. On your Android phone or tablet, open the Chrome app.
  //   2. To the right of the address bar, tap More. Settings.
  //   3. Tap Site settings. Location.
  //   4. Turn Location on.
</script>

<div>
  <h1>Geolocation</h1>
  <p>Your location is:</p>
  <p>Latitude: {loc?.coords.latitude}</p>
  <p>Longitude: {loc?.coords.longitude}</p>

  <button on:click={getCurrentPosition}>Get Current Location</button>
</div>
