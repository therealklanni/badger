// Load Google+ API
(function() {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

var signinCallback = function(authResult) {
	if (authResult.access_token) {
		$('.signin').fadeOut();

		// Initialize gShare button
		// gapi.interactivepost.render('badger-share', {
		// 	contenturl: 'http://therealklanni.github.io/badger',
		// 	contentdeeplinkid: '/badger',
		// 	clientid: '679488287242.apps.googleusercontent.com',
		// 	cookiepolicy: 'single_host_origin',
		// 	prefilltext: 'Create your Google+ Page too!',
		// 	calltoactionlabel: 'CREATE',
		// 	calltoactionurl: 'http://therealklanni.github.io/badger',
		// 	calltoactiondeeplinkid: '/badger'
		// });

		$.ajax({
			url: 'https://www.googleapis.com/plus/v1/people/me',
			beforeSend: function(xhr) { xhr.setRequestHeader('Authorization','Bearer ' + authResult.access_token); }
		}).done(function(person) {
			if (person.nickname) {
				$('#setCodename').val(person.nickname).trigger('change').focus();
			}
		});
	} else if (authResult.error) {
		throw new Error('Problem signing in:', authResult.error);
	}
}
