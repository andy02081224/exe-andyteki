// Register desktopUI event listeners
var exe = (function($, window) {
    $(document).ready(_initialSetup);

    function _initialSetup() {
        var $desktop = $('#desktop'),
            $installWindow = $('#draggable-window'),
            $startButton = $('#btn-start'),
            $shortcutButton = $('#btn-shortcut'),
            $minimizeButton = $('#btn-minimize'),
            $exitButton = $('#btn-exit'),
            $prevButton = $('#btn-previous'),
            $nextButton = $('#btn-next'),
            $package = $('#package-list > .package'),
            $body = $('#body'),
            $pageTitle = $('#draggable-window .tasks > .title'),
            $postit = $('.postit');
            $startPanel = $('#start-panel'),
            $fbShareLink = $('#fb-share');

        var currentPage = -1,
            packageListPage = $body.html(),
            installPages,
            pageCount,
            pageTitles = {};


        $installWindow.draggable({
            containment: "#desktop",
            scroll: false,
            handle: "div.status-bar"
        });

        $postit.draggable({
            containment: "#desktop",
            scroll: false
        });

        $startButton.click(function() {
            $startPanel.toggle();
            $(this).toggleClass('pressed');
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
            } else {
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
                    for (var key in installPages) {
                        // Catch title from html comment: <!-- title -->
                        pageTitles[key] = installPages[key].match(/^<!-{2}\s*(\S+)\s*-{2}>/)[1];
                    }
                    pageCount = Object.keys(installPages).length;
                    loadPage(currentPage);
                    $nextButton.show();
                },
                error: function() {}
            });
        });

        $fbShareLink.click(function(e) {
            e.preventDefault();
            FB.ui({
                method: 'share',
                href: 'https://developers.facebook.com/docs/',
            }, function(response) {});
        });


        function loadPage(pageNumber) {
            $pageTitle.html(pageTitles[pageNumber]);
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
            $pageTitle.html('請選擇版本');
        }

        function addDesktopIcon() {
            $desktop.append('<div style="font-size: 50px"><i class="fa fa-tasks"></i></div>');
        }
    }


    function initializeAccordion() {
        jQuery('#skills > .skill').accordion({
            header: ".title",
            collapsible: true,
            active: false,
            icons: {
                "header": "ui-icon-plus",
                "activeHeader": "ui-icon-minus"
            },
            heightStyle: 'content'
        });
    }

    return {
        initializeAccordion: initializeAccordion
    }

})(jQuery, window)