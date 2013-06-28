// temporary
var

setLevel = function(lv) {
	var fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'];

	$('.badge-level').removeClass('lv0 lv1 lv2 lv3 lv4 lv5 lv6 lv7 lv8').addClass('lv'+ lv).text(lv);
	$('#badge-flag-svg').find('path').css('fill', fillColor[+lv]);
},

displayImage = function(file, targetElement) {
	var reader = new FileReader();

	if (file.type.match('image.*')) {
		reader.onload = (function() {
			return function(e) {
				targetElement.src = e.target.result;
			}
		})(file);

		reader.readAsDataURL(file);
	} else {
		// TODO warn user of unsupported file type
		return false;
	}
}

;

$('#setLevel').spinner({
	stop: function() {
		setLevel($(this).val());
	},
	spin: function(_, ui) {
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
		var reader = new FileReader(),
			file = event.originalEvent.dataTransfer.files[0];

		event.stopPropagation();
		event.preventDefault();

		displayImage(file, event.target);
	}
});

$('#userLogo, #userQr').on('change', function(event) {
	var target = $($(this).data('target'))[0],
		file = $(this)[0].files[0];

	event.stopPropagation();
	event.preventDefault();

	displayImage(file, target);
});

$('#setCodename, #setLink, #setCommname').on('keyup', function(event) {
	var $target = $($(this).data('target'));

	$target.text($(this).val());
});
