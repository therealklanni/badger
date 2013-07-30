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

	$target.text($(this).val().replace('http://',''));
});

// level spinner
$('#setLevel').spinner(spinnerOptions);

$('.badge-flag').on('click', function(event) {
	$('#setLevel').spinner('stepUp');
	event.stopPropagation();
});

// swap badge blanks on faction change
$('#factionRadio').buttonset().on('click', function(event) {
	if (event.target.id === "factionEnlightened") {
		$('.resistance.badge-base').hide();
		$('.enlightened.badge-base').show();
	} else {
		$('.resistance.badge-base').show();
		$('.enlightened.badge-base').hide();
	}
});

// apply community customizations

// do some type/value checks
community_defaults = typeof community_defaults === 'object' ? community_defaults : {};
community_defaults.community = typeof community_defaults.community === 'string' ? community_defaults.community : 'COMMUNITY';
community_defaults.link = typeof community_defaults.link === 'string' ? community_defaults.link : 'goo.gl/link';
community_defaults.enlightened = typeof community_defaults.enlightened === 'boolean' ? community_defaults.enlightened : true;

// apply the custom community name
$('.badge-community').text(community_defaults.community);
$('#setCommname').attr('placeholder', community_defaults.community);

// apply the custom link
$('.badge-link').text(community_defaults.link);
$('#setLink').attr('placeholder', community_defaults.link);

// toggle the faction
if (!community_defaults.enlightened) {
	$('#factionEnlightened').removeClass('active');
	$('.enlightened.badge-base').hide();
	$('#factionResistance').addClass('active');
	$('.resistance.badge-base').show();
}
