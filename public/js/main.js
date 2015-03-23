// Register desktopUI event listeners
(function($, window) {
  $(document).ready(function() {
  	var $desktop = $('#desktop');
    var $installWindow = $('#draggable-window');
    var $startButton = $('#btn-start'),
      $shortcutButton = $('#btn-shortcut'),
      $minimizeButton = $('#btn-minimize'),
      $exitButton = $('#btn-exit'),
      $prevButton = $('#btn-previous'),
      $nextButton = $('#btn-next');

    var currentPage = -1;

    var $package = $('#package-list > .package');
    var $body = $('#body');

    var packageListPage = $body.html();

    var installPages,
    		pageCount;

    $prevButton.hide();
    $nextButton.hide();

    $installWindow.draggable({
      containment: "#desktop",
      scroll: false,
      handle: "div.status-bar"
    });

    $shortcutButton.click(function() {
      $installWindow.toggle();
      if ($shortcutButton.hasClass('closed')) $shortcutButton.removeClass('closed');
      $(this).toggleClass('active');
    });

    $minimizeButton.click(function() {
      $installWindow.hide();
      $shortcutButton.toggleClass('active');
    });

    $exitButton.click(function() {
      var exitForSure = confirm('安裝程式正在進行，確定關閉視窗？');
      if (exitForSure) {
      	resetInstallation();
      }
    });

    $prevButton.click(function() {
      if (currentPage > 1) {
	      currentPage--;
	      loadPage(currentPage);
	      $nextButton.text('下一步');
	      if (currentPage == 1) $(this).hide();
    	}
    });

    $nextButton.click(function() {
      if (currentPage < pageCount - 1) {
        // From user agreement page
      	if (currentPage == 0) {
          var isAccept = !!Number($('input:radio:checked[name="agreement-radio"]').attr('value'));
          if (!isAccept) {
            var notAccpetReason = prompt('您不同意哪幾個點呢？請填入編號或理由，謝謝！');
          }
        } 
        currentPage++;
	      loadPage(currentPage);

        if (currentPage > 1) $prevButton.show();
    		if (currentPage == pageCount - 1) $(this).text('完成');
	    }
	    else {
	    	resetInstallation();
	    }
    });

    $body.on('click', '#package-list > .package', function() {
      var selectedPackage = $(this).attr('id').replace(/\w+-/, '');
      // Temporarily block custom query
      if (selectedPackage == 'custom') return; 
      $.ajax({
        url: '/process',
        type: 'POST',
        data: {
          package: selectedPackage
        },
        success: function(data) {
          currentPage++;
          installPages = data;
          pageCount  = Object.keys(installPages).length;
          loadPage(currentPage);
          $nextButton.show();
        },
        error: function() {}
      });
    });


    function loadPage(pageNumber) {
      $body.html(installPages[pageNumber]);
    }

    function resetInstallation() {
    	$installWindow.hide();
    	$shortcutButton.removeClass('active');
    	$shortcutButton.addClass('closed');
    	$body.html(packageListPage);
    	currentPage = -1;
    	$prevButton.hide();
    	$nextButton.hide();
    	$nextButton.text('下一步');
    }

    function addDesktopIcon() {
    	$desktop.append('<div style="font-size: 50px"><i class="fa fa-tasks"></i></div>');
    }

  });

})(jQuery, window)