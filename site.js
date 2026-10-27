(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const frame = document.getElementById('aintinai-frame');
  const stage = document.getElementById('painting-stage');
  const motion = document.getElementById('motion-toggle');
  const status = document.getElementById('painting-status');
  const portrait = document.getElementById('portrait-video');
  const portraitToggle = document.getElementById('portrait-toggle');
  let paused = reduced.matches;
  let artIndex = 0;
  let loadTimer;
  let currentUrl;
  let journeySpeed = 32;
  let displayedPlace = 'madurai';
  const speedControl = document.getElementById('journey-speed');
  const scenes = {
    madurai: { tamil: 'மதுரை', name: 'Madurai, my hometown', description: 'A street that leads home, to the Meenakshi temple.', center: -21165, image: 'town' },
    kurinji: { tamil: 'குறிஞ்சி', name: 'Kurinji · mountains', description: 'The mountains of union, under a sky full of stars.', center: -5800, image: 'kurinji' },
    mullai: { tamil: 'முல்லை', name: 'Mullai · forest', description: 'The quiet of the forest. A landscape of patient waiting.', center: 8600, image: 'mullai' },
    marutham: { tamil: 'மருதம்', name: 'Marutham · farmland', description: 'Fields, rivers, and the everyday rhythms of domestic life.', center: 17600, image: 'marutham' },
    neithal: { tamil: 'நெய்தல்', name: 'Neithal · coast', description: 'Palm groves and open water. A landscape of longing.', center: 600, image: 'neithal' },
    paalai: { tamil: 'பாலை', name: 'Paalai · drylands', description: 'Dry country, separation, and the journeys between.', center: 2400, image: 'paalai' }
  };
  function sendMotion(active) {
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage({ type: 'aintinai-motion', paused: !active }, window.location.origin === 'null' ? '*' : window.location.origin);
  }
  function syncMotion() {
    if (motion) {
      motion.textContent = paused ? 'Play motion' : 'Pause motion';
      motion.setAttribute('aria-pressed', String(paused));
    }
    const journeyState = document.getElementById('journey-state');
    if (journeyState) journeyState.textContent = paused ? 'The world can wait. Explore at your own pace.' : 'An endless walk. Drag to take the lead.';
    sendMotion(!paused && !document.hidden && stageInView);
  }
  let stageInView = true;
  function loadPainting(url, scene) {
    if (!frame) return;
    clearTimeout(loadTimer);
    stage.classList.remove('is-ready');
    currentUrl = new URL(url, window.location.href);
    const full = new URL(currentUrl);
    full.searchParams.delete('embed');
    full.searchParams.set('drift', journeySpeed);
    full.searchParams.delete('paused');
    document.getElementById('aintinai-open').href = full.href;
    currentUrl.searchParams.set('embed', '1');
    currentUrl.searchParams.set('drift', journeySpeed);
    currentUrl.searchParams.set('paused', paused ? '1' : '0');
    if (scene) {
      displayedPlace = Object.keys(scenes).find(key => scenes[key] === scene);
      document.getElementById('place-tamil').textContent = scene.tamil;
      document.getElementById('place-name').textContent = scene.name;
      document.getElementById('place-description').textContent = scene.description;
      const poster = document.getElementById('painting-poster');
      poster.src = scene.image === 'town' ? 'images/aintinai-madurai.png' : `tinai/screenshots/${scene.image}.jpg`;
      poster.alt = `Aintinai: ${scene.name}. ${scene.description}`;
    }
    status.textContent = 'Opening the landscape…';
    frame.src = currentUrl.href;
    loadTimer = setTimeout(() => { status.textContent = 'The interactive painting is taking a little longer. You can still enter the full painting.'; }, 12000);
  }
  if (frame) {
    frame.addEventListener('load', () => {
      // Keep the real painting poster if the embedded document failed to render.
      try { if (!frame.contentDocument?.getElementById('SVG')) return; } catch { /* file URLs can have opaque origins */ }
      clearTimeout(loadTimer);
      stage.classList.add('is-ready');
      status.textContent = `${document.getElementById('place-name').textContent} is open. Drag the painting to explore.`;
      syncMotion();
    });
    document.getElementById('journey-tools').hidden = false;
    speedControl.addEventListener('input', () => {
      journeySpeed = Number(speedControl.value);
      const pace = journeySpeed < 26 ? 'Linger' : journeySpeed < 50 ? 'Wander' : 'Roam';
      document.getElementById('journey-pace').textContent = pace;
      speedControl.setAttribute('aria-valuetext', pace);
      frame.contentWindow.postMessage({ type: 'aintinai-speed', speed: journeySpeed }, window.location.origin);
      const link = new URL(document.getElementById('aintinai-open').href);
      link.searchParams.set('drift', journeySpeed);
      document.getElementById('aintinai-open').href = link.href;
    });
    window.addEventListener('message', event => {
      if (event.source !== frame.contentWindow || event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.type !== 'aintinai-view' || !scenes[data.place] || !Number.isFinite(data.center)) return;
      const scene = scenes[data.place];
      if (displayedPlace !== data.place) {
        displayedPlace = data.place;
        document.getElementById('place-tamil').textContent = scene.tamil;
        document.getElementById('place-name').textContent = scene.name;
        document.getElementById('place-description').textContent = scene.description;
        document.querySelectorAll('[data-scene]').forEach(link => {
          if (link.dataset.scene === data.place) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
      const full = new URL(document.getElementById('aintinai-open').href);
      full.searchParams.set('center', Math.round(data.center));
      document.getElementById('aintinai-open').href = full.href;
    });
    motion.hidden = false;
    motion.addEventListener('click', () => { paused = !paused; syncMotion(); });
    const worldButton = document.getElementById('new-world');
    worldButton.hidden = false;
    worldButton.addEventListener('click', () => {
      const values = new Uint32Array(2);
      crypto.getRandomValues(values);
      displayedPlace = '';
      const seed = Array.from(values, n => n.toString(36)).join('-');
      document.querySelectorAll('[data-scene]').forEach(link => link.removeAttribute('aria-current'));
      document.getElementById('place-tamil').textContent = 'ஐந்திணை';
      document.getElementById('place-name').textContent = 'A new world';
      document.getElementById('place-description').textContent = 'The same five landscapes, drawn differently each time.';
      loadPainting(`tinai/index.html?seed=${seed}&center=600&drift=12`);
    });
    document.querySelectorAll('[data-scene]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const scene = scenes[link.dataset.scene];
        document.querySelectorAll('[data-scene]').forEach(item => item.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
        loadPainting(link.href, scene);
      });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        stageInView = entries[0].isIntersecting;
        syncMotion();
      }, { threshold: 0 }).observe(stage);
    }
    loadPainting(frame.dataset.src, scenes.madurai);
    syncMotion();
  }
  document.addEventListener('visibilitychange', () => {
    syncMotion();
    if (document.hidden && portrait) portrait.pause();
  });
  reduced.addEventListener('change', () => {
    paused = reduced.matches;
    syncMotion();
    if (reduced.matches && portrait) portrait.pause();
  });
  if (portrait && portraitToggle) {
    portraitToggle.hidden = false;
    portraitToggle.addEventListener('click', () => {
      if (portrait.paused) portrait.play().catch(() => { portraitToggle.textContent = 'Play portrait'; });
      else portrait.pause();
    });
    portrait.addEventListener('play', () => { portraitToggle.textContent = 'Pause portrait'; });
    portrait.addEventListener('pause', () => { portraitToggle.textContent = 'Play portrait'; });
  }
  const art = document.getElementById('siren-art');
  function changeArt(direction) {
    artIndex = (artIndex + direction + 6) % 6;
    const path = `siren_art/siren_${artIndex + 1}.png`;
    art.src = path;
    art.alt = `Experimental SIREN artwork ${artIndex + 1} of 6: colourful abstract neural patterns.`;
    document.getElementById('slide-counter').textContent = `${artIndex + 1} / 6`;
    if (!reduced.matches) art.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
  }
  if (art) {
    document.getElementById('previous-art').addEventListener('click', () => changeArt(-1));
    document.getElementById('next-art').addEventListener('click', () => changeArt(1));
  }
  // The finished page is always visible. Motion adds a gentle arrival, never a hidden dependency.
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const isImage = element.matches('.landscape-piece, .portrait');
        element.animate(isImage ? [{ opacity: .65, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }] : [{ opacity: .65 }, { opacity: 1 }], { duration: isImage ? 650 : 450, easing: 'cubic-bezier(.22,1,.36,1)' });
        observer.unobserve(element);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.story-intro h2, .story-copy, .landscape-piece, .making, .portrait, .about-copy h2, .publication, .accidents-art, .footer-top').forEach(element => observer.observe(element));
  }
})();
