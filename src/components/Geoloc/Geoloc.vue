<template>
  <div class="geolocContainer">
    <ion-button @click="getGeoloc">getGeoloc</ion-button>
    <p>{{ currePos }}</p>
    <p>{{ formatedCurrentPos }}</p>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import { computed, ref } from "vue";

const currePos = ref(null);

const formatedCurrentPos = computed(() => {
  return JSON.stringify(currePos.value);
});

function getGeoloc() {
  const nav = window.navigator.geolocation;

  nav.getCurrentPosition((it) => {
    console.log("currentPos: ", it);
    currePos.value = it.coords.accuracy;
  });
}
</script>
