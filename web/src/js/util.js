String.prototype.format_time = function(br, prefix) {
	console.log(this);
	var data = this.split(/(h|\'|\")/).map(function(a) {
		console.log(a);
		return a.trim();
	});

	console.log(data);

	var h = parseInt(data[0], 10);
	var m = parseInt(data[2], 10);
	var s = parseInt(data[4], 10);

	console.log([h, m, s]);

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