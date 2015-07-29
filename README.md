# ZeachCobbler
## What is Zeach Cobbler?
ZeachCobbler is a mod for the web game Agario ( http://agar.io ) It included several unique features found in no other mods. Please note that the Agario community at large considers many of the features contained in this mod hacks or cheats as it could be argued that they give you an unfair advantage over others.

Zeach Cobbler also includes a bot we like to call the "grazer" which helps with the grunt work of collecting food pellets in the early game. 

## Install instructions:
**Note: Zeach Cobbler is currently for Chrome Only. It does not work with Firefox+Greasemonkey.**

1) Install TamperMonkey addon for Chrome 
* https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

2) Visit the raw version of the script 
* https://github.com/RealDebugMonkey/ZeachCobbler/raw/master/ZeachCobbler.user.js

3) Click 'Install' on the script install confirmation page

##Key Reference
* TAB - Switch selected blob
* 8 - Self destruct (spectacular when you're really big)
* A - Toggle Acid mode
* C - Toggles display of visual cues
* D - Cycle through various debug levels
* G - Grazing mode
  * P - Enable/Disable Target Fixaton (see explanation below)
  * T - Switch target (if Target Fixation is on)
  * V - Visualization of Target paths evaluated
* E - fire at virus near cursor
* R - Fire at virus near selected blob (virus is highlighted in red)
* O - Enable/Disable firing at virus by left-mouse click (LMB duplicates 'E' functionality)

##Feature List
1. Auto-grazing (bot-like feeding on pellets) with optional target analysis visualization
   * P will enable target-fixation. With fixation on new targets are calculated only after previously chosen one is destroyed. With it off, targets are recalculated every new update, which is roughly 25 times per second, which is resource intensive and can eat up laptop battery life. 
   * With fixation on you can press 'T' to retarget to the cluster of cells nearest to the mouse cursor.
   * You can press 'V' to toggle display of target analysis lines.
2. Split Kill range indicator
   * Inner ring displays base jump distance for all cells. Your split cell will land so its center is half-in/half-out of inner circle. Outer circle shows how far out beyond the center circle your cell will land.
3. Viruses now display number of times it needs to be fed mass to make it split.
4. Display blob danger/edibility via color
   * Red - it can split and eat you
   * Orange - it can eat you, but not if it splits
   * Yellow - Same size as you
   * Green - you can eat it, but not if you split
   * Purple - you can split and still eat it
5. Each blob will display percent based on how much bigger or smaller than you it is.
6. Each of your blobs displays number of times you can use eject mass(if display mass is enabled)
7. press R to target virus (outlined in red) nearest to blob 0 and shoot exact # of shots to split.
8. press E to target nearest virus o cursor and shoot exact # of shots to split
   * Optionally, press 'O' to make left-click do same as 'E', allowing you to split viruses with a mouse click.
9. Time-To-Remerge (TTR) timer displayed on each blob that estimates when your cell will be allowed to remerge.
   * After a split one cell may already display a negative value. This is by design
10. Z to zoom in/out. Mouse scroll wheel can also be used to activate.
11. Server Select UI (Thanks to Angal for use of his code)
12. Automatically save and autofill last-used username
13. Agariomods.com skins support http://skins.agariomods.com/ 
14. Agariomods.com style imgur-based skin support 
    * For example use i/m68ZpaW to get http://i.imgur.com/m68ZpaW.jpg as your skin.
15. X/Y coordinate display
16. 'Time alive' tracker
17. 'Highest score' tracker
18. Acid mode support
 

## What's up with the name?
It was chosen on a whim. And I like Peach Cobbler.

(Much later I discovered that there was actually a person using 'Zeach Cobbler' as their online handle. My deepest apologies to that individual if the name collision causes them any grief.)

# Contributers and Used code
* albel727 - For the complete rewrite of the grazer into what is now called the 'new grazer'
* Angal - For the original Server select UI (now unused), click-to-lock multiblob feature, and multiblob grazer feature 
* Apostolique - debug text output derived from Apostolique's bot code -- https://github.com/Apostolique/Agar.io-bot
* Electronoob - Imgur skins, Agariomods.com skins, connect.agariomod.com skins
* Ephemerality - Code review
* GamerLio - Minimap from his awesome bot -- https://github.com/leomwu/agario-bot
* Gjum - Bug fixes
* Pepin - Advanced zoom functions
* Incompetech - For KSP soundtrack music - http://incompetech.com/music/royalty-free/most/kerbalspaceprogram.php
* Mikeyk730 - stats screen code - https://greasyfork.org/en/scripts/10154-agar-chart-and-stats-screen
* White Light - Grazer concept and enemy avoidance code
