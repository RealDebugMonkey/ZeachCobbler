For more recent changes see script header.

```
//              0.21.0 - Changed way script is loaded.
//              0.20.0 - Version leap due to updated grazer
//                     - Fixes for new client behavior
//              0.15.0 - Fixed Minimap (Zeach broke it)
//                     - Fixed Borders(Zeach broke them too)
//                     - Lite Brite mode added (and some UI issues fixed)
//                   2 - Lite Brite, SFX, and BGM settings all saved
//                   3 - hack for overflowing chart & updated hardcoded agariomods skins
//              0.14.0 - Major refactoring to help with future updates
//                     - Support for AgarioMods connect skins
//              0.13.0 - Fixed break caused by recent code changes
//                   1 - bug fixes
//                     - removed direct connect UI (for now)
//                   2 - grazer speed improved by removing debug logging & adding artifical 200ms throttle
//                   3 - fixed virus poppers
//                     - fixed ttr calculation
//                   6 - fixed flickering grazer lines
//              0.12.0 - Added music and sound effects.
//                     - Sound effects from agariomods.com
//                     - Music from http://incompetech.com/music/royalty-free/most/kerbalspaceprogram.php
//                     - Fix: scroll wheel function
//                     - Fixed blank cell not displaying % diff issue
//                     - Fixed key bindings triggering while changing name
//                   4 - bug fix courtesy of Gjum
//                   5 - updated handshake for v548
//              0.11.0 - Fix for v538 fix
//                   1 - grazer fixed, time alive and ttr fixed
//                   2 - more fixes for stuff I missed
//                   3 - onDestroy bugfix
//                   4 - update with mikeyk730's latest changes
//                   5 - skins should now display in experimental
//              0.10.0 - Mikey's stats screen added
//                     - Minimap added - idea and code from Gamerlio's bot
//                     - Our own blobs are no longer considered threats in grazing mode
//                   1 - updated agariomods.com skins
//                     - minimap viruses now green
//                     - recent server box moved so you can (hopefully) see top 3 players on server
//                     - bug fixes to minimap
//                     - added match tag for https://agar.io
//                     - minimap now disappears when you press C
//                   2 - moved last servers window again
//                   3 - more window movement
//              0.09.0 - Fixed script break caused by recent changes
//                   1 - Shots display next to mass restored
//                     - Added possible fix for times we might somehow (?!) miss player spawning.
//                   2 - Press 'A' to toggle acid mode
//                   3 - Name still moved for bitdo skins even with visual assist turned off
//                   4 - Changed repos (again)
//                   5 - O/P keys didn't match documentation. Changed keys to match documentation.
//                       O now enables/disables virus firing via mouse, P is for target fixation toggle
//                   6 - Fixed issue where TTR displays when you have only 1 blob. (works around issue in official code
//                       caused by ID not being removed from own IDs)
//              0.08.0 - Fixed bug in handling of agariomods.com skins
//                     - Press 'C' to toggle display of Zeachy powers.
//                     - New GM_xmlhttpRequest permission required to check that bit.do skins point to imgur.com
//                   1 - tiny bit of refactoring
//                     - tab key allows you to switch which of your blobs calculations are based on
//                     - split guide easier to see now
//                     - WARNING! Press '8' to self destruct (in spectacular fashion when you have large mass)
//              0.07.0 - AgarioMods.com extended skins support
//                   1 - Added new "Extended skins" section
//                     - Extended skins and bit.do skins get name placed underneath the cell
//              0.06.0 - Fixed team colors
//                     - Added server select
//              0.05.0 - Custom skins returned
//                     - Agariomods.com style imgur skin support
//                     - Bit.do skin syntax: `Username
//                   1 - Bit.do fix and skin transparency
//                   2 - Nick, Right-click-to-fire, and visualization settings should now be saved between sessions.
//                     - Grazing visualization lines added
//                     - V - toggle grazing visualization
//                   3 - Fixed a bug in the TTR code that caused everything to show a 30 second TTR
//              0.04.0 - P to toggle right-click mouse fire
//                     - O to toggle grazing target fixation (less CPU intensive grazing)
//                     - T will change target when fixation is on.
//                     - Debug display now has 3 levels of info
//              0.03.0 - E - Virus popper for virus closest to cursor
//                     - R - Virus popper for virus closest to cell zero
//                   1 - Virus nearest to cell zero is highlighted in red
//                   2 - M - disable mouse input
//                     - mouse left click also functions as 'E'
//                   3 - Scroll wheel *should* toggle zoom (untested)
//                   4 - Mouse scroll wheel  tweak
//                   5 - Reversed scroll wheel direction processing logic
//                     - smaller debug text
//                     - display mod version in debug text.
//                     - names scaled down slightly to 1.25 times
//              0.02.0 - Multi-cell TTR added (Experimental)
//                     - Virus shot counters added
//                     - Names scaled up 1.5 times
//                     - Shots available added next to mass with tweaked formula set to start at 35 mass
//                     - Mass line sized up 2 times
//                     - Percent added to your cell when you split
//                     - Percent size added to enemy cells
//               0.01  - Initial rewrite
//                     - Grazer
//                     - High Score
//                     - Time alive
//                     - Map borders
//                     - split kill range guide
//                     - Auto display mass
//                     - Auto set dark mode
//                     - Color display based on size
//                     - X/Y coordinate display
```
