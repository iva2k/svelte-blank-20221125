<!-- <script type="module" lang="ts">
  import QrScanner from 'qr-scanner';
</script> -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import QrScanner from 'qr-scanner';

  import Drawer from '$lib/components/drawer/Drawer.svelte';
  let drawerOpen = false;

  import { GEARS_ENTITY, CAMERA_FLASH_ENTITY } from '$lib/constants/entities';
  import SEO from '$lib/components/seo/SEO.svelte';
  const pageTitle = 'QR Scanner';
  const pageCaption = 'QR Scanner page';
  const seoProps = { pageTitle, pageCaption, slug: 'qrscanner' };

  const doAutostart = true;
  const resultDisplayTime_ms = 5000; // Time to keep the scan result on page.
  const drawerAnimation_s = 0.25; // Time to animate Drawer open/close.

  const styles = [
    { className: 'default-style', name: 'Default style' },
    { className: 'example-style-1', name: 'Example custom style 1' },
    { className: 'example-style-2', name: 'Example custom style 2' }
  ];
  let style = styles[2].className;

  let scanner: QrScanner | null = null;

  let video: HTMLVideoElement | undefined;
  let camList: HTMLSelectElement | undefined;

  let scanActive = false;
  let scanResult: string | undefined;
  let haveCamera = false;
  let haveFlash = false;
  let isFlashOn = false;
  let camQrResultMsg = '';
  let camQrResultNew = false;
  let camQrResultNewTimer: ReturnType<typeof setTimeout> | null;
  let camQrResultTimestampMsg = '';

  function setResultEx(timestamp: string, value: string, newResult: boolean) {
    camQrResultTimestampMsg = timestamp;
    camQrResultMsg = value;
    camQrResultNew = newResult;
  }
  function clearTimer(doResetNew = true) {
    if (camQrResultNewTimer) {
      clearTimeout(camQrResultNewTimer);
      camQrResultNewTimer = null;
    }
    if (doResetNew) {
      camQrResultMsg = '';
      camQrResultNew = false;
    }
  }
  function setResult(
    result: QrScanner.ScanResult | undefined,
    error: string | Error | undefined = undefined
  ) {
    const timestamp = new Date().toString();
    if (error) {
      if (!camQrResultNew && camQrResultMsg !== error.toString()) {
        setResultEx(timestamp, error.toString(), false);
      }
    } else if (result && result.data) {
      console.log('QR Scanner: ', result.data, timestamp);
      scanResult = result.data;
      if (camQrResultMsg === result.data) {
        camQrResultTimestampMsg = timestamp;
      } else {
        clearTimer(false);
        setResultEx(timestamp, result.data, true);
        camQrResultNewTimer = setTimeout(clearTimer, resultDisplayTime_ms);
      }
    }
  }

  function preloadScanner() {
    console.log('DEBUG: in preloadScanner()');
    // https://github.com/nimiq/qr-scanner

    // ####### Web Cam Scanning #######
    if (video) {
      // See https://w3c.github.io/picture-in-picture/#dom-htmlvideoelement-disablepictureinpicture :
      // (video as { disablePictureInPicture: boolean }).disablePictureInPicture = true;
      video.setAttribute('disablepictureinpicture', 'true'); // Has no effect on Vivaldi. Only vivaldi://settings/webpages "Picture-In-Picture Button on Videos" has effect
      video.removeAttribute('controls'); // This removes "controls" boolean attribute
      scanner = new QrScanner(video, (result) => setResult(result), {
        onDecodeError: (error) => setResult(undefined, error),
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: 'environment'
        // calculateScanRegion?: (video: HTMLVideoElement) => QrScanner.ScanRegion;
        // maxScansPerSecond?: number;
        // overlay?: HTMLDivElement;
        // returnDetailedScanResult?: true;
      });

      if (doAutostart) {
        onStart()?.then(() => onUpdateCameraList()); // Autostart
      } else {
        onUpdateCameraList();
      }

      // for debugging
      (window as unknown as { scanner: QrScanner | undefined }).scanner = scanner;
    }
  }
  onMount(preloadScanner);

  function unloadScanner() {
    scanner?.destroy();
    scanner = null;
  }
  onDestroy(unloadScanner);

  function onUpdateCameraList() {
    // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
    // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
    // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
    // start the scanner earlier.
    QrScanner?.hasCamera().then((hasCamera) => {
      haveCamera = hasCamera;
    });
    QrScanner?.listCameras(true).then((cameras) => {
      let pref: QrScanner.Camera | undefined;
      // camList.clear(2); // TODO: clear list elements after # 2 when re-running
      cameras.forEach((camera) => {
        const option = document.createElement('option');
        option.value = camera.id;
        option.text = camera.label;
        if (camList) {
          camList.add(option);
        }
        // Example of how to select an heuristic preferred camera
        // TODO: (when needed) convert the code to check against a list, so can keep database of special devices - mostly ones with multi-cameras need that. Also maintain a mirror flag to fix user-facing autodetection.
        if (camera.label.startsWith('camera2 0')) {
          pref = camera; // {label: 'No camera2 0 found in list', list, id: 'environment'}
        }
      });
      if (pref && scanner)
        // console.log('Using Camera: ', pref)
        scanner.setCamera(pref.id).then(
          () => {
            // Camera Set
          },
          (err) => console.log('Failed to set camera', err)
        );
    });
  }
  const updateFlashAvailability = () => {
    scanner?.hasFlash().then((hasFlash) => {
      haveFlash = hasFlash;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onStyleSelect(select: HTMLSelectElement) {
    // style = select.value;
    // reposition the highlight for cases when style sets "position: relative"
    // scanner?._updateOverlay(); // Private method. TypeScript throws warnings.
    if (typeof window === 'object') {
      // if (typeof Event === 'function') {
      //   // modern browsers
      window.dispatchEvent(new Event('resize')); // Same effect as scanner?._updateOverlay()
      // We don't care of IE anymore
      // } else {
      //   // for IE and other old browsers
      //   // causes deprecation warning on modern browsers
      //   var evt = window.document.createEvent('UIEvents');
      //   evt.initUIEvent('resize', true, false, window, 0);
      //   window.dispatchEvent(evt);
      // }
    }
  }

  function onRegionSelect(target: HTMLInputElement) {
    const label = target.parentNode;
    if (scanner) {
      if (label) {
        label.parentNode?.insertBefore(scanner.$canvas, label.nextSibling);
      }
      scanner.$canvas.style.display = target.checked ? 'block' : 'none';
    }
  }

  function onModeSelect(target: HTMLSelectElement) {
    scanner?.setInversionMode(target.value as QrScanner.InversionMode);
  }

  function onCamSelect(target: HTMLSelectElement) {
    scanner?.setCamera(target.value).then(updateFlashAvailability);
  }

  function getFlashState() {
    isFlashOn = !!scanner?.isFlashOn();
  }
  function onFlash(enable: boolean | undefined = undefined) {
    const fnc =
      enable === undefined
        ? scanner?.toggleFlash
        : enable
        ? scanner?.turnFlashOn
        : scanner?.turnFlashOff;
    if (fnc) fnc().then(getFlashState);
  }

  function onStart() {
    return scanner
      ?.start()
      .then(() => {
        scanActive = true;
        updateFlashAvailability();
      })
      .catch((e) => {
        // handle error
        console.error('Error %o in QrScanner.start()', e);
      });
  }
  function onStartClick() {
    onStart();
  }

  function onStopClick() {
    scanActive = false;
    scanner?.stop();
  }
</script>

<SEO {...seoProps} />

{#if true}
  <div class="drawerContainer" class:open={drawerOpen}>
    <Drawer
      open={drawerOpen}
      size="300px"
      duration={drawerAnimation_s}
      on:clickAway={() => (drawerOpen = false)}
      placement="right"
    >
      <button on:click={() => (drawerOpen = false)}>Close ></button>
      <div class="demo">
        <label>
          Highlight Style
          <select
            id="scan-region-highlight-style-select"
            bind:value={style}
            on:change={(e) => onStyleSelect(e.currentTarget)}
          >
            {#each styles as s}
              <option value={s.className}>{s.name}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="demo">
        <select id="inversion-mode-select" on:change={(e) => onModeSelect(e.currentTarget)}>
          <option value="original">Scan original (dark QR code on bright background)</option>
          <option value="invert"
            >Scan with inverted colors (bright QR code on dark background)</option
          >
          <option value="both">Scan both</option>
        </select>
      </div>
      <div class="demo">
        <span><b>Device has camera:</b> {haveCamera ? 'Has Camera' : 'Camera not found'}</span>
        <b>Preferred camera:</b>
        <select bind:this={camList} id="cam-list" on:change={(e) => onCamSelect(e.currentTarget)}>
          <option value="environment" selected>Environment Facing (default)</option>
          <option value="user">User Facing</option>
        </select>
      </div>
      <div class="demo">
        <b>Detected QR code: </b>
        <span id="cam-qr-result" class:new={camQrResultNew}
          >{camQrResultMsg} ({camQrResultNew})</span
        >
        <br />
        <b>Last detected at: </b>
        <span id="cam-qr-result-timestamp">{camQrResultTimestampMsg}</span>
      </div>
      <div class="demo">
        <label>
          <input
            id="show-scan-region"
            type="checkbox"
            on:change={(e) => onRegionSelect(e.currentTarget)}
          />
          Show scan region canvas
        </label>
      </div>
      <div class="demo" />
    </Drawer>
  </div>
{/if}

<section id="container">
  <div id="video-container" class={style}>
    <div id="video-overlay" />
    <!-- TODO: (now) Use <video poster="..."></video> -->
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      class:active={scanActive}
      class:inactive={!scanActive}
      bind:this={video}
      id="qr-video"
      muted
      on:contextmenu={() => false}
    />
  </div>
</section>

<div id="middle">
  <div class="toolbar-left">
    {#if scanActive}
      <button disabled={!haveFlash} on:click={() => onFlash()}>
        {CAMERA_FLASH_ENTITY}
      </button>
    {/if}
  </div>

  <div class="middle-space">
    <div id="header">
      <h1>{pageTitle}</h1>
    </div>
  </div>

  <div class="toolbar-right">
    <button class="drawerBtn" on:click={() => (drawerOpen = true)}>{GEARS_ENTITY}</button>
  </div>
</div>

{#if true}
  <div id="footer">
    {#if scanner}
      {#if scanActive}
        <div class="scan-toolbar">
          <div class="stop-button">
            <button class="stop-button" on:click={onStopClick}>Stop</button>
          </div>
        </div>
      {:else}
        <div class="scan-button">
          <div>
            <button on:click={onStartClick}>Scan</button>
          </div>
        </div>
        <!-- <div><p>{scanResult}</p></div> -->
      {/if}
    {:else}
      <div>Loading...</div>
    {/if}
  </div>
{/if}

<style lang="scss">
  /* Set container to cover the whole window */
  #container {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    min-width: 100vw;
    width: 100vw !important;
    min-height: 100vh;
    height: 100vh !important;
  }

  #footer {
  }

  #header {
    h1 {
      margin: 0;
    }
  }

  #middle {
    flex-grow: 1;
    display: flex;
    flex-direction: row;

    div {
      flex: 0;
      min-width: 2.5em;
      display: flex;
      flex-direction: column;
    }
    // div.toolbar-left {}
    div.middle-space {
      text-align: center;
      flex: 1;
    }
    // div.toolbar-right {}
  }

  .drawerContainer {
    width: 100vw;
  }
  #video-container {
    line-height: 0;
  }

  #video-overlay {
    position: absolute;
    min-width: 100vw;
    width: 100vw !important;
    height: 100vh !important;
    display: none; /* TODO: (when needed) Use the overlay to show custom info over the video */
  }
  #qr-video {
    /* Set video to fill the window, no scrollbars. */
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100vw !important;
    height: 100vh !important;
    object-fit: cover; /* Scale video uniformly, chop off what does not fit */
    /* object-position: top 0 left 0;  /* Can use this to shift the feed within the video frame, e.g. to compensate for cameras in the corner */
    /* background-color: black; /* Color to show before video starts. */
    pointer-events: none; /* Shut off all right-click/context menu, hover events/so pip button does not show and controls can't be enabled */
  }
  #qr-video.inactive {
    background-color: transparent; /* Color to show when not scanning */
  }

  :global(#video-container.example-style-1 .scan-region-highlight-svg),
  :global(#video-container.example-style-1 .code-outline-highlight) {
    stroke: #64a2f3 !important;
  }

  :global(#video-container.example-style-2) {
    width: max-content;
    height: max-content;
    overflow: hidden;
  }
  :global(#video-container.example-style-2 .scan-region-highlight) {
    border-radius: 30px;
    outline: rgba(255, 255, 255, 0.5) solid 50vmax; // Light theme
  }
  :global(#video-container.example-style-2 .scan-region-highlight-svg) {
    display: none;
  }
  :global(#video-container.example-style-2 .code-outline-highlight) {
    stroke-width: 15 !important;
    stroke-dasharray: none !important;
    stroke: rgba(255, 255, 255, 0.5) !important; // Light theme
  }
  :global(html[color-scheme='dark']) {
    // Dark theme
    :global(#video-container.example-style-2 .scan-region-highlight) {
      outline: rgba(0, 0, 0, 0.5) solid 50vmax;
    }
    :global(#video-container.example-style-2 .code-outline-highlight) {
      stroke: rgba(0, 0, 0, 0.5) !important;
    }
  }

  #cam-qr-result {
    color: var(--color-text);
  }
  #cam-qr-result.new {
    color: blue;
  }

  div.demo {
    margin-bottom: 16px;
  }

  .scan-button,
  .scan-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1em;
    div {
      flex: 1;
      button {
        width: 100%;
      }
    }
  }

  /* Drawer */
  :global(.app .drawerContainer .drawer .overlay) {
    background: rgba(255, 255, 255, 0.5);
  }
  :global(.app .drawerContainer .drawer .panel) {
    background: white;
    color: var(--color-text);
  }
  :global(html[color-scheme='dark']) {
    // Dark theme
    :global(.app .drawerContainer .drawer .overlay) {
      background: rgba(0, 0, 0, 0.5);
    }
    :global(.app .drawerContainer .drawer .panel) {
      background: black;
      color: white;
    }
  }

  /* Set z-index of all overlapping elements */
  :global(.app .drawerContainer),
  :global(.app .drawerContainer .drawer .panel) {
    z-index: 2000;
  }
  :global(.app .drawerContainer .drawer) {
    // display: none;
  }
  :global(.app .drawerContainer .drawer .overlay) {
    z-index: 100;
  }
  :global(.app .drawerContainer.open .drawer) {
    // display: block;
  }

  // #header,
  #footer,
  #middle,
  #footer .scan-button,
  #footer .scan-button *,
  #footer .scan-toolbar,
  #footer .scan-toolbar * {
    z-index: 1000;
  }
  #video-overlay {
    z-index: 100;
  }
  #video-container,
  :global(#video-container .scan-region-highlight) {
    z-index: -100;
  }
  #qr-video {
    z-index: -200; /* Below all other elements */
  }
  #container {
    z-index: -300; /* Make sure to draw everything below Layout's Nav and Foot */
  }

  /* Hide controls if they somehow show */
  #video-container :global(video::-webkit-media-controls) {
    display: none !important;
  }
</style>
