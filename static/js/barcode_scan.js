if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
  var _scannerIsRunning = false;
  var width = $( window ).width();
  var videoSize = Math.min(width - 20, 500);

  function startScanner() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#_scanner_container'),
        constraints: {
          width: 650,
          height: 650,
          facingMode: "environment"
        },
      },
      decoder: {
        readers: [
          "ean_reader"
        ],
        debug: {
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingPatchLabels: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true
          }
        }
      },
      locator: {
        patchSize: "medium", // x-small, small, medium, large, x-large
      }
    }, function (err) {
      if (err) {
        console.log(err);
        return
      }
      Quagga.start();
      _scannerIsRunning = true;
    });

    Quagga.onProcessed(function (result) {
      $('#_scanner_container video').css('width', videoSize);
      $('#_scanner_container video').css('height', videoSize);
      $('#_scanner_container video').css('display', 'inline');
    });

    Quagga.onDetected(function (result) {
      var firstLetter = result.codeResult.code.substring(0, 1);
      if (firstLetter === '9') {
        $('#_barcode_result').val('');
        $('#_barcode_result').val(result.codeResult.code);
        Quagga.stop();
        _scannerIsRunning = false;
        $('#_scanner_container video').css('display', 'none');
      }
    });
  }
} else {
  alert('바코드 인식이 지원되지 않는 기기입니다.');
}

$( document ).ready(function() {
  $('._barcode_scan').click(function (e) {
    e.preventDefault();
    if (_scannerIsRunning) {
      Quagga.stop();
      _scannerIsRunning = false;
      $('#_scanner_container video').css('display', 'none');
    } else {
      startScanner();
    }
  });
});
