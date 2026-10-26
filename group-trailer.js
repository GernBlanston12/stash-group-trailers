(function () {
  "use strict";

  const PLUGIN_ID = "group-trailer";

  async function gql(query, variables = {}) {
    try {
      const res = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();
      if (json.errors) return null;
      return json.data;
    } catch (e) {
      return null;
    }
  }

  async function getPluginSettings() {
    const data = await gql(`
      query {
        configuration {
          plugins
        }
      }
    `);
    const plugins = data?.configuration?.plugins || {};
    const settings = plugins[PLUGIN_ID] || {};
    return {
      enabled: settings.enabled !== false,
      defaultMute: settings.defaultMute !== false,
    };
  }

  async function getAutoStart() {
    const data = await gql(`
      query {
        configuration {
          interface {
            autoStartVideo
          }
        }
      }
    `);
    return !!data?.configuration?.interface?.autoStartVideo;
  }

  function getGroupIdFromUrl() {
    const m = window.location.pathname.match(/\/groups\/(\d+)/);
    return m ? m[1] : null;
  }

  async function getTrailerSceneId(groupId) {
    const data = await gql(
      `
      query FindGroup($id: ID!) {
        findGroup(id: $id) {
          id
          custom_fields
        }
      }
    `,
      { id: groupId }
    );
    const group = data?.findGroup;
    if (!group) return null;
    const fields = group.custom_fields || {};
    const id = fields.trailer_scene_id || fields.trailerSceneId;
    return id ? String(id) : null;
  }

  function findInsertionPoint() {
    const candidates = [
      document.querySelector(".group-details"),
      document.querySelector("#group-page .group-details"),
      document.querySelector(".detail-header .row"),
      document.querySelector("#group-page .detail-header"),
      document.querySelector(".detail-group"),
    ];
    for (const el of candidates) {
      if (el) return el;
    }
    return null;
  }

  function injectPlayer(sceneId, autoplay, muted) {
    if (document.querySelector(".group-trailer-slot")) return;

    const anchor = findInsertionPoint();
    if (!anchor) return;

    const slot = document.createElement("div");
    slot.className = "group-trailer-slot";

    const video = document.createElement("video");
    video.className = "group-trailer-video";
    video.controls = true;
    video.preload = "metadata";
    video.muted = muted;
    video.loop = true;
    video.src = `/scene/${sceneId}/stream`;
    video.setAttribute("playsinline", "");

    if (autoplay) {
      video.autoplay = true;
      video.play().catch(() => {});
    }

    slot.appendChild(video);

    if (anchor.classList.contains("group-details") && anchor.parentElement) {
      anchor.parentElement.insertBefore(slot, anchor.nextSibling);
    } else {
      anchor.appendChild(slot);
    }
  }

  async function run() {
    const groupId = getGroupIdFromUrl();
    if (!groupId) return;

    const settings = await getPluginSettings();
    if (!settings.enabled) return;

    const trailerId = await getTrailerSceneId(groupId);
    if (!trailerId) return;

    const autoStart = await getAutoStart();
    const muted = !!settings.defaultMute;

    setTimeout(() => {
      injectPlayer(trailerId, autoStart, muted);
    }, 500);
  }

  function init() {
    run();

    let lastUrl = location.href;
    const obs = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(run, 300);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
