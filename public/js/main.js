(function($, window) {
	var $startButton = $('#btn-start'),
			$shortcutButton = $('#btn-shortcut'),
			$minimizeButton = $('#btn-minimize'),
			$exitButton = $('#btn-exit');

	var $installWindow = $('#draggable-window');

	$installWindow.draggable({
		containment: "#desktop", 
		scroll: false, 
		handle: "div.status-bar"
	});

	$shortcutButton.click(function() {
		$(this).toggleClass('active');
		$installWindow.toggle();
	});

	$minimizeButton.click(function() {
		$installWindow.hide();
		$shortcutButton.toggleClass('active');
	});

})(jQuery, window)