/* Isolated reusable visual loader. No build step or external dependencies. */
(function () {
  'use strict';
  const assets = window.THREE_LANES_VISUAL_ASSETS || {};
  const safe = (path, side) => {
    if (typeof path !== 'string' || path.includes('..') || path.startsWith('/')) return false;
    return side === 'backend'
      ? /^visuals\/svg\/[a-z0-9_./-]+\.svg$/i.test(path)
      : /^visuals\/frontend-ui\/[a-z0-9_./-]+\.html$/i.test(path);
  };
  function mount(side, sha, step, container) {
    const chosen = assets[String(sha) + ':' + String(step)]?.[side];
    if (!chosen || !container || !safe(chosen, side)) return false;
    const asset = document.createElement(side === 'backend' ? 'img' : 'iframe');
    asset.className = side === 'backend' ? 'stored-svg-visual' : 'stored-frontend-visual';
    asset.src = chosen;
    if (side === 'backend') {
      asset.alt = 'Architecture diagram for step ' + step;
      asset.decoding = 'async';
    } else {
      asset.title = 'Frontend preview for step ' + step;
      asset.setAttribute('sandbox', 'allow-scripts');
      asset.setAttribute('scrolling', 'no');
      asset.loading = 'eager';
    }
    asset.addEventListener('error', () => {
      // No alternate visual is invented if the registered file is missing.
      container.textContent = 'Could not load saved visual: ' + chosen;
    }, { once: true });
    container.replaceChildren(asset);
    return true;
  }
  window.THREE_LANES_VISUAL_LIBRARY = Object.freeze({ mount });
})();
