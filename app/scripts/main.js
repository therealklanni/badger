// temporary
var setLevel = function(lv) {
	var fillColor = ['#333', '#fece5a', '#ffa630', '#ff7315', '#e40000', '#fd2992', '#eb26cd', '#c124e0', '#9627f4'];

	$('.badge-level').removeClass('lv0 lv1 lv2 lv3 lv4 lv5 lv6 lv7 lv8').addClass('lv'+ lv).text(lv);
	$('#badge-flag-svg').find('path').css('fill', fillColor[lv]);
};
