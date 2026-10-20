/* IWCare Joy Monogram — 웹용 로고 렌더러 (brand/monogram.jsx 기하 1:1)
   사용: <span data-logo data-size="36" data-theme="light|dark|mono" data-pal="teal|coral|mint" data-v="auto|base|bold|fine|badge|tile"></span>
   규칙: size ≤ 24px → bold 자동 적용 (최소 16px) · dark = C/W 아이보리 + 코랄 점 · mono = #111 */
(function () {
  const PAL = {
    teal:  { c1: '#14514F', c2: '#E8826A', bg: '#FAF8F4', ink: '#0E2524' }, // B01 기본
    coral: { c1: '#B4543F', c2: '#F2B544', bg: '#FBF5EF', ink: '#3A1D16' }, // B03 시니어·가족
    mint:  { c1: '#1F2A4A', c2: '#5EC7AE', bg: '#F5F7F8', ink: '#121829' }, // B04 AI·데이터
  };
  const arc = (cx, cy, r, a0, a1) => {
    const p = d => [cx + r * Math.cos(d * Math.PI / 180), cy + r * Math.sin(d * Math.PI / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const span = ((a1 - a0) % 360 + 360) % 360;
    return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const W = 'M29 42 L39 68 L50 50 L61 68 L71 42';
  const L = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const core = (c1, c2, s, sw, r = 7.5, cy = 31, rr = 38, a0 = 40, a1 = 320) =>
    `<g ${L}><path d="${arc(50, 52, rr, a0, a1)}" stroke="${c1}" stroke-width="${s * sw}"/><path d="${W}" stroke="${c1}" stroke-width="${s * sw}"/></g><circle cx="50" cy="${cy}" r="${r}" fill="${c2}"/>`;

  function svg(v, c1, c2, c3, sw) {
    let b;
    switch (v) {
      case 'bold': b = `<g ${L}><path d="${arc(50, 52, 37, 42, 318)}" stroke="${c1}" stroke-width="${12 * sw}"/><path d="${W}" stroke="${c1}" stroke-width="${12 * sw}"/></g><circle cx="50" cy="30" r="8.5" fill="${c2}"/>`; break;
      case 'fine': b = core(c1, c2, 5.5, sw, 6, 32, 39); break;
      case 'badge': b = `<circle cx="50" cy="50" r="48" fill="${c1}"/><g transform="translate(50 52) scale(.72) translate(-50 -52)">${core(c3, c2, 9, sw)}</g>`; break;
      case 'tile': b = `<rect x="2" y="2" width="96" height="96" rx="24" fill="${c1}"/><g transform="translate(50 51) scale(.66) translate(-50 -52)">${core(c3, c2, 10, sw, 8)}</g>`; break;
      default: b = core(c1, c2, 9, sw);
    }
    return `<svg viewBox="0 0 100 100" width="100%" height="100%" style="display:block;overflow:visible" aria-hidden="true">${b}</svg>`;
  }

  function render(el) {
    const size = +el.dataset.size || 36;
    const theme = el.dataset.theme || 'light';
    const p = PAL[el.dataset.pal] || PAL.teal;
    let v = el.dataset.v || 'auto';
    if (v === 'auto') v = size <= 24 ? 'bold' : 'base';
    const sw = +(el.dataset.sw || (size <= 24 && v !== 'bold' ? 1.15 : 1));
    let c1 = p.c1, c2 = p.c2, c3 = p.bg;
    if (theme === 'dark') { c1 = v === 'tile' || v === 'badge' ? p.c1 : p.bg; c3 = p.bg; }
    if (theme === 'accent') { c1 = p.c2; c2 = p.c1; c3 = p.bg; }
    if (theme === 'light-tile') { c1 = p.bg; c3 = p.c1; }
    if (theme === 'ink-tile') { c1 = p.ink; c3 = p.c2; c2 = p.bg; }
    if (theme === 'mono') { c1 = c2 = '#111'; c3 = '#fff'; }
    el.style.width = el.style.height = size + 'px';
    el.style.display = el.style.display || 'inline-block';
    el.style.flex = 'none';
    el.innerHTML = svg(v, c1, c2, c3, sw);
    el.setAttribute('data-v-used', v);
  }
  window.IWCLogo = { render, all: (root = document) => root.querySelectorAll('[data-logo]').forEach(render), PAL };
  if (document.readyState !== 'loading') window.IWCLogo.all();
  else document.addEventListener('DOMContentLoaded', () => window.IWCLogo.all());
})();
