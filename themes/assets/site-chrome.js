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
    '<a class="home" href="/">← HOME</a>' +
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

  /* ---------- トップへ戻るリンク（ブランド／← HOME）----------
     履歴の「←」と同じ帰りの演出（白から明ける＋軌道の減速）にするため、
     遷移する前に戻りフラグを立てておく。 */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="/"]'), function (a) {
    a.addEventListener('click', function (e) {
      /* 新しいタブ・別ウィンドウで開くときはこのページに留まるので立てない */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      try { sessionStorage.setItem('w3kBack', '1'); } catch (_) {}
    });
  });

  /* ---------- コード欄のコピーボタン ---------- */
  var ICON_COPY =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="8" y="8" width="13" height="13" rx="2"/>' +
    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_FAIL =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M18 6 6 18M6 6l12 12"/></svg>';

  Array.prototype.forEach.call(document.querySelectorAll('pre'), function (pre) {
    var text = pre.textContent;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.innerHTML = ICON_COPY;
    btn.title = 'コピー';
    btn.setAttribute('aria-label', 'コマンドをコピー');
    var timer;
    function flash(ok) {
      clearTimeout(timer);
      /* 成功はアイコンの色だけで知らせる。失敗したときだけ形を変える */
      btn.innerHTML = ok ? ICON_COPY : ICON_FAIL;
      btn.classList.add(ok ? 'done' : 'fail');
      btn.title = ok ? 'コピーしました' : 'コピーできませんでした';
      timer = setTimeout(function () {
        btn.innerHTML = ICON_COPY;
        btn.classList.remove('done');
        btn.classList.remove('fail');
        btn.title = 'コピー';
      }, 700);
    }
    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash(true); }, function () { flash(false); });
        return;
      }
      /* clipboard API が使えないときの逃げ道 */
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      document.body.removeChild(ta);
      flash(ok);
    });
    /* pre 自体は横スクロールするので、外側の箱にボタンを置いて右上に固定する */
    var holder = document.createElement('div');
    holder.className = 'codeblock';
    pre.parentNode.insertBefore(holder, pre);
    holder.appendChild(pre);
    holder.appendChild(btn);
  });

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
