// ═══════════════════════════════════════════════════════════
// request-store.js — إرسال طلبات الخدمات (سلفة / استرداد / ساعة ذكية)
// يغلّف window.pushFirebaseRequest مع انتظار جاهزية المصادقة وحدّ زمني،
// فلا يتعطّل التوجيه إن تأخّرت الشبكة. يُحمَّل بعد firebase-client.js.
// ═══════════════════════════════════════════════════════════
(function () {
  window.submitServiceRequest = function (req) {
    var sent = false;
    function send() {
      if (sent) return Promise.resolve();
      sent = true;
      if (typeof window.pushFirebaseRequest !== 'function') return Promise.resolve();
      try {
        return Promise.resolve(window.pushFirebaseRequest(req)).catch(function () {});
      } catch (e) {
        return Promise.resolve();
      }
    }

    var ready = (typeof window.ensureAuthReady === 'function')
      ? window.ensureAuthReady().then(send).catch(send)
      : send();

    // لا ننتظر أكثر من 2500ms حتى لا يتعطّل التوجيه عند تعذّر الشبكة
    var timeout = new Promise(function (resolve) {
      setTimeout(function () { send().then(resolve); }, 2500);
    });

    return Promise.race([ready, timeout]);
  };
})();
