// initial parameters (used in setup.js):

exports.showDebugInfo = true;
exports.showExpressDebugInfo = false;

exports.mosaic = {
	folders:{
		root       : '/public/uploads/',
		full       : 'full/',
		resizes    : 'resizes/',
		main       : 'main/',
		tiles      : 'tiles/',
		output     : 'output/'
	},
	maxtiles: 1800,    // aim at 1800 tiles
	aspectratio: 16/10,
	tile:{
		size: 12
	},
	tilehq:{
		size: 128
	},
	flyingtile:{
		size: 256
	},
	maxuseofsametile: 2,   // make sure that there are enough tiles available
	minspacebetweensametile: 10,

	greetingcard: {
		lowres: {
			overlay : 'overlay.png',
			width: 660,  // don't forget to update these when you update the overlay image
			height: 540,
			offset : {
				x: 12,
				y: 12
			}
		},
		dontPutFakeTilesBeyond: 250 // the overlay starts from about 250px height
	}
};

exports.sharing = {
	message : 'Mijn selfie werd gemixt met het media jaaroverzicht %23iwasmixed',
	messageNoHash : 'Mijn selfie werd gemixt met het media jaaroverzicht',
	url : 'www.mixwensen.be',
	title: 'MiX je selfie met het media jaaroverzicht',
	hardcodedUrl: 'http://www.mixwensen.be'
}

exports.keys = {
	consumerKey: 'LwV2sfwiNQkLwvwAG5Ig',
	consumerSecret: 'G2k4abIgdlESbZva20qwQchUZdLEWKe9CllGQFRVEI',
	token: '2255057647-tW9Xdb6YVgsLXI5YlPpnlLBDP0x8wT9SD14PB2O',
	tokenSecret: 'pKfpMhWejF7qEZX4d70whFuOZdXIf2sza7Ml5ukL6E7ns',
	twitPic: 'b6b2313f9c53a52da01f02ab32d374ce'
};
