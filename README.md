# ZeachCobbler
Custom Agario modifications
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
15. bit.do custom url skin support
    * Generate a custom url link with bit.do, then prefix that word with ` to get a skin
    * Example: the name `roborex will load http://bit.do/roborex
16. X/Y coordinate display
17. 'Time alive' tracker
18. 'Highest score' tracker
19. Acid mode support
