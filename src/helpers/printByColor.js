function printByColor (color, text) {
	const reset = '%s\x1b[0m';

	switch (color) {
		case 'bright': color = '\x1b[1m'; break;
		case 'dim': color = '\x1b[2m'; break;
		case 'underscore': color = '\x1b[4m'; break;
		case 'blink': color = '\x1b[5m'; break;
		case 'reverse': color = '\x1b[7m'; break;
		case 'hidden': color = '\x1b[8m'; break;

		case 'black': color = '\x1b[30m'; break;
		case 'red': color = '\x1b[31m'; break;
		case 'green': color = '\x1b[32m'; break;
		case 'yellow': color = '\x1b[33m'; break;
		case 'blue': color = '\x1b[34m'; break;
		case 'magenta': color = '\x1b[35m'; break;
		case 'cyan': color = '\x1b[36m'; break;

		case 'bgBlack': color = '\x1b[40m'; break;
		case 'bgRed': color = '\x1b[41m'; break;
		case 'bgGreen': color = '\x1b[42m'; break;
		case 'bgYellow': color = '\x1b[43m'; break;
		case 'bgBlue': color = '\x1b[44m'; break;
		case 'bgMagenta': color = '\x1b[45m'; break;
		case 'bgCyan': color = '\x1b[46m'; break;
		case 'bgWhite': color = '\x1b[47m'; break;
		default: color = '\x1b[37m';
	}
	
	color = color + reset;

	console.log(color, text);
}

module.exports = printByColor;