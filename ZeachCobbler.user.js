// ==UserScript==
// @name         Zeach Cobbler
// @namespace    https://github.com/RealDebugMonkey/ZeachCobbler
// @updateURL    http://bit.do/ZeachCobblerJS
// @downloadURL  http://bit.do/ZeachCobblerJS
// @contributer  The White Light -- You rock the maths.
// @contributer  Angal - For the UI additions and server select code
// @contributer  Gjum - Bug fixes
// @contributer  Agariomods.com (and Electronoob) for the innovative imgur style skins
// @contributer  Agariomods.com again for maintaining the best extended repo out there.
// @codefrom     http://incompetech.com/music/royalty-free/most/kerbalspaceprogram.php
// @codefrom     mikeyk730 stats screen - https://greasyfork.org/en/scripts/10154-agar-chart-and-stats-screen
// @codefrom     debug text output derived from Apostolique's bot code -- https://github.com/Apostolique/Agar.io-bot
// @codefrom     minimap derived from Gamer Lio's bot code -- https://github.com/leomwu/agario-bot
// @version      0.15.1
// @description  Agario powerups
// @author       DebugMonkey
// @match        http://agar.io
// @match        https://agar.io
// @changes     0.15.0 - Fixed Minimap (Zeach broke it)
//                     - Fixed Borders(Zeach broke them too)
//                     - Lite Brite mode added (and some UI issues fixed)
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// ==/UserScript==
var _version_ = GM_info.script.version;
var debugMonkeyReleaseMessage = "<h3>Another Quick Note</h3><p>This still isn't a polished release.<br>" +
    "I was having so much fun with lite-brite mode that I decided to push.<br>" +
    "Click on the extended options tab then go into spectate mode or play to check it out." +
    "<br><br>Stay safe out there.<br><br>debugmonkey</p><br><br>PS. ZeachCobbler also supports " +
    "the new AgarioMod *name skins. Try playing as *Zeach or *Pikachu to check it out.";
//if (window.top != window.self)  //-- Don't run on frames or iframes
//    return;
//https://cdn.rawgit.com/pockata/blackbird-js/1e4c9812f8e6266bf71a25e91cb12a553e7756f4/blackbird.js
//https://raw.githubusercontent.com/pockata/blackbird-js/cc2dc268b89e6345fa99ca6109ddaa6c22143ad0/blackbird.css
$.getScript("https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js");
$.getScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js");


