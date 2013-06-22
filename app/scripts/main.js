// temporary
var setLevel = function(lv) {
	var fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'];

	$('.badge-level').removeClass('lv0 lv1 lv2 lv3 lv4 lv5 lv6 lv7 lv8').addClass('lv'+ lv).text(lv);
	$('#badge-flag-svg').find('path').css('fill', fillColor[+lv]);
};

$('#setLevel').spinner({
	stop: function(event, ui) {
		setLevel($(this).val());
	},
	spin: function(event, ui) {
		if (ui.value > 8) {
			$(this).spinner('value', 0);

			return false;
		} else if (ui.value < 0) {
			$(this).spinner('value', 8);

			return false;
		}
	}
});

$('.badge-logo, .badge-qr').on({
	dragover: function(event) {
		event.stopPropagation();
		event.preventDefault();
	},
	dragenter: function(event) {
		event.stopPropagation();
		event.preventDefault();
	},
	drop: function(event) {
		event.stopPropagation();
		event.preventDefault();

		console.debug(event);
		var reader = new FileReader(),
			file = event.originalEvent.dataTransfer.files[0];

		if (file.type.match('image.*')) {
			console.debug('image!');
			reader.onload = (function(image) {
				return function(e) {
					event.target.src = e.target.result;
				}
			})(file);

			reader.readAsDataURL(file);
		} else {
			// TODO warn user of unsupported file type
			return false;
		}
	}
});
