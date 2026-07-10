// Localiza el navbar/footer y arregla el conmutador de idioma en un sitio
// Quarto bilingüe con un único navbar global.
// - Traduce las etiquetas del menú según el idioma de la URL (/es/ o /en/).
// - Mantiene la navegación dentro del idioma actual.
// - Hace que "Español/English" salten a la página EQUIVALENTE en el otro idioma,
//   mapeando carpetas (proyectos<->projects) y slugs de blog que difieren.
(function () {
  "use strict";

  var path = location.pathname;
  var m = path.match(/\/(es|en)\//);
  if (!m) return;                       // páginas sin idioma (redirect raíz): no tocar
  var lang = m[1];
  var isEN = lang === "en";

  // --- Etiquetas del menú (ES -> EN) ---
  var LABELS = {
    "Inicio": "Home",
    "Proyectos": "Projects",
    "Blog": "Blog",
    "Idioma": "Language",
    "Desarrollado en Debian 13 con Quarto": "Built on Debian 13 with Quarto"
  };

  // --- Mapa de slugs de blog que NO coinciden entre idiomas ---
  // (clave = slug ES, valor = slug EN). Añade aquí futuros posts con títulos distintos.
  var SLUGS = {
    "de-prototipo-a-produccion": "from-prototype-to-production"
  };
  var SLUGS_REV = {};
  Object.keys(SLUGS).forEach(function (k) { SLUGS_REV[SLUGS[k]] = k; });

  // Calcula la ruta equivalente de "p" en el idioma "to".
  function counterpart(p, to) {
    var np = p.replace(/\/(es|en)\//, "/" + to + "/");
    if (to === "en") {
      np = np.replace("/proyectos/", "/projects/");
      Object.keys(SLUGS).forEach(function (es) {
        np = np.replace(es + ".html", SLUGS[es] + ".html");
      });
    } else {
      np = np.replace("/projects/", "/proyectos/");
      Object.keys(SLUGS_REV).forEach(function (en) {
        np = np.replace(en + ".html", SLUGS_REV[en] + ".html");
      });
    }
    return np;
  }

  // Reemplaza solo el nodo de texto (preserva iconos <i>).
  function relabel(el, txt) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.textContent.trim()) { n.textContent = " " + txt; return; }
    }
    el.textContent = txt;
  }

  // --- Enlaces del navbar ---
  document.querySelectorAll(".navbar a").forEach(function (a) {
    var text = (a.textContent || "").trim();

    // Conmutador de idioma: saltar a la página equivalente
    if (text === "Español") { a.setAttribute("href", counterpart(path, "es")); }
    else if (text === "English") { a.setAttribute("href", counterpart(path, "en")); }
    else {
      // Enlaces de navegación normales: mantenerlos en el idioma actual
      var url;
      try { url = new URL(a.href, location.origin); } catch (e) { url = null; }
      if (url && url.origin === location.origin && /\/(es|en)\//.test(url.pathname)) {
        a.setAttribute("href", counterpart(url.pathname, lang));
      }
      if (isEN && LABELS[text]) relabel(a, LABELS[text]);
    }
  });

  // --- Footer ---
  if (isEN) {
    document.querySelectorAll(".nav-footer a, .nav-footer span, .nav-footer p").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (LABELS[t]) relabel(el, LABELS[t]);
    });
  }
})();
