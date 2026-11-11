const picker = document.querySelector('.studio-picker');
if (picker) {
  const tabs = [...picker.querySelectorAll('[data-study]')];
  const panels = tabs.map(tab => document.getElementById(tab.dataset.study));
  picker.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  function show(id, updateHistory = false) {
    const selected = Math.max(0, tabs.findIndex(tab => tab.dataset.study === id));
    tabs.forEach((tab, index) => {
      const active = selected === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;
    });
    const hash = `#${panels[selected].id}`;
    if (updateHistory && location.hash !== hash) history.pushState(null, '', hash);
    document.title = `${['The eyes', 'The courtyard', 'Happy accidents'][selected]} · Studio — Sacchin Sundar`;
    // A panel change is immediate; only the chosen artwork gets an animation clock.
    window.dispatchEvent(new Event('studiochange'));
  }
  const fromLocation = () => show(location.hash === '#kolam' ? 'ascii-study' : location.hash.slice(1));
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); show(tab.dataset.study, true);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) {
        if (event.key === ' ') { event.preventDefault(); show(tab.dataset.study, true); }
        return;
      }
      event.preventDefault(); show(tabs[next].dataset.study, true); tabs[next].focus();
    });
  });
  window.addEventListener('popstate', fromLocation);
  window.addEventListener('hashchange', fromLocation);
  fromLocation();
}
