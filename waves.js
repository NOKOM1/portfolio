/* Native canvas adaptation of the user-supplied Waves reference.
   Uses bounded sine fields instead of React/simplex-noise; never captures touch input. */
(() => {
  const canvas = document.getElementById('wave-background');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  const toggle = document.getElementById('wave-toggle');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const quiet = () => document.documentElement.classList.contains('quiet-mode');
  const pointer = {x: -1000, y: -1000, targetX: -1000, targetY: -1000};
  let width = 1, height = 1, phase = 0, lastTime = 0, frame = 0, paused = false;
  let waveColor = '#72394e', background = '#13050e';
  canvas.style.pointerEvents = 'none';

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = .8;
    const columns = Math.min(58, Math.max(12, Math.ceil(width / 28) + 4));
    const points = Math.min(54, Math.max(12, Math.ceil(height / 24) + 2));
    const gap = width / (columns - 4);
    for (let column = 0; column < columns; column++) {
      const baseX = (column - 2) * gap;
      ctx.beginPath();
      for (let point = 0; point < points; point++) {
        const y = -40 + point * (height + 80) / (points - 1);
        const wave = Math.sin(y * .004 + baseX * .003 + time * .17) * 15
          + Math.sin(y * .009 - baseX * .002 - time * .11) * 6;
        const distance = Math.hypot(baseX - pointer.x, y - pointer.y);
        const influence = !reduce.matches && !paused ? Math.max(0, 1 - distance / 160) ** 2 : 0;
        const x = baseX + wave + (baseX - pointer.x) * influence * .22;
        const movedY = y + (y - pointer.y) * influence * .1;
        if (point === 0) ctx.moveTo(x, movedY);
        else ctx.lineTo(x, movedY);
      }
      ctx.stroke();
    }
  }
  function running() { return !document.hidden && !reduce.matches && !paused && !quiet(); }
  function tick(time) {
    frame = 0;
    if (!running()) return;
    if (time - lastTime >= 1000 / 30) {
      lastTime = time;
      phase = time / 1000;
      pointer.x += (pointer.targetX - pointer.x) * .12;
      pointer.y += (pointer.targetY - pointer.y) * .12;
      draw(phase);
    }
    frame = requestAnimationFrame(tick);
  }
  function reconcile() {
    cancelAnimationFrame(frame);
    frame = 0;
    const stopped = paused || reduce.matches || quiet();
    if (toggle) {
      toggle.disabled = reduce.matches || quiet();
      toggle.textContent = stopped ? 'Фон: пауза' : 'Фон: движение';
      toggle.setAttribute('aria-pressed', String(stopped));
      toggle.setAttribute('aria-label', toggle.textContent);
      toggle.title = reduce.matches ? 'Уменьшение движения включено на устройстве' : '';
    }
    if (running()) frame = requestAnimationFrame(tick);
  }
  function resize() {
    width = Math.max(1, innerWidth);
    height = Math.max(1, innerHeight);
    const ratio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2400000 / (width * height)));
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    const colors = getComputedStyle(document.documentElement);
    waveColor = colors.getPropertyValue('--wave-color').trim() || '#72394e';
    background = colors.getPropertyValue('--bg').trim() || '#13050e';
    draw(reduce.matches ? 0 : phase);
    reconcile();
  }
  addEventListener('resize', resize, {passive: true});
  addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !running()) return;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
  }, {passive: true});
  addEventListener('pointerout', event => {
    if (!event.relatedTarget) pointer.targetX = pointer.targetY = -1000;
  }, {passive: true});
  document.addEventListener('visibilitychange', reconcile);
  document.addEventListener('themechange', resize);
  document.addEventListener('quietchange', reconcile);
  document.addEventListener('wavepause', event => {
    paused = event.detail === true;
    reconcile();
  });
  toggle?.addEventListener('click', () => {
    if (reduce.matches || quiet()) return;
    paused = !paused;
    reconcile();
  });
  reduce.addEventListener('change', () => {
    draw(reduce.matches ? 0 : phase);
    reconcile();
  });
  resize();
})();
