// jshint -W085
/* global community_defaults:true, paper, saveAs */

(function($) {
'use strict';

var

urlStrip = /(https?:\/\/)?(www\.)?/g,

agent = {
  codename: 'CODENAME',
  level: 0,
  enlightened: true,
  color: null
},

// draw front badge design onto canvas
drawBadgeFront = function(agent) {
  var blank, logo, scancode, codename, flag, level,
    color = agent.color ? agent.color.toRgb() : null,
    canvas = $('#canvas')[0];

  paper.setup(canvas);

  blank = new paper.Raster((agent.enlightened ? 'enl' : 'res') + '-blank-front', new paper.Point(39, 61));
  blank.scale(0.419, 0.402);

  logo = new paper.Raster('badge-logo', new paper.Point(paper.view.center._x, 113));
  logo.size = new paper.Size(250, 250);
  logo.scale(0.545);

  scancode = new paper.Raster('badge-scancode', new paper.Point(63, 203));
  scancode.size = new paper.Size(109, 21);

  codename = new paper.PointText(new paper.Point(paper.view.center._x, 38));
  codename.content = agent.codename;
  codename.characterStyle = {
    fontSize: 20,
    font: 'Iceland',
    justification: 'center'
  };

  flag = new paper.Path({
    segments: [[149,190], [149,214], [184,214], [184,173], [164,173]]
  });

  if (color && $('#customLevel').is(':checked')) {
    flag.fillColor = new paper.Color(color.r / 255, color.g / 255, color.b / 255, color.a);
  } else {
    flag.fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'][agent.level];
  }

  level = new paper.PointText(new paper.Point(166,204));
  level.content = agent.level;
  level.fillColor = (agent.level > 0 && agent.level < 8) ? '#333' : '#ffa630';
  level.characterStyle = {
    fontSize: 40,
    font: 'Iceland',
    justification: 'center'
  };
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

  if (agent.color && $('#customLevel').is(':checked')) {
    fillColor = agent.color.toRgbString();
  } else {
    fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'][+lv];
  }

  $('.badge-level').removeClass('lv0 lv1 lv2 lv3 lv4 lv5 lv6 lv7 lv8').addClass('lv'+ lv).text(lv);
  $('#badge-flag-svg').find('path').css('fill', fillColor);

  if (lv > 9) {
    $('.badge-level').addClass('badge-level-big');
  } else {
    $('.badge-level').removeClass('badge-level-big');
  }

  return lv;
},

// handler for displaying dropped or selected images
displayImage = function(file, targetElement) {
  var reader = new FileReader();

  if (file.type.match('image.*')) {
    reader.onload = (function() {
      return function(e) {
        targetElement.onload = function() {
          // update the generated image
          drawBadgeFront(agent);
        };

        targetElement.src = e.target.result;
      };
    })(file);

    reader.readAsDataURL(file);
  } else {
    // TODO warn user of unsupported file type
    return false;
  }
}

;

$('#customLevel').on('change', function() {
  $('#customLevelColor').parent().toggle($(this).is(':checked'));
});

$('#customLevelColor').ColorPickerSliders({
  size: 'sm',
  placement: 'bottom',
  swatches: ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992',
    '#eb26cd', '#c124e0', '#9627f4', '#00c2ff', '#28f428', '#f9f9f9'],
  order: {
    opacity: 1,
    hsl: 2
  },
  onchange: function(_, color) {
    agent.color = color.tiny;

    setLevel(agent.level);
    drawBadgeFront(agent);
  }
});

// save button
$('button.save').on('click', function() {
  agent.filename = 'Badger - '+ agent.codename +'.png';

  saveImage();
});

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
    var file = event.originalEvent.dataTransfer.files[0];

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
$('#setCodename, #setLink, #setCommname').on('blur change', function() {
  var $target = $($(this).data('target')),
    target = $(this).data('target').replace('.badge-', ''),
    text = $(this).val().replace(urlStrip, '');

  // update own text
  $(this).val(text);

  // update linked element's text
  agent[target] = $target.text(text).text();

  drawBadgeFront(agent);
});

// link editable elements with inputs
$('.badge-codename, .badge-link, .badge-community').on('blur change', function() {
  var classes = $(this)[0].className,
    target = classes.slice(classes.indexOf('badge')).split('-')[1],
    $target = $('#set'+ target[0].toUpperCase() + target.slice(1)),
    text = $(this).text().replace(urlStrip, '');

  // update own text
  $(this).text(text);

  // update linked input's text
  agent[target] = $target.val(text).val();

  drawBadgeFront(agent);
});

// level spinner
$('#setLevel').spinner({
  stop: function() {
    agent.level = setLevel($(this).val());

    drawBadgeFront(agent);
  },
  spin: function(_, ui) {
    var custom = $('#customLevel').is(':checked');

    if ((ui.value > 8 && !custom) || ui.value > 99) {
      $(this).spinner('value', 0);

      return false;
    } else if (ui.value < 0 && !custom) {
      $(this).spinner('value', 8);

      return false;
    } else if (ui.value < 0) {
      $(this).spinner('value', 99);

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

  setTimeout(function() { drawBadgeFront(agent); }, 100);
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

}(jQuery));
