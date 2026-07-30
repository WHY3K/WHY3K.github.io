/* WHY3K — サイト共通の外装を流し込むスクリプト。
   トップ（/index.html）と同じ装飾・カーソル十字線・戻る進む・白幕遷移をサブページに敷く。

   使い方：<body data-page="themes — 03" data-side="WHY3K — themes" data-up="/" data-up-label="index">
   これだけで、装飾HTMLは全部このスクリプトが作る。
   ナビゲーションの行き先はトップにしか置かない方針なので、ここでも「戻る」以外のリンクは作らない。 */

(function () {
  'use strict';

  var body = document.body;
  var d = body.dataset;
  var PAGE = d.page || '';
  var SIDE = d.side || 'WHY3K';
  var UP = d.up || '/';
  var UP_LABEL = d.upLabel || 'index';
  var A = '../assets/';   /* themes/ から見たトップの assets */

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

  /* ---------- 1. 白幕・トンボ ---------- */
  var frag = el(
    '<div class="warp" aria-hidden="true"></div>' +
    '<span class="reg tl"></span><span class="reg tr"></span>' +
    '<span class="reg bl"></span><span class="reg br"></span>'
  );

  /* ---------- 2. 刃（全面を横切る細線） ---------- */
  frag.appendChild(el(
    '<div class="blades" aria-hidden="true"><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">' +
    '<path d="M -60 880 C 380 520, 620 700, 760 380 S 1080 -40, 1500 -80" stroke="#131316" stroke-width="1" opacity=".10"/>' +
    '<path d="M -80 620 C 420 640, 700 300, 860 260 S 1240 140, 1520 240" stroke="#131316" stroke-width=".8" opacity=".08"/>' +
    '<path d="M 200 940 C 480 560, 520 420, 700 300 S 900 60, 980 -60" stroke="#131316" stroke-width="1.4" opacity=".12"/>' +
    '<path d="M -40 200 C 300 260, 640 520, 900 560 S 1320 700, 1500 660" stroke="#131316" stroke-width=".7" opacity=".07"/>' +
    '<path d="M 480 -60 C 560 240, 700 520, 640 940" stroke="#131316" stroke-width=".9" opacity=".09"/>' +
    '<path d="M -60 420 C 360 400, 900 180, 1500 420" stroke="#131316" stroke-width=".9" opacity=".10" stroke-dasharray="3 8"/>' +
    '<path d="M 1500 780 C 1000 760, 760 560, 300 780" stroke="#131316" stroke-width=".8" opacity=".08" stroke-dasharray="2 7"/>' +
    '<path d="M -40 60 L 1480 640" stroke="#131316" stroke-width=".5" opacity=".07"/>' +
    '<path d="M 120 -40 L 980 940" stroke="#131316" stroke-width=".5" opacity=".06"/>' +
    '<path d="M 1500 100 L -60 720" stroke="#131316" stroke-width=".6" opacity=".05"/>' +
    '<path d="M -80 760 C 300 720, 560 460, 780 120 S 1120 -60, 1520 40" stroke="#131316" stroke-width=".7" opacity=".08"/>' +
    '<path d="M -60 560 C 480 540, 1000 420, 1500 560" stroke="#131316" stroke-width=".5" opacity=".05" stroke-dasharray="6 10"/>' +
    '<circle cx="1180" cy="180" r="130" stroke="#131316" stroke-width=".5" opacity=".07" fill="none"/>' +
    '<circle cx="180" cy="700" r="170" stroke="#131316" stroke-width=".5" opacity=".06" fill="none" stroke-dasharray="2 7"/>' +
    '</svg></div>'
  ));

  /* ---------- 3. インクの爆発 ---------- */
  frag.appendChild(el(
    '<div class="ink" aria-hidden="true"><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">' +
    '<defs><filter id="roughSub" x="-30%" y="-30%" width="160%" height="160%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="9" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="80"/></filter></defs>' +
    '<g filter="url(#roughSub)" stroke="#131316">' +
    '<path d="M -80 -60 C 160 130, 320 210, 540 340 S 840 540, 1010 660" stroke-width="52"/>' +
    '<path d="M 30 -80 C 220 140, 430 260, 660 410" stroke-width="15" opacity=".85"/>' +
    '<path d="M 1500 830 C 1300 760, 1180 700, 1040 660" stroke-width="26" opacity=".7"/></g>' +
    '<g filter="url(#roughSub)" fill="#131316" stroke="none">' +
    '<ellipse cx="720" cy="480" rx="28" ry="10"/><ellipse cx="810" cy="545" rx="13" ry="6"/>' +
    '<ellipse cx="890" cy="590" rx="8" ry="4"/><ellipse cx="250" cy="130" rx="17" ry="7"/></g>' +
    '</svg></div>'
  ));

  /* ---------- 4. マテリアル層（ガラス・塵・回路図・分光） ---------- */
  frag.appendChild(el(
    '<div class="cosmos" aria-hidden="true">' +
    '<img class="glassring g3" src="' + A + 'ring_system.png" alt="" style="top:50%; left:50%; width:min(72vw, 860px); margin:-36vw 0 0 -36vw; opacity:.13; --r:0deg;">' +
    '<img class="glassring" src="' + A + 'ring_system.png" alt="" style="top:3%; left:1%; width:min(30vw, 350px); --r:-10deg; opacity:.9;">' +
    '<img class="glassring g2" src="' + A + 'ring_system.png" alt="" style="top:16%; right:6%; width:min(22vw, 265px); --r:150deg; opacity:.85;">' +
    '<img class="glassring g3 hide-m" src="' + A + 'glass_knot.png" alt="" style="top:69%; right:13%; width:min(18vw, 205px); --r:10deg; opacity:.85;">' +
    '<img class="glassring g2 hide-m" src="' + A + 'amber_beads.png" alt="" style="top:13%; left:21%; width:min(15vw, 180px); --r:-14deg; opacity:.8;">' +
    '<img class="glassring hide-m" src="' + A + 'glass_debris.png" alt="" style="top:40%; left:12%; width:min(13vw, 150px); --r:0deg; opacity:.8;">' +
    '<img class="glassring g2 hide-m" src="' + A + 'blade_cluster.png" alt="" style="top:64%; left:4%; width:min(20vw, 240px); --r:-10deg; opacity:.85;">' +
    '<img class="glassring hide-m" src="' + A + 'glass_sphere.png" alt="" style="bottom:11%; right:26%; width:min(6vw, 70px); --r:0deg; opacity:.85;">' +
    '<span class="pt float" style="top:15%; left:44%; width:5px; height:5px; opacity:.5;"></span>' +
    '<span class="pt float f2" style="top:37%; right:30%; width:3px; height:3px; opacity:.38;"></span>' +
    '<span class="pt float f3" style="top:58%; left:24%; width:4px; height:4px; opacity:.45;"></span>' +
    '<span class="pt float f2 hide-m" style="bottom:18%; right:36%; width:6px; height:6px; opacity:.3;"></span>' +
    '<img class="schem s1" src="' + A + 'schematic.svg" alt="" style="top:-14%; right:-13%; width:min(52vw, 600px);">' +
    '<img class="schem s2 hide-m" src="' + A + 'schematic.svg" alt="" style="bottom:-20%; left:-11%; width:min(40vw, 450px); transform: rotate(140deg);">' +
    '<div class="disp" style="top:20%; right:18%; width:120px; height:120px;"></div>' +
    '<div class="disp hide-m" style="bottom:16%; left:18%; width:90px; height:90px; opacity:.14;"></div>' +
    '</div>'
  ));

  /* ---------- 5. 定規・見出しラベル・側面キャプション ---------- */
  frag.appendChild(el(
    '<div class="ruler hide-m" aria-hidden="true">' +
    '<b style="top:104px;">100</b><b style="top:304px;">300</b>' +
    '<b style="top:504px;">500</b><b style="top:704px;">700</b></div>' +
    '<div class="doc-head"><span class="bar"></span> ' + PAGE + '</div>' +
    '<div class="head-bar2 hide-m" aria-hidden="true"></div>' +
    '<div class="side-cap">' + SIDE + '</div>'
  ));

  /* ---------- 6. 上部バー（戻る手段だけ。行き先はトップにしか置かない） ---------- */
  frag.appendChild(el(
    '<nav class="topnav" aria-label="Primary">' +
    '<a class="brand" href="/" data-warp><i class="d2"></i><i class="ln"></i>WHY3K<i class="ln"></i><i class="d2"></i></a>' +
    '<span class="hist">' +
    '<button class="hb" id="histBack" aria-label="前のページへ" disabled>←</button>' +
    '<button class="hb" id="histFwd" aria-label="次のページへ" disabled>→</button>' +
    '</span></nav>'
  ));

  /* ---------- 7. 散乱レイヤー ---------- */
  frag.appendChild(el(
    '<div class="scatter" aria-hidden="true">' +
    '<div class="patch" style="top:9%; right:8%; width:26%; height:64px;"></div>' +
    '<div class="patch p2" style="top:37%; left:-4%; width:22%; height:110px;"></div>' +
    '<div class="patch p3 hide-m" style="top:2%; left:56%; width:12%; height:46px;"></div>' +
    '<span class="coord" style="top:15%; left:6%;">1223 : 378</span>' +
    '<span class="coord" style="top:10%; right:13%;">2138 : 2234</span>' +
    '<span class="coord hide-m" style="top:26%; right:5%;">L 449 y:1562</span>' +
    '<span class="coord hide-m" style="top:41%; left:3.5%;">3373 : 3448</span>' +
    '<span class="coord flicker" style="top:64%; left:7%;">L 4413 y:262</span>' +
    '<span class="coord hide-m flicker f2" style="bottom:19%; left:5%;">7523 : 4138</span>' +
    '<span class="coord" style="bottom:9%; right:14%;">1583 y:2448</span>' +
    '<span class="coord hide-m" style="top:33%; right:16%;">L 2210 y:434</span>' +
    '<span class="coord hide-m rot" style="top:22%; left:15%;">4451 : 108</span>' +
    '<span class="brk" style="top:20%; right:24%;"></span>' +
    '<span class="brk hide-m" style="top:48%; left:12%;"></span>' +
    '<span class="brk hide-m" style="bottom:33%; right:18%;"></span>' +
    '<span class="cross" style="top:31%; left:8%;"></span>' +
    '<span class="cross hide-m" style="top:70%; right:7%;"></span>' +
    '<span class="cross hide-m" style="bottom:8%; right:30%;"></span>' +
    '<span class="sq" style="top:17%; left:22%;"></span>' +
    '<span class="sq s2 hide-m" style="top:57%; right:13%;"></span>' +
    '<span class="sq hollow hide-m" style="top:36%; left:19%;"></span>' +
    '<span class="num" style="top:29%; right:8%;">+0.4</span>' +
    '<span class="num hide-m" style="bottom:31%; right:12%;">v1.1</span>' +
    '<span class="tri hide-m" style="top:44%; left:2%;">▶ ▶ ▶</span>' +
    '<div class="rule hide-m" style="top:13%; right:5%; width:200px;">carrier lock — 03</div>' +
    '<div class="rule gray hide-m" style="top:47%; left:2%; width:150px;">aux signal</div>' +
    '<div class="rule gray hide-m" style="bottom:22%; right:6%; width:170px;">Δt 0.000 — hold</div>' +
    '<div class="dotmat" style="top:16%; right:6%; width:121px; height:32px;"></div>' +
    '<div class="stripeblk hide-m" style="bottom:7%; right:3%; width:54px; height:54px;"></div>' +
    '<div class="bcode" data-n="3 0 0 0 1 1 7" style="top:12%; left:52%; width:84px; height:22px;"></div>' +
    '<div class="bcode hide-m" data-n="7 5 2 3 4 1" style="bottom:11%; right:37%; width:88px; height:24px;"></div>' +
    '<div class="datablock hide-m" style="top:22%; left:4%;">sys.3k\nscan  ....... ok\nfield ....... ok\ngain  ....... +0.4\nnoise ....... floor</div>' +
    '<div class="datablock term hide-m" style="bottom:7%; right:19%;"><b>| navigation_</b>\nvector ..... 3K-01\ndrift ...... 0.02\nphase ...... hold</div>' +
    '<div class="plusfield hide-m" style="top:9%; left:33%;">+ + + +\n+ + + +\n+ + + +</div>' +
    '</div>' +
    '<div class="cursor-x" aria-hidden="true"></div>' +
    '<div class="cursor-y" aria-hidden="true"></div>' +
    '<div class="cursor-tag" aria-hidden="true">0000 : 0000</div>'
  ));

  body.insertBefore(frag, body.firstChild);

  /* ---------- 8. カーソル追従の十字線 ---------- */
  (function () {
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    var cx = document.querySelector('.cursor-x');
    var cy = document.querySelector('.cursor-y');
    var tag = document.querySelector('.cursor-tag');
    if (!cx || !cy || !tag) return;
    var x = 0, y = 0, queued = false;
    function paint() {
      queued = false;
      cx.style.transform = 'translateX(' + x + 'px)';
      cy.style.transform = 'translateY(' + y + 'px)';
      tag.style.left = x + 'px';
      tag.style.top = y + 'px';
      tag.textContent = String(Math.round(x)).padStart(4, '0') + ' : ' + String(Math.round(y)).padStart(4, '0');
    }
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      body.classList.add('has-pointer');
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener('mouseleave', function () { body.classList.remove('has-pointer'); });
  })();

  /* ---------- 9. 散乱レイヤーの視差（スクロールでわずかにずれる） ---------- */
  (function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sc = document.querySelector('.scatter');
    var cos = document.querySelector('.cosmos');
    var bl = document.querySelector('.blades svg');
    if (!sc) return;
    var queued = false;
    function paint() {
      queued = false;
      var y = window.scrollY || 0;
      sc.style.transform = 'translateY(' + (-y * 0.06) + 'px)';
      if (cos) cos.style.transform = 'translateY(' + (-y * 0.03) + 'px)';
      if (bl) bl.style.transform = 'translateY(' + (-y * 0.02) + 'px)';
    }
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
  })();

  /* ---------- 10. 戻る/進むボタン ---------- */
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

  /* ---------- 11. 白幕遷移（入るとき・出るとき） ---------- */
  (function () {
    var warp = document.querySelector('.warp');
    if (!warp) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* 入場：白から紙面へ */
    requestAnimationFrame(function () {
      document.documentElement.classList.remove('backnav');
      warp.classList.add('out');
      setTimeout(function () { warp.className = 'warp'; }, 400);
    });

    /* 退場：紙面が溶けて白へ。その後に遷移 */
    if (reduce) return;
    document.querySelectorAll('a[data-warp], a[download]').forEach(function (a) {
      /* ダウンロードは遷移しないので演出だけ出さない */
      if (a.hasAttribute('download')) return;
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        e.preventDefault();
        body.classList.add('leaving');
        warp.classList.add('in');
        setTimeout(function () { location.href = href; }, 320);
      });
    });
  })();

})();
