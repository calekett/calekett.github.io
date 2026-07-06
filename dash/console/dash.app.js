/*
 * dash.gaylab.me — renders the control plane from dash.data.js. Vanilla JS.
 * Edit dash.data.js, not this file.
 */
(function () {
  "use strict";
  var D = window.GAYLAB_DASH || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var SLABEL = { online: "online", offline: "offline", maintenance: "maintenance", planned: "planned" };
  var SCLASS = { online: "g-online", offline: "g-offline", maintenance: "g-maint", planned: "g-planned" };
  function scls(s) { return SCLASS[s] || "g-planned"; }
  function glyph(s) { return '<span class="glyph ' + scls(s) + '" aria-hidden="true">' + (s === "planned" ? "○" : "●") + "</span>"; }
  function pill(txt, cls) { return '<span class="pill ' + (cls || "g-planned") + '">' + esc(txt) + "</span>"; }

  // Build a URL from {url} or {host,port,path} + tailnet. Returns "" if not set.
  function buildUrl(o) {
    if (!o) return "";
    if (o.url) return o.url;
    if (!o.host) return "";
    var host = o.host;
    if (host.indexOf(".") === -1 && D.tailnet) host = host + "." + D.tailnet;
    var scheme = (o.port === 443 || o.scheme === "https") ? "https" : "http";
    var port = o.port ? (":" + o.port) : "";
    if ((scheme === "https" && o.port === 443) || (scheme === "http" && o.port === 80)) port = "";
    return scheme + "://" + host + port + (o.path || "");
  }
  function launch(o, label) {
    var url = buildUrl(o);
    if (!url) return '<span class="launch off" title="set host/url in dash.data.js">not wired</span>';
    var u = esc(url);
    return '<a class="launch" href="' + u + '" target="_blank" rel="noopener noreferrer" ' +
      'title="' + u + '">' + esc(label || "open") + ' &rarr;</a>';
  }

  // ── stats strip ──
  var svc = D.services || [];
  var nodes = D.nodes || [];
  var nodeCount = nodes.reduce(function (a, n) { return a + (n.count || 1); }, 0);
  var online = svc.filter(function (s) { return s.status === "online"; }).length;
  var stats = document.getElementById("stats");
  if (stats) {
    stats.innerHTML =
      stat(nodeCount, "nodes") +
      stat(svc.length, "surfaces") +
      stat(online + "/" + svc.length, "online") +
      stat(esc(D.updated || "—"), "as of");
  }
  function stat(big, small) {
    return '<div class="stat"><b>' + big + '</b><span>' + small + "</span></div>";
  }

  // ── boot line ──
  var boot = document.getElementById("boot-text");
  var bootLine = document.getElementById("status-banner");
  if (boot) {
    if (online === 0) {
      boot.textContent = "control plane staged — surfaces come online as the fleet boots";
      if (bootLine) bootLine.classList.add("warn");
    } else {
      boot.textContent = online + " of " + svc.length + " surfaces up — systems nominal";
    }
  }

  // ── control surfaces ──
  var sEl = document.getElementById("services");
  if (sEl) {
    sEl.innerHTML = svc.map(function (s) {
      return '<div class="row wide">' + glyph(s.status) +
        '<div class="rc"><span class="rname">' + esc(s.name) + '</span>' +
        '<span class="rdesc">' + esc(s.desc || "") + "</span></div>" +
        '<div class="rright">' + pill(s.gate || "gated", scls(s.status)) + launch(s) + "</div></div>";
    }).join("");
  }

  // ── fleet nodes ──
  var nEl = document.getElementById("nodes");
  if (nEl) {
    nEl.innerHTML = nodes.map(function (n) {
      var badge = n.count ? pill("×" + n.count, "g-planned") : "";
      var link = n.admin ? launch(n.admin, "manage") : '<span class="launch off">—</span>';
      return '<div class="row wide">' + glyph(n.status) +
        '<div class="rc"><span class="rname">' + esc(n.name) +
          ' <small class="role">' + esc(n.role || "") + "</small></span>" +
        '<span class="rdesc">' + esc(n.spec || "") + "</span></div>" +
        '<div class="rright">' + badge + link + "</div></div>";
    }).join("");
  }

  // ── footer ──
  var segNodes = document.getElementById("seg-nodes");
  if (segNodes) segNodes.textContent = nodeCount + " nodes · " + svc.length + " surfaces";
  var segUpd = document.getElementById("seg-updated");
  if (segUpd) segUpd.textContent = "updated " + (D.updated || "—");
})();
