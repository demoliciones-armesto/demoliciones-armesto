// Match the pinned image to the real navbar height, including on mobile.
const heroHeader = document.querySelector('header');
if (heroHeader) {
  const syncHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-height', `${heroHeader.getBoundingClientRect().height}px`);
  };
  syncHeaderHeight();
  if ('ResizeObserver' in window) new ResizeObserver(syncHeaderHeight).observe(heroHeader);
  else window.addEventListener('resize', syncHeaderHeight);
}