(function (g, m) {

    // Options that will always be reset on reload
    var isAcid = false;
    var zoomFactor = 10;
    var isGrazing = false;
    var serverIP = "";
    var showVisualCues = true;


    // Configurable options we want to persist
    var visualizeGrazing = GM_getValue('visualizeGrazing', true);
    var rightClickFires = GM_getValue('rightClickFires', false);
    var minimapScale = 48; //  1/miniMapScale
    var displayDebugInfo = 1;   // Has multiple levels
    var autoRespawn = false;
    var grazeOnAutoRespawn = false;
    var isLiteBrite = true;

    // Game State & Info
    var highScore = 0;
    var timeSpawned = null;
    var grazingTargetID;    // primarily used for target fixation
    var nearestVirusID;
    var suspendMouseUpdates = false;
    var grazingTargetFixation = false;
    var selectedBlobID = null;

    // Constants
    var Huge = 2.66,
        Large = 1.25,
        Small = 0.7,
        Tiny = 0.375;
    var Huge_Color = "#FF3C3C",
        Large_Color = "#FFBF3D",
        Same_Color = "#FFFF00",
        Small_Color  = "#00AA00",
        Tiny_Color = "#CC66FF",
        myColor ="#3371FF",
        virusColor ="#666666";
    var lastMouseCoords = { x: 0, y: 0 };
    var ghostBlobs = [];


    var miniMapCtx=jQuery('<canvas id="mini-map" width="175" height="175" style="border:2px solid #999;text-align:center;position:fixed;bottom:5px;right:5px;"></canvas>')
        .appendTo(jQuery('body'))
        .get(0)
        .getContext("2d");

    GetGmValues();

    var cobbler = {
        "isAcid" : false,
        "autoRespawn": false,
        "respawnWithGrazer" : false,
        "visualizeGrazer" : true,
        "displayMiniMap" : true,
        "clickToShoot" : false,
        "sfxVol" : 0,
        "BGMVol" : 0,
    };
    g.cobbler = cobbler;

    // ======================   Property & Var Name Restoration  =======================================================
    var zeach = {
        get ctx()           {return f;},
        get webSocket()     {return s$$0;},
        get myIDs()         {return G;},
        get myPoints()      {return p;},
        get allNodes()      {return A;},
        get allItems()      {return v;},
        get mouseX2()       {return Z;},
        get mouseY2()       {return $;},
        get mapTop()        {return ha; },
        get mapLeft()       {return ia;},
        get mapBottom()     {return ja;},
        get mapRight()      {return ka;},
        get isShowSkins()   {return Sa;},
        get isNightMode()   {return la;},
        get isShowMass()    {return Ta;},
        get gameMode()      {return Q;},
        get fireFunction()  {return D;},
        get isColors()      {return Ba;},
        get defaultSkins()  {return Va;},
        get imgCache()      {return M;},
        get textFunc()      {return na;},
        get textBlobs()     {return kb;},
        get hasNickname()   {return oa},
        // These never existed before but are useful
        get mapWidth()      {return  ~~(Math.abs(zeach.mapLeft) + zeach.mapRight)},
        get mapHeight()  {return  ~~(Math.abs(zeach.mapTop) + zeach.mapBottom)},
    };

    function restoreCanvasElementObj(objPrototype){
        var canvasElementPropMap = {
            'setValue'   : 'u',
            'render'     : 'G',
            'setScale'   : '$',
        };
        _.forEach(canvasElementPropMap, function(newPropName,oldPropName){
            Object.defineProperty(objPrototype, oldPropName, {
                get: function()     { return this[newPropName];},
                set: function(val)  { this[newPropName] = val; }
            });
        });
    }

    function restorePointObj(objPrototype){
        var pointPropMap = {
            'isVirus'   : 'd',
            'nx'        : 'D',
            'ny'        : 'F',
            'setName'   : 'Z',
            'nSize'     : 'n',
        };
        _.forEach(pointPropMap, function(newPropName,oldPropName){
            Object.defineProperty(objPrototype, oldPropName, {
                get: function()     { return this[newPropName];},
                set: function(val)  { this[newPropName] = val; }
            });
        });
    }
    // ======================  UI Responders   ===================================================================


    // ======================   Utility code    ==================================================================
    function getSelectedBlob(){
        if(!_.contains(zeach.myIDs, selectedBlobID)){
            selectedBlobID = zeach.myPoints[0].id;
            //console.log("Had to select new blob. Its id is " + selectedBlobID);
        }
        return zeach.allNodes[selectedBlobID];
    }

    function GetGmValues(){
        console.log("GM nick: " + GM_getValue('nick', "none set"));
        console.log("GM rightClickFires: " + GM_getValue('rightClickFires', "none set"));
        console.log("GM visualizeGrazing: " + GM_getValue('visualizeGrazing', "none set"));
    }

    function isPlayerAlive(){
        return !!zeach.myPoints.length;
    }

    function sendMouseUpdate(ws, mouseX2,mouseY2) {
        lastMouseCoords = {x: mouseX2, y: mouseY2};

        if (ws != null && ws.readyState == ws.OPEN) {
            var z0 = new ArrayBuffer(21);
            var z1 = new DataView(z0);
            z1.setUint8(0, 16);
            z1.setFloat64(1, mouseX2, true);
            z1.setFloat64(9, mouseY2, true);
            z1.setUint32(17, 0, true);
            ws.send(z0);
        }
    }

    function getMass(x){
        return x*x/100
    }

    function lineDistance( point1, point2 ){
        var xs = point2.nx - point1.nx;
        var ys = point2.ny - point1.ny;

        return Math.sqrt( xs * xs + ys * ys );
    }

    function getVirusShotsNeededForSplit(cellSize){
        return ~~((150-cellSize)/7);
    }

    function calcTTR(element){

        var totalMass = _.sum(_.pluck(zeach.myPoints, "nSize").map(getMass));
        return ~~((((totalMass*0.02)*1000)+30000) / 1000) - ~~((Date.now() - element.splitTime) / 1000);
    }

    function getBlobShotsAvailable(blob) {
        return ~~(Math.max(0, (getMass(blob.nSize)-20)/15));
    }

    function distanceFromCellZero(blob) {
        return isPlayerAlive() ? lineDistance(blob, getSelectedBlob()) :
            Math.sqrt((zeach.mapRight - zeach.mapLeft) * (zeach.mapRight - zeach.mapLeft) + (zeach.mapBottom - zeach.mapTop) * (zeach.mapBottom - zeach.mapTop));
    }

    function getViewport(interpolated) {
        var x =  _.sum(_.pluck(zeach.myPoints, interpolated ? "x" : "nx")) / zeach.myPoints.length;
        var y =  _.sum(_.pluck(zeach.myPoints, interpolated ? "y" : "ny")) / zeach.myPoints.length;
        var totalRadius =  _.sum(_.pluck(zeach.myPoints, interpolated ? "size" : "nSize"));
        var zoomFactor = Math.pow(Math.min(64.0 / totalRadius, 1), 0.4);
        var deltaX = 1024 / zoomFactor;
        var deltaY = 600 / zoomFactor;
        return { x: x, y: y, dx: deltaX, dy: deltaY };
    }

    function getMouseCoordsAsPseudoBlob(){
        return {
            "x": zeach.mouseX2,
            "y": zeach.mouseY2,
            "nx": zeach.mouseX2,
            "ny": zeach.mouseY2,
        };
    }

    // ======================   Grazing code    ==================================================================

    function checkCollision(myBlob, targetBlob, potential){
        // Calculate distance to target
        var dtt = lineDistance(myBlob, targetBlob);
        // Slope and normal slope
        var sl = (targetBlob.ny-myBlob.ny)/(targetBlob.nx-myBlob.nx);
        var ns = -1/sl;
        // y-int of ptt
        var yint1 = myBlob.ny - myBlob.nx*sl;
        if(!lineDistance(myBlob, potential) < dtt){
            // get second y-int
            var yint2 = potential.ny - potential.nx * ns;
            var interx = (yint2-yint1)/(sl-ns);
            var intery = sl*interx + yint1;
            var pseudoblob = {};
            pseudoblob.nx = interx;
            pseudoblob.ny = intery;
            if (((targetBlob.nx < myBlob.nx && targetBlob.nx < interx && interx < myBlob.nx) ||
                (targetBlob.nx > myBlob.nx && targetBlob.nx > interx && interx > myBlob.nx)) &&
                ((targetBlob.ny < myBlob.ny && targetBlob.ny < intery && intery < myBlob.ny) ||
                (targetBlob.ny > myBlob.ny && targetBlob.ny > intery && intery > myBlob.ny))){
                if(lineDistance(potential, pseudoblob) < potential.size+100){
                    return true;
                }
            }
        }
        return false;
    }

    function isSafeTarget(myBlob, targetBlob, threats){
        var isSafe = true;
        // check target against each enemy to make sure no collision is possible
        threats.forEach(function (threat){
            if(isSafe) {
                if(threat.isVirus) {
                    //todo once we are big enough, our center might still be far enough
                    // away that it doesn't cross virus but we still pop
                    if(checkCollision(myBlob, targetBlob, threat) )  {
                        isSafe = false;
                    }
                }
                else {
                    if ( checkCollision(myBlob, targetBlob, threat) || lineDistance(threat, targetBlob) <= threat.size + 200) {
                        isSafe = false;
                    }
                }
            }
        });
        return isSafe;
    }

    // All blobs that aren't mine
    function getOtherBlobs(){
        return _.omit(zeach.allNodes, zeach.myIDs);
    }

    // Gets any item which is a threat including bigger players and viruses
    function getThreats(blobArray, myMass) {
        // start by omitting all my IDs
        // then look for viruses smaller than us and blobs substantially bigger than us
        return _.filter(getOtherBlobs(), function(possibleThreat){
            var possibleThreatMass = getMass(possibleThreat.size);

            if(possibleThreat.isVirus) {
                // Viruses are only a threat if we are bigger than them
                return myMass >= possibleThreatMass;
            }
            // other blobs are only a threat if they cross the 'Large' threshhold
            return possibleThreatMass > myMass * Large;
        });
    }

    var throttledResetGrazingTargetId = null;

    function doGrazing() {
        if(!isPlayerAlive()){
            isGrazing = false;
            return;
        }

        if(null == throttledResetGrazingTargetId){
            throttledResetGrazingTargetId = _.throttle(function (){
                grazingTargetID = null;
                //console.log(~~(Date.now()/1000));
            }, 200);
        }

        // with target fixation on, target remains until it's eaten by someone or
        // otherwise disappears. With it off target is constantly recalculated
        // at the expense of CPU
        if(!grazingTargetFixation){
            throttledResetGrazingTargetId();
        }

        var target;
        if(!zeach.allNodes.hasOwnProperty(grazingTargetID))
        {
            var target = findFoodToEat(getSelectedBlob(), zeach.allItems);
            if(-1 == target){
                isGrazing = false;
                return;
            }
            grazingTargetID = target.id;
        }
        else
        {
            target = zeach.allNodes[grazingTargetID];
        }
        sendMouseUpdate(zeach.webSocket, target.x + Math.random(), target.y + Math.random());
    }

    function dasMouseSpeedFunction(cx, cy, radius, nx, ny) {
        this.cx = cx; this.cy = cy; this.radius = radius; this.nx = nx; this.ny = ny;
        this.value = function(x, y) {
            x -= this.cx; y -= this.cy;
            var lensq = x*x + y*y;
            var len = Math.sqrt(lensq);

            var val = x * this.nx + y * this.ny;
            if (len > this.radius) {
                return {
                    v: val / len,
                    dx: y * (this.nx * y - this.ny * x) / (lensq * len),
                    dy: x * (this.ny * x - this.nx * y) / (lensq * len),
                };
            } else {
                return {v: val / this.radius, dx: this.nx, dy: this.ny};
            }
        }
    }

    function dasBorderFunction(l, t, r, b, w) {
        this.l = l; this.t = t; this.r = r; this.b = b; this.w = w;
        this.value = function(x, y) {
            var v = 0, dx = 0, dy = 0;
            if (x < this.l) {
                v += this.l - x;
                dx = -this.w;
            } else if (x > this.r) {
                v += x - this.r;
                dx = this.w;
            }

            if (y < this.t) {
                v += this.t - y;
                dy = -this.w;
            } else if (y > this.b) {
                v += y - this.b;
                dy = this.w;
            }

            return {v: v * this.w, dx: dx, dy: dy};
        }
    }

    function dasSumFunction(sumfuncs) {
        this.sumfuncs = sumfuncs;
        this.value = function(x, y) {
            return sumfuncs.map(function(func) {
                return func.value(x, y);
            }).reduce(function (acc, val) {
                acc.v += val.v; acc.dx += val.dx; acc.dy += val.dy;
                return acc;
            });
        }
    }

    function gradient_ascend(func, step, iters, x, y) {
        var max_step = step;

        var last = func.value(x, y);

        while(iters > 0) {
            iters -= 1;

            x += last.dx * step;
            y += last.dy * step;
            var tmp = func.value(x, y);
            if (tmp.v < last.v) {
                step /= 2;
            } else {
                step = Math.min(2 * step, max_step);
            }
            //console.log([x, y, tmp[0], step]);

            last.v = tmp.v;
            last.dx = (last.dx + tmp.dx)/2.0;
            last.dy = (last.dy + tmp.dy)/2.0;
        }

        return {x: x, y: y, v: last.v};
    }

    function augmentBlobArray(blobArray) {

        blobArray = blobArray.slice();

        var curTimestamp = Date.now();

        // Outdated blob id set
        var ghostSet = [];

        blobArray.forEach(function (element) {
            ghostSet[element.id] = true;
            element.lastTimestamp = curTimestamp;
        });

        var viewport = getViewport(false);

        ghostBlobs = _.filter(ghostBlobs, function (element) {
            return !ghostSet[element.id] && // a fresher blob with the same id doesn't exist in blobArray already
                (curTimestamp - element.lastTimestamp < 10000) && // last seen no more than 10 seconds ago
                (
                 (Math.abs(viewport.x - element.nx) > (viewport.dx + element.nSize) * 0.9) ||
                 (Math.abs(viewport.y - element.ny) > (viewport.dy + element.nSize) * 0.9)
                ); // outside of firmly visible area, otherwise there's no need to remember it
        });

        ghostBlobs.forEach(function (element) {
            blobArray.push(element);
        });

        ghostBlobs = blobArray;

        return blobArray;
    }
    function findFoodToEat(cell, blobArray){
        blobArray = augmentBlobArray(blobArray);

        var accs = zeach.myPoints.map(function (cell) {

            var acc = { fx: 0, fy: 0, x: cell.nx, y: cell.ny, size : cell.nSize };
            var totalMass = _.sum(_.pluck(zeach.myPoints, "nSize").map(getMass))

            // Avoid walls too
            var wallArray = [];
            wallArray.push({id: -2, nx: cell.nx, ny: zeach.mapTop - 1, nSize: cell.nSize * 30});
            wallArray.push({id: -2, nx: cell.nx, ny: zeach.mapBottom + 1, nSize: cell.nSize * 30});
            wallArray.push({id: -2, ny: cell.ny, nx: zeach.mapLeft - 1, nSize: cell.nSize * 30});
            wallArray.push({id: -2, ny: cell.ny, nx: zeach.mapRight + 1, nSize: cell.nSize * 30});
            wallArray.forEach(function(el) {
                // Calculate repulsion vector
                var vec = { x: cell.nx - el.nx, y: cell.ny - el.ny };
                var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                // Normalize it to unit length
                vec.x /= dist;
                vec.y /= dist;

                // Walls have pseudo-size to generate repulsion, but we can move farther.
                dist += cell.nSize / 2.0;

                dist = Math.max(dist, 0.01);

                // Walls. Hate them muchly.
                dist /= 10;

                // The more we're split and the more we're to lose, the more we should be afraid.
                dist /= cell.nSize * Math.sqrt(zeach.myPoints.length);

                // The farther they're from us the less repulsive/attractive they are.
                vec.x /= dist;
                vec.y /= dist;

                if(!isFinite(vec.x) || !isFinite(vec.y)) {
                    return;
                }

                // Save element-produced force for visualization
                el.grazeVec = vec;

                // Sum forces from all threats
                acc.fx += vec.x;
                acc.fy += vec.y;
            });

            blobArray.forEach(function(el) {
                if(_.includes(zeach.myIDs, el.id)) {
                    el.isSafeTarget = false; //our cell, ignore
                } else if( !el.isVirus && (getMass(el.nSize) * 4 <= getMass(cell.nSize) * 3)) {
                //if(!el.isVirus && (getMass(el.nSize) <= 9)) {
                    el.isSafeTarget = true; //edible
                } else if (!el.isVirus && (getMass(el.nSize) * 3 < (getMass(cell.nSize) * 4))) {
                    el.isSafeTarget = false; //not edible ignorable
                } else {
                    el.isSafeTarget = null; //threat
                }

                if(false === el.isSafeTarget) {
                    // Ignorable blob. Skip.
                    // TODO: shouldn't really be so clear-cut. Must generate minor repulsion/attraction depending on size.
                    return;
                }

                // Calculate repulsion vector
                var vec = { x: cell.nx - el.nx, y: cell.ny - el.ny };
                var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                // Normalize it to unit length
                vec.x /= dist;
                vec.y /= dist;

                if(el.nSize > cell.nSize) {
                    if(el.isVirus) {
                        // Viruses are only a threat if they're smaller than us
                        return;
                    }

                    if(0 > el.id) {
                        // Walls have pseudo-size to generate repulsion, but we can move farther.
                        dist += cell.nSize / 2.0;
                    } else {
                        // Distance till consuming
                        dist -= el.nSize;
                        dist += cell.nSize /　3.0;
                        dist -= 11;
                    }

                    dist = Math.max(dist, 0.01);

                    if(0 > el.id) {
                        // Walls. Hate them muchly.
                        dist /= 10;
                    }

                    // Prioritize targets by size
                    if(null !== el.isSafeTarget) {
                        dist /= el.nSize;
                    } else {
                        var ratio = getMass(el.nSize) / getMass(cell.nSize);
                        // Cells that 1 to 8 times bigger are the most dangerous.
                        // Prioritize them by a truncated parabola up to 6 times.

                        // when we are fractured into small parts, we might underestimate
                        // how cells a lot bigger than us can be interested in us as a conglomerate of mass.
                        // So calculate threat index for our total mass too.
                        var ratio2 = getMass(el.nSize) / totalMass;
                        if(ratio2 < 4.5 && ratio > 4.5) {
                            ratio2 = 4.5;
                        }

                        ratio = Math.min(5, Math.max(0, - (ratio - 1) * (ratio - 8))) + 1;
                        ratio2 = Math.min(5, Math.max(0, - (ratio2 - 1) * (ratio2 - 8))) + 1;
                        ratio = Math.max(ratio, ratio2);

                        // The more we're split and the more we're to lose, the more we should be afraid.
                        dist /= ratio * cell.nSize * Math.sqrt(zeach.myPoints.length);
                    }

                } else {
                    // Distance till consuming
                    dist += el.nSize * 1 / 3;
                    dist -= cell.nSize;
                    dist -= 11;

                    if(el.isVirus) {
                        if(zeach.myPoints.length >= 16 ) {
                            // Can't split anymore so viruses are actually a good food!
                            el.isSafeTarget = true;
                        } else {
                            // Hate them a bit less than same-sized blobs.
                            dist *= 2;
                        }
                    }

                    dist = Math.max(dist, 0.01);

                    // Prioritize targets by size
                    dist /= el.nSize;
                }

                if(null !== el.isSafeTarget) {
                    //Not a threat. Make it attractive.
                    dist = -dist;
                }

                // The farther they're from us the less repulsive/attractive they are.
                vec.x /= dist;
                vec.y /= dist;

                if(!isFinite(vec.x) || !isFinite(vec.y)) {
                    return;
                }

                // Save element-produced force for visualization
                el.grazeVec = vec;

                // Sum forces from all threats
                acc.fx += vec.x;
                acc.fy += vec.y;

            });

            // Save resulting force for visualization
            cell.grazeDir = acc;
            return acc;
        });

        var funcs = accs.map(function(acc) {
            return new dasMouseSpeedFunction(acc.x, acc.y, 200, acc.fx, acc.fy);
        });

        // Pick gradient ascent step size for better convergence
        // so that coord jumps don't exceed ~50 units
        var step = _.sum(accs.map(function(acc) {
            return Math.sqrt(acc.fx * acc.fx + acc.fy * acc.fy);
        }));
        step = 50 / step;
        if(!isFinite(step)) {
            step = 50;
        }

        var viewport = getViewport(false);
        funcs.push(
            new dasBorderFunction(
                viewport.x - viewport.dx,
                viewport.y - viewport.dy,
                viewport.x + viewport.dx,
                viewport.y + viewport.dy,
                -1000
            )
        );

        var func = new dasSumFunction(funcs);

        var results = accs.map(function(acc) {
            return gradient_ascend(func, step, 100, acc.x, acc.y);
        });

        var coords = _.max(results, "v");

        var ans = {
            id: -5,
            x: Math.min(zeach.mapRight - cell.nSize/2, Math.max(zeach.mapLeft + cell.nSize/2, coords.x)),
            y: Math.min(zeach.mapBottom - cell.nSize/2, Math.max(zeach.mapTop + cell.nSize/2, coords.y)),
        };

        return ans;
    }


    function findFoodToEat_old(cell, blobArray){
        var edibles = [];
        var densityResults = [];
        var threats = getThreats(blobArray, getMass(cell.size));
        blobArray.forEach(function (element){
            var distance = lineDistance(cell, element);
            element.isSafeTarget = null;
            if( getMass(element.size) <= (getMass(cell.size) * 0.4) && !element.isVirus){
                if(isSafeTarget(cell, element, threats)){
                    edibles.push({"distance":distance, "id":element.id});
                    element.isSafeTarget = true;
                }
                else {
                    element.isSafeTarget = false;
                }
            }
        });
        edibles = edibles.sort(function(x,y){return x.distance<y.distance?-1:1;});
        edibles.forEach(function (element){
            var density = calcFoodDensity(zeach.allNodes[element.id], blobArray)/(element.distance*2);
            densityResults.push({"density":density, "id":element.id});
        });
        if(0 === densityResults.length){
            //console.log("No target found");
            return avoidThreats(threats, getSelectedBlob());
            return -1;
        }
        var target = densityResults.sort(function(x,y){return x.density>y.density?-1:1;});
        //console.log("Choosing blob (" + target[0].id + ") with density of : "+ target[0].isVirusensity);
        return zeach.allNodes[target[0].id];
    }

    function avoidThreats(threats, cell){
        // Avoid walls too
        threats.push({x: cell.x, y: zeach.mapTop - 1, size: 1});
        threats.push({x: cell.x, y: zeach.mapBottom + 1, size: 1});
        threats.push({y: cell.y, x: zeach.mapLeft - 1, size: 1});
        threats.push({y: cell.y, x: zeach.mapRight + 1, size: 1});

        var direction = threats.reduce(function(acc, el) {
            // Calculate repulsion vector
            var vec = { x: cell.x - el.x, y: cell.y - el.y };
            var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

            // Normalize it to unit length
            vec.x /= dist;
            vec.y /= dist;

            // Take enemy cell size into account
            dist -= el.size;

            // The farther they're from us the less repulsive they are
            vec.x /= dist;
            vec.y /= dist;

            // Sum forces from all threats
            acc.x += vec.x;
            acc.y += vec.y;

            return acc;
        }, {x: 0, y: 0});

        // Normalize force to unit direction vector
        var dir_norm = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        direction.x /= dir_norm;
        direction.y /= dir_norm;

        if(!isFinite(direction.x) || !isFinite(direction.y)) {
            return -1;
        }

        return { id: -5, x: cell.x + direction.x * cell.size * 5, y: cell.y + direction.y * cell.size * 5 };
    }

    function calcFoodDensity(cell2, blobArray2){
        var MaxDistance2 = 250;
        var pelletCount = 0;
        blobArray2.forEach(function (element2){
            var distance2 = lineDistance(cell2, element2);

            var cond1 = getMass(element2.size) <= (getMass(getSelectedBlob().size) * 0.4);
            var cond2 = distance2 < MaxDistance2;
            var cond3 = !element2.isVirus;
            //console.log(cond1 + " " + distance2 + " " + cell2.isSafeTarget);
            if( cond1 && cond2 && cond3 && cell2.isSafeTarget ){
                pelletCount +=1;
            }
        });

        return pelletCount;
    }
// ======================   UI stuff    ==================================================================

    function drawRescaledItems(ctx) {
        if (showVisualCues && isPlayerAlive()) {
            drawMapBorders(ctx);
            drawGrazingLines(ctx);
            drawSplitGuide(ctx, getSelectedBlob());
            drawMiniMap();
        }
    }

    function getScoreBoardExtrasString(F) {
        var extras = " ";
        if (showVisualCues) {
            highScore = Math.max(highScore, ~~(F / 100));
            extras += " High: " + highScore.toString();
            if (isPlayerAlive()) {
                extras += "" + isPlayerAlive() ? " Alive: " + (~~((Date.now() - timeSpawned) / 1000)).toString() : "";
            }
        }
        return extras;
    }

    function drawCellInfos(noColors, ctx) {
        var color = this.color;
        if (showVisualCues) {
            color = setCellColors(this, zeach.myPoints);
            if (this.isVirus) {
                if (!zeach.allNodes.hasOwnProperty(nearestVirusID))
                    nearestVirusID = this.id;
                else if (distanceFromCellZero(this) < distanceFromCellZero(zeach.allNodes[nearestVirusID]))
                    nearestVirusID = this.id;
            }
            if(noColors) {
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#AAAAAA"
            }
            else {
                ctx.fillStyle = color;
                ctx.strokeStyle = (this.id == nearestVirusID) ? "red" : color
            }
        }
    }

    function drawMapBorders(ctx) {
        if (zeach.isNightMode) {
            ctx.strokeStyle = '#FFFFFF';
        }
        ctx.beginPath();
        ctx.moveTo(zeach.mapLeft, zeach.mapTop);        // 0
        ctx.lineTo(zeach.mapRight, zeach.mapTop);       // >
        ctx.lineTo(zeach.mapRight, zeach.mapBottom);    // V
        ctx.lineTo(zeach.mapLeft, zeach.mapBottom);     // <
        ctx.lineTo(zeach.mapLeft, zeach.mapTop);        // ^
        ctx.stroke();
    }

    function drawSplitGuide(ctx, cell) {
        if( !isPlayerAlive()){
            return;
        }
        var radius = 660;
        var centerX = cell.x;
        var centerY = cell.y;
        var hold = ctx.globalAlpha;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius+cell.size, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
        ctx.globalAlpha = hold;
    }

    function isTeamMode(){
        return (zeach.gameMode === ":teams");
    }
    function setCellColors(cell,myPoints){
        if(!showVisualCues){
            return cell.color;
        }
        var color = cell.color;
        if (myPoints.length > 0 && !isTeamMode()) {
            var size_this =  getMass(cell.size);
            var size_that =  ~~(getSelectedBlob().size * getSelectedBlob().size / 100);
            if (cell.isVirus || myPoints.length === 0) {
                color = virusColor;
            } else if (~myPoints.indexOf(cell)) {
                color = myColor;
            } else if (size_this > size_that * Huge) {
                color = Huge_Color;
            } else if (size_this > size_that * Large) {
                color = Large_Color;
            } else if (size_this > size_that * Small) {
                color = Same_Color;
            } else if (size_this > size_that * Tiny) {
                color = Small_Color;
            } else {
                color = Tiny_Color;
            }
        }
        return color;
    }

    function displayDebugText(ctx, agarTextFunction) {

        if(0 >= displayDebugInfo) {
            return;
        }

        var textSize = 15;
        var debugStrings = [];
        if(1 <= displayDebugInfo) {
            debugStrings.push("v " + _version_);
            debugStrings.push("Server: " + serverIP);
            debugStrings.push("D - toggle debug display");
            debugStrings.push("G - grazing: " + (isGrazing ? "On" : "Off"));
        }
        if(2 <= displayDebugInfo) {
            debugStrings.push("M - suspend mouse: " + (suspendMouseUpdates ? "On" : "Off"));
            debugStrings.push("P - grazing target fixation :" + (grazingTargetFixation ? "On" : "Off"));
            if(grazingTargetFixation){ debugStrings.push("  (T) to retarget");}
            debugStrings.push("O - right click: " + (rightClickFires ? "Fires @ virus" : "Default"))
            debugStrings.push("V - visualize grazing: " + (visualizeGrazing ? "On" : "Off"))
            debugStrings.push("Z - zoom: " + zoomFactor.toString());
            if (isPlayerAlive()) {
                debugStrings.push("Location: " + Math.floor(getSelectedBlob().x) + ", " + Math.floor(getSelectedBlob().y));
            }

        }
        var offsetValue = 20;
        var text = new agarTextFunction(textSize, (zeach.isNightMode ? '#F2FBFF' : '#111111'));

        for (var i = 0; i < debugStrings.length; i++) {
            text.setValue(debugStrings[i]); // setValue
            var textRender = text.render();
            ctx.drawImage(textRender, 20, offsetValue);
            offsetValue += textRender.height;
        }
    }

    // Probably isn't necessary to throttle it ... but what the hell.
    var rescaleMinimap = _.throttle(function(){
        var scaledWidth = ~~(zeach.mapWidth/minimapScale);
        var scaledHeight = ~~(zeach.mapHeight/minimapScale);
        var minimap = jQuery("#mini-map");

        if(minimap.width() != scaledWidth || minimap.height() != scaledHeight){
            // rescale the div
            minimap.width(scaledWidth);
            minimap.height(scaledHeight);
            // rescale the canvas element
            minimap[0].width = scaledWidth;
            minimap[0].height = scaledHeight;
        }
    }, 10*1000);

    function drawMiniMap() {
        rescaleMinimap();

        miniMapCtx.clearRect(0, 0, ~~(zeach.mapWidth/minimapScale), ~~(zeach.mapHeight/minimapScale));

        _.forEach(_.values(getOtherBlobs()), function(blob){
            miniMapCtx.strokeStyle = blob.isVirus ?  "#33FF33" : 'rgb(52,152,219)' ;
            miniMapCtx.beginPath();
            miniMapCtx.arc((blob.nx+Math.abs(zeach.mapLeft)) / minimapScale, (blob.ny+Math.abs(zeach.mapTop)) / minimapScale, blob.size / minimapScale, 0, 2 * Math.PI);
            miniMapCtx.stroke();
        });

        _.forEach(zeach.myPoints, function(myBlob){
            miniMapCtx.strokeStyle = "#FFFFFF";
            miniMapCtx.beginPath();
            miniMapCtx.arc((myBlob.nx+Math.abs(zeach.mapLeft)) / minimapScale, (myBlob.ny+Math.abs(zeach.mapTop)) / minimapScale, myBlob.size / minimapScale, 0, 2 * Math.PI);
            miniMapCtx.stroke();
        });
    }
    function drawLine(ctx, point1, point2, color){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
    }

    function drawGrazingLines(ctx) {
        if(!isGrazing || !visualizeGrazing ||  !isPlayerAlive())
        {
            //console.log("returning early");
            return;
        }
        var oldLineWidth = ctx.lineWidth;
        var oldColor = ctx.color;
        var oldGlobalAlpha = ctx.globalAlpha;

        var playerBlob = getSelectedBlob();
        var blobArray = augmentBlobArray(zeach.allItems);

        var nullVec = { x: 0, y: 0 };
        var cumulatives = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
        var maxSize = 0.001;

        blobArray.forEach(function (element){

            var color;
            var grazeVec = element.grazeVec ? element.grazeVec : nullVec;
            var cumul = cumulatives[(element.isSafeTarget === true) ? 1 : 0];
            cumul.x += grazeVec.x;
            cumul.y += grazeVec.y;

            if(element.isSafeTarget === true) {
                //drawLine(ctx,element, playerBlob, "white" );
                drawLine(ctx,element, {x: element.x + grazeVec.x / maxSize, y: element.y + grazeVec.y / maxSize }, "green" );
                //drawLine(ctx,playerBlob, {x: playerBlob.x + grazeVec.x / maxSize, y: playerBlob.y + grazeVec.y / maxSize }, "green" );
            } else { //if (element.isSafeTarget === false)
                //drawLine(ctx,element, playerBlob, "red" );
                //drawLine(ctx,element, {x: element.x + grazeVec.x / maxSize, y: element.y + grazeVec.y / maxSize }, "red" );
                drawLine(ctx,playerBlob, {x: playerBlob.x + grazeVec.x / maxSize, y: playerBlob.y + grazeVec.y / maxSize }, "red" );

                var grazeVecLen = Math.sqrt(grazeVec.x * grazeVec.x + grazeVec.y * grazeVec.y);

                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(element.x, element.y, grazeVecLen / maxSize / 20, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#00FF00';
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });

        var grazeVec = playerBlob.grazeDir ? playerBlob.grazeDir : { fx: 0, fy: 0 };

        // Prepare to render cumulatives
        maxSize *= blobArray.length;
        maxSize /= 10;

        ctx.lineWidth = 10;

        // Render summary force without special forces, like walls
        drawLine(ctx,playerBlob,
            {
                x: playerBlob.x + (cumulatives[0].x + cumulatives[1].x) / maxSize,
                y: playerBlob.y + (cumulatives[0].y + cumulatives[1].y) / maxSize,
            }, "gray"
        );

        // Render foods and threats force cumulatives
        drawLine(ctx,playerBlob, {x: playerBlob.x + cumulatives[1].x / maxSize, y: playerBlob.y + cumulatives[1].y / maxSize }, "green" );
        drawLine(ctx,playerBlob, {x: playerBlob.x + cumulatives[0].x / maxSize, y: playerBlob.y + cumulatives[0].y / maxSize }, "red" );

        // Render summart force with special forces, like walls
        ctx.lineWidth = 5;
        drawLine(ctx,playerBlob, {x: playerBlob.x + (grazeVec.fx) / maxSize, y: playerBlob.y + (grazeVec.fy) / maxSize }, "orange" );

        // Render sent mouse coords as a small circle
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(lastMouseCoords.x, lastMouseCoords.y, 0.1 * playerBlob.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = zeach.isNightMode ? '#FFFFFF' : '#000000';
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Render viewport borders, useful for blob lookout and 10-sec-memoization debugging
        var viewport = getViewport(true);

        ctx.strokeStyle = zeach.isNightMode ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(viewport.x - viewport.dx, viewport.y - viewport.dy);
        ctx.lineTo(viewport.x + viewport.dx, viewport.y - viewport.dy);
        ctx.lineTo(viewport.x + viewport.dx, viewport.y + viewport.dy);
        ctx.lineTo(viewport.x - viewport.dx, viewport.y + viewport.dy);
        ctx.lineTo(viewport.x - viewport.dx, viewport.y - viewport.dy);
        ctx.stroke();

        ctx.globalAlpha = oldGlobalAlpha;
        ctx.lineWidth = oldLineWidth;
        ctx.color = oldColor;
    }

    function drawGrazingLines_old(ctx) {
        if(!isGrazing || !visualizeGrazing ||  !isPlayerAlive())
        {
            //console.log("returning early");
            return;
        }
        var oldLineWidth = ctx.lineWidth;
        var oldColor = ctx.color;
        zeach.allItems.forEach(function (element){
            if(element.isSafeTarget === true)
                drawLine(ctx,element, getSelectedBlob(), "white" );
            else if (element.isSafeTarget === false)
                drawLine(ctx,element, getSelectedBlob(), "red" );
            else
            {
                //drawLine(ctx,element, getSelectedBlob(), "blue" );
            }

        });

        if(_.has(zeach.allNodes, grazingTargetID)){
            ctx.lineWidth = 10;
            drawLine(ctx, zeach.allNodes[grazingTargetID], getSelectedBlob(), "green");
        }
        ctx.lineWidth = oldLineWidth;
        ctx.color = oldColor;

    }

// =============


// ======================   Virus Popper    ==================================================================
    function findNearestVirus(cell, blobArray){
        var nearestVirus = _.min(_.filter(blobArray, "isVirus", true), function(element) {
            return lineDistance(cell, element);
        });

        if( Infinity == nearestVirus){
            //console.log("No nearby viruses");
            return -1;
        }
        return nearestVirus;
    }

    function fireAtVirusNearestToBlob(blob, blobArray) {
        console.log("fireAtVirusNearestToBlob");
        var msDelayBetweenShots = 75;
        nearestVirus = findNearestVirus(blob, blobArray);

        if(-1 == nearestVirus){
            console.log("No Nearby Virus Found");
            console.log(blobArray);
            console.log(blob);
            return;
        }

        // TODO: count availableshots and limit shots sent to  Math.min(shotsNeeded, ShotsAvailable)
        var shotsNeeded = getVirusShotsNeededForSplit(nearestVirus.size);
        var shotsFired = 0 / zeach.myPoints.length;
        if(shotsNeeded <= 0){
            return;
        }

        suspendMouseUpdates = true;
        console.log("Nearest Virus at: ("+ nearestVirus.x + "," + nearestVirus.y + ") requires " + shotsNeeded + " shots.");
        // two mouse updates in a row to make sure new position is locked in.
        sendMouseUpdate(zeach.webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random());
        window.setTimeout(function () { sendMouseUpdate(zeach.webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random()); }, 25);

        // schedules all shots needed spaced evenly apart by of 'msDelayBetweenShots'
        for ( ; shotsFired < shotsNeeded; shotsFired++){
            window.setTimeout(function () {
                    sendMouseUpdate(zeach.webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random());
                    zeach.fireFunction(21);
                }, msDelayBetweenShots *(shotsFired+1));
        }
        window.setTimeout(function () { suspendMouseUpdates = false;}, msDelayBetweenShots *(shotsFired+1));
    }


    function fireAtVirusNearestToCursor(){
        fireAtVirusNearestToBlob(getMouseCoordsAsPseudoBlob(), zeach.allItems);
    }

// ======================   Skins    ==================================================================
    /* AgarioMod.com skins have been moved to the very end of the file */
    var extendedSkins = {
        "billy mays" : "http://i.imgur.com/HavxFJu.jpg",
        "stannis": "http://i.imgur.com/JyZr0CI.jpg",
        "shrek is love" : "http://i.imgur.com/QDhkr4C.jpg",
        "shrek is life" : "http://i.imgur.com/QDhkr4C.jpg",
        "blueeyes" : "http://i.imgur.com/wxCfUws.jpg",
        "ygritte"  : "http://i.imgur.com/lDIFCT1.png",
        "lord kience" : "http://i.imgur.com/b2UXk15.png",
    }

    var skinsSpecial = {
        "white  light": "https://i.imgur.com/4y8szAE.png",
        "tubbymcfatfuck" : "http://tinyurl.com/TubbyMcFatFuck",
        "texas  doge" : "http://i.imgur.com/MVsLldL.jpg",
        "doge  helper" : "http://i.imgur.com/FzZebpk.jpg",
        "controless " : "https://i.imgur.com/uD5SW8X.jpg",
        "sqochit" : "http://i.imgur.com/AnowvFI.jpg",
        "drunken" : "http://i.imgur.com/JeKNRss.png",
    };

    var bitdoAlreadyChecked = [];

    function isBitdoToImgurRedirect(userName, imgCache) {
        var bitdoURL = "http://bit.do/"+ userName.slice(1);
        GM_xmlhttpRequest({
            method: "GET",
            url: (bitdoURL + "-"),
            onload: function(response) {
                var imgurlink = /href=\"(http:\/\/i\.imgur\.com\/[a-zA-Z0-9.]+)/g.exec(response.responseText);
                if(null == imgurlink || imgurlink.length < 2 || !_.startsWith(imgurlink[1], "http://i.imgur.com/"))
                    console.log("No imgur link found");
                else {
                    console.log(imgurlink[1] + " is image for  " + userName);
                    imgCache[userName.toLowerCase()] = new Image;
                    imgCache[userName.toLowerCase()].src = imgurlink[1];
                }
            }
        });
        return true;
    }

    function isAgarioModsSkin(targetName){
        return _.includes(agariomodsSkins, targetName)
    }
    function isSpecialSkin(targetName){
        return skinsSpecial.hasOwnProperty(targetName.toLowerCase());
    }
    function isExtendedSkin(targetName){
        return _.has(extendedSkins, targetName.toLowerCase());
    }

    function isImgurSkin(targetName){
        return _.startsWith(targetName, "i/");
    }
    function isAMConnectSkin(targetName){
        return _.startsWith(targetName, "*");
    }

    function isBitDoSkin(targetName){
        return _.startsWith(targetName, "`");
    }

    function customSkins(cell, defaultSkins, imgCache, showSkins, gameMode) {
        var retval = null;
        var userName = cell.name;
        var userNameLowerCase = userName.toLowerCase();
        if(":teams" ==  gameMode)
        {
            retval = null;
        }
        else if(!cell.isAgitated && showSkins ){
            if(-1 != defaultSkins.indexOf(userNameLowerCase) || isSpecialSkin(userNameLowerCase) || isImgurSkin(userNameLowerCase) ||
                isBitDoSkin(userName) || isAgarioModsSkin(userNameLowerCase) || isAMConnectSkin(userNameLowerCase) || isExtendedSkin(userNameLowerCase)){
                if (!imgCache.hasOwnProperty(userNameLowerCase)){
                    if(isSpecialSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image;
                        imgCache[userNameLowerCase].src = skinsSpecial[userNameLowerCase];
                    }
                    else if(isExtendedSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image;
                        imgCache[userNameLowerCase].src = extendedSkins[userNameLowerCase];
                    }
                    else if(isAgarioModsSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image;
                        imgCache[userNameLowerCase].src = "http://skins.agariomods.com/i/" + userNameLowerCase + ".png";
                    }
                    else if(isAMConnectSkin(userNameLowerCase)) {
                        console.log("is AmConnect skin")
                        imgCache[userNameLowerCase] = new Image;
                        imgCache[userNameLowerCase].src = "http://connect.agariomods.com/img_" + userNameLowerCase.slice(1) + ".png";
                    }
                    else if(isBitDoSkin(userNameLowerCase)){
                        if(-1 != bitdoAlreadyChecked.indexOf(userNameLowerCase))
                        {
                            console.log(userNameLowerCase + " already checked");
                            return null;
                        }
                        isBitdoToImgurRedirect(userName, imgCache);
                        console.log(userName + " added to already checked list");
                        bitdoAlreadyChecked.push(userNameLowerCase);
                        return null;
                    }
                    else if(isImgurSkin(userNameLowerCase)){
                        imgCache[userNameLowerCase] = new Image;
                        imgCache[userNameLowerCase].src = "http://i.imgur.com/"+ userName.slice(2) +".png";
                    }

                    else{
                        imgCache[userNameLowerCase] = new Image;
                        imgCache[userNameLowerCase].src = "skins/" + userNameLowerCase + ".png";
                    }
                }
                if(0 != imgCache[userNameLowerCase].width && imgCache[userNameLowerCase].complete) {
                    retval = imgCache[userNameLowerCase];
                } else {
                    retval = null;
                }
            }
            else {
                retval = null;
            }
        }
        else {
            retval = null;
        }
        return retval;
    }


// ======================   Draw Functions    ==================================================================
    function shouldRelocateName(){
        return ((isExtendedSkin(this.name)|| isSpecialSkin(this.name) || isBitDoSkin(this.name)|| isAMConnectSkin(this.name)));
    }

    function drawCellName(isMyCell, kbIndex, itemToDraw){
        var yBasePos;
        var nameCache = this.k;
        yBasePos = ~~this.y;
        // Viruses have empty name caches. If this is a virus with an empty name cache
        // then give it a name of the # of shots needed to split it.
        if(this.isVirus && null == nameCache){
            var virusSize = this.nSize;
            var shotsNeeded = getVirusShotsNeededForSplit(virusSize).toString();
            this.setName(shotsNeeded);
        }

        if((zeach.hasNickname || isMyCell) && (this.name && (nameCache && (null == itemToDraw || -1 == zeach.textBlobs.indexOf(kbIndex)))) ) {

            itemToDraw = nameCache;
            itemToDraw.setValue(this.name);
            setCellName(this, itemToDraw);
            itemToDraw.H(this.h());
            var scale = Math.ceil(10 * k) / 10;
            itemToDraw.setScale(scale);

            setVirusInfo(this, itemToDraw, scale);
            itemToDraw = itemToDraw.render();
            var xPos = ~~(itemToDraw.width / scale);
            var yPos = ~~(itemToDraw.height / scale);

            if(shouldRelocateName.call(this)) {
                // relocate names to UNDER the cell rather than on top of it
                zeach.ctx.drawImage(itemToDraw, ~~this.x - ~~(xPos / 2), yBasePos + ~~(yPos ), xPos, yPos);
                yBasePos += itemToDraw.height / 2 / scale + 8;
            }
            else {
                zeach.ctx.drawImage(itemToDraw, ~~this.x - ~~(xPos / 2), yBasePos - ~~(yPos / 2), xPos, yPos);
            }
            yBasePos += itemToDraw.height / 2 / scale + 4;
        }
        return yBasePos;
    }

    function drawCellMass(yBasePos, itemToDraw){
        var massValue = (~~(getMass(this.size))).toString();
        // Append shots to mass if visual cues are enabled
        if(showVisualCues && _.contains(zeach.myIDs, this.id)){
            massValue += " (" + getBlobShotsAvailable(this).toString() + ")";
        }

        if(zeach.isShowMass) {
            var scale;
            if(itemToDraw || 0 == zeach.myPoints.length && ((!this.isVirus || this.j) && 20 < this.size)) {
                if(null == this.J) {
                    this.J = new na(this.h() / 2, "#FFFFFF", true, "#000000");
                }
                itemToDraw = this.J;
                itemToDraw.H(this.h() / 2);
                itemToDraw.setValue(massValue); // precalculated & possibly appended
                scale = Math.ceil(10 * k) / 10;
                itemToDraw.setScale(scale);

                // Tweak : relocated mass is line is bigger than stock
                itemToDraw.setScale(scale * ( shouldRelocateName.call(this) ? 2 : 1));

                var e = itemToDraw.render();
                var xPos = ~~(e.width / scale);
                var yPos = ~~(e.height / scale);
                if(shouldRelocateName.call(this)) {
                    // relocate mass to UNDER the cell rather than on top of it
                    zeach.ctx.drawImage(e, ~~this.x - ~~(xPos / 2), yBasePos + ~~(yPos), xPos, yPos);
                }
                else {
                    zeach.ctx.drawImage(e, ~~this.x - ~~(xPos / 2), yBasePos - ~~(yPos / 2), xPos, yPos);
                }
            }
        }

    }

// ======================   Misc    ==================================================================

    function customKeyDownEvents(d)
    {
        if(jQuery("#overlays").is(':visible')){
            return;
        }

        if(9 === d.keyCode && isPlayerAlive()) {
            var myids_sorted = _.pluck(zeach.myPoints, "id").sort(); // sort by id
            var indexloc = _.indexOf(myids_sorted, selectedBlobID);
            d.preventDefault();
            if(-1 === indexloc){
                selectedBlobID = zeach.myPoints[0].id;
                console.log("Had to select new blob. Its id is " + selectedBlobID);
                return zeach.allNodes[selectedBlobID];
            }
            indexloc += 1;
            if(indexloc >= myids_sorted.length){
                selectedBlobID = zeach.myPoints[0].id;
                console.log("Reached array end. Moving to begining with id " + selectedBlobID);
                return zeach.allNodes[selectedBlobID];
            }
            selectedBlobID = zeach.myPoints[indexloc].id;
            return zeach.allNodes[selectedBlobID];
        }
        else if('A'.charCodeAt(0) === d.keyCode && isPlayerAlive()){
            cobbler.isAcid = !cobbler.isAcid;
            setAcid(cobbler.isAcid);
        }
        else if('C'.charCodeAt(0) === d.keyCode && isPlayerAlive()) {
            grazingTargetID = null;
            showVisualCues = !showVisualCues;
            if(!showVisualCues) {
                zoomFactor = 10;
                jQuery("#mini-map").hide();
            }
            else
            {
                jQuery("#mini-map").show();
            }
        }
        else if('D'.charCodeAt(0) === d.keyCode && isPlayerAlive()) {
            displayDebugInfo +=1;
            if(displayDebugInfo >= 3){
                displayDebugInfo = 0;
            }
        }
        else if('E'.charCodeAt(0) === d.keyCode && isPlayerAlive()){
            fireAtVirusNearestToCursor();
        }
        else if('G'.charCodeAt(0) === d.keyCode && isPlayerAlive()) {
            grazingTargetID = null;
            isGrazing = !isGrazing;
        }
        else if('M'.charCodeAt(0) === d.keyCode && isPlayerAlive()){
            suspendMouseUpdates = !suspendMouseUpdates;
        }
        else if('O'.charCodeAt(0) === d.keyCode && isPlayerAlive()) {
            rightClickFires = !rightClickFires;
            GM_setValue('rightClickFires', rightClickFires);
        }
        else if('P'.charCodeAt(0) === d.keyCode && isPlayerAlive()) {
            grazingTargetFixation = !grazingTargetFixation;
        }
        else if('R'.charCodeAt(0) === d.keyCode && isPlayerAlive()){
            fireAtVirusNearestToBlob(getSelectedBlob(),zeach.allItems);
        }
        else if('T'.charCodeAt(0) === d.keyCode && isPlayerAlive() && isGrazing && grazingTargetFixation)
        {
            console.log("Retarget requested");
            var pseudoBlob = getMouseCoordsAsPseudoBlob();

            pseudoBlob.size = getSelectedBlob().size;
            //pseudoBlob.scoreboard = scoreboard;
            var target = findFoodToEat(pseudoBlob,zeach.allItems);
            if(-1 == target){
                isGrazing = false;
                return;
            }
            grazingTargetID = target.id;
        }
        else if('V'.charCodeAt(0) === d.keyCode && isPlayerAlive()) {
            visualizeGrazing = !visualizeGrazing;
            GM_setValue('visualizeGrazing', visualizeGrazing);
        }

        else if('Z'.charCodeAt(0) === d.keyCode && isPlayerAlive()) {
            zoomFactor = (zoomFactor == 10 ? 11 : 10);
        }
        else if('8'.charCodeAt(0) === d.keyCode && isPlayerAlive()) { // SELF DESTRUCT
            zeach.fireFunction(20);
        }
    }

    function onAfterUpdatePacket() {
        if (!isPlayerAlive()){
            timeSpawned = null;
        }
        if(null == timeSpawned && isPlayerAlive()) {
            timeSpawned = Date.now(); // it's been reported we miss some instances of player spawning
        }
    }

    function onBeforeNewPointPacket() {
        if (0 == _.size(zeach.myPoints)){
            timeSpawned = Date.now();
        }
    }

    function setCellName(cell, d) {
        if (showVisualCues) {
            var pct;
            if (_.contains(zeach.myIDs, cell.id) && _.size(zeach.myPoints) > 1) {
                pct = (cell.n * cell.n) * 100 / (getSelectedBlob().n * getSelectedBlob().n);
                d.setValue(calcTTR(cell) + " ttr" + " " + ~~(pct) + "%");
            } else if (!cell.isVirus && isPlayerAlive()) {
                pct = ~~((cell.n * cell.n) * 100 / (getSelectedBlob().n * getSelectedBlob().n));
                d.setValue(cell.name + " " + pct.toString() + "%");
            }
        }
    }

    function setVirusInfo(cell, ctx, c) {
        ctx.setScale(c * 1.25);
        if (showVisualCues) {
            if (cell.isVirus) {
                cell.k.setValue(getVirusShotsNeededForSplit(cell.n));
                var nameSizeMultiplier = 4;
                ctx.setScale(c * nameSizeMultiplier);
            }
        }
        if (cell.isVirus && !showVisualCues) {
            cell.k.setValue(" ");
        }
    }

    window.setLiteBrite = function (val){
        isLiteBrite = val;
    };
    window.setLeftMouseButtonFires = function (val){
        rightClickFires = val;
    };


// ======================   Start main    ==================================================================

    function Wa() {
        pa = true;
        Ca();
        setInterval(Ca, 18E4);
        C = qa = document.getElementById("canvas");
        f = C.getContext("2d");
        /*new*//*remap*/ C.onmousewheel = function (e) {zoomFactor = e.wheelDelta > 0 ? 10 : 11;}
        C.onmousedown = function (a) {
            /*new*/if(isPlayerAlive() && rightClickFires){fireAtVirusNearestToCursor();}
            /*new*/ return;
            /*new*/ //event.preventDefault(); // FUTURE: Electronoob mousedrag fix. is this needed?
            if(Da) {
                var b = a.clientX - (5 + q / 5 / 2);
                var c = a.clientY - (5 + q / 5 / 2);
                if(Math.sqrt(b * b + c * c) <= q / 5 / 2) {
                    N();
                    D(17);
                    return;
                }
            }
            V = a.clientX;
            W = a.clientY;
            ra();
            N();
        };
        C.onmousemove = function (a) {
            V = a.clientX;
            W = a.clientY;
            ra();
        };
        C.onmouseup = function () {};
        if(/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", Ea, false);
        } else {
            document.body.onmousewheel = Ea;
        }
        var a = false;
        var b = false;
        var c = false;
        g.onkeydown = function (d) {
            if(!(32 != d.keyCode)) {
                if(!a) {
                    N();
                    D(17);
                    a = true;
                }
            }
            if(!(81 != d.keyCode)) {
                if(!b) {
                    D(18);
                    b = true;
                }
            }
            if(!(87 != d.keyCode)) {
                if(!c) {
                    N();
                    D(21);
                    c = true;
                }
            }
            if(27 == d.keyCode) {
                Fa(true);
            }
            /*new*/customKeyDownEvents(d);
        };
        g.onkeyup = function (d) {
            if(32 == d.keyCode) {
                a = false;
            }
            if(87 == d.keyCode) {
                c = false;
            }
            if(81 == d.keyCode) {
                if(b) {
                    D(19);
                    b = false;
                }
            }
        };
        g.onblur = function () {
            D(19);
            c = b = a = false;
        };
        g.onresize = Ga;
        if(g.requestAnimationFrame) {
            g.requestAnimationFrame(Ha);
        } else {
            setInterval(sa, 1E3 / 60);
        }
        setInterval(N, 40);
        if(w) {
            m("#region")
                .val(w);
        }
        Ia();
        X(m("#region")
            .val());
        if(null == s$$0) {
            if(w) {
                Y();
            }
        }
        m("#overlays")
            .show();
        Ga();
    }

    function Ea(a) {
        E *= Math.pow(0.9, a.wheelDelta / -120 || (a.detail || 0));
        if(1 > E) {
            E = 1;
        }
        if(E > 4 / k) {
            E = 4 / k;
        }
    }

    function Xa() {
        if(0.4 > k) {
            O = null;
        } else {
            var a = Number.POSITIVE_INFINITY;
            var b = Number.POSITIVE_INFINITY;
            var c = Number.NEGATIVE_INFINITY;
            var d = Number.NEGATIVE_INFINITY;
            var e = 0;
            var l = 0;
            for(; l < v.length; l++) {
                var h = v[l];
                if(!!h.I()) {
                    if(!h.M) {
                        if(!(20 >= h.size * k)) {
                            e = Math.max(h.size, e);
                            a = Math.min(h.x, a);
                            b = Math.min(h.y, b);
                            c = Math.max(h.x, c);
                            d = Math.max(h.y, d);
                        }
                    }
                }
            }
            O = Ya.ca({
                X: a - (e + 100),
                Y: b - (e + 100),
                fa: c + (e + 100),
                ga: d + (e + 100),
                da: 2,
                ea: 4
            });
            l = 0;
            for(; l < v.length; l++) {
                if(h = v[l], h.I() && !(20 >= h.size * k)) {
                    a = 0;
                    for(; a < h.a.length; ++a) {
                        b = h.a[a].x;
                        c = h.a[a].y;
                        if(!(b < t - q / 2 / k)) {
                            if(!(c < u - r / 2 / k)) {
                                if(!(b > t + q / 2 / k)) {
                                    if(!(c > u + r / 2 / k)) {
                                        O.i(h.a[a]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function ra() {
        Z = (V - q / 2) / k + t;
        $ = (W - r / 2) / k + u;
    }

    function Ca() {
        if(null == aa) {
            aa = {};
            m("#region")
                .children()
                .each(function () {
                    var a = m(this);
                    var b = a.val();
                    if(b) {
                        aa[b] = a.text();
                    }
                });
        }
        m.get(ba + "//m.agar.io/info", function (a) {
            var b = {};
            var c;
            for(c in a.regions) {
                var d = c.split(":")[0];
                b[d] = b[d] || 0;
                b[d] += a.regions[c].numPlayers;
            }
            for(c in b) {
                m('#region option[value="' + c + '"]')
                    .text(aa[c] + " (" + b[c] + " players)");
            }
        }, "json");
    }

    function Ja() {
        m("#adsBottom")
            .hide();
        m("#overlays")
            .hide();
        Ia();
    }

    function X(a) {
        if(a) {
            if(a != w) {
                if(m("#region")
                        .val() != a) {
                    m("#region")
                        .val(a);
                }
                w = g.localStorage.location = a;
                m(".region-message")
                    .hide();
                m(".region-message." + a)
                    .show();
                m(".btn-needs-server")
                    .prop("disabled", false);
                if(pa) {
                    Y();
                }
            }
        }
    }

    function Fa(a) {
        F = null;
        Za();
        m("#overlays")
            .fadeIn(a ? 200 : 3E3);
        /*new*//*mikey*/OnShowOverlay(a);
        if(!a) {
            m("#adsBottom")
                .fadeIn(3E3);
        }
    }

    function Ia() {
        if(m("#region")
                .val()) {
            g.localStorage.location = m("#region")
                .val();
        } else {
            if(g.localStorage.location) {
                m("#region")
                    .val(g.localStorage.location);
            }
        }
        if(m("#region")
                .val()) {
            m("#locationKnown")
                .append(m("#region"));
        } else {
            m("#locationUnknown")
                .append(m("#region"));
        }
    }

    function Za() {
        if(!!ca) {
            if(!(75 <= P)) {
                ca = false;
                setTimeout(function () {
                    ca = true;
                }, 6E4 * da);
                g.googletag.pubads()
                    .refresh([g.mainAd]);
            }
        }
    }

    function Ka() {
        console.log("Find " + w + Q);
        m.ajax(ba + "//m.agar.io/", {
            error: function () {
                setTimeout(Ka, 1E3);
            },
            success: function (a) {
                a = a.split("\n");
                if(a[2]) {
                    alert(a[2]);
                }
                La("ws://" + a[0], a[1]);
                /*new*/ serverIP = a[0];
            },
            dataType: "text",
            method: "POST",
            cache: false,
            crossDomain: true,
            data: (w + Q || "?") + "\n154669603"
        });
    }

    function Y() {
        if(pa) {
            if(w) {
                m("#connecting")
                    .show();
                Ka();
            }
        }
    }

    function La(a$$0, b) {
        if(s$$0) {
            s$$0.onopen = null;
            s$$0.onmessage = null;
            s$$0.onclose = null;
            try {
                s$$0.close();
            } catch(c$$0) {}
            s$$0 = null;
        }
        if($a) {
            var d = a$$0.split(":");
            a$$0 = d[0] + "s://ip-" + d[1].replace(/\./g, "-")
                    .replace(/\//g, "") + ".tech.agar.io:" + (+d[2] + 2E3);
        }
        G = [];
        p = [];
        A = {};
        v = [];
        I = [];
        B = [];
        x = y = null;
        J = 0;
        ta = false;
        console.log("Connecting to " + a$$0);
        s$$0 = new WebSocket(a$$0);
        s$$0.binaryType = "arraybuffer";
        s$$0.onopen = function () {
            var a;
            console.log("socket open");
            a = K(5);
            a.setUint8(0, 254);
            a.setUint32(1, 4, true);
            L(a);
            a = K(5);
            a.setUint8(0, 255);
            a.setUint32(1, 154669603, true);
            L(a);
            a = K(1 + b.length);
            a.setUint8(0, 80);
            var c = 0;
            for(; c < b.length; ++c) {
                a.setUint8(c + 1, b.charCodeAt(c));
            }
            L(a);
            Ma();
        };
        s$$0.onmessage = ab;
        s$$0.onclose = bb;
        s$$0.onerror = function () {
            console.log("socket error");
        };
    }

    function K(a) {
        return new DataView(new ArrayBuffer(a));
    }

    function L(a) {
        s$$0.send(a.buffer);
    }

    function bb() {
        if(ta) {
            ea = 500;
        }
        console.log("socket close");
        setTimeout(Y, ea);
        ea *= 2;
    }

    function ab(a) {
        cb(new DataView(a.data));
    }

    function cb(a) {
        function b$$0() {
            var b = "";
            for(;;) {
                var d = a.getUint16(c, true);
                c += 2;
                if(0 == d) {
                    break;
                }
                b += String.fromCharCode(d);
            }
            return b;
        }
        var c = 0;
        if(240 == a.getUint8(c)) {
            c += 5;
        }
        switch(a.getUint8(c++)) {
            case 16:
                db(a, c);
                /*new*/onAfterUpdatePacket();
                break;
            case 17:
                R = a.getFloat32(c, true);
                c += 4;
                S = a.getFloat32(c, true);
                c += 4;
                T = a.getFloat32(c, true);
                c += 4;
                break;
            case 20:
                p = [];
                G = [];
                break;
            case 21:
                ua = a.getInt16(c, true);
                c += 2;
                va = a.getInt16(c, true);
                c += 2;
                if(!wa) {
                    wa = true;
                    fa = ua;
                    ga = va;
                }
                break;
            case 32:
                /*new*/onBeforeNewPointPacket();
                G.push(a.getUint32(c, true));
                c += 4;
                break;
            case 49:
                if(null != y) {
                    break;
                }
                var d$$0 = a.getUint32(c, true);
                c = c + 4;
                B = [];
                var e = 0;
                for(; e < d$$0; ++e) {
                    var l = a.getUint32(c, true);
                    c = c + 4;
                    B.push({
                        id: l,
                        name: b$$0()
                    });
                }
                Na();
                break;
            case 50:
                y = [];
                d$$0 = a.getUint32(c, true);
                c += 4;
                e = 0;
                for(; e < d$$0; ++e) {
                    y.push(a.getFloat32(c, true));
                    c += 4;
                }
                Na();
                break;
            case 64:
                ha = a.getFloat64(c, true);
                c += 8;
                ia = a.getFloat64(c, true);
                c += 8;
                ja = a.getFloat64(c, true);
                c += 8;
                ka = a.getFloat64(c, true);
                c += 8;
                R = (ja + ha) / 2;
                S = (ka + ia) / 2;
                T = 1;
                if(0 == p.length) {
                    t = R;
                    u = S;
                    k = T;
                };
        }
    }

    function db(a, b) {
        H = +new Date;
        ta = true;
        m("#connecting")
            .hide();
        var c = Math.random();
        xa = false;
        var d = a.getUint16(b, true);
        b += 2;
        var e = 0;
        for(; e < d; ++e) {
            var l = A[a.getUint32(b, true)];
            var h = A[a.getUint32(b + 4, true)];
            b += 8;
            if(l) {
                if(h) {
                    /*new*//*mikey*//*remap*/OnCellEaten(l,h);
                    // Remove from 10-sec-remembered cells list by id
                    _.remove(ghostBlobs, {id: h.id});

                    h.S();
                    h.p = h.x;
                    h.q = h.y;
                    h.o = h.size;
                    h.D = l.x;
                    h.F = l.y;
                    h.n = h.size;
                    h.L = H;
                }
            }
        }
        e = 0;
        for(;;) {
            d = a.getUint32(b, true);
            b += 4;
            if(0 == d) {
                break;
            }
            ++e;
            var f;
            l = a.getInt16(b, true);
            b += 2;
            h = a.getInt16(b, true);
            b += 2;
            f = a.getInt16(b, true);
            b += 2;
            var g = a.getUint8(b++);
            var k = a.getUint8(b++);
            var q = a.getUint8(b++);
            g = (g << 16 | k << 8 | q)
                .toString(16);
            for(; 6 > g.length;) {
                g = "0" + g;
            }
            g = "#" + g;
            k = a.getUint8(b++);
            q = !!(k & 1);
            var s = !!(k & 16);
            if(k & 2) {
                b += 4;
            }
            if(k & 4) {
                b += 8;
            }
            if(k & 8) {
                b += 16;
            }
            var r;
            var n = "";
            for(;;) {
                r = a.getUint16(b, true);
                b += 2;
                if(0 == r) {
                    break;
                }
                n += String.fromCharCode(r);
            }
            r = n;
            n = null;
            if(A.hasOwnProperty(d)) {
                n = A[d];
                n.K();
                n.p = n.x;
                n.q = n.y;
                n.o = n.size;
                n.color = g;
            } else {
                n = new Oa(d, l, h, f, g, r);
                v.push(n);
                A[d] = n;
                n.ka = l;
                n.la = h;
            }
            n.d = q;
            n.j = s;
            n.D = l;
            n.F = h;
            n.n = f;
            n.ja = c;
            n.L = H;
            n.W = k;
            if(r) {
                n.Z(r);
            }
            if(-1 != G.indexOf(d)) {
                if(-1 == p.indexOf(n)) {
                    document.getElementById("overlays")
                        .style.display = "none";
                    p.push(n);
                    if(1 == p.length) {
                        /*new*//*mikey*/OnGameStart(zeach.myPoints);
                        t = n.x;
                        u = n.y;
                    }
                }
            }
        }
        c = a.getUint32(b, true);
        b += 4;
        e = 0;
        for(; e < c; e++) {
            d = a.getUint32(b, true);
            b += 4;
            n = A[d];
            if(null != n) {
                n.S();
            }
        }
        if(xa) {
            if(0 == p.length) {
                Fa(false);
            }
        }
    }

    function N() {
        /*new*/if(isGrazing){ doGrazing(); return; }
        /*new*/if(suspendMouseUpdates){return;}
        var a;
        if(ya()) {
            a = V - q / 2;
            var b = W - r / 2;
            if(!(64 > a * a + b * b)) {
                if(!(0.01 > Math.abs(Pa - Z) && 0.01 > Math.abs(Qa - $))) {
                    Pa = Z;
                    Qa = $;
                    a = K(21);
                    a.setUint8(0, 16);
                    a.setFloat64(1, Z, true);
                    a.setFloat64(9, $, true);
                    a.setUint32(17, 0, true);
                    L(a);
                }
            }
        }
    }

    function Ma() {
        if(ya() && null != F) {
            var a = K(1 + 2 * F.length);
            a.setUint8(0, 0);
            var b = 0;
            for(; b < F.length; ++b) {
                a.setUint16(1 + 2 * b, F.charCodeAt(b), true);
            }
            L(a);
        }
    }

    function ya() {
        return null != s$$0 && s$$0.readyState == s$$0.OPEN;
    }

    function D(a) {
        if(ya()) {
            var b = K(1);
            b.setUint8(0, a);
            L(b);
        }
    }

    function Ha() {
        sa();
        g.requestAnimationFrame(Ha);
    }

    function Ga() {
        q = g.innerWidth;
        r = g.innerHeight;
        qa.width = C.width = q;
        qa.height = C.height = r;
        var a = m("#helloDialog");
        a.css("transform", "none");
        var b = a.height();
        var c = g.innerHeight;
        if(b > c / 1.1) {
            a.css("transform", "translate(-50%, -50%) scale(" + c / b / 1.1 + ")");
        } else {
            a.css("transform", "translate(-50%, -50%)");
        }
        sa();
    }

    function Ra() {
        var a;
        a = 1 * Math.max(r / 1080, q / 1920);
        return a *= E;
    }

    function eb() {
        if(0 != p.length) {
            var a = 0;
            var b = 0;
            for(; b < p.length; b++) {
                a += p[b].size;
            }
            a = Math.pow(Math.min(64 / a, 1), 0.4) * Ra();
            //k = (9 * k + a) / 10;
            /*new*//*remap*/k = (9 * k + a) / zoomFactor;
        }
    }

    function sa() {
        var a$$0;
        var b$$0 = Date.now();
        ++fb;
        H = b$$0;
        if(0 < p.length) {
            eb();
            var c = a$$0 = 0;
            var d = 0;
            for(; d < p.length; d++) {
                p[d].K();
                a$$0 += p[d].x / p.length;
                c += p[d].y / p.length;
            }
            R = a$$0;
            S = c;
            T = k;
            t = (t + a$$0) / 2;
            u = (u + c) / 2;
        } else {
            t = (29 * t + R) / 30;
            u = (29 * u + S) / 30;
            k = (9 * k + T * Ra()) / 10;
        }
        Xa();
        ra();
        if(!za) {
            f.clearRect(0, 0, q, r);
        }
        if(za) {
            f.fillStyle = la ? "#111111" : "#F2FBFF";
            f.globalAlpha = 0.05;
            f.fillRect(0, 0, q, r);
            f.globalAlpha = 1;
        } else {
            gb();
        }
        v.sort(function (a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size;
        });
        f.save();
        f.translate(q / 2, r / 2);
        f.scale(k, k);
        f.translate(-t, -u);
        d = 0;
        for(; d < I.length; d++) {
            I[d].T(f);
        }
        d = 0;
        for(; d < v.length; d++) {
            v[d].T(f);
        }
        /*new*/drawRescaledItems(zeach.ctx);
        if(wa) {
            fa = (3 * fa + ua) / 4;
            ga = (3 * ga + va) / 4;
            f.save();
            f.strokeStyle = "#FFAAAA";
            f.lineWidth = 10;
            f.lineCap = "round";
            f.lineJoin = "round";
            f.globalAlpha = 0.5;
            f.beginPath();
            d = 0;
            for(; d < p.length; d++) {
                f.moveTo(p[d].x, p[d].y);
                f.lineTo(fa, ga);
            }
            f.stroke();
            f.restore();
        }
        f.restore();
        if(x) {
            if(x.width) {
                f.drawImage(x, q - x.width - 10, 10);
            }
        }
        /*new*//*mikey*/OnDraw(zeach.ctx);
        J = Math.max(J, hb());
        /*new*//*remap*/ var extras = " " + getScoreBoardExtrasString(J);
        if(0 != J) {
            if(null == ma) {
                ma = new na(24, "#FFFFFF");
            }
            ma.u("Score: " + ~~(J / 100));
            /*new*/ /*remap*/ ma.setValue("Score: " + ~~(J / 100) + extras);
            c = ma.G();
            a$$0 = c.width;
            f.globalAlpha = 0.2;
            f.fillStyle = "#000000";
            f.fillRect(10, r - 10 - 24 - 10, a$$0 + 10, 34);
            f.globalAlpha = 1;
            f.drawImage(c, 15, r - 10 - 24 - 5);
            /*new*//*mikey*//*remap*/(zeach.myPoints&&zeach.myPoints[0]&&OnUpdateMass(hb()));
        }
        ib();
        b$$0 = Date.now() - b$$0;
        if(b$$0 > 1E3 / 60) {
            z -= 0.01;
        } else {
            if(b$$0 < 1E3 / 65) {
                z += 0.01;
            }
        }
        if(0.4 > z) {
            z = 0.4;
        }
        if(1 < z) {
            z = 1;
        }
        /*new*//*remap*/displayDebugText(zeach.ctx,zeach.textFunc); // second param is same as above 'new ??(24,  "#FFFFFF");'
    }

    function gb() {
        f.fillStyle = la ? "#111111" : "#F2FBFF";
        f.fillRect(0, 0, q, r);
        f.save();
        f.strokeStyle = la ? "#AAAAAA" : "#000000";
        f.globalAlpha = 0.2;
        f.scale(k, k);
        var a = q / k;
        var b = r / k;
        var c = -0.5 + (-t + a / 2) % 50;
        for(; c < a; c += 50) {
            f.beginPath();
            f.moveTo(c, 0);
            f.lineTo(c, b);
            f.stroke();
        }
        c = -0.5 + (-u + b / 2) % 50;
        for(; c < b; c += 50) {
            f.beginPath();
            f.moveTo(0, c);
            f.lineTo(a, c);
            f.stroke();
        }
        f.restore();
    }

    function ib() {
        if(Da && Aa.width) {
            var a = q / 5;
            f.drawImage(Aa, 5, 5, a, a);
        }
    }

    function hb() {
        var a = 0;
        var b = 0;
        for(; b < p.length; b++) {
            a += p[b].n * p[b].n;
        }
        return a;
    }

    function Na() {
        x = null;
        if(null != y || 0 != B.length) {
            if(null != y || oa) {
                x = document.createElement("canvas");
                var a = x.getContext("2d");
                var b = 60;
                b = null == y ? b + 24 * B.length : b + 180;
                var c = Math.min(200, 0.3 * q) / 200;
                x.width = 200 * c;
                x.height = b * c;
                a.scale(c, c);
                a.globalAlpha = 0.4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c)
                        .width / 2, 40);
                if(null == y) {
                    a.font = "20px Ubuntu";
                    b = 0;
                    for(; b < B.length; ++b) {
                        c = B[b].name || "An unnamed cell";
                        if(!oa) {
                            c = "An unnamed cell";
                        }
                        if(-1 != G.indexOf(B[b].id)) {
                            if(p[0].name) {
                                c = p[0].name;
                            }
                            a.fillStyle = "#FFAAAA";
                            /*new*//*mikey*/OnLeaderboard(b+1);
                        } else {
                            a.fillStyle = "#FFFFFF";
                        }
                        c = b + 1 + ". " + c;
                        a.fillText(c, 100 - a.measureText(c)
                                .width / 2, 70 + 24 * b);
                    }
                } else {
                    b = c = 0;
                    for(; b < y.length; ++b) {
                        var d = c + y[b] * Math.PI * 2;
                        a.fillStyle = jb[b + 1];
                        a.beginPath();
                        a.moveTo(100, 140);
                        a.arc(100, 140, 80, c, d, false);
                        a.fill();
                        c = d;
                    }
                }
            }
        }
    }

    function Oa(a, b, c, d, e, l) {
        this.id = a;
        this.p = this.x = b;
        this.q = this.y = c;
        this.o = this.size = d;
        this.color = e;
        this.a = [];
        this.l = [];
        this.R();
        this.Z(l);
        /*new*/this.splitTime = Date.now();
    }


    function na(a, b, c, d) {
        if(a) {
            this.r = a;
        }
        if(b) {
            this.N = b;
        }
        this.P = !!c;
        if(d) {
            this.s = d;
        }
    }
    var ba = g.location.protocol;
    var $a = "https:" == ba;
    if(g.location.ancestorOrigins && (g.location.ancestorOrigins.length && "https://apps.facebook.com" != g.location.ancestorOrigins[0])) {
        g.top.location = "http://agar.io/";
    } else {
        var qa;
        var f;
        var C;
        var q;
        var r;
        var O = null;
        var s$$0 = null;
        var t = 0;
        var u = 0;
        var G = [];
        var p = [];
        var A = {};
        var v = [];
        var I = [];
        var B = [];
        var V = 0;
        var W = 0;
        var Z = -1;
        var $ = -1;
        var fb = 0;
        var H = 0;
        var F = null;
        var ha = 0;
        var ia = 0;
        var ja = 1E4;
        var ka = 1E4;
        var k = 1;
        var w = null;
        var Sa = true;
        var oa = true;
        var Ba = false;
        var xa = false;
        var J = 0;
        var la = false;
        var Ta = false;
        var R = t = ~~((ha + ja) / 2);
        var S = u = ~~((ia + ka) / 2);
        var T = 1;
        var Q = "";
        var y = null;
        var pa = false;
        var wa = false;
        var ua = 0;
        var va = 0;
        var fa = 0;
        var ga = 0;
        var P = 0;
        var jb = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
        var za = false;
        var ta = false;
        var E = 1;
        var Da = "ontouchstart" in g && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var Aa = new Image;
        Aa.src = "img/split.png";
        var Ua = document.createElement("canvas");
        if("undefined" == typeof console || ("undefined" == typeof DataView || ("undefined" == typeof WebSocket || (null == Ua || (null == Ua.getContext || null == g.localStorage))))) {
            alert("You browser does not support this game, we recommend you to use Firefox to play this");
        } else {
            var aa = null;
            g.setNick = function (a) {
                Ja();
                F = a;
                Ma();
                J = 0;
                /*new*/GM_setValue("nick", a);
                /*new*/console.log("Storing '" + a + "' as nick");
            };
            g.setRegion = X;
            g.setSkins = function (a) {
                Sa = a;
            };
            g.setNames = function (a) {
                oa = a;
            };
            g.setDarkTheme = function (a) {
                la = a;
            };
            g.setColors = function (a) {
                Ba = a;
            };
            g.setShowMass = function (a) {
                Ta = a;
            };
            g.spectate = function () {
                F = null;
                D(1);
                Ja();
            };
            g.setGameMode = function (a) {
                if(a != Q) {
                    Q = a;
                    Y();
                }
            };
            g.setAcid = function (a) {
                za = a;
            };
            if(null != g.localStorage) {
                if(null == g.localStorage.AB9) {
                    g.localStorage.AB9 = 0 + ~~(100 * Math.random());
                }
                P = +g.localStorage.AB9;
                g.ABGroup = P;
            }
            m.get(ba + "//gc.agar.io", function (a) {
                var b = a.split(" ");
                a = b[0];
                b = b[1] || "";
                if(-1 == ["UA"].indexOf(a)) {
                    Va.push("ussr");
                }
                if(U.hasOwnProperty(a)) {
                    if("string" == typeof U[a]) {
                        if(!w) {
                            X(U[a]);
                        }
                    } else {
                        if(U[a].hasOwnProperty(b)) {
                            if(!w) {
                                X(U[a][b]);
                            }
                        }
                    }
                }
            }, "text");
            var ca = false;
            var da = 0;
            if(25 > P) {
                da = 10;
            } else {
                if(50 > P) {
                    da = 5;
                }
            }
            setTimeout(function () {
                ca = true;
            }, Math.max(6E4 * da, 1E4));
            var U = {
                AF: "JP-Tokyo",
                AX: "EU-London",
                AL: "EU-London",
                DZ: "EU-London",
                AS: "SG-Singapore",
                AD: "EU-London",
                AO: "EU-London",
                AI: "US-Atlanta",
                AG: "US-Atlanta",
                AR: "BR-Brazil",
                AM: "JP-Tokyo",
                AW: "US-Atlanta",
                AU: "SG-Singapore",
                AT: "EU-London",
                AZ: "JP-Tokyo",
                BS: "US-Atlanta",
                BH: "JP-Tokyo",
                BD: "JP-Tokyo",
                BB: "US-Atlanta",
                BY: "EU-London",
                BE: "EU-London",
                BZ: "US-Atlanta",
                BJ: "EU-London",
                BM: "US-Atlanta",
                BT: "JP-Tokyo",
                BO: "BR-Brazil",
                BQ: "US-Atlanta",
                BA: "EU-London",
                BW: "EU-London",
                BR: "BR-Brazil",
                IO: "JP-Tokyo",
                VG: "US-Atlanta",
                BN: "JP-Tokyo",
                BG: "EU-London",
                BF: "EU-London",
                BI: "EU-London",
                KH: "JP-Tokyo",
                CM: "EU-London",
                CA: "US-Atlanta",
                CV: "EU-London",
                KY: "US-Atlanta",
                CF: "EU-London",
                TD: "EU-London",
                CL: "BR-Brazil",
                CN: "CN-China",
                CX: "JP-Tokyo",
                CC: "JP-Tokyo",
                CO: "BR-Brazil",
                KM: "EU-London",
                CD: "EU-London",
                CG: "EU-London",
                CK: "SG-Singapore",
                CR: "US-Atlanta",
                CI: "EU-London",
                HR: "EU-London",
                CU: "US-Atlanta",
                CW: "US-Atlanta",
                CY: "JP-Tokyo",
                CZ: "EU-London",
                DK: "EU-London",
                DJ: "EU-London",
                DM: "US-Atlanta",
                DO: "US-Atlanta",
                EC: "BR-Brazil",
                EG: "EU-London",
                SV: "US-Atlanta",
                GQ: "EU-London",
                ER: "EU-London",
                EE: "EU-London",
                ET: "EU-London",
                FO: "EU-London",
                FK: "BR-Brazil",
                FJ: "SG-Singapore",
                FI: "EU-London",
                FR: "EU-London",
                GF: "BR-Brazil",
                PF: "SG-Singapore",
                GA: "EU-London",
                GM: "EU-London",
                GE: "JP-Tokyo",
                DE: "EU-London",
                GH: "EU-London",
                GI: "EU-London",
                GR: "EU-London",
                GL: "US-Atlanta",
                GD: "US-Atlanta",
                GP: "US-Atlanta",
                GU: "SG-Singapore",
                GT: "US-Atlanta",
                GG: "EU-London",
                GN: "EU-London",
                GW: "EU-London",
                GY: "BR-Brazil",
                HT: "US-Atlanta",
                VA: "EU-London",
                HN: "US-Atlanta",
                HK: "JP-Tokyo",
                HU: "EU-London",
                IS: "EU-London",
                IN: "JP-Tokyo",
                ID: "JP-Tokyo",
                IR: "JP-Tokyo",
                IQ: "JP-Tokyo",
                IE: "EU-London",
                IM: "EU-London",
                IL: "JP-Tokyo",
                IT: "EU-London",
                JM: "US-Atlanta",
                JP: "JP-Tokyo",
                JE: "EU-London",
                JO: "JP-Tokyo",
                KZ: "JP-Tokyo",
                KE: "EU-London",
                KI: "SG-Singapore",
                KP: "JP-Tokyo",
                KR: "JP-Tokyo",
                KW: "JP-Tokyo",
                KG: "JP-Tokyo",
                LA: "JP-Tokyo",
                LV: "EU-London",
                LB: "JP-Tokyo",
                LS: "EU-London",
                LR: "EU-London",
                LY: "EU-London",
                LI: "EU-London",
                LT: "EU-London",
                LU: "EU-London",
                MO: "JP-Tokyo",
                MK: "EU-London",
                MG: "EU-London",
                MW: "EU-London",
                MY: "JP-Tokyo",
                MV: "JP-Tokyo",
                ML: "EU-London",
                MT: "EU-London",
                MH: "SG-Singapore",
                MQ: "US-Atlanta",
                MR: "EU-London",
                MU: "EU-London",
                YT: "EU-London",
                MX: "US-Atlanta",
                FM: "SG-Singapore",
                MD: "EU-London",
                MC: "EU-London",
                MN: "JP-Tokyo",
                ME: "EU-London",
                MS: "US-Atlanta",
                MA: "EU-London",
                MZ: "EU-London",
                MM: "JP-Tokyo",
                NA: "EU-London",
                NR: "SG-Singapore",
                NP: "JP-Tokyo",
                NL: "EU-London",
                NC: "SG-Singapore",
                NZ: "SG-Singapore",
                NI: "US-Atlanta",
                NE: "EU-London",
                NG: "EU-London",
                NU: "SG-Singapore",
                NF: "SG-Singapore",
                MP: "SG-Singapore",
                NO: "EU-London",
                OM: "JP-Tokyo",
                PK: "JP-Tokyo",
                PW: "SG-Singapore",
                PS: "JP-Tokyo",
                PA: "US-Atlanta",
                PG: "SG-Singapore",
                PY: "BR-Brazil",
                PE: "BR-Brazil",
                PH: "JP-Tokyo",
                PN: "SG-Singapore",
                PL: "EU-London",
                PT: "EU-London",
                PR: "US-Atlanta",
                QA: "JP-Tokyo",
                RE: "EU-London",
                RO: "EU-London",
                RU: "RU-Russia",
                RW: "EU-London",
                BL: "US-Atlanta",
                SH: "EU-London",
                KN: "US-Atlanta",
                LC: "US-Atlanta",
                MF: "US-Atlanta",
                PM: "US-Atlanta",
                VC: "US-Atlanta",
                WS: "SG-Singapore",
                SM: "EU-London",
                ST: "EU-London",
                SA: "EU-London",
                SN: "EU-London",
                RS: "EU-London",
                SC: "EU-London",
                SL: "EU-London",
                SG: "JP-Tokyo",
                SX: "US-Atlanta",
                SK: "EU-London",
                SI: "EU-London",
                SB: "SG-Singapore",
                SO: "EU-London",
                ZA: "EU-London",
                SS: "EU-London",
                ES: "EU-London",
                LK: "JP-Tokyo",
                SD: "EU-London",
                SR: "BR-Brazil",
                SJ: "EU-London",
                SZ: "EU-London",
                SE: "EU-London",
                CH: "EU-London",
                SY: "EU-London",
                TW: "JP-Tokyo",
                TJ: "JP-Tokyo",
                TZ: "EU-London",
                TH: "JP-Tokyo",
                TL: "JP-Tokyo",
                TG: "EU-London",
                TK: "SG-Singapore",
                TO: "SG-Singapore",
                TT: "US-Atlanta",
                TN: "EU-London",
                TR: "TK-Turkey",
                TM: "JP-Tokyo",
                TC: "US-Atlanta",
                TV: "SG-Singapore",
                UG: "EU-London",
                UA: "EU-London",
                AE: "EU-London",
                GB: "EU-London",
                US: {
                    AL: "US-Atlanta",
                    AK: "US-Fremont",
                    AZ: "US-Fremont",
                    AR: "US-Atlanta",
                    CA: "US-Fremont",
                    CO: "US-Fremont",
                    CT: "US-Atlanta",
                    DE: "US-Atlanta",
                    FL: "US-Atlanta",
                    GA: "US-Atlanta",
                    HI: "US-Fremont",
                    ID: "US-Fremont",
                    IL: "US-Atlanta",
                    IN: "US-Atlanta",
                    IA: "US-Atlanta",
                    KS: "US-Atlanta",
                    KY: "US-Atlanta",
                    LA: "US-Atlanta",
                    ME: "US-Atlanta",
                    MD: "US-Atlanta",
                    MA: "US-Atlanta",
                    MI: "US-Atlanta",
                    MN: "US-Fremont",
                    MS: "US-Atlanta",
                    MO: "US-Atlanta",
                    MT: "US-Fremont",
                    NE: "US-Fremont",
                    NV: "US-Fremont",
                    NH: "US-Atlanta",
                    NJ: "US-Atlanta",
                    NM: "US-Fremont",
                    NY: "US-Atlanta",
                    NC: "US-Atlanta",
                    ND: "US-Fremont",
                    OH: "US-Atlanta",
                    OK: "US-Atlanta",
                    OR: "US-Fremont",
                    PA: "US-Atlanta",
                    RI: "US-Atlanta",
                    SC: "US-Atlanta",
                    SD: "US-Fremont",
                    TN: "US-Atlanta",
                    TX: "US-Atlanta",
                    UT: "US-Fremont",
                    VT: "US-Atlanta",
                    VA: "US-Atlanta",
                    WA: "US-Fremont",
                    WV: "US-Atlanta",
                    WI: "US-Atlanta",
                    WY: "US-Fremont",
                    DC: "US-Atlanta",
                    AS: "US-Atlanta",
                    GU: "US-Atlanta",
                    MP: "US-Atlanta",
                    PR: "US-Atlanta",
                    UM: "US-Atlanta",
                    VI: "US-Atlanta"
                },
                UM: "SG-Singapore",
                VI: "US-Atlanta",
                UY: "BR-Brazil",
                UZ: "JP-Tokyo",
                VU: "SG-Singapore",
                VE: "BR-Brazil",
                VN: "JP-Tokyo",
                WF: "SG-Singapore",
                EH: "EU-London",
                YE: "JP-Tokyo",
                ZM: "EU-London",
                ZW: "EU-London"
            };
            g.connect = La;
            var ea = 500;
            var Pa = -1;
            var Qa = -1;
            var x = null;
            var z = 1;
            var ma = null;
            var M = {};
            var Va = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook".split(";");
            var kb = ["8", "nasa"];
            var lb = ["m'blob"];
            Oa.prototype = {
                id: 0,
                a: null,
                l: null,
                name: null,
                k: null,
                J: null,
                x: 0,
                y: 0,
                size: 0,
                p: 0,
                q: 0,
                o: 0,
                D: 0,
                F: 0,
                n: 0,
                W: 0,
                L: 0,
                ja: 0,
                ba: 0,
                A: false,
                d: false,
                j: false,
                M: true,
                S: function () {
                    var a;
                    a = 0;
                    for(; a < v.length; a++) {
                        if(v[a] == this) {
                            v.splice(a, 1);
                            break;
                        }
                    }
                    delete A[this.id];
                    a = p.indexOf(this);
                    if(-1 != a) {
                        xa = true;
                        p.splice(a, 1);
                    }
                    a = G.indexOf(this.id);
                    if(-1 != a) {
                        G.splice(a, 1);
                    }
                    this.A = true;
                    I.push(this);
                },
                h: function () {
                    return Math.max(~~(0.3 * this.size), 24);
                },
                Z: function (a) {
                    if(this.name = a) {
                        if(null == this.k) {
                            this.k = new na(this.h(), "#FFFFFF", true, "#000000");
                        } else {
                            this.k.H(this.h());
                        }
                        this.k.u(this.name);
                    }
                },
                R: function () {
                    var a = this.C();
                    for(; this.a.length > a;) {
                        var b = ~~(Math.random() * this.a.length);
                        this.a.splice(b, 1);
                        this.l.splice(b, 1);
                    }
                    if(0 == this.a.length) {
                        if(0 < a) {
                            this.a.push({
                                Q: this,
                                e: this.size,
                                x: this.x,
                                y: this.y
                            });
                            this.l.push(Math.random() - 0.5);
                        }
                    }
                    for(; this.a.length < a;) {
                        b = ~~(Math.random() * this.a.length);
                        var c = this.a[b];
                        this.a.splice(b, 0, {
                            Q: this,
                            e: c.e,
                            x: c.x,
                            y: c.y
                        });
                        this.l.splice(b, 0, this.l[b]);
                    }
                },
                C: function () {
                    if(0 == this.id) {
                        return 16;
                    }
                    var a = 10;
                    if(20 > this.size) {
                        a = 0;
                    }
                    if(this.d) {
                        a = 30;
                    }
                    var b = this.size;
                    if(!this.d) {
                        b *= k;
                    }
                    b *= z;
                    if(this.W & 32) {
                        b *= 0.25;
                    }
                    return ~~Math.max(b, a);
                },
                ha: function () {
                    this.R();
                    var a$$0 = this.a;
                    var b = this.l;
                    var c = a$$0.length;
                    var d = 0;
                    for(; d < c; ++d) {
                        var e = b[(d - 1 + c) % c];
                        var l = b[(d + 1) % c];
                        b[d] += (Math.random() - 0.5) * (this.j ? 3 : 1);
                        b[d] *= 0.7;
                        if(10 < b[d]) {
                            b[d] = 10;
                        }
                        if(-10 > b[d]) {
                            b[d] = -10;
                        }
                        b[d] = (e + l + 8 * b[d]) / 10;
                    }
                    var h = this;
                    var g = this.d ? 0 : (this.id / 1E3 + H / 1E4) % (2 * Math.PI);
                    d = 0;
                    for(; d < c; ++d) {
                        var f = a$$0[d].e;
                        e = a$$0[(d - 1 + c) % c].e;
                        l = a$$0[(d + 1) % c].e;
                        if(15 < this.size && (null != O && (20 < this.size * k && 0 != this.id))) {
                            var m = false;
                            var p = a$$0[d].x;
                            var q = a$$0[d].y;
                            O.ia(p - 5, q - 5, 10, 10, function (a) {
                                if(a.Q != h) {
                                    if(25 > (p - a.x) * (p - a.x) + (q - a.y) * (q - a.y)) {
                                        m = true;
                                    }
                                }
                            });
                            if(!m) {
                                if(a$$0[d].x < ha || (a$$0[d].y < ia || (a$$0[d].x > ja || a$$0[d].y > ka))) {
                                    m = true;
                                }
                            }
                            if(m) {
                                if(0 < b[d]) {
                                    b[d] = 0;
                                }
                                b[d] -= 1;
                            }
                        }
                        f += b[d];
                        if(0 > f) {
                            f = 0;
                        }
                        f = this.j ? (19 * f + this.size) / 20 : (12 * f + this.size) / 13;
                        a$$0[d].e = (e + l + 8 * f) / 10;
                        e = 2 * Math.PI / c;
                        l = this.a[d].e;
                        if(this.d) {
                            if(0 == d % 2) {
                                l += 5;
                            }
                        }
                        a$$0[d].x = this.x + Math.cos(e * d + g) * l;
                        a$$0[d].y = this.y + Math.sin(e * d + g) * l;
                    }
                },
                K: function () {
                    if(0 == this.id) {
                        return 1;
                    }
                    var a;
                    a = (H - this.L) / 120;
                    a = 0 > a ? 0 : 1 < a ? 1 : a;
                    var b = 0 > a ? 0 : 1 < a ? 1 : a;
                    this.h();
                    if(this.A && 1 <= b) {
                        var c = I.indexOf(this);
                        if(-1 != c) {
                            I.splice(c, 1);
                        }
                    }
                    this.x = a * (this.D - this.p) + this.p;
                    this.y = a * (this.F - this.q) + this.q;
                    this.size = b * (this.n - this.o) + this.o;
                    return b;
                },
                I: function () {
                    return 0 == this.id ? true : this.x + this.size + 40 < t - q / 2 / k || (this.y + this.size + 40 < u - r / 2 / k || (this.x - this.size - 40 > t + q / 2 / k || this.y - this.size - 40 > u + r / 2 / k)) ? false : true;
                },
                T: function (a) {
                    if(this.I()) {
                        var b = 0 != this.id && (!this.d && (!this.j && 0.4 > k));
                        if(5 > this.C()) {
                            b = true;
                        }
                        if(this.M && !b) {
                            var c = 0;
                            for(; c < this.a.length; c++) {
                                this.a[c].e = this.size;
                            }
                        }
                        this.M = b;
                        a.save();
                        this.ba = H;
                        c = this.K();
                        if(this.A) {
                            a.globalAlpha *= 1 - c;
                        }
                        a.lineWidth = 10;
                        a.lineCap = "round";
                        a.lineJoin = this.d ? "miter" : "round";
                        if(Ba) {
                            a.fillStyle = "#FFFFFF";
                            a.strokeStyle = "#AAAAAA";
                        } else {
                            a.fillStyle = this.color;
                            a.strokeStyle = this.color;
                        }
                        /*new*/drawCellInfos.call(this, zeach.isColors, zeach.ctx);
                        if(b) {
                            a.beginPath();
                            a.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI, false);
                        } else {
                            this.ha();
                            a.beginPath();
                            var d = this.C();
                            a.moveTo(this.a[0].x, this.a[0].y);
                            c = 1;
                            for(; c <= d; ++c) {
                                var e = c % d;
                                a.lineTo(this.a[e].x, this.a[e].y);
                            }
                        }
                        a.closePath();
                        d = this.name.toLowerCase();
                        //if(!this.j && (Sa && ":teams" != Q)) {
                        //    if(-1 != Va.indexOf(d)) {
                        //        if(!M.hasOwnProperty(d)) {
                        //            M[d] = new Image;
                        //            M[d].src = "skins/" + d + ".png";
                        //        }
                        //        c = 0 != M[d].width && M[d].complete ? M[d] : null;
                        //    } else {
                        //        c = null;
                        //    }
                        //} else {
                        //    c = null;
                        //}
                        /*new*/var c = customSkins(this, zeach.defaultSkins, zeach.imgCache, zeach.isShowSkins, zeach.gameMode);
                        c = (e = c) ? -1 != lb.indexOf(d) : false;

                        ///*new*/if(isLiteBrite) {a.lineWidth = ~~(10/k); }
                            //if (!b) {
                                a.stroke();
                            //}
                        /*new*/if(!isLiteBrite)
                            a.fill();


                        /*new*/zeach.ctx.globalAlpha = (isSpecialSkin(this.name.toLowerCase()) || _.contains(zeach.myIDs, this.id)|| isBitDoSkin(this.name.toLowerCase()) ) ? 1 : 0.5;
                        if(!(null == e)) {
                            if(!c) {
                                a.save();
                                a.clip();
                                a.drawImage(e, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                                a.restore();
                            }
                        }
                        if(Ba || 15 < this.size) {
                            if(!b) {
                                a.strokeStyle = "#000000";
                                a.globalAlpha *= 0.1;
                                a.stroke();
                            }
                        }
                        a.globalAlpha = 1;
                        if(null != e) {
                            if(c) {
                                a.drawImage(e, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                            }
                        }
                        c = -1 != p.indexOf(this);
                        if(0 != this.id) {
                            //b = ~~this.y;
                            //if((oa || c) && (this.name && (this.k && (null == e || -1 == kb.indexOf(d))))) {
                            //    e = this.k;
                            //    e.u(this.name);
                            //    e.H(this.h());
                            //    d = Math.ceil(10 * k) / 10;
                            //    e.$(d);
                            //    e = e.G();
                            //    var l = ~~(e.width / d);
                            //    var h = ~~(e.height / d);
                            //    a.drawImage(e, ~~this.x - ~~(l / 2), b - ~~(h / 2), l, h);
                            //    b += e.height / 2 / d + 4;
                            //}
                            /*new*//*remap*/b = drawCellName.call(this,c,d,e);

                            //if(Ta) {
                            //    if(c || 0 == p.length && ((!this.d || this.j) && 20 < this.size)) {
                            //        if(null == this.J) {
                            //            this.J = new na(this.h() / 2, "#FFFFFF", true, "#000000");
                            //        }
                            //        c = this.J;
                            //        c.H(this.h() / 2);
                            //        c.u(~~(this.size * this.size / 100));
                            //        d = Math.ceil(10 * k) / 10;
                            //        c.$(d);
                            //        e = c.G();
                            //        l = ~~(e.width / d);
                            //        h = ~~(e.height / d);
                            //        a.drawImage(e, ~~this.x - ~~(l / 2), b - ~~(h / 2), l, h);
                            //    }
                            //}
                            /*new*//*remap*/ drawCellMass.call(this,b,c);

                        }
                        a.restore();
                    }
                }
            };
            /*new*//*remap*/restorePointObj(Oa.prototype);
            na.prototype = {
                w: "",
                N: "#000000",
                P: false,
                s: "#000000",
                r: 16,
                m: null,
                O: null,
                g: false,
                v: 1,
                H: function (a) {
                    if(this.r != a) {
                        this.r = a;
                        this.g = true;
                    }
                },
                $: function (a) {
                    if(this.v != a) {
                        this.v = a;
                        this.g = true;
                    }
                },
                setStrokeColor: function (a) {
                    if(this.s != a) {
                        this.s = a;
                        this.g = true;
                    }
                },
                u: function (a) {
                    if(a != this.w) {
                        this.w = a;
                        this.g = true;
                    }
                },
                G: function () {
                    if(null == this.m) {
                        this.m = document.createElement("canvas");
                        this.O = this.m.getContext("2d");
                    }
                    if(this.g) {
                        this.g = false;
                        var a = this.m;
                        var b = this.O;
                        var c = this.w;
                        var d = this.v;
                        var e = this.r;
                        var l = e + "px Ubuntu";
                        b.font = l;
                        var h = ~~(0.2 * e);
                        a.width = (b.measureText(c)
                                .width + 6) * d;
                        a.height = (e + h) * d;
                        b.font = l;
                        b.scale(d, d);
                        b.globalAlpha = 1;
                        b.lineWidth = 3;
                        b.strokeStyle = this.s;
                        b.fillStyle = this.N;
                        if(this.P) {
                            b.strokeText(c, 3, e - h / 2);
                        }
                        b.fillText(c, 3, e - h / 2);
                    }
                    return this.m;
                }
            };
            /*new*//*remap*/restoreCanvasElementObj(na.prototype);

            if(!Date.now) {
                Date.now = function () {
                    return(new Date)
                        .getTime();
                };
            }
            var Ya = {
                ca: function (a$$0) {
                    function b$$1(a, b, c, d, e) {
                        this.x = a;
                        this.y = b;
                        this.f = c;
                        this.c = d;
                        this.depth = e;
                        this.items = [];
                        this.b = [];
                    }
                    var c$$1 = a$$0.da || 2;
                    var d$$0 = a$$0.ea || 4;
                    b$$1.prototype = {
                        x: 0,
                        y: 0,
                        f: 0,
                        c: 0,
                        depth: 0,
                        items: null,
                        b: null,
                        B: function (a) {
                            var b$$0 = 0;
                            for(; b$$0 < this.items.length; ++b$$0) {
                                var c = this.items[b$$0];
                                if(c.x >= a.x && (c.y >= a.y && (c.x < a.x + a.f && c.y < a.y + a.c))) {
                                    return true;
                                }
                            }
                            if(0 != this.b.length) {
                                var d = this;
                                return this.V(a, function (b) {
                                    return d.b[b].B(a);
                                });
                            }
                            return false;
                        },
                        t: function (a, b) {
                            var c$$0 = 0;
                            for(; c$$0 < this.items.length; ++c$$0) {
                                b(this.items[c$$0]);
                            }
                            if(0 != this.b.length) {
                                var d = this;
                                this.V(a, function (c) {
                                    d.b[c].t(a, b);
                                });
                            }
                        },
                        i: function (a) {
                            if(0 != this.b.length) {
                                this.b[this.U(a)].i(a);
                            } else {
                                if(this.items.length >= c$$1 && this.depth < d$$0) {
                                    this.aa();
                                    this.b[this.U(a)].i(a);
                                } else {
                                    this.items.push(a);
                                }
                            }
                        },
                        U: function (a) {
                            return a.x < this.x + this.f / 2 ? a.y < this.y + this.c / 2 ? 0 : 2 : a.y < this.y + this.c / 2 ? 1 : 3;
                        },
                        V: function (a, b) {
                            return a.x < this.x + this.f / 2 && (a.y < this.y + this.c / 2 && b(0) || a.y >= this.y + this.c / 2 && b(2)) || a.x >= this.x + this.f / 2 && (a.y < this.y + this.c / 2 && b(1) || a.y >= this.y + this.c / 2 && b(3)) ? true : false;
                        },
                        aa: function () {
                            var a = this.depth + 1;
                            var c = this.f / 2;
                            var d = this.c / 2;
                            this.b.push(new b$$1(this.x, this.y, c, d, a));
                            this.b.push(new b$$1(this.x + c, this.y, c, d, a));
                            this.b.push(new b$$1(this.x, this.y + d, c, d, a));
                            this.b.push(new b$$1(this.x + c, this.y + d, c, d, a));
                            a = this.items;
                            this.items = [];
                            c = 0;
                            for(; c < a.length; c++) {
                                this.i(a[c]);
                            }
                        },
                        clear: function () {
                            var a = 0;
                            for(; a < this.b.length; a++) {
                                this.b[a].clear();
                            }
                            this.items.length = 0;
                            this.b.length = 0;
                        }
                    };
                    var e$$0 = {
                        x: 0,
                        y: 0,
                        f: 0,
                        c: 0
                    };
                    return {
                        root: new b$$1(a$$0.X, a$$0.Y, a$$0.fa - a$$0.X, a$$0.ga - a$$0.Y, 0),
                        i: function (a) {
                            this.root.i(a);
                        },
                        t: function (a, b) {
                            this.root.t(a, b);
                        },
                        ia: function (a, b, c, d, f) {
                            e$$0.x = a;
                            e$$0.y = b;
                            e$$0.f = c;
                            e$$0.c = d;
                            this.root.t(e$$0, f);
                        },
                        B: function (a) {
                            return this.root.B(a);
                        },
                        clear: function () {
                            this.root.clear();
                        }
                    };
                }
            };
            g.onload = Wa;
        }
    }
})(unsafeWindow, unsafeWindow.jQuery)


// ====================================== Stats Screen ===========================================================

var __STORAGE_PREFIX = "mikeyk730__";
var chart_update_interval = 10;
jQuery('body').append('<div id="chart-container" style="display:none; position:absolute; height:176px; width:300px; left:10px; bottom:44px"></div>');
var checkbox_div = jQuery('#settings input[type=checkbox]').closest('div');

jQuery("#helloDialog").css('left','230px');
jQuery('#overlays').append('<div id="stats" style="position: absolute; top:50%; left: 450px; width: 750px; height:673px; background-color: #FFFFFF; ' +
    'border-radius: 15px; padding: 5px 15px 5px 15px; transform: translate(0,-50%)">'+
    '<ul class="nav nav-pills" role="tablist">' +
        '<li role="presentation" class="active" > <a href="#page0" id="newsTab"   role="tab" data-toggle="tab">News</a></li>' +
        '<li role="presentation">                 <a href="#page1" id="statsTab"  role="tab" data-toggle="tab">Stats</a></li>' +
        '<li role="presentation">                 <a href="#page2" id="configTab" role="tab" data-toggle="tab">Extended Options</a></li>' +
        //'<li role="presentation"><a href="#page3" role="tab" data-toggle="tab">IP Connect</a></li>' +
    '</ul>'+

    '<div id="bigbox" class="tab-content">' +
        '<div id="page0" role="tabpanel" class="tab-pane active">'+ debugMonkeyReleaseMessage +'</div>' +

        '<div id="page1" role="tabpanel" class="tab-pane">' +
            '<div id="statArea" style="vertical-align:top; width:350px; display:inline-block;"></div>' +
            '<div id="pieArea" style="vertical-align: top; width:350px; height:250px; display:inline-block; vertical-align:top"></div>' +
            '<div id="gainArea" style="width:350px; display:inline-block; vertical-align:top"></div><div id="lossArea" style="width:350px; display:inline-block;"></div>' +
            '<div id="chartArea" style="width:700px; height:200px; display:inline-block; vertical-align:top"></div></div>' +
        '<div id="page2" role="tabpanel" class="tab-pane">' +
            '<div class="row">' +
                '<div class="col-sm-1"></div><div id="col1" class="col-sm-3"><h3>Options</h3></div>' +
                '<div class="col-sm-1"></div><div id="col2" class="col-sm-3"></div>' +
                '<div class="col-sm-1"></div><div id="col3" class="col-sm-3"></div>' +
            '</div>' +
        '</div>'+
        //'<div id="page3" role="tabpanel" class="tab-pane"><h3>gcommer IP connect</h3></div>' +
    '</div>' +
    '</div>');
//jQuery('#stats').hide(0);
//jQuery('#page1').hide(0);
////Existing:

//var setAutoRespawn = function (state) {
//    cobbler.autoRespawn = state;
//}
//var setvisualGrazer = function (state){
//    cobbler.visualizeGrazer = state;
//}
//var setMinimap =function (state){
//    cobbler.displayMiniMap = jQuery("#minimap").show(state);
//}
//var setClickToShoot = function (state){
//    cobbler.rightClickFires = state;
//}
//function populateOptions(){
//
//
//    AppendCheckboxBR(page2, 'option1', ' Acid Mode', cobbler.isAcid, setAcid);
//    AppendCheckboxBR(page2, 'option2', ' Auto-respawn', cobbler.autoRespawn, setAcid);
//    AppendCheckboxBR(page2, 'option3', ' Visualize Grazer', cobbler.visualizeGrazer, setAcid);
//    AppendCheckboxBR(page2, 'option4', ' Display MiniMap', cobbler.displayMiniMap, setAcid);
//    AppendCheckboxBR(page2, 'option5', ' Click-to-Shoot', cobbler.rightClickFires, setAcid);
//    //AppendCheckboxBR(page2, 'option4', 'Acid Mode', false, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option7', 'Skins: Agariomods.com', true, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option8', 'Skins: Bit.do', true, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option9', 'Skins: Default', true, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option10', 'Skins: Imgur', true, OnChangeDisplayChart);
//
//    ////Soon Hopefully
//    //AppendCheckboxBR(page2, 'option6', 'Pirates v Ninja V Robot Teams', false, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option3', 'Pacifist Grazer', false, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option5', 'Lite-Brite Mode', false, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option17', 'Enable background Gcommer participation', true, OnChangeDisplayChart);
//    //EventuallyMaybe
//    //AppendCheckboxBR(page2, 'option11', 'Use Apostolique Bot instead of Grazer', false, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option12', 'Enable Viral Retaliationn', true, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option13', 'Enable Enemy Tagging', true, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option14', 'Enable Auto-suicide', true, OnChangeDisplayChart);
//    //AppendCheckboxBR(page2, 'option15', 'Enable QuickMerge', false, OnChangeDisplayChart);
//
//}

function LS_getValue(aKey, aDefault) {
    var val = localStorage.getItem(__STORAGE_PREFIX + aKey);
    if (null === val && 'undefined' != typeof aDefault) return aDefault;
    return val;
}

function LS_setValue(aKey, aVal) {
    localStorage.setItem(__STORAGE_PREFIX + aKey, aVal);
}

function GetRgba(hex_color, opacity)
{
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hex_color);
    return "rgba("+parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16)+","+opacity+")";
}

function secondsToHms(d)
{
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

var chart = null;
var chart_data = [];
var num_cells_data = [];
var chart_counter = 0;
var stat_canvas = null;

var stats = null;
var my_cells = null;
var my_color = "#ff8888";
var pie = null;
var stats_chart;

var display_chart = LS_getValue('display_chart', 'true') === 'true';
var display_stats = LS_getValue('display_stats', 'false') === 'true';

function AppendCheckbox(e, id, label, checked, on_change)
{
    e.append('<label><input type="checkbox" id="'+id+'">'+label+'</label>');
    jQuery('#'+id).attr('checked', checked);
    jQuery('#'+id).change(function(){
        on_change(!!this.checked);
    });
    on_change(checked);
}
function AppendCheckboxP(e, id, label, checked, on_change)
{
    e.append('<p><input type="checkbox" id="'+id+'">'+label+'</p>');
    jQuery('#'+id).attr('checked', checked);
    jQuery('#'+id).change(function(){
        on_change(!!this.checked);
    });
    on_change(checked);
}

function OnChangeDisplayChart(display)
{
    LS_setValue('display_chart', display ? 'true' : 'false');
    display_chart = display;
    display ? jQuery('#chart-container').show() : jQuery('#chart-container').hide();
}

function OnChangeDisplayStats(display)
{
    LS_setValue('display_stats', display ? 'true' : 'false');
    display_stats = display;
    RenderStats(false);
}

function ResetChart()
{
    chart = null;
    chart_data.length = 0;
    num_cells_data.length = 0;
    chart_counter = 0;
    jQuery('#chart-container').empty();
}

function UpdateChartData(mass)
{
    chart_counter++;
    if (chart_counter%chart_update_interval > 0)
        return false;

    num_cells_data.push({
        x: chart_counter,
        y: my_cells.length
    });

    chart_data.push({
        x: chart_counter,
        y: mass/100
    });
    return true;
}

function CreateChart(e, color, interactive)
{
    return new CanvasJS.Chart(e,{
        interactivityEnabled: false,
        title: null,
        axisX:{
            valueFormatString: " ",
            lineThickness: 0,
            tickLength: 0
        },
        axisY:{
            lineThickness: 0,
            tickLength: 0,
            gridThickness: 2,
            gridColor: "white",
            labelFontColor: "white"
        },
        backgroundColor: "rgba(0,0,0,0.2)",
        data: [{
            type: "area",
            color: color,
            dataPoints: chart_data
        }]
    });
}

function UpdateChart(mass, color)
{
    my_color = color;
    if (chart === null)
        chart = CreateChart("chart-container", color, false);
    if (UpdateChartData(mass) && display_chart)
        chart.render();

    jQuery('.canvasjs-chart-credit').hide();
}

function ResetStats()
{
    stats = {
        pellets: {num:0, mass:0},
        w: {num:0, mass:0},
        cells: {num:0, mass:0},
        viruses: {num:0, mass:0},

        birthday: Date.now(),
        time_of_death: null,
        high_score: 0,
        top_slot: Number.POSITIVE_INFINITY,

        gains: {},
        losses: {},
    };
}

function OnGainMass(me, other)
{
    var mass = other.size * other.size;
    if (other.d){
        stats.viruses.num++;
        stats.viruses.mass += mass; //TODO: shouldn't add if  game mode is teams
        sfx_event("virushit");
    }
    else if (Math.floor(mass) <= 400 && !other.name){
        stats.pellets.num++;
        stats.pellets.mass += mass;
        sfx_event("pellet");
    }
    // heuristic to determine if mass is 'w', not perfect
    else if (!other.name && mass <= 1444 && (mass >= 1369 || (other.x == other.ox && other.y == other.oy))){
        //console.log('w', mass, other.name, other);
        if (other.color != me.color){ //don't count own ejections, again not perfect
            stats.w.num++;
            stats.w.mass += mass;
        }
        sfx_event("eat");
    }
    else {
        //console.log('cell', mass, other.name, other);
        var key = other.name + ':' + other.color;
        stats.cells.num++;
        stats.cells.mass += mass;
        if (stats.gains[key] == undefined)
            stats.gains[key] = {num: 0, mass: 0};
        stats.gains[key].num++;
        stats.gains[key].mass += mass;
        sfx_event("eat");
    }
}

function OnLoseMass(me, other)
{
    var mass = me.size * me.size;
    var key = other.name + ':' + other.color;
    if (stats.losses[key] == undefined)
        stats.losses[key] = {num: 0, mass: 0};
    stats.losses[key].num++;
    stats.losses[key].mass += mass;
    sfx_event("eat");
}

function DrawPie(pellet, w, cells, viruses)
{
    var total = pellet + w + cells + viruses;
    pie = new CanvasJS.Chart("pieArea", {
        title: null,
        animationEnabled: false,
        legend:{
            verticalAlign: "center",
            horizontalAlign: "left",
            fontSize: 20,
            fontFamily: "Helvetica"
        },
        theme: "theme2",
        data: [{
            type: "pie",
            startAngle:-20,
            showInLegend: true,
            toolTipContent:"{legendText} {y}%",
            dataPoints: [
                {  y: 100*pellet/total, legendText:"pellets"},
                {  y: 100*cells/total, legendText:"cells"},
                {  y: 100*w/total, legendText:"w"},
                {  y: 100*viruses/total, legendText:"viruses"},
            ]
        }]
    });
    pie.render();
}

function GetTopN(n, p){
    var r = [];
    var a = Object.keys(stats[p]).sort(function(a, b) {return -(stats[p][a].mass - stats[p][b].mass)});
    for (var i = 0; i < n && i < a.length; ++i){
        var key = a[i];
        var mass = stats[p][key].mass;
        var name = key.slice(0,key.length-8);
        if (!name) name = "An unnamed cell";
        var color = key.slice(key.length-7);
        r.push({name:name, color:color, mass:Math.floor(mass/100)});
    }
    return r;
}

function AppendTopN(n, p, list) {
    var a = GetTopN(n,p);
    for (var i = 0; i < a.length; ++i){
        var text = a[i].name + ' (' + (p == 'gains' ? '+' : '-') + a[i].mass + ' mass)';
        list.append('<li style="font-size: 20px; "><div style="width: 20px; height: 20px; border-radius: 50%; margin-right:5px; background-color: ' + a[i].color + '; display: inline-block;"></div>' + text + '</li>');
    };
    return a.length > 0;
}

function DrawStats(game_over) {
    if (!stats) return;

    jQuery('#statArea').empty();
    jQuery('#pieArea').empty();
    jQuery('#gainArea').empty();
    jQuery('#lossArea').empty();
    jQuery('#chartArea').empty();
    jQuery('#statsTab').tab('show');

    if (game_over){
        stats.time_of_death = Date.now();
        sfx_play(1);
        StopBGM();
    }
    var time = stats.time_of_death ? stats.time_of_death : Date.now();
    var seconds = (time - stats.birthday)/1000;

    var list = jQuery('<ul>');
    list.append('<li style="font-size: 20px; ">Game time: ' + secondsToHms(seconds) + '</li>');
    list.append('<li style="font-size: 20px; ">High score: ' + ~~(stats.high_score/100) + '</li>');
    if (stats.top_slot == Number.POSITIVE_INFINITY){
        list.append('<li style="font-size: 20px; ">You didn\'t make the leaderboard</li>');
    }
    else{
        list.append('<li style="font-size: 20px; ">Leaderboard max: ' + stats.top_slot + '</li>');
    }
    list.append('<li style="font-size: 20px; padding-top: 15px">' + stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 20px; ">' + stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 20px; ">' + stats.w.num + " masses eaten (" + ~~(stats.w.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 20px; ">' + stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ' mass)</li>');
    jQuery('#statArea').append('<h1>Game Summary</h1>');
    jQuery('#statArea').append(list);

    DrawPie(stats.pellets.mass, stats.w.mass, stats.cells.mass, stats.viruses.mass);

    jQuery('#gainArea').append('<h2>Top Gains</h2>');
    list = jQuery('<ol>');
    if (AppendTopN(5, 'gains', list))
        jQuery('#gainArea').append(list);
    else
        jQuery('#gainArea').append('<ul><li style="font-size: 20px; ">You have not eaten anybody</li></ul>');

    jQuery('#lossArea').append('<h2>Top Losses</h2>');
    list = jQuery('<ol>');
    if (AppendTopN(5, 'losses', list))
        jQuery('#lossArea').append(list);
    else
        jQuery('#lossArea').append('<ul><li style="font-size: 20px; ">Nobody has eaten you</li></ul>');

    if (stats.time_of_death !== null){
        jQuery('#chartArea')[0].width = 700;
        jQuery('#chartArea')[0].height= 250;
        stat_chart = CreateChart('chartArea', my_color, true);
        var scale = Math.max.apply(Math,chart_data.map(function(o){return o.y;}))/16;
        var scaled_data = num_cells_data.map(function(a){return {x:a.x, y:a.y*scale};});
        stat_chart.options.data.push({type: "line", dataPoints: scaled_data, toolTipContent:" "});
        stat_chart.render();
    }
    else {
        jQuery('#chartArea').width(700).height(0);
    }
}

var styles = {
    heading: {font:"30px Ubuntu", spacing: 41, alpha: 1},
    subheading: {font:"25px Ubuntu", spacing: 31, alpha: 1},
    normal: {font:"17px Ubuntu", spacing: 21, alpha: 0.6}
};

var g_stat_spacing = 0;
var g_display_width = 220;
var g_layout_width = g_display_width;

function AppendText(text, context, style) {
    context.globalAlpha = styles[style].alpha;
    context.font = styles[style].font;
    g_stat_spacing += styles[style].spacing;

    var width = context.measureText(text).width;
    g_layout_width = Math.max(g_layout_width, width);
    context.fillText(text, g_layout_width/2 - width/2, g_stat_spacing);
}

function RenderStats(reset) {
    if (reset) g_layout_width = g_display_width;
    if (!display_stats || !stats) return;
    g_stat_spacing = 0;

    var gains = GetTopN(3, 'gains');
    var losses =  GetTopN(3, 'losses');
    var height = 30 + styles['heading'].spacing + styles['subheading'].spacing * 2 + styles['normal'].spacing * (4 + gains.length + losses.length);

    stat_canvas = document.createElement("canvas");
    var scale = Math.min(g_display_width, .3 * window.innerWidth) / g_layout_width;
    stat_canvas.width = g_layout_width * scale;
    stat_canvas.height = height * scale;
    var context = stat_canvas.getContext("2d");
    context.scale(scale, scale);

    context.globalAlpha = .4;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, g_layout_width, height);

    context.fillStyle = "#FFFFFF";
    AppendText("Stats", context, 'heading');

    var text = stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.w.num + " mass eaten (" + ~~(stats.w.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ")";
    AppendText(text, context,'normal');

    AppendText("Top Gains",context,'subheading');
    for (var j = 0; j < gains.length; ++j){
        text = (j+1) + ". " + gains[j].name + " (" + gains[j].mass + ")";
        context.fillStyle = gains[j].color;
        AppendText(text, context,'normal');
    }

    context.fillStyle = "#FFFFFF";
    AppendText("Top Losses",context,'subheading');
    for (var j = 0; j < losses.length; ++j){
        text = (j+1) + ". " + losses[j].name + " (" + losses[j].mass + ")";
        context.fillStyle = losses[j].color;
        AppendText(text, context,'normal');
    }
}

jQuery(unsafeWindow).resize(function() {
    RenderStats(false);
});

unsafeWindow.OnGameStart = function(cells) {
    my_cells = cells;
    ResetChart();
    ResetStats();
    RenderStats(true);
    StartBGM();
    sfx_play(0);
};

unsafeWindow.OnShowOverlay = function(game_in_progress) {
    DrawStats(!game_in_progress);
};

unsafeWindow.OnUpdateMass = function(mass) {
    stats.high_score = Math.max(stats.high_score, mass);
    UpdateChart(mass, GetRgba(my_cells[0].color,0.4));
};

unsafeWindow.OnCellEaten = function(predator, prey) {
    if (!my_cells) return;

    if (my_cells.indexOf(predator) != -1){
        OnGainMass(predator, prey);
        RenderStats(false);
    }
    if (my_cells.indexOf(prey) != -1){
        OnLoseMass(prey, predator);
        RenderStats(false);
    }
};

unsafeWindow.OnLeaderboard = function(position) {
    stats.top_slot = Math.min(stats.top_slot, position);
};

unsafeWindow.OnDraw = function(context) {
    display_stats && stat_canvas && context.drawImage(stat_canvas, 10, 10);
};

// ====================== Music & SFX System ==============================================================
//sfx play on event (only one of each sfx can play - for sfx that won't overlap with itself)
var ssfxlist = [
    'spawn',
    'gameover'
];
var ssfxs = [];
for (i=0;i<ssfxlist.length;i++) {
    var newsfx = new Audio("http://skins.agariomods.com/botb/sfx/" + ssfxlist[i] + ".mp3");
    newsfx.loop = false;
    ssfxs.push(newsfx);
}
function sfx_play(id) {
    if (document.getElementById("sfx").value==0) return;
    var event = ssfxs[id];
    event.volume = document.getElementById("sfx").value;
    event.play();
}

//sfx insertion on event (multiple of same sfx can be played simultaneously)
var sfxlist = [
    'pellet',
    'split',
    'eat',
    'bounce',
    'merge',
    'virusfeed',
    'virusshoot',
    'virushit'
];

var sfxs = {};
for (i=0;i<sfxlist.length;i++) {
    var newsfx = new Audio("//skins.agariomods.com/botb/sfx/" + sfxlist[i] + ".mp3");
    newsfx.loop = false;
    newsfx.onended = function() {
        $(this).remove();
    };
    sfxs[sfxlist[i]] = newsfx;
}
function sfx_event(id) {
    if (document.getElementById("sfx").value==0) return;
    var event = jQuery.clone(sfxs[id]);
    event.volume = document.getElementById("sfx").value;
    event.play();
}

StartBGM = function () {
    if (document.getElementById("bgm").value==0) return;
    if (bgmusic.src == ""){
        bgmusic.src = _.sample(tracks, 1);
        bgmusic.load()
    }
    bgmusic.volume = document.getElementById("bgm").value;
    bgmusic.play();
};

StopBGM = function () {
    if (document.getElementById("bgm").value==0) return;
    bgmusic.pause();
    bgmusic.src = _.sample(tracks, 1);
    bgmusic.load()
};

volBGM = function (vol) {
    bgmusic.volume = document.getElementById("bgm").value;
};

var tracks = ['http://incompetech.com/music/royalty-free/mp3-preview2/Frost%20Waltz.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Frozen%20Star.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Groove%20Grove.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Dreamy%20Flashback.mp3'];
/*sfx*/
var nodeAudio = document.createElement("audio");
nodeAudio.id = 'audiotemplate';
nodeAudio.preload = "auto";
jQuery(playBtn).parent().get(0).appendChild(nodeAudio);

//var checkbox_div = jQuery('#settings input[type=checkbox]').closest('div');
//AppendCheckbox(checkbox_div, 'stats-checkbox', 'Show stats', display_stats, OnChangeDisplayStats);
var bgmusic = $('#audiotemplate').clone()[0];
bgmusic.src = tracks[Math.floor(Math.random() * tracks.length)];
bgmusic.load();
bgmusic.loop = false;
bgmusic.onended = function() {
    var track = tracks[Math.floor(Math.random() * tracks.length)];
    bgmusic.src = track;
    bgmusic.play();
};

function uiOnLoadTweaks(){
    $("label:contains(' Dark Theme') input").prop('checked', true);
    setDarkTheme(true);
    $("label:contains(' Show mass') input").prop('checked', true);
    setShowMass(true);

    // default helloDialog has a margin of 10 px. take that away to make it line up with our other dialogs.
    $("#helloDialog").css("marginTop", "0px");
    $("#settings").show(); $("#instructions").hide();
    $('#nick').val(GM_getValue("nick", ""));
}

// ===============================================================================================================
uiOnLoadTweaks();

var col1 = $("#col1");
AppendCheckboxP(col1, 'chart-checkbox', ' Show chart', display_chart, OnChangeDisplayChart);
AppendCheckboxP(col1, 'option1', ' Acid Mode', false, setAcid);
AppendCheckboxP(col1, 'option2', ' Lite Brite', false, setLiteBrite);
//AppendCheckboxP(col1, 'option3', ' Left Mouse Button Fires', false, setLeftMouseButtonFires);
col1.append('<BR><label>SFX<input id="sfx" type="range" value="0" step=".1" min="0" max="1"></label>');
col1.append('<BR><label>BGM<input type="range" id="bgm" value="0" step=".1" min="0" max="1" oninput="volBGM(this.value);"></label>');

var agariomodsSkins = ("1up;8ball;agariomods.com;albania;android;anonymous;apple;atari;awesome;baka;bandaid;bane;baseball;basketball;batman;beats;bender;bert;bitcoin;blobfish;bobross;bobsaget;boo;boogie2988;borg;bp;breakfast;buckballs;burgundy;butters;byzantium;charmander;chechenya;chickfila;chocolate;chrome;cj;coca cola;cokacola;converse;cornella;creeper;cyprus;czechrepublic;deadpool;deal with it;deathstar;derp;dickbutt;doge;doggie;dolan;domo;domokun;dong;donut;dreamcast;drunken;ebin;egg;egoraptor;egypt;electrokitty;epicface;expand;eye;facebook;fast forward;fastforward;fbi;fidel;finn;firefox;fishies;flash;florida;freeman;freemason;friesland;frogout;fuckfacebook;gaben;garfield;gaston;generikb;getinmybelly;getinthebox;gimper;github;giygas;gnomechild;gonzo;grayhat;halflife;halflife3;halo;handicapped;hap;hatty;hebrew;heisenburg;helix;hipsterwhale;hitler;honeycomb;hydro;iceland;ie;illuminati;imgur;imperial japan;imperialjapan;instagram;isaac;isis;isreal;itchyfeetleech;ivysaur;james bond;java;jew;jewnose;jimmies;kappa;kenny;kingdomoffrance;kingjoffrey;kirby;kitty;klingon;knightstemplar;knowyourmeme;kyle;ladle;lenny;lgbt;libertyy;liechtenstien;linux;love;luigi;macedonia;malta;mario;mars;maryland;masterball;mastercheif;mcdonalds;meatboy;meatwad;megamilk;mike tyson;mlg;moldova;mortalkombat;mr burns;mr.bean;mr.popo;n64;nasa;nazi;nick;nickelodeon;nipple;northbrabant;nosmoking;notch;nsa;obey;osu;ouch;pandaexpress;pedo;pedobear;peka;pepe;pepsi;pewdiepie;pi;pig;piggy;pika;pinkfloyd;pinkstylist;piratebay;pizza;playstation;poop;potato;quantum leap;rageface;rewind;rockstar;rolfharris;rss;satan;serbia;shell;shine;shrek;sinistar;sir;skull;skype;skyrim;slack;slovakia;slovenia;slowpoke;smash;snafu;snapchat;soccer;soliare;solomid;somalia;space;spawn;spiderman;spongegar;spore;spy;squirtle;stalinjr;starbucks;starrynight;stitch;stupid;summit1g;superman;taco;teamfortress;tintin;transformer;transformers;triforce;trollface;tubbymcfatfuck;turkey;twitch;twitter;ukip;uppercase;uruguay;utorrent;voyager;wakawaka;wewlad;white  light;windows;wwf;wykop;yinyang;ylilauta;yourmom;youtube;zoella;zoidberg").split(";");
