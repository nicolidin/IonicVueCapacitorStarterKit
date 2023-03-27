import { Drivers, Storage } from "@ionic/storage";

const storage = new Storage({
  name: "__mydb",
  driverOrder: [Drivers.LocalStorage],
});

storage.create();

export const piniaIonicStorage = ({ store: store }) => {
  // Get the store name
  const storeName = store.$id;

  console.log("store: ", store);
  console.log("storeName: ", storeName);

  console.log("PLUugin");
  // Get the previous state of the store from IonicStorage
  storage.get(storeName).then((previousState) => {
    if (previousState !== null) {
      store.$state = { ...previousState };
    }
  });

  // Listen to changes in the store
  store.$subscribe((mutation: any, state: any) => {
    console.log("subscribe !");
    // Get the updated property
    storage.get(storeName).then((previousState) => {
      storage.set(storeName, { ...previousState, ...state });
    });
  });
};
