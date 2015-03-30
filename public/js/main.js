// Register desktopUI event listeners
var exe = (function($, window) {
    $(document).ready(_initialSetup);

    function _initialSetup() {
        var $desktop = $('#desktop'),
            $installWindow = $('#draggable-window'),
            $statusBarTitle = $installWindow.find('.status-bar > .title'),
            $menuBar = $('#menu-bar'),
            $startButton = $('#btn-start'),
            $installButton = $('#btn-install'),
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
        $easterLink = $('#easter > a');

        var currentPage = -1,
            packageListPage = $body.html(),
            installPages,
            pageCount,
            pageTitles = {};

        var currentRunning = 'install',
            isInstalled = false;

        // addMenuBarIcon();

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

        // $installButton.click(function() {
        //     $installWindow.toggle();
        //     if ($installButton.hasClass('closed')) $installButton.removeClass('closed');
        //     $(this).toggleClass('active');
        // });

        $menuBar.on('click', '.button.shortcut', function() {
            currentRunning = $(this).attr('id').split('-')[1];
            if (isInstalled && currentRunning == 'install') {
                var reinstallForSure = confirm('你已成功安裝exe.andyteki，是否重新安裝？');
                if (reinstallForSure) reinstall();
                return;
            }
            else if (currentRunning == 'download') {
                $statusBarTitle.html('<i class="fa fa-cloud-download"></i>&nbspandyteki');
                $body.html();
            }
            $installWindow.toggle();
            if ($(this).hasClass('closed')) $(this).removeClass('closed');
            $(this).toggleClass('active');
        });

        $minimizeButton.click(function() {
            $installWindow.hide();
            $('#btn-' + currentRunning).toggleClass('active');
        });

        $exitButton.click(function() {
            if (currentRunning == 'install') {
                var exitForSure = confirm('安裝程式正在進行，確定關閉視窗？');
                if (exitForSure) {
                    resetInstallation();
                }
            } else if (currentRunning == 'download') {
                $installWindow.hide();
                $('#btn-' + currentRunning).removeClass('active');
                $('#btn-' + currentRunning).addClass('closed');
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
                        var advice = prompt('您不同意哪幾個點呢？請填入編號或理由，謝謝！');
                        saveAgreementAdvice(advice);
                    }
                }
                currentPage++;
                loadPage(currentPage);

                if (currentPage > 1) $prevButton.show();
                if (currentPage == pageCount - 1) $(this).text('完成');
            } else {
                // 完成安裝
                addMenuBarIcon()
                resetInstallation();
                isInstalled = true;
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

        $easterLink.tooltip();


        function loadPage(pageNumber) {
            $pageTitle.html(pageTitles[pageNumber]);
            $body.html(installPages[pageNumber]);
        }

        function resetInstallation() {
            $installWindow.hide();
            $installButton.removeClass('active');
            $installButton.addClass('closed');
            $body.html(packageListPage);
            currentPage = -1;
            $prevButton.hide();
            $nextButton.hide();
            $nextButton.text('下一步');
            $pageTitle.html('請選擇版本');
        }

        function addMenuBarIcon() {
            $menuBar.append('<button id="btn-download" class="button shortcut closed"><i class="fa fa-cloud-download"></i></button>');
            var downloadButton = $('#btn-download');
        }

        function reinstall() {
            if (currentRunning == 'install') {
                $installWindow.hide();
            }
            isInstalled = false;
            $statusBarTitle.html('<i class="fa fa-download"></i>&nbspexe.andyteki');
            $('#btn-download').remove();
            $installWindow.show();
            $installButton.removeClass('closed');
            $installButton.addClass('active');
        }

        function saveAgreementAdvice(advice) {
            console.log(advice);
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