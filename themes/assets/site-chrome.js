/* WHY3K — サブページ共通の外装。
   ・上部バーをトップと同じ項目で作る（data-nav でどこを現在地にするか指定）
   ・リンクを踏んだら、トップと同じように時計と軌道が巻き上がって白に溶けてから遷移する
   背景の装飾（刃・インク・ガラス・定規・散乱データ）はサブページには置かない。

   使い方：<body data-nav="themes"> だけ。 */

(function () {
  'use strict';

  var body = document.body;
  var CURRENT = body.dataset.nav || '';
  var PLUGINS = 'https://why3k.github.io/why3k-plugins/';

  /* 戻り遷移では最初の描画から白で出す（トップと同じ挙動） */
  try {
    var nav0 = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var backFlag = sessionStorage.getItem('w3kBack') === '1';
    if (backFlag) sessionStorage.removeItem('w3kBack');
    if (backFlag || (nav0 && nav0.type === 'back_forward')) document.documentElement.classList.add('backnav');
  } catch (_) {}

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content;
  }

  /* ---------- 上部バー（トップと同じ5項目） ---------- */
  function item(no, label, href, current, soon) {
    if (soon) {
      return '<a class="soon" href="#" aria-disabled="true"><span class="no">' + no + '</span>' +
             label + '<span class="soonmk">SOON</span></a>';
    }
    return '<a' + (current ? ' class="active"' : '') + ' href="' + href + '">' +
           '<span class="no">' + no + '</span>' + label + '</a>';
  }

  var nav =
    '<nav class="topnav" aria-label="Primary">' +
    '<a class="brand" href="/"><i class="d2"></i><i class="ln"></i>WHY3K<i class="ln"></i><i class="d2"></i></a>' +
    '<span class="hist">' +
    '<button class="hb" id="histBack" aria-label="前のページへ" disabled>←</button>' +
    '<button class="hb" id="histFwd" aria-label="次のページへ" disabled>→</button>' +
    '</span>' +
    item('01', 'Index', '/', CURRENT === 'index') +
    item('02', 'Plugins', PLUGINS, CURRENT === 'plugins') +
    item('03', 'Themes', '/themes/', CURRENT === 'themes') +
    item('04', 'Music', '#', false, true) +
    item('05', 'Store', '#', false, true) +
    '</nav>';

  /* ---------- 白幕と、遷移のあいだだけ回る時計 ---------- */
  var clock =
    '<div class="warp" aria-hidden="true"></div>' +
    '<div class="warpfig" aria-hidden="true"><svg viewBox="0 0 600 516" fill="none">' +
    /* 中心軸と目盛り */
    '<line x1="300" y1="12" x2="300" y2="504" stroke="#131316" stroke-width="2"/>' +
    '<g stroke="#131316" stroke-width="1" opacity=".65">' +
    '<line x1="295" y1="40" x2="305" y2="40"/><line x1="296" y1="100" x2="304" y2="100"/>' +
    '<line x1="295" y1="160" x2="305" y2="160"/><line x1="296" y1="356" x2="304" y2="356"/>' +
    '<line x1="295" y1="416" x2="305" y2="416"/><line x1="296" y1="470" x2="304" y2="470"/></g>' +
    '<circle cx="300" cy="76" r="4.5" fill="#131316"/>' +
    '<circle cx="300" cy="258" r="6" fill="#131316"/>' +
    '<circle cx="300" cy="436" r="4.5" fill="#131316"/>' +
    /* 同心円・作図線 */
    '<circle cx="300" cy="258" r="70" stroke="#131316" stroke-width=".45" opacity=".12"/>' +
    '<circle cx="300" cy="258" r="150" stroke="#131316" stroke-width=".45" opacity=".10"/>' +
    '<circle cx="300" cy="258" r="235" stroke="#131316" stroke-width=".5" opacity=".10" stroke-dasharray="5 9"/>' +
    '<circle cx="300" cy="258" r="196" stroke="#d9d9df" stroke-width=".7" stroke-dasharray="2 5"/>' +
    '<circle cx="300" cy="258" r="118" stroke="#e2e2e7" stroke-width=".6"/>' +
    /* 針 */
    '<g class="hands">' +
    '<g class="handH">' +
    '<line x1="300" y1="258" x2="300" y2="232" stroke="#131316" stroke-width="4" stroke-linecap="round" opacity=".85"/>' +
    '<path d="M300 168 C309 188 307 212 300 234 C293 212 291 188 300 168 Z" fill="#131316" opacity=".85"/></g>' +
    '<g class="handM">' +
    '<line x1="300" y1="258" x2="300" y2="206" stroke="#131316" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M300 92 C306 122 305 160 300 208 C295 160 294 122 300 92 Z" fill="#131316" opacity=".8"/></g>' +
    '<g class="handS">' +
    '<line x1="300" y1="290" x2="300" y2="86" stroke="#7a7a83" stroke-width="1.4" opacity=".8"/>' +
    '<circle cx="300" cy="280" r="4.5" fill="#7a7a83" opacity=".8"/></g>' +
    '</g>' +
    /* 文字盤 */
    '<g class="clockface" font-family="Cormorant, \'Hiragino Mincho ProN\', serif" font-size="15" font-weight="600" fill="#131316" text-anchor="middle" letter-spacing=".04em">' +
    '<text x="300" y="15">XII</text><text x="424" y="48.2">I</text><text x="514.8" y="139">II</text>' +
    '<text x="548" y="263">III</text><text x="514.8" y="387">IIII</text><text x="424" y="477.8">V</text>' +
    '<text x="300" y="511">VI</text><text x="176" y="477.8">VII</text><text x="85.2" y="387">VIII</text>' +
    '<text x="52" y="263">IX</text><text x="85.2" y="139">X</text><text x="176" y="48.2">XI</text></g>' +
    /* ビーズの軌道 */
    '<circle cx="300" cy="258" r="168" stroke="#131316" stroke-width="3.4" stroke-dasharray="0.1 11" stroke-linecap="round" opacity=".5" transform="rotate(-20 300 258)"/>' +
    '<circle cx="300" cy="258" r="228" stroke="#131316" stroke-width="2.6" stroke-dasharray="0.1 14" stroke-linecap="round" opacity=".35" transform="rotate(30 300 258)"/>' +
    /* 軌道群 */
    '<g class="orbitA">' +
    '<ellipse cx="300" cy="258" rx="244" ry="66" stroke="#1a1a1f" stroke-width="1" opacity=".75" transform="rotate(-14 300 258)"/>' +
    '<ellipse cx="300" cy="258" rx="154" ry="46" stroke="#1a1a1f" stroke-width=".8" opacity=".6" transform="rotate(26 300 258)"/>' +
    '<ellipse cx="300" cy="258" rx="188" ry="30" stroke="#1a1a1f" stroke-width=".6" opacity=".4" transform="rotate(8 300 258)"/>' +
    '<circle cx="476" cy="216" r="3" fill="#131316"/><circle cx="176" cy="304" r="2" fill="#131316"/></g>' +
    '<g class="orbitB">' +
    '<ellipse cx="300" cy="258" rx="212" ry="114" stroke="#1a1a1f" stroke-width=".7" opacity=".4" transform="rotate(-38 300 258)"/>' +
    '<ellipse cx="300" cy="258" rx="124" ry="90" stroke="#1a1a1f" stroke-width=".6" opacity=".3" stroke-dasharray="1 4" transform="rotate(52 300 258)"/>' +
    '<circle cx="408" cy="150" r="2.4" fill="#131316" opacity=".7"/></g>' +
    '<g class="orbitC">' +
    '<ellipse cx="300" cy="258" rx="272" ry="46" stroke="#1a1a1f" stroke-width=".5" opacity=".25" transform="rotate(18 300 258)"/></g>' +
    /* 点線アーク */
    '<g class="redarc">' +
    '<path d="M 132 136 A 216 216 0 0 1 404 82" stroke="#131316" stroke-width="1.3" opacity=".8" stroke-dasharray="2 6"/>' +
    '<path d="M 468 384 A 216 216 0 0 1 206 442" stroke="#131316" stroke-width="1.3" opacity=".8" stroke-dasharray="2 6"/>' +
    '<circle cx="132" cy="136" r="2.2" fill="#131316"/></g>' +
    '</svg></div>';

  body.insertBefore(el(nav + clock), body.firstChild);

  /* ---------- 戻る/進むボタン ---------- */
  (function () {
    var b = document.getElementById('histBack');
    var f = document.getElementById('histFwd');
    if (!b || !f) return;
    function update() {
      if (window.navigation && 'canGoBack' in window.navigation) {
        b.disabled = !window.navigation.canGoBack;
        f.disabled = !window.navigation.canGoForward;
      } else {
        b.disabled = history.length <= 1;
      }
    }
    b.addEventListener('click', function () {
      try { sessionStorage.setItem('w3kBack', '1'); } catch (_) {}
      history.back();
    });
    f.addEventListener('click', function () { history.forward(); });
    update();
    window.addEventListener('pageshow', function (e) {
      update();
      if (!(window.navigation && 'canGoBack' in window.navigation)) {
        var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
        if (e.persisted || (nav && nav.type === 'back_forward')) f.disabled = false;
      }
    });
    if (window.navigation && window.navigation.addEventListener) {
      window.navigation.addEventListener('currententrychange', update);
    }
  })();

  /* ---------- 入場：白から紙面へ ---------- */
  var warp = document.querySelector('.warp');
  var fig = document.querySelector('.warpfig');
  requestAnimationFrame(function () {
    document.documentElement.classList.remove('backnav');
    if (warp) { warp.classList.add('out'); setTimeout(function () { warp.className = 'warp'; }, 400); }
  });

  /* ---------- 退場：時計が巻き上がって白に溶ける（トップと同じ作法） ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startSpin() {
    var groups = [
      { sel: '.orbitA', dir: 1,  v: 1.2 },
      { sel: '.orbitB', dir: -1, v: .8 },
      { sel: '.orbitC', dir: 1,  v: .6 },
      { sel: '.redarc', dir: -1, v: 1.6 },
      { sel: '.handM', dir: 1, v: 5,  k: 1.6, a0: 60 },
      { sel: '.handH', dir: 1, v: .4, k: .14, a0: -55 },
      { sel: '.handS', dir: 1, v: 18, k: 2.4, a0: 150 }
    ].map(function (g) {
      g.el = fig && fig.querySelector(g.sel);
      g.a = (g.a0 !== undefined) ? g.a0 : 0;
      return g;
    });
    var t0 = performance.now(), last = t0;
    function frame(now) {
      var dt = (now - last) / 1000; last = now;
      var t = (now - t0) / 1000;
      var accel = 380 * t + 1050 * t * t;   /* 序盤じわじわ→終盤は爆発的に */
      groups.forEach(function (g) {
        if (!g.el) return;
        g.v += accel * dt * (g.k || 1);
        g.a += g.dir * g.v * dt;
        g.el.style.transform = 'rotate(' + g.a + 'deg)';
      });
      window.__w3kSpin = requestAnimationFrame(frame);
    }
    window.__w3kSpin = requestAnimationFrame(frame);
  }

  function departTo(href) {
    body.classList.add('departing');
    startSpin();
    setTimeout(function () {
      body.classList.add('departing2');       /* 中心へダイブ */
      if (warp) warp.classList.add('in');     /* そのあと白へ */
    }, 900);
    setTimeout(function () { location.href = href; }, 1900);
  }

  document.addEventListener('click', function (e) {
    if (reduce) return;
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.hasAttribute('download') || a.target === '_blank') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.getAttribute('aria-disabled') === 'true') return;
    e.preventDefault();
    departTo(a.href);
  });

  /* 戻ってきた時に演出の残骸を掃除 */
  window.addEventListener('pageshow', function () {
    body.classList.remove('departing');
    body.classList.remove('departing2');
    if (window.__w3kSpin) { cancelAnimationFrame(window.__w3kSpin); window.__w3kSpin = null; }
    if (fig) {
      ['.orbitA', '.orbitB', '.orbitC', '.redarc', '.handH', '.handM', '.handS'].forEach(function (sel) {
        var g = fig.querySelector(sel);
        if (g) g.style.transform = '';
      });
      fig.style.transform = '';
    }
    if (warp) { warp.className = 'warp'; }
  });

})();
