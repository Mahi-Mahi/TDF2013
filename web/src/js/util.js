String.prototype.format_time = function(br, prefix) {
	var data = this.split(/(h|\'|\")/).map(function(a) {
		return a.trim();
	});

	var h = parseInt(data[0], 10);
	var m = parseInt(data[2], 10);
	var s = parseInt(data[4], 10);

	var res = '';
	if (h > 0)
		res += h + ' h';
	if (br)
		res += '<br />';
	if (m > 0)
		res += ' ' + m + ' min.'
	if (s > 0)
		res += ' ' + s + ' s'
	if (res.length) {
		return (prefix ? prefix : '') + res;
	}
	return '';
	// return this.replace('h', ' h').replace("'", ' min.').replace('"', " s");
};

// EXTEND JQUERY SCROLLTO
jQuery.fn.extend({
    scrollTo : function(speed, easing) {
        return this.each(function() {
            var targetOffset = jQuery(this).offset().top;
            jQuery("html,body").animate({scrollTop: targetOffset}, speed, easing);
        });
    }
});
