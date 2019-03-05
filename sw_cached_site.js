const cacheName = 'v1';

const isValidFormat = (fileName) => {
	const validFileExtensions = [ ".css", ".js", ".jpg", ".jpeg", ".png" ];

	let isValid = false;
	for (let i = 0; i < validFileExtensions.length; i++) {
		let currentExtension = validFileExtensions[i];

		if (fileName.substr(fileName.length - currentExtension.length, currentExtension.length).toLowerCase() == currentExtension.toLowerCase()) {
			isValid = true;
			break;
		}
	}

	return isValid;
}

const fetchServer = (e) => {
	e.respondWith(
		fetch(e.request)
			.then(res => {
				console.log('res = ', res);
				const resClone = res.clone();

				caches.open(cacheName)
					.then(cache => {
						console.log('Service Worker: Caching files');
						cache.put(e.request, resClone);
					})
				return res;
			})
			// When there is connection error
			.catch(() => caches.match(e.request).then(res => res))
	);
}

// Call Install Event
self.addEventListener('install', e => {
	console.log('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', e => {
	console.log('Service Worker: Activated');

	// Remove unwanted caches
	e.waitUntil(
		caches.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cache => {
						if (cache !== cacheName) {
							console.log(`Service Worker: Clearing Old Cache ${cache}`);
							return caches.delete(cache);
						}
					})
				)
			})
			.then(() => self.skipWaiting())
	);
});

// Call Fetch Event
self.addEventListener('fetch', e => {
	console.log(`Service Worker: Fetching file from ${e.request.url}`);

	// If file request is not .html
	if (isValidFormat(e.request.url)) {
		// Check if there is exist file in cache
		console.log(`${e.request.url} valid`);
		caches.has(e.request)
			.then(hasCache => {
				// If there is file in cache => return to user
				if (hasCache) {
					caches.match(e.request)
						.then(res => res);
				}
				// If not, fetch from server
				else {
					fetchServer(e);
				}
			})
	}
	// If file request is .html
	else {
		console.log(`${e.request.url} unvalid`);
	}
});