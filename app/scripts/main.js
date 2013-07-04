var

spinnerOptions = {
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
},

// change text and color of level flag
setLevel = function(lv) {
	var fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'];

	$('.badge-level').removeClass('lv0 lv1 lv2 lv3 lv4 lv5 lv6 lv7 lv8').addClass('lv'+ lv).text(lv);
	$('#badge-flag-svg').find('path').css('fill', fillColor[+lv]);
},

// handler for displaying dropped or selected images
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

// drag-n-drop event handlers
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

// file input handler
$('#userLogo, #userQr').on('change', function(event) {
	var target = $($(this).data('target'))[0],
		file = $(this)[0].files[0];

	event.stopPropagation();
	event.preventDefault();

	displayImage(file, target);
});

// link inputs with editable elements
$('#setCodename, #setLink, #setCommname').on('keyup', function() {
	var $target = $($(this).data('target'));

	$target.text($(this).val());
});

// level spinners
$('#setLevel').spinner(spinnerOptions);
$('#setLevelFlag').spinner(spinnerOptions);

$('.badge-flag .ui-spinner').position({
	my: 'left top-8',
	at: 'right-8 top',
	of: '.badge-level'
}).hide();

$('.badge-flag').hover(function() {
	$('.badge-flag .ui-spinner').show();
}, function() {
	$('.badge-flag .ui-spinner').hide();
});
