// Native (Android) features, bundled to vendor/native.js and exposed as window.NativeSDK.
// On the website Capacitor.isNativePlatform() is false and none of this is used.
export { Capacitor } from "@capacitor/core";
export { App } from "@capacitor/app";
export { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
export { Share } from "@capacitor/share";
