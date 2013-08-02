var

agent = {
	codename: 'CODENAME',
	level: 0,
	enlightened: true
},

// draw front badge design onto canvas
drawBadgeFront = function(agent) {
	var blank, logo, scancode, codename, flag, level,
		canvas = $('#canvas')[0];

	paper.setup(canvas);

	with (paper) {
		blank = new Raster('enl-blank-front', new Point(40, 60));
		blank.scale(0.42, 0.4075);

		logo = new Raster('badge-logo', new Point(view.center._x, 112));
		logo.size = new Size(250, 250);
		logo.scale(0.56);

		scancode = new Raster('badge-scancode', new Point(63, 204));
		scancode.size = new Size(109, 21);

		codename = new PointText(new Point(view.center._x, 35));
		codename.content = agent.codename;
		codename.characterStyle = {
			fontSize: 20,
			font: 'Iceland',
			justification: 'center'
		};

		flag = new Path({
			segments: [[149,190], [149,214], [184,214], [184,173], [164,173]]
		});

		flag.fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'][agent.level]

		level = new PointText(new Point(166,204));
		level.content = agent.level;
		level.fillColor = (agent.level > 0 && agent.level < 8) ? '#333' : '#ffa630';
		level.characterStyle = {
			fontSize: 40,
			font: 'Iceland',
			justification: 'center'
		}
	}
},

// download canvas as an image
saveImage = function(filename) {
	var canvas = $('canvas')[0];

	canvas.toBlob(function(blob) {
		saveAs(blob, filename);
	});
},

// change text and color of level flag
setLevel = function(lv) {
	var fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'];

	$('.badge-level').removeClass('lv0 lv1 lv2 lv3 lv4 lv5 lv6 lv7 lv8').addClass('lv'+ lv).text(lv);
	$('#badge-flag-svg').find('path').css('fill', fillColor[+lv]);

	return lv;
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

// save button
$('button.save').on('click', function(event) {
	if ($(event.currentTarget).hasClass('front')) {
		agent.filename = 'Badger - '+ agent.codename +'.png';

		drawBadgeFront(agent);
	} else {
		// TODO
		// drawBadgeBack();
	}
})

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

	agent.codename = $target.text($(this).val()).text();
});

// level spinner
$('#setLevel').spinner({
	stop: function() {
		agent.level = setLevel($(this).val());
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

$('.badge-flag').on('click', function(event) {
	$('#setLevel').spinner('stepUp');
	event.stopPropagation();
});

// swap badge blanks on faction change
$('#factionRadio').buttonset().on('click', function(event) {
	agent.enlightened = (event.target.id === 'factionEnlightened');

	if (event.target.id === 'factionEnlightened') {
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
