
/**
 * Function to handle mobile viewport adjustments for a more native-like experience
 */
export function setupMobileViewport() {
  // Prevent zooming on iOS
  document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });
  
  // Handle iOS height issues with virtual keyboard
  const metaViewport = document.querySelector('meta[name=viewport]');
  if (metaViewport) {
    let viewportContent = metaViewport.getAttribute('content') || '';
    viewportContent = viewportContent.replace(/height=[^,]+/g, '').trim();
    if (!/height=/i.test(viewportContent)) {
      viewportContent = `${viewportContent}, height=device-height`;
    }
    metaViewport.setAttribute('content', viewportContent);
  }

  // Prevent pull-to-refresh on mobile
  document.body.style.overscrollBehavior = 'none';

  // Add iOS standalone app styling
  if (window.navigator.standalone) {
    document.documentElement.classList.add('ios-standalone');
  }
}
