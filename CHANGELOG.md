For more recent changes see script header.

```
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
