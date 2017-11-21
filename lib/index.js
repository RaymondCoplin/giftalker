var html2canvas = require('html2canvas');
var GIFEncoder = require('./GIFEncoder');
window.GIFEncoder = GIFEncoder;
window.html2canvas = html2canvas;

function GifTalker(){
	this.encoder = new GIFEncoder();
	_this = this;
}

function GifTalker(width, height, quality, delay){
	this.encoder = new GIFEncoder();
	_this = this;
	_this.width = width;
	_this.height = height;
	_this.quality = quality;
	_this.delay = delay;
}

GifTalker.prototype.start = function(){
    _this.encoder.setRepeat(0);
	_this.encoder.setQuality(_this.quality || 25);
	_this.encoder.setDelay(_this.delay || 500);
	_this.encoder.setSize(_this.width, _this.height);
	_this.encoder.start();
	var encoder = _this.encoder;
	
	_this.mousemoveHandler = window.addEventListener('mouseup', function(e){
		var cursor = document.createElement('div');
		cursor.style.position = "absolute";
		cursor.style.width = 20;
		cursor.style.height = 20;
		cursor.style.left = e.pageX;
		cursor.style.top = e.pageY;
		cursor.style.backgroundColor = "white";
		cursor.style.border = "red dashed 2px";
		cursor.style.borderRadius = "10px";
		document.body.appendChild(cursor);

		setTimeout(function(){
			html2canvas(document.body, { 
				letterRendering: 1, 
				allowTaint : true, 
				onrendered : function (canvas) {
					var ctx = canvas.getContext('2d');
					var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					console.log(encoder.addFrame(imageData, true));
				} 
			});
			document.body.removeChild(cursor); 
		}, 100, encoder, cursor);
	});

	// _this.handler = setInterval(function(encoder){
	// 	html2canvas(document.body, { 
	// 		letterRendering: 1, 
	// 		allowTaint : true, 
	// 		onrendered : function (canvas) {
	// 			var ctx = canvas.getContext('2d');
	// 			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// 			console.log(encoder.addFrame(imageData, true));
	// 		} 
	// 	});   
	// }, 1000, encoder);
}

GifTalker.prototype.finish = function(){
	clearInterval(this.handler);
	window.removeEventListener('mouseup', function(){console.log('event listener removido.');});
	this.encoder.finish();
}

GifTalker.prototype.download = function(name){
	this.encoder.download(name);
}

module.exports = GifTalker;