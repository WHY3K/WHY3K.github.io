/* WHY3K — サブページ共通の外装。
   ・上部バーをどのページでも同じ見た目で作る
   ・入ってくるときだけ白から現れる（トップから出る演出の受け側）

   置くのは「見た目の共通化」と「このページから動ける手段（戻る/進む・インデックスへ）」だけ。
   他のセクションへ飛ぶ導線はトップの索引に集約する。 */

(function () {
  'use strict';

  var body = document.body;

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

  /* ---------- 上部バー（見た目はトップと共通。中身はこのページで動ける手段だけ） ---------- */
  var nav =
    '<nav class="topnav" aria-label="Primary">' +
    '<a class="brand" href="/" aria-label="WHY3K インデックスへ"><i class="d2"></i><i class="ln"></i>WHY3K<i class="ln"></i><i class="d2"></i></a>' +
    '<a class="home" href="/">← home</a>' +
    '<span class="hist">' +
    '<button class="hb" id="histBack" aria-label="前のページへ" disabled>←</button>' +
    '<button class="hb" id="histFwd" aria-label="次のページへ" disabled>→</button>' +
    '</span></nav>';

  /* ---------- 白幕（入ってくるときだけ使う） ---------- */
  var clock = '<div class="warp" aria-hidden="true"></div>';

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
  function reveal() {
    document.documentElement.classList.remove('backnav');
    if (!warp) return;
    warp.classList.add('out');
    setTimeout(function () { warp.className = 'warp'; }, 400);
  }
  requestAnimationFrame(reveal);
  /* 戻ってきたとき（bfcache 復帰を含む）に白幕が残らないように */
  window.addEventListener('pageshow', reveal);

})();
