/*
 * dash.gaylab.me — control-plane content.
 * This is the file you edit. No build step: save, commit, push.
 *
 * IMPORTANT: this hub is meant to live behind Tailscale or Cloudflare Access
 * (see dash/README.md). The URLs below are private admin endpoints — they only
 * resolve/work from inside the tailnet. Keep this repo private OR keep this hub
 * off public Pages; if it must be public, scrub the hosts to MagicDNS names only.
 *
 * status: "online" | "offline" | "maintenance" | "planned"
 * gate:   "tailscale" | "cloudflare"           (shown as a pill)
 *
 * Links are built as:  <scheme>://<host>.<tailnet>:<port><path>
 * Scheme defaults to http, or https when port is 443 or you set scheme:"https"
 * (Proxmox on :8006 is https-only, for example). Set `url` for a literal link.
 * Leave host/url empty to show a "configure me" placeholder instead of a dead link.
 */
window.GAYLAB_DASH = {
  updated: "2026-07-06",

  // Your Tailscale MagicDNS suffix, e.g. "tail1a2b3c.ts.net". Used to build the
  // links below from each surface's `host`. Find it: `tailscale status` or the
  // admin console → DNS.
  tailnet: "tailnet.ts.net",

  // ── Control surfaces — the dashboards you actually open ────────────────────
  services: [
    { name: "fleet health",   host: "fleet",     port: 8088,  gate: "tailscale",  status: "planned",
      desc: "one-pane node status board (fleet-ui) — up/down, temps, quorum" },
    { name: "metrics",        host: "grafana",   port: 3000,  gate: "tailscale",  status: "planned",
      desc: "Grafana + Prometheus — history, dashboards, alerting" },
    { name: "game panel",     host: "panel",     port: 443,   gate: "tailscale",  status: "planned",
      desc: "Pterodactyl — start/stop servers, consoles, users, backups" },
    { name: "virtualization", host: "pve",       port: 8006,  scheme: "https", gate: "tailscale", status: "planned",
      desc: "Proxmox VE — the 10-node cluster: VMs, LXCs, migrations" },
    { name: "network",        host: "opnsense",  port: 443,   gate: "tailscale",  status: "planned",
      desc: "OPNsense — firewall, VLANs, port-forwards, DHCP/DNS" },
    { name: "storage",        host: "vault",     port: 443,   gate: "tailscale",  status: "planned",
      desc: "TrueNAS SCALE — pools, shares, snapshots, replication" },
    { name: "media",          host: "plex",      port: 32400, path: "/web", gate: "tailscale", status: "planned",
      desc: "Plex — library, transcode sessions, users" },
    { name: "status",         host: "uptime",    port: 3001,  gate: "tailscale",  status: "planned",
      desc: "Uptime Kuma — external probes, notifications" }
  ],

  // ── Physical fleet — the hardware behind it all ───────────────────────────
  nodes: [
    { name: "pve-cluster", count: 10, status: "planned",
      role: "Proxmox cluster",
      spec: "10× Ryzen 7 5825U mini — game servers + aux services as VMs/LXCs",
      admin: { host: "pve", port: 8006, scheme: "https" } },
    { name: "pve-edge", status: "planned",
      role: "standalone Proxmox",
      spec: "Intel i5-10500T — OPNsense (L3 router) VM + services LXC, off the cluster",
      admin: { host: "pve-edge", port: 8006, scheme: "https" } },
    { name: "mon", status: "planned",
      role: "monitoring + QDevice",
      spec: "Intel QuickSync box — Prometheus/Grafana + corosync quorum tiebreaker",
      admin: { host: "grafana", port: 3000 } },
    { name: "vault", status: "planned",
      role: "storage + media",
      spec: "Ryzen 5 2600 + RTX 5060 Ti — TrueNAS SCALE (bare metal) + Plex app",
      admin: { host: "vault", port: 443 } },
    { name: "consoles", status: "planned",
      role: "retro + streaming",
      spec: "spare minis — NES→PS1 emulation + modern game streaming (VLAN 30)",
      admin: null },
    { name: "sw-core", status: "planned",
      role: "L2 switch",
      spec: "Aruba Instant On 1960 48G — VLAN trunking, 2× 10G uplinks to vault",
      admin: { host: "sw-core", port: 443 } }
  ]
};
