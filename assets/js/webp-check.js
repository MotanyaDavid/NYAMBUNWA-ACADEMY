// ============================================
// NYAMBUNWA ACADEMY
// webp-check.js - WebP Support Detection
// ============================================

(function() {
    // Check if browser supports WebP
    function checkWebP(callback) {
        var webP = new Image();
        webP.onload = function() {
            callback(true);
        };
        webP.onerror = function() {
            callback(false);
        };
        webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    }

    checkWebP(function(supportsWebP) {
        if (supportsWebP) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }
    });
})();