<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

  const restrict = false;
  let scanActive = false;
  let scanResult: string | undefined;
  let torchActive = false;

  const askPermissionDialog = async () => {
    return confirm(
      'We need your permission to use your camera to be able to scan QR and barcodes.'
    );
  };

  const checkPermission = async () => {
    // check if user already granted permission
    const passivePermission = await BarcodeScanner.checkPermission({ force: false });
    // TODO: (when needed) Catch  BarcodeScanner.checkPermission() thrown errors (e.g. for platforms that are not yet supported, such as web).

    if (passivePermission.granted) {
      // user granted permission before
      return true;
    }

    if (passivePermission.denied || passivePermission.restricted || passivePermission.unknown) {
      // user denied permission before
      return false;
    }

    if (passivePermission.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (!passivePermission.neverAsked) {
      return false;
    }
    if (!(await askPermissionDialog())) {
      return false;
    }

    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const activePermission = await BarcodeScanner.checkPermission({ force: true });

    if (activePermission.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (activePermission.granted) {
      // the user did grant the permission now
      return true;
    }

    if (activePermission.denied) {
      // On Android this will happen only when the user checks the box "never ask again"
      BarcodeScanner.openAppSettings();
    }

    // user did not grant the permission, so (s)he must have declined the request
    return false;
  };

  // Speed-up subsequent startScanner()
  const preloadScanner = () => {
    console.log('DEBUG: in prepareScanner()');
    BarcodeScanner.prepare();
  };

  const showPreview = async (show: boolean) => {
    // We need to change styling of top-level <body> to transparent for the preview to show through.
    // Use brute-force js.
    const body = document.querySelector('body');
    body?.classList[show ? 'add' : 'remove']?.('scanning');
    if (show) {
      BarcodeScanner.hideBackground(); // This supposedly handles top-level <html>
    } else {
      torchEnable(false);
      BarcodeScanner.showBackground();
    }
  };

  const pretendStartScanner = async () => {
    showPreview(true);
    scanActive = true;
  };

  const startScanner = async () => {
    const allowed = await checkPermission();

    if (allowed) {
      scanActive = true;
      showPreview(true);
      const result = await BarcodeScanner.startScan(
        restrict ? { targetedFormats: [SupportedFormat.QR_CODE] } : {}
      );

      if (result.hasContent) {
        scanActive = false;
        // alert(result.content); //The QR content will come out here
        scanResult = result.content;
        //Handle the data as your heart desires here
      } else {
        scanActive = false;
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  };

  const stopScanner = () => {
    console.log('DEBUG: in stopScanner()');
    if (scanActive) {
      showPreview(false);
      BarcodeScanner.stopScan();
      scanActive = false;
    }
  };

  const torchEnable = (enable: boolean) => {
    if (enable) {
      BarcodeScanner.enableTorch();
    } else {
      BarcodeScanner.disableTorch();
    }
    torchActive = enable;
  };

  const torchOn = () => {
    torchEnable(true);
  };
  const torchOff = () => {
    torchEnable(false);
  };

  onMount(preloadScanner);
  onDestroy(stopScanner);
</script>

<section>
  <h1>QR Scanner</h1>
  {#if scanActive}
    <div class="scan-toolbar">
      <button class="stop-button" on:click={stopScanner}>Stop</button>
      <button class="torch-button" on:click={torchOn} disabled={torchActive}>Light On</button>
      <button class="torch-button" on:click={torchOff} disabled={!torchActive}>Light Off</button>
    </div>
    <div class="scan-frame" />
  {:else}
    <div class="scan-button">
      <button on:click={startScanner}>Scan</button>
      <button on:click={pretendStartScanner}>Scan Pretend</button>
    </div>
    <div><p>{scanResult}</p></div>
  {/if}
</section>

<style>
  :global(html) {
    background: transparent;
  }
  :global(body.scanning) {
    /* background: none !important; */
    background: transparent !important;
    /* background-image: none !important; */
  }
  :global(main) {
    margin: 0 !important;
    max-width: none !important;
    padding-left: 0;
    padding-right: 0;
  }
  .scan-frame {
    border: 2px solid #fff;
    box-shadow: 0 0 0 100vmax rgb(0, 0, 0, 0.5);
    content: '';
    display: block;
    left: 50%;
    height: 300px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
  }
  .scan-button,
  .scan-toolbar {
    margin: 0px;
    position: absolute;
    bottom: 100px;
    width: 100vw;
    height: 50px;
    z-index: 11;
  }
</style>
