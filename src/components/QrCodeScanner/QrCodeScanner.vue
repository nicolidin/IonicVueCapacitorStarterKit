<template>
  <div class="qrcodeContainer">
    <div id="video-container">
      <video id="qr-video"></video>
      <div id="reader" width="600px"></div>

    </div>
    <img type="file" id="image" class="imageInput" @change="detectBarcode" accept="image/*">

    <ion-button @click="againNewQrCode">againNewQrCode</ion-button>
    <ion-button @click="scanQrCode">Scan QrCode</ion-button>
    <ion-button @click="newScanQrCode">NEw Scan QrCode</ion-button>
    <h3>bar code: {{ barCode }}</h3>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import { onMounted, ref } from "vue";
import QrScanner from "qr-scanner";
import {Html5QrcodeScanner} from "html5-qrcode"
import {Html5Qrcode} from "html5-qrcode"

let video = null;
let videoContainer = null;

const emit = defineEmits<{
  (e: "open"): void;
  (e: "close"): void;
}>();

const detectedBarcodes = ref<string[]>([]);
const barCode = ref(null);
function onScanSuccess(decodedText, decodedResult) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
}


async function againNewQrCode() {
  Html5Qrcode.getCameras().then(devices => {
    /**
     * devices would be an array of objects of type:
     * { id: "id", label: "label" }
     */
    if (devices && devices.length) {
      const cameraId = devices[1].id;
      // .. use this to start scanning.
      const html5QrCode = new Html5Qrcode(/* element id */ "reader");
      html5QrCode.start(
          cameraId,
          {
            fps: 10,    // Optional, frame per seconds for qr code scanning
            qrbox: { width: 350, height: 350 }  // Optional, if you want bounded box UI
          },
          (decodedText, decodedResult) => {
            barCode.value = decodedText
            html5QrCode.stop()
            // do something when code is read
          },
          (errorMessage) => {
            // parse error, ignore it.
          })
      .catch((err) => {
        // Start failed, handle it.
      });
    }
  }).catch(err => {
    // handle err
  });
}

async function scanQrCode() {
  const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250} },
      /* verbose= */ false);
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

async function newScanQrCode() {
  const qrScanner = new QrScanner(
    video!,
    (result) => {
      barCode.value = result;
      qrScanner.stop();
      console.log("decoded qr code:", result);
    },
    {
      highlightScanRegion: true,
      calculateScanRegion: () => {
        return { x: 60, y: 420, width: 300, height: 300 };
      },
    }
  );
  await qrScanner.turnFlashOn()
  await qrScanner.start();
}

onMounted(() => {
  video = document.getElementById("qr-video");
  videoContainer = document.getElementById("video-container");
});
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
