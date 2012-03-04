(function() {
	
	function getRelativeMousePosition(event) {
		var mx = event.pageX - $(event.target).offset().left;
		var my = event.pageY - $(event.target).offset().top;
		
		return [mx, my];
	}
	
	function isInBox(box, event) {
		if (box.w) {
			var pos = getRelativeMousePosition(event);
			
			return (pos[0] >= box.x && pos[0] <= (box.x + box.w) &&
						pos[1] >= box.y && pos[1] <= (box.y + box.h));
		}
		return false;
	}
	
	function main() {
		var canvas = document.createElement('canvas');
		canvas.height = 480;
		canvas.width = 640;
		var context = canvas.getContext('2d'),
		    image = $('.placeholderImage').first(),
		    canvasElement = $(canvas),
				originalData, itemId;
		
		image.load(function() {
			canvasElement.insertBefore(image);
			context.drawImage(image.get(0), 0, 0, canvas.width, canvas.height);
			itemId = image.attr('id');
			image.detach();
			originalData = context.getImageData(0, 0, canvas.width, canvas.height);
		});
		
		var box = {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		};
		
		// Attach event handlers to image-resizers
		var resetData = function(){
			context.putImageData(originalData, 0, 0);
		};
		
		var moveBox = function(x, y, width, height) {
			resetData();
			context.fillStyle = "rgba(255, 255, 255, 0.7)";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.putImageData(originalData, 0, 0, x, y, width, height);
			context.strokeRect(x, y, width, height);			
			box = {
				x: x,
				y: y,
				w: width,
				h: height
			};
		};
		
		$('#saveCrop').live('click', function(e) {
			$.post('http://localhost:3000/image', {id: itemId, box: box}, function(data) {
				console.log("Sent!");
				$('a[data-dimensions="' + box.w + 'x' + box.h + '"]').attr('data-xy', box.x + 'x' + box.y);
			});
		});
		
		$('a.select').live('click', function(e) {
			// Get dimensions
			var element = $(e.target),
			    dimensions = element.attr('data-dimensions').split('x'),
			    xy = element.attr('data-xy').split('x'),
			    width = parseInt(dimensions[0], 10),
			    height = parseInt(dimensions[1], 10),
			    x, y;
			
			if (xy.length == 2) {
				x = parseInt(xy[0], 10);
				y = parseInt(xy[1], 10);
			} else{
				x = (canvas.width - width)/2;
				y = (canvas.height - height)/2;
			}
			moveBox(x, y, width, height);
      
			return false;
		});
		
		// Dragdrop-handling
		isDragging = false;
		dragPos = [0, 0];
		canvasElement.live('mousedown', function(e) {
			if (isInBox(box, e)) {
				isDragging = true;
				dragPos = getRelativeMousePosition(e);
			}
		});
		
		canvasElement.live('mouseup', function(e) {
			isDragging = false;
		});
		
		canvasElement.live('mousemove', function(e) {
			if (isDragging) {
				var pos = getRelativeMousePosition(e);
				var newX = box.x - (dragPos[0] - pos[0]),
				    newY = box.y - (dragPos[1] - pos[1]);
				
				moveBox(newX, newY, box.w, box.h);
				dragPos = pos;
			}
		});
		
	};
	
	$(document).ready(function() {
		main();
	});
})();