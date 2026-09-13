/* WHY3K — 手元のファイルを直接開いたとき（file://）だけ、サイト内リンクを飛べるようにする。
   本番（https）では何もしない。

   サイト内リンクは "/themes/" のように「サイトの入口から数える」書き方をしている。
   file:// だと入口がディスクの一番上になって行き先を見失うので、
   このファイルの場所（assets/ の一つ上＝サイトの入口）から数え直し、
   フォルダで終わる行き先には index.html を付ける（file:// はフォルダを開けない）。

   各ページの </body> 直前で読む。演出のクリック処理は href の書き方で相手を選んでいるので、
   それらが付け終わった後に書き換えないと演出が外れる。 */
(function () {
  if (location.protocol !== 'file:') return;
  var root = new URL('..', document.currentScript.src);

  Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || h.slice(0, 2) === '//' || /^[a-z][a-z0-9+.-]*:/i.test(h)) return;
    var u = h.charAt(0) === '/' ? new URL(h.slice(1), root) : new URL(h, location.href);
    if (u.pathname.slice(-1) === '/') u.pathname += 'index.html';
    a.href = u.href;
  });
})();
