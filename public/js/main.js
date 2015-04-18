var exe = (function($, window) {
  $(document).ready(_initialSetup);

  function _initialSetup() {
    var $desktop = $('#desktop'),
        $installWindow = $('#draggable-window'),
        $statusBarTitle = $installWindow.find('.status-bar > .title'),
        $menuBar = $('#menu-bar'),
        $startButton = $('#btn-start'),
        $installButton = $('#btn-shortcut-install'),
        $minimizeButton = $('#btn-minimize'),
        $exitButton = $('#btn-exit'),
        $prevButton = $('#btn-previous'),
        $nextButton = $('#btn-next'),
        $package = $('#package-list > .package'),
        $body = $('#body'),
        $pageTitle = $('#draggable-window .tasks > .title'),
        $postit = $('.postit'),
        $startPanel = $('#start-panel'),
        $fbShareLink = $('#fb-share'),
        $easterLink = $('#easter > a');

    var currentPage = -1,
        packageListPage = $body.html(),
        installPages,
        downloadPage,
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

    $menuBar.on('click', '.button.shortcut', function() {
      currentRunning = $(this).attr('id').split('-')[2];
      if (isInstalled && currentRunning == 'install') {
        var reinstallForSure = confirm('你已成功安裝exe.andyteki，是否重新安裝？');
        if (reinstallForSure) reinstall();
        return;
      } else if (currentRunning == 'download') {
        $statusBarTitle.html('<i class="fa fa-cloud-download"></i>&nbspandyteki');
        loadPage(pageCount);
        registerDownloadEvent();
      }
      $installWindow.toggle();
      if ($(this).hasClass('closed')) $(this).removeClass('closed');
      $(this).toggleClass('active');
    });

    $minimizeButton.click(function() {
      $installWindow.hide();
      $('#btn-shortcut-' + currentRunning).toggleClass('active');
    });

    $exitButton.click(function() {
      if (currentRunning == 'install') {
        var exitForSure = confirm('安裝程式正在進行，確定關閉視窗？');
        if (exitForSure) {
          resetInstallation();
        }
      } else if (currentRunning == 'download') {
        $installWindow.hide();
        $('#btn-shortcut-' + currentRunning).removeClass('active');
        $('#btn-shortcut-' + currentRunning).addClass('closed');
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
        var isChecked = $('#execution-andyteki').prop('checked')
        addMenuBarIcon()
        resetInstallation();
        isInstalled = true;
        if (isChecked) {
          $('#btn-shortcut-download').trigger('click');
        }
      }
    });

    $body.on('click', '#package-list > .package', function() {
      var selectedPackage = $(this).attr('id').replace(/\w+-/, '');

      // Temporarily block custom query
      if (selectedPackage == 'custom') return;
      $body.html('<h1>Loading...</h1>')
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
          pageCount = Object.keys(installPages).length - 1;
          downloadPage = installPages[pageCount];
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
        href: window.location.href,
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
      $pageTitle.html('請選擇版本');
      currentPage = -1;
      $prevButton.hide();
      $nextButton.hide();
      $nextButton.text('下一步');
    }

    function addMenuBarIcon() {
      $menuBar.append('<button id="btn-shortcut-download" class="button shortcut closed"><i class="fa fa-cloud-download"></i></button>');
      var downloadButton = $('#btn-shortcut-download');
    }

    function reinstall() {
      if (currentRunning == 'install') {
        $installWindow.hide();
      }
      isInstalled = false;
      $statusBarTitle.html('<i class="fa fa-download"></i>&nbspexe.andyteki');
      $body.html(packageListPage);
      $pageTitle.html('請選擇版本');
      $('#btn-shortcut-download').remove();
      $installWindow.show();
      $installButton.removeClass('closed');
      $installButton.addClass('active');
    }

    function registerDownloadEvent() {
      $('.button-group.bc > button, .button-group.cv > button').click(function() {
        var media = $(this).attr('id').split('-')[1];
        var group = $(this).attr('id').split('-')[2];
        var BC_URL = 'https://www.dropbox.com/s/38hkgsxyq6hr1pw/BC.pdf?raw=1';
        var CV_URL = 'https://www.dropbox.com/s/ltwoysbpl6rwy33/%E5%B1%A5%E6%AD%B7.pdf?raw=1';
        var dropboxOptions = {
          success: function() {
            alert('儲存成功!');
          }
        }

        if (media == 'open') {
          if (group == 'card') window.open(BC_URL);
          if (group == 'cv') window.open(CV_URL);
        } 
        else if (media == 'dropbox') {
          if (group == 'card') Dropbox.save(BC_URL, '名片', dropboxOptions);
          if (group == 'cv') Dropbox.save(CV_URL, '履歷', dropboxOptions);
        }
      });
    }

    function saveAgreementAdvice(advice) {
      console.log(advice);
    }
  }

  function initializeHandAnimation() {
    $('#btn-next-card').click(function(e) {
      e.preventDefault();
      var $image = $('#working-experience > .hand-with-card > img')
      var imagePath = $image.attr('src');
      var imageIndex = imagePath.match(/(\d).png$/)[1];
      imageIndex < 3 ? imageIndex++ : imageIndex = 1;

      $image.addClass('take');
      setTimeout(function() {
        $image.attr('src', imagePath.replace(/\d/, imageIndex)).load(function() {
           $image.removeClass('take');
        });
      }, 1000);
    });
  }

  function initializeAccordion() {
    $('#skills > .skill').accordion({
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

  function initializeLanguage() {
    var overlay = $('#languages > .overlay');
    $('.language > img').hover(function() {
      var info = $(this).siblings('.info').text();
      overlay.html(info);
      overlay.removeClass('hide');
    }, function() {
      overlay.addClass('hide');
    });
  }

  return {
    initializeExperience: initializeHandAnimation,
    initializeSkills: initializeAccordion,
    initializeLanguage: initializeLanguage
  };

})(jQuery, window)