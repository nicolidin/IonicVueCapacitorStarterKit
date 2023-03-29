<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container" class="container">
        <p class="container__test">new</p>
        <h1>Hot Reload ?</h1>
        <h2>test</h2>
        <h2>test 2</h2>
        <p>{{ counterStore.count }}</p>
        <button>TESTT !</button>
        <ion-button @click="takePicture">Take picture</ion-button>
        <ion-button @click="() => counterStore.increment()"
        >Increment</ion-button
        >
        <img :src="imgSrc" alt="" />
        <body>
        body?
        <div> bar code: {{ barCode }}</div>
        <ion-button @click="scanQrCode">Scan QrCode</ion-button>
        <h1>yow that's body</h1>
        </body>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
    IonButton
} from "@ionic/vue";
import { useCounterStore } from "@/stores";
import { onMounted, ref } from "vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
const counterStore = useCounterStore();

const imgSrc = ref("");

const barCode = ref(null);
async function takePicture() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  // Can be set to the src of an image now
  imgSrc.value = image.webPath!;
}

function scanQrCode() {
  const startScan = async () => {
      // Check if camera permission is granted

    // console.log("check permission")
    // const cameraPermission = await Camera.checkPermissions();
    // console.log("after check perm")
    // console.log("cameraPermission: ", cameraPermission)
    // if (cameraPermission.camera !== 'granted') {
    //
    //   // Request camera permission
    //   const permissionRequest = await Camera.requestPermissions();
    //   if (permissionRequest.camera !== 'granted') {
    //     console.log('Camera permission not granted');
    //     return;
    //   }
    // }

    console.log("begin");
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission();

    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();

    document.querySelector("body").classList.add("scanner-active");
    console.log("before start scan");
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    console.log("after start scan");

    // if the result has content
    if (result.hasContent) {
      barCode.value = result.content;
      console.log(result.content); // log the raw scanned content
    }
  };
  startScan();
}
</script>

<style scoped lang="scss">

.test {
  font-size: 30px !important;
  color: red !important;
}
</style>
<style scoped>

#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>

<style >
body.scanner-active {
  --background: transparent;
  --ion-background-color: transparent;
  color: transparent;
  background-color: transparent;

}

body.scanner-active > * {

  --background: transparent;
  --ion-background-color: transparent;

  color: transparent;
    /*display: none;*/
}
</style>
