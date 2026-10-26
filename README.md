# Group Trailer

A Stash UI plugin that adds a trailer player to Group detail pages.

The player sits flush on the right side of the Group header (matching banner height) and plays a local trailer scene. Trailers are kept completely separate from the Group’s scene list.

## Features

- Native HTML5 video player with standard controls (play/pause, mute, seek, fullscreen)
- Respects Stash’s global “Auto-start video” setting
- Plugin settings: enable/disable + “Default mute trailer”
- Layout does not affect the Group edit page
- Works with SPA navigation

## Installation

1. Create a folder in your Stash plugins directory:
   ```
   ~/.stash/plugins/group-trailer/
   ```
2. Place these three files inside it:
   - `group-trailer.yml`
   - `group-trailer.js`
   - `group-trailer.css`
3. In Stash go to **Settings → Plugins** and click **Reload Plugins**.
4. Enable the plugin and configure the options if desired.

## Usage

1. Open the Group you want a trailer for and click **Edit**.
2. Under **Custom Fields** add:
   - Name: `trailer_scene_id`
   - Value: the numeric Scene ID of your trailer (e.g. `16850`)
3. Save and reload the Group page.

The trailer player will appear on the right side of the header.

## Settings

| Setting              | Type    | Description                          |
|----------------------|---------|--------------------------------------|
| Enable Group Trailer | BOOLEAN | Master on/off switch                 |
| Default mute trailer | BOOLEAN | Start the trailer muted (default on) |

## Notes

- The trailer scene should be a normal Stash scene (tagged/metadata’d as you like). It does **not** need to be added to the Group.
- The plugin looks for the custom field `trailer_scene_id` (or `trailerSceneId`).
- On narrower viewports the player stacks below the details instead of sitting beside them.

## License

MIT
