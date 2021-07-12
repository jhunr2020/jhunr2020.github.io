'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "cd4fffa6fb8e9de5d7ea6eec515452db",
"assets/assets/bg.jpg": "534e674f1da29ad7595ffe623b0356d3",
"assets/assets/dev1.jpg": "b4f1972c04577cc322103577d0380b49",
"assets/assets/dev2.jpg": "a078d78a5ad2086e512a52ae9e69c26c",
"assets/assets/dev3.jpg": "37f9f5b6b9761b53f4fae066a3fae461",
"assets/assets/dev4.jpg": "e26f3950c1836d7c66ed906acfa4d15f",
"assets/assets/dev5.jpg": "53cdf67f65836766af1b3794a442da9b",
"assets/assets/dev6.jpg": "738015ffb106983f33750d1b57a4d26f",
"assets/assets/dev7.jpg": "29a10a93250f3463179797217348ef52",
"assets/assets/dev99.jpg": "19bfde93771ecb3a23309ec50c9bd724",
"assets/assets/divecamp.jpg": "95cda980976a8a56d5b53182798dc1c7",
"assets/assets/divecamp.png": "73954011d62bad1a2e9e1afc8fc41cbe",
"assets/assets/favicon.png": "f9310c2aa6b4d8ba6e2b102da897f506",
"assets/assets/google.svg": "41fbe59aa07f42727a75ea0ca0066ff3",
"assets/assets/hingotanan.jpg": "c470253535103e44bbd400f610f7ef8e",
"assets/assets/island%2520front%2520view%2520resort.jpg": "0673b8a14d5823479c15b8e35addc90c",
"assets/assets/island%2520hopping%25201.jpg": "20dcead7a9ba29bbead08c6a804b3bee",
"assets/assets/island%2520hopping.jpg": "f76df6f158dfeb93927b45d001b67565",
"assets/assets/jao%2520bay%2520resorts.jpg": "ff399e85c4983728a0dd72793aa7fed8",
"assets/assets/killua.jpg": "3ebf53ef7bfb0271222c583ec4acf6f5",
"assets/assets/Nichos%2520islan%2520resort.jpg": "50e317fe86197fe76065b1581ca5ec70",
"assets/assets/Philippines_Maomawan%2520Island1.jpg": "246b4169db3f39badecda50cd1771242",
"assets/assets/phone.svg": "ad8c4e8680dc3fbaeac78688dda41ab7",
"assets/assets/playa%2520bech.jpg": "3a7f786963f82d7a66068ba4b58b80d7",
"assets/assets/sagasa.jpg": "96c3daf32a4f96c47443a7cee7e7cc05",
"assets/assets/sanbar.jpg": "0ac6719bac5d9e24b18261324802fb58",
"assets/assets/sanbar1.jpg": "8a45eaad71acb84c6e4bfe0724341abd",
"assets/assets/sunsets.jpg": "a295efffaa52f00630fac05931f09940",
"assets/assets/town%2520hall.png": "d6a368c46801b2d7ff922a689dbdfe94",
"assets/assets/underwater%2520sto%2520nino.png": "5d29f5f64f3e2417dab9d64eee2aa591",
"assets/assets/white-logo.png": "e5121bfa70e5ee689ffda24187ed396c",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "5ca0651f09dc9cfc95a86bd068cea080",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "f9310c2aa6b4d8ba6e2b102da897f506",
"icons/Icon-192.png": "f9310c2aa6b4d8ba6e2b102da897f506",
"icons/Icon-512.png": "f9310c2aa6b4d8ba6e2b102da897f506",
"index.html": "3a6bd95e012121c82fdf3d5c1cd20cb6",
"/": "3a6bd95e012121c82fdf3d5c1cd20cb6",
"main.dart.js": "d54c8978f5389416ba8270b77d6a59cc",
"manifest.json": "a6b2824286e31192a78b36ea289542ad",
"version.json": "6a776eb4bc494487199eb04f0268e371"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
