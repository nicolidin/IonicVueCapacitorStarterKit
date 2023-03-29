import { Drivers, Storage } from "@ionic/storage";

const storage = new Storage({
  name: "__mydb",
  driverOrder: [Drivers.LocalStorage],
});

storage.create();

export const piniaIonicStorage = ({ store: store }) => {
  // Get the store name
  const storeName = store.$id;

  // Get the previous state of the store from IonicStorage
  storage.get(storeName).then((previousState) => {
    if (previousState !== null) {
      store.$state = { ...previousState };
    }
  });

  // Listen to changes in the store
  store.$subscribe((mutation: any, state: any) => {
    // Get the updated property
    storage.get(storeName).then((previousState) => {
      storage.set(storeName, { ...previousState, ...state });
    });
  });
};
