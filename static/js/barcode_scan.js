if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
  var _scannerIsRunning = false;

  function startScanner() {
    var width = $( window ).width();
    var constraintsSize = Math.min(width - 20, 500);

    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#_scanner_container'),
        constraints: {
          width: constraintsSize,
          height: constraintsSize,
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
      $('#_scanner_container video').css('display', 'inline');
    });

    Quagga.onDetected(function (result) {
      $('#_barcode_result').val('');
      $('#_barcode_result').val(result.codeResult.code);
      Quagga.stop();
      _scannerIsRunning = false;
      $('#_scanner_container video').css('display', 'none');
    });
  }
} else {
  alert('바코드 인식이 지원되지 않는 기기입니다.')
}

$( document ).ready(function() {
  $('._barcode_scan').click(function (e) {
    e.preventDefault()
    if (_scannerIsRunning) {
      Quagga.stop();
      _scannerIsRunning = false;
      $('#_scanner_container video').css('display', 'none');
    } else {
      startScanner();
    }
  })
})
