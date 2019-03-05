if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('./sw_cached_site.js')
			.then(reg => console.log('Service Worker: Registered'))
			.catch(err => console.log(`Service Worker: Error: ${err}`));
	});
}

const authenticate = () => {
	if ( window.location.href != 'https://site.test/checkin/' &&
		!window.localStorage.getItem('token')) {
		console.log(window.location.href);
		window.location.href = './';
	}
}

const URL = 'http://localhost:3000/api/v1';