// Register desktopUI event listeners
(function($, window) {
	$(document).ready(function() {
		var $startButton = $('#btn-start'),
				$shortcutButton = $('#btn-shortcut'),
				$minimizeButton = $('#btn-minimize'),
				$exitButton = $('#btn-exit'),
				$prevButton = $('#btn-previous'),
				$nextButton = $('#btn-next');

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

		$exitButton.click(function() {
			var exitForSure = confirm('安裝程式正在進行，確定關閉視窗？');
			if (exitForSure) {}
		});
	});


	var $package = $('#package-list > .package');
	var $body = $('#body');
	$package.click(function() {
		var selectedPackage = $(this).attr('id').replace(/\w+-/, '');
		
		$.ajax({
			url: '/process',
			type: 'POST',
			data: {
				package: selectedPackage
			},
			success: function(data) {
				console.log(data)
				$body.html(data['1']);
			},
			error: function() {}
		})
	});

})(jQuery, window)


