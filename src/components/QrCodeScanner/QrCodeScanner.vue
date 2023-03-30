<template>
  <div class="qrcodeContainer">
    <div id="video-container">
      <video id="qr-video"></video>
    </div>
    <ion-button @click="scanQrCode">Scan QrCode</ion-button>
    <ion-button @click="newScanQrCode">NEw Scan QrCode</ion-button>
    <h3>bar code: {{ barCode }}</h3>
  </div>
</template>

<script setup lang="ts">
import {IonButton} from "@ionic/vue";
import {BarcodeScanner} from "@capacitor-community/barcode-scanner";
import {onMounted, ref} from "vue";
import {Camera} from "@capacitor/camera";
// import {DBR} from "capacitor-plugin-dynamsoft-barcode-reader";
let video = null
let videoContainer = null;
import QrScanner from "qr-scanner";
import {sassNull} from "sass";

const emit = defineEmits<{
  (e: 'open'): void
  (e: 'close'): void
}>()

const barCode = ref(null);

async function checkPermission() {
  return new Promise((resolve, reject) => {
    return BarcodeScanner.checkPermission({ force: true }).then((status) => {
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  });
}

async function newScanQrCode() {

  const qrScanner = new QrScanner(
      video!,
      result => {
        barCode.value = result
        qrScanner.stop()
        console.log('decoded qr code:', result)},
      {highlightScanRegion: true, calculateScanRegion: () => {return {x: 60, y: 420, width: 300, height: 300}} });

  qrScanner.start().then(() => {
    // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
    // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
    // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
    // start the scanner earlier.
    // QrScanner.listCameras(true).then(cameras => cameras.forEach(camera => {
    //   const option = document.createElement('option');
    //   option.value = camera.id;
    //   option.text = camera.label;
    //   // camList.add(option);
    // }));
  });
  // .then(result => console.log(result))
  // .catch(error => console.log(error || 'No QR code found.'));
  // await DBR.initialize()
  // await DBR.requestCameraPermission()
  // await DBR.startScan();
  // DBR.getAllCameras().then(value => {
  //   console.log("all cameras: ", value)
  // })
}

async function scanQrCode() {

  await checkPermission()

    console.log("begin");
    BarcodeScanner.hideBackground();

    document.querySelector("body").classList.add("scanner-active");
    console.log("before start scan");
  emit("open")
  await BarcodeScanner.enableTorch()
  await BarcodeScanner.toggleTorch()
  const result = await BarcodeScanner.startScan()
  // const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    console.log("after start scan");

    // if the result has content
    if (result.hasContent) {
      barCode.value = result.content;
      console.log(result.content); // log the raw scanned content
    }
}

onMounted(() => {
  video = document.getElementById('qr-video');
  videoContainer = document.getElementById('video-container')
})
</script>

<style scoped lang="scss">
.qrcodeContainer {
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
body video {
  --background: transparent;
  --ion-background-color: transparent;

  color: transparent;
  /*display: none;*/
}
</style>
