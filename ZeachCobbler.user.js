// ==UserScript==
// @name         Zeach Cobbler
// @namespace    https://github.com/RealDebugMonkey/ZeachCobbler
// @updateURL    https://rawgit.com/RealDebugMonkey/ZeachCobbler/master/ZeachCobbler.user.js
// @downloadURL  http://bit.do/ZeachCobblerJS
// @contributer  The White Light -- You rock the maths.
// @contributer  Angal - For the UI additions and server select code
// @contributer  Agariomods.com (and Electronoob) for the innovative imgur style skins
// @contributer  Agariomods.com again for maintaining the best extended repo out there.
// @codefrom     mikeyk730 stats screen - https://greasyfork.org/en/scripts/10154-agar-chart-and-stats-screen
// @codefrom     debug text output derived from Apostolique's bot code -- https://github.com/Apostolique/Agar.io-bot
// @codefrom     minimap derived from Gamer Lio's bot code -- https://github.com/leomwu/agario-bot
// @version      0.11.3
// @description  Agario powerups
// @author       DebugMonkey
// @match        http://agar.io
// @match        https://agar.io
// @changes     0.11.0 - Fix for v538 fix
//                   1 - grazer fixed, time alive and ttr fixed
//                   2 - more fixes for stuff I missed
//                   3 - onDestroy bugfix
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
var _version_ = '0.11.3';

//if (window.top != window.self)  //-- Don't run on frames or iframes
//    return;

var QUAD;
console.log("Running Zeach Cobbler!");
$.getScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash.min.js");
$.getScript("https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js");

(function (h$$0, f) {
    var zoomFactor = 10;
    var highScore = 0;
    var timeSpawned = null;
    var isGrazing = false;
    var grazingTargetID;
    var serverIP = "";
    var suspendMouseUpdates = false;
    var nearestVirusID;
    var rightClickFires = GM_getValue('rightClickFires', false);
    var displayDebugInfo = 1;
    var showVisualCues = true;
    var grazingTargetFixation = false;
    var visualizeGrazing = GM_getValue('visualizeGrazing', true);
    var selectedBlobID = null;
    var isAcid = false;
    var $x = unsafeWindow.jQuery;
    var miniMapCtx=jQuery('<canvas id="mini-map" width="175" height="175" style="border:2px solid #999;text-align:center;position:fixed;bottom:5px;right:5px;"></canvas>')
        .appendTo(jQuery('body'))
        .get(0)
        .getContext("2d");
    GetGmValues();

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

    // ====================== Virtual Point System ==============================================================

    // ======================   Utility code    ==================================================================
    function getSelectedBlob(){
        if(!_.contains(myIDs, selectedBlobID)){
            selectedBlobID = myPoints[0].id;
            console.log("Had to select new blob. Its id is " + selectedBlobID);
        }
        return nodes[selectedBlobID];
    }
    function GetGmValues(){
        console.log("GM nick: " + GM_getValue('nick', "none set"));
        console.log("GM rightClickFires: " + GM_getValue('rightClickFires', "none set"));
        console.log("GM visualizeGrazing: " + GM_getValue('visualizeGrazing', "none set"));
    }
    function isPlayerAlive(){
        return !!myPoints.length;
    }
    function sendMouseUpdate(ws, mouseX2,mouseY2) {

        if (ws != null && ws.readyState == ws.OPEN) {
            z0 = new ArrayBuffer(21);
            z1 = new DataView(z0);
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

        var totalMass = _.sum(_.pluck(myPoints, "nSize").map(getMass)); //_.sum(_.map(_.pluck(myPoints, "nSize"), getMass));
        return ~~((((totalMass*0.02)*1000)+30000) / 1000) - ~~((Date.now() - element.splitTime) / 1000);
        //return ~~((((getMass(element.size)*0.02)*1000)+30000) / 1000) - ~~((Date.now() - element.splitTime) / 1000);

    }
    function getBlobShotsAvailable(blob) {
        return ~~(Math.max(0, (getMass(blob.nSize)-20)/15));
    }
    function distanceFromCellZero(blob) {
        return isPlayerAlive() ? lineDistance(blob, getSelectedBlob()) : 11180;
    }
    // Hack: Mouse variables must have these names
    function getMouseCoordsAsPseudoBlob(){
        var pseudoBlob = {
            x: mouseX2,
            y: mouseY2,
            nx: mouseX2,
            ny: mouseY2,
        };
        return pseudoBlob;
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
            var pseudoblob = {"nx": interx, "ny": intery};
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
    function isSafeTarget(myBlob, targetBlob, blobArray, threats){

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
        return _.omit(nodes, myIDs);
    }

    // Gets any item which is a threat including bigger players and viruses
    function getThreats(blobArray, myMass) {
        // start by omitting all my IDs
        // then look for viruses smaller than us and blobs substantially bigger than us
        var threatArray = _.filter(getOtherBlobs(), function(possibleThreat){
            var possibleThreatMass = getMass(possibleThreat.size);

            if(possibleThreat.isVirus) {
                // Viruses are only a threat if we are bigger than them
                return myMass >= possibleThreatMass;
            }
            // other blobs are only a threat if they cross the 'Large' threshhold
            return possibleThreatMass > myMass * Large;
        });
        return threatArray;
    }

    function doGrazing(ws)
    {
        if(!isPlayerAlive()){
            isGrazing = false;
            return;
        }
        // with target fixation on, target remains until it's eaten by someone or
        // otherwise disappears. With it off target is constantly recalculated
        // at the expense of CPU
        if(!grazingTargetFixation){
            grazingTargetID = null;
        }

        var target;
        if(!nodes.hasOwnProperty(grazingTargetID))
        {
            var target = findFoodToEat(getSelectedBlob(),items);
            if(-1 == target){
                isGrazing = false;
                return;
            }
            grazingTargetID = target.id;
        }
        else
        {
            target = nodes[grazingTargetID];
        }
        sendMouseUpdate(ws, target.x + Math.random(), target.y + Math.random());
    }

    function findFoodToEat(cell, blobArray){
        var edibles = [];
        var densityResults = [];
        var threats = getThreats(blobArray, getMass(cell.size));
        blobArray.forEach(function (element, index, array){
            var distance = lineDistance(cell, element);
            element.isSafeTarget = null;
            if( getMass(element.size) <= (getMass(cell.size) * 0.4) && !element.isVirus){
                if(isSafeTarget(cell, element, blobArray, threats)){
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
            var density = calcFoodDensity(nodes[element.id], blobArray)/(element.distance*2);
            densityResults.push({"density":density, "id":element.id});
        });
        if(0 === densityResults.length){
            console.log("No target found");
            //return avoidThreats(threats, k[0]);
            return -1;
        }
        var target = densityResults.sort(function(x,y){return x.density>y.density?-1:1;});
        //console.log("Choosing blob (" + target[0].id + ") with density of : "+ target[0].density);
        return nodes[target[0].id];
    }

    function calcFoodDensity(cell2, blobArray2){
        var MaxDistance2 = 250;
        var pelletCount = 0;
        blobArray2.forEach(function (element2){
            var distance2 = lineDistance(cell2, element2);
            var cond1 = getMass(element2.size) <= (getMass(getSelectedBlob().size) * 0.4);
            var cond2 = distance2 < MaxDistance2;
            var cond3 = !element2.isVirus;
            //console.log(cond1 + " " + cond2 + " " + cond3);
            if( cond1 && cond2 && cond3 && cell2.isSafeTarget ){
                pelletCount +=1;
            }
        });
        return pelletCount;
    }
// ======================   UI stuff    ==================================================================

    function drawRescaledItems(ctx) {
        if (showVisualCues && isPlayerAlive()) {
            drawGrazingLines(ctx);
            drawMapBorders(ctx, isNightMode);
            drawSplitGuide(ctx, getSelectedBlob());
            drawMiniMap(ctx);
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

    function drawCellInfos(xa, xb, thisCell) {
        var color = this.color;
        if (showVisualCues) {
            color = setCellColors(thisCell, myPoints);
            if (thisCell.isVirus) {
                if (!nodes.hasOwnProperty(nearestVirusID))
                    nearestVirusID = thisCell.id;
                else if (distanceFromCellZero(thisCell) < distanceFromCellZero(nodes[nearestVirusID]))
                    nearestVirusID = thisCell.id;
            }
            xa ? (xb.fillStyle = "#FFFFFF", xb.strokeStyle = "#AAAAAA") : (xb.fillStyle = color, xb.strokeStyle = thisCell.id == nearestVirusID ? "red" : color);
        }
    }

    function drawMapBorders(ctx, isNightmode) {
        if (isNightmode) {
            ctx.strokeStyle = '#FFFFFF';
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(11180, 0);
        ctx.lineTo(11180, 11180);
        ctx.lineTo(0, 11180);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }
    function drawSplitGuide(ctx, cell)
    {
        if( !isPlayerAlive())
        {
            return;
        }
        var radius = 660;
        var centerX = cell.x;
        var centerY = cell.y;
        var hold = ctx.globalAlpha;
        //ctx.globalAlpha = 0.05;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius+cell.size, 0, 2 * Math.PI, false);
        //ctx.fillStyle = 'green';
        //ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        //ctx.fillStyle = 'red';
        //ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
        ctx.globalAlpha = hold;
    }

    // TODO: K below is build dependant
    function isTeamMode(){
        return (K === ":teams");
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
                color = virusColor; // Viruses are always gray, and everything is gray when dead
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

    function displayDebugText(d, agarTextFunction) {

        if(0 >= displayDebugInfo) {
            return;
        }

        // HACK: On update change this function name to correct function
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
        var text = new agarTextFunction(textSize, (isNightMode ? '#F2FBFF' : '#111111'));

        for (var i = 0; i < debugStrings.length; i++) {
            /*todo*/text.setValue(debugStrings[i]); // setValue
            var textRender = text.render();
            d.drawImage(textRender, 20, offsetValue);
            offsetValue += textRender.height;
        }
    }

    function drawMiniMap(ctx) {
        miniMapCtx.clearRect(0, 0, 175, 175);

        _.forEach(_.values(getOtherBlobs()), function(blob){
            miniMapCtx.strokeStyle = blob.isVirus ?  "#33FF33" : 'rgb(52,152,219)' ;
            miniMapCtx.beginPath();
            miniMapCtx.arc(blob.nx / 64, blob.ny / 64, blob.size / 64, 0, 2 * Math.PI);
            miniMapCtx.stroke();
        });



        _.forEach(myPoints, function(myBlob){
            miniMapCtx.strokeStyle = "#FFFFFF";
            miniMapCtx.beginPath();
            miniMapCtx.arc(myBlob.x / 64, myBlob.y / 64, myBlob.size / 64, 0, 2 * Math.PI);
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
        if(!isGrazing || grazingTargetID == null || !visualizeGrazing ||!nodes.hasOwnProperty(grazingTargetID) || !isPlayerAlive())
        {
            return;
        }
        var oldLineWidth = ctx.lineWidth;
        var oldColor = ctx.color;
        items.forEach(function (element){
            var color;
            if(element.isSafeTarget === true)
                drawLine(ctx,element, getSelectedBlob(), "white" );
            else if (element.isSafeTarget === false)
                drawLine(ctx,element, getSelectedBlob(), "red" );
            // else
            // {
            //     // value is null -- neither
            // }

        });
        ctx.lineWidth = 10;
        drawLine(ctx, nodes[grazingTargetID], getSelectedBlob(), "green");
        ctx.lineWidth = oldLineWidth;
        ctx.color = oldColor;

    }
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

    function fireAtVirusNearestToBlob(blob, blobArray)
    {
        /*remap*/// HACK: On update change this function name to correct function
        var fireFunction = C;
        var msDelayBetweenShots = 75;
        nearestVirus = findNearestVirus(blob, blobArray);

        if(-1 == nearestVirus){
            return;
        }

        // TODO: count availableshots and limit shots sent to  Math.min(shotsNeeded, ShotsAvailable)
        var shotsNeeded = getVirusShotsNeededForSplit(nearestVirus.size);
        var shotsFired = 0 / myPoints.length;
        if(shotsNeeded <= 0){
            return;
        }

        suspendMouseUpdates = true;
        console.log("Nearest Virus at: ("+ nearestVirus.x + "," + nearestVirus.y + ") requires " + shotsNeeded + " shots.");
        // two mouse updates in a row to make sure new position is locked in.
        sendMouseUpdate(ws, nearestVirus.x + Math.random(), nearestVirus.y + Math.random());
        window.setTimeout(function () { sendMouseUpdate(ws, nearestVirus.x + Math.random(), nearestVirus.y + Math.random()); }, 25);

        // schedules all shots needed spaced evenly apart by of 'msDelayBetweenShots'
        for ( ; shotsFired < shotsNeeded; shotsFired++){
            window.setTimeout(function () { sendMouseUpdate(ws, nearestVirus.x + Math.random(), nearestVirus.y + Math.random()); fireFunction(21); },
                msDelayBetweenShots *(shotsFired+1));
        }
        window.setTimeout(function () { suspendMouseUpdates = false;}, msDelayBetweenShots *(shotsFired+1));
    }


    function fireAtVirusNearestToCursor(){
        fireAtVirusNearestToBlob(getMouseCoordsAsPseudoBlob(), items);
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
        "controless" : "https://i.imgur.com/uD5SW8X.jpg",
        "sqochit" : "http://i.imgur.com/AnowvFI.jpg",
        "drunken" : "http://i.imgur.com/JeKNRss.png",
    };

    var bitdoAlreadyChecked = []

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
    function isBitDoSkin(targetName){
        return _.startsWith(targetName, "`");
    }

    function customSkins(userName, defaultSkins, imgCache, Ba, K) {
        var retval = null;
        var userNameLowerCase = userName.toLowerCase();
        if(!this.isAgitated && Ba && "" == K){
            if(-1 != defaultSkins.indexOf(userNameLowerCase) || isSpecialSkin(userNameLowerCase) || isImgurSkin(userNameLowerCase) ||
                isBitDoSkin(userName) || isAgarioModsSkin(userNameLowerCase) || isExtendedSkin(userNameLowerCase)){
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
// ======================   Misc    ==================================================================
    function shouldRelocateName(cell){
        return ((isExtendedSkin(this.name)|| isSpecialSkin(this.name) || isBitDoSkin(this.name)));
    }
    function customKeyDownEvents(d)
    {

        if(9 === d.keyCode && isPlayerAlive()) {
            var myids_sorted = _.pluck(myPoints, "id").sort(); // sort ids because they could
            var indexloc = _.indexOf(myids_sorted, selectedBlobID);
            d.preventDefault();
            if(-1 === indexloc){
                selectedBlobID = myPoints[0].id;
                console.log("Had to select new blob. Its id is " + selectedBlobID);
                return nodes[selectedBlobID];
            }
            indexloc += 1;
            if(indexloc >= myids_sorted.length){
                selectedBlobID = myPoints[0].id;
                console.log("Reached array end. Moving to begining with id " + selectedBlobID);
                return nodes[selectedBlobID];
            }
            selectedBlobID = myPoints[indexloc].id;
            return nodes[selectedBlobID];
        }
        else if('A'.charCodeAt(0) === d.keyCode && isPlayerAlive()){
            isAcid = !isAcid;
            setAcid(isAcid);
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
            fireAtVirusNearestToBlob(getSelectedBlob(),items);
        }
        else if('T'.charCodeAt(0) === d.keyCode && isPlayerAlive() && isGrazing && grazingTargetFixation)
        {
            console.log("Retarget requested");
            var pseudoBlob = getMouseCoordsAsPseudoBlob();

            pseudoBlob.size = getSelectedBlob().size;
            //pseudoBlob.scoreboard = scoreboard;
            var target = findFoodToEat(pseudoBlob,items);
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
            C(20);
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
        if (0 == _.size(myPoints)){
            timeSpawned = Date.now();
        }
    }
    function setCellName(cell, d) {
        if (showVisualCues) {
            if (_.contains(myIDs, cell.id) && _.size(myPoints) > 1) {
                var pct = (cell.nSize * cell.nSize) * 100 / (getSelectedBlob().nSize * getSelectedBlob().nSize);
                d.setValue(calcTTR(cell) + " ttr" + " " + ~~(pct) + "%");
            } else if (!cell.isVirus && isPlayerAlive()) {
                var pct = ~~((cell.nSize * cell.nSize) * 100 / (getSelectedBlob().nSize * getSelectedBlob().nSize));
                d.setValue(cell.name + " " + pct.toString() + "%");
            }
        }
    }
    function setVirusInfo(cell, d, c) {
        d.setScale(c * 1.25);
        if (showVisualCues) {
            if (cell.isVirus) {
                cell.nameCache.setValue(getVirusShotsNeededForSplit(cell.nSize));
                var nameSizeMultiplier = 4;
                d.setScale(c * 4);
            }
        }
        if (cell.isVirus && !showVisualCues) {
            cell.nameCache.setValue(" ");
        }
    }
// ======================   Start main    ==================================================================

    function Sa() {
        la = true;
        za();
        setInterval(za, 18E4);
        B = ma = document.getElementById("canvas");
        globalCtx = B.getContext("2d");
        scoreboard.onmousewheel = function (e) {zoomFactor = e.wheelDelta > 0 ? 10 : 11;}
        B.onmousedown = function (a) {
            /*new*/if(isPlayerAlive() && rightClickFires){fireAtVirusNearestToCursor();}
            /*new*/ return;
            /*new*/ //event.preventDefault(); // FUTURE: Electronoob mousedrag fix. is this needed?
            if(Aa) {
                var b = a.clientX - (5 + p / 5 / 2);
                var c = a.clientY - (5 + p / 5 / 2);
                if(Math.sqrt(b * b + c * c) <= p / 5 / 2) {
                    K();
                    C(17);
                    return;
                }
            }
            mouseX = a.clientX;
            mouseY = a.clientY;
            na();
            K();
        };
        B.onmousemove = function (a) {
            mouseX = a.clientX;
            mouseY = a.clientY;
            na();
        };
        B.onmouseup = function () {};
        if(/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", Ba, false);
        } else {
            document.body.onmousewheel = Ba;
        }
        var a = false;
        var b = false;
        var c = false;
        h$$0.onkeydown = function (d) {
            if(!(32 != d.keyCode)) {
                if(!a) {
                    K();
                    C(17);
                    a = true;
                }
            }
            if(!(81 != d.keyCode)) {
                if(!b) {
                    C(18);
                    b = true;
                }
            }
            if(!(87 != d.keyCode)) {
                if(!c) {
                    K();
                    C(21);
                    c = true;
                }
            }
            if(27 == d.keyCode) {
                Ca(true);
            }
            /*new*/customKeyDownEvents(d);
        };
        h$$0.onkeyup = function (d) {
            if(32 == d.keyCode) {
                a = false;
            }
            if(87 == d.keyCode) {
                c = false;
            }
            if(81 == d.keyCode) {
                if(b) {
                    C(19);
                    b = false;
                }
            }
        };
        h$$0.onblur = function () {
            C(19);
            c = b = a = false;
        };
        h$$0.onresize = Da;
        Da();
        if(h$$0.requestAnimationFrame) {
            h$$0.requestAnimationFrame(Ea);
        } else {
            setInterval(oa, 1E3 / 60);
        }
        setInterval(K, 40);
        if(v) {
            f("#region")
                .val(v);
        }
        Fa();
        V(f("#region")
            .val());
        if(null == ws) {
            if(v) {
                W();
            }
        }
        f("#overlays")
            .show();
        /*new*/op_onLoad();
    }

    function Ba(a) {
        D *= Math.pow(0.9, a.wheelDelta / -120 || (a.detail || 0));
        if(1 > D) {
            D = 1;
        }
        if(D > 4 / g) {
            D = 4 / g;
        }
    }

    function Ta() {
        if(0.4 > g) {
            L = null;
        } else {
            var a = Number.POSITIVE_INFINITY;
            var b = Number.POSITIVE_INFINITY;
            var c = Number.NEGATIVE_INFINITY;
            var d = Number.NEGATIVE_INFINITY;
            var e = 0;
            var l = 0;
            for(; l < items.length; l++) {
                var k = items[l];
                if(!!k.I()) {
                    if(!k.M) {
                        if(!(20 >= k.size * g)) {
                            e = Math.max(k.size, e);
                            a = Math.min(k.x, a);
                            b = Math.min(k.y, b);
                            c = Math.max(k.x, c);
                            d = Math.max(k.y, d);
                        }
                    }
                }
            }
            L = Ua.ca({
                X: a - (e + 100),
                Y: b - (e + 100),
                fa: c + (e + 100),
                ga: d + (e + 100),
                da: 2,
                ea: 4
            });
            l = 0;
            for(; l < items.length; l++) {
                if(k = items[l], k.I() && !(20 >= k.size * g)) {
                    a = 0;
                    for(; a < k.a.length; ++a) {
                        b = k.a[a].x;
                        c = k.a[a].y;
                        if(!(b < s - p / 2 / g)) {
                            if(!(c < t - q / 2 / g)) {
                                if(!(b > s + p / 2 / g)) {
                                    if(!(c > t + q / 2 / g)) {
                                        L.i(k.a[a]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function na() {
        mouseX2 = (mouseX - p / 2) / g + s;
        mouseY2 = (mouseY - q / 2) / g + t;
    }

    function za() {
        if(null == Z) {
            Z = {};
            f("#region")
                .children()
                .each(function () {
                    var a = f(this);
                    var b = a.val();
                    if(b) {
                        Z[b] = a.text();
                    }
                });
        }
        f.get($ + "//m.agar.io/info", function (a) {
            var b = {};
            var c;
            for(c in a.regions) {
                var d = c.split(":")[0];
                b[d] = b[d] || 0;
                b[d] += a.regions[c].numPlayers;
            }
            for(c in b) {
                f('#region option[value="' + c + '"]')
                    .text(Z[c] + " (" + b[c] + " players)");
            }
        }, "json");
    }

    function Ga() {
        f("#adsBottom")
            .hide();
        f("#overlays")
            .hide();
        Fa();
    }

    function V(a) {
        if(a) {
            if(a != v) {
                if(f("#region")
                        .val() != a) {
                    f("#region")
                        .val(a);
                }
                v = h$$0.localStorage.location = a;
                f(".region-message")
                    .hide();
                f(".region-message." + a)
                    .show();
                f(".btn-needs-server")
                    .prop("disabled", false);
                if(la) {
                    W();
                }
            }
        }
    }

    function Ca(a) {
        E = null;
        f("#overlays")
            .fadeIn(a ? 200 : 3E3);
        /*new*//*mikey*/OnShowOverlay(a);
        if(!a) {
            f("#adsBottom")
                .fadeIn(3E3);
        }
    }

    function Fa() {
        if(f("#region")
                .val()) {
            h$$0.localStorage.location = f("#region")
                .val();
        } else {
            if(h$$0.localStorage.location) {
                f("#region")
                    .val(h$$0.localStorage.location);
            }
        }
        if(f("#region")
                .val()) {
            f("#locationKnown")
                .append(f("#region"));
        } else {
            f("#locationUnknown")
                .append(f("#region"));
        }
    }

    function pa() {
        console.log("Find " + v + M);
        f.ajax($ + "//m.agar.io/", {
            error: function () {
                setTimeout(pa, 1E3);
            },
            success: function (a) {
                a = a.split("\n");
                if("45.79.222.79:443" == a[0]) {
                    pa();
                } else {
                    Ha("ws://" + a[0]);
                    /*new*/ serverIP = a[0];
                }
            },
            dataType: "text",
            method: "POST",
            cache: false,
            crossDomain: true,
            data: v + M || "?"
        });
    }

    function W() {
        if(la) {
            if(v) {
                f("#connecting")
                    .show();
                pa();
            }
        }
    }

    function Ha(a) {
        if(ws) {
            /*new*/h$$0.angal_data.server.set(a);
            ws.onopen = null;
            ws.onmessage = null;
            ws.onclose = null;
            try {
                ws.close();
            } catch(b) {}
            ws = null;
        }
        var c = h$$0.location.search.slice(1);
        if(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+$/.test(c)) {
            a = "ws://" + c;
        }
        if(Va) {
            a = a.split(":");
            a = a[0] + "s://ip-" + a[1].replace(/\./g, "-")
                    .replace(/\//g, "") + ".tech.agar.io:" + (+a[2] + 2E3);
        }
        myIDs = [];
        myPoints = [];
        nodes = {};
        items = [];
        H = [];
        scoreboard = [];
        w = teamScoreBoard = null;
        I = 0;
        console.log("Connecting to " + a);
        ws = new WebSocket(a);
        ws.binaryType = "arraybuffer";
        ws.onopen = Wa;
        ws.onmessage = Xa;
        ws.onclose = Ya;
        ws.onerror = function () {
            console.log("socket error");
        };
    }
    /*new*//*remap*/h$$0.angal_connectDirect = Ha;

    function N(a) {
        return new DataView(new ArrayBuffer(a));
    }

    function O(a) {
        ws.send(a.buffer);
    }
    function Wa() {
        var a;
        aa = 500;
        f("#connecting")
            .hide();
        console.log("socket open");
        a = N(5);
        a.setUint8(0, 254);
        a.setUint32(1, 4, true);
        O(a);
        a = N(5);
        a.setUint8(0, 255);
        a.setUint32(1, 673720361, true);
        O(a);
        Ia();
    }

    function Ya() {
        console.log("socket close");
        setTimeout(W, aa);
        aa *= 1.5;
    }

    function Xa(a) {
        Za(new DataView(a.data));
    }

    function Za(a) {
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
                $a(a, c);
                /*new*/onAfterUpdatePacket();
                break;
            case 17:
                P = a.getFloat32(c, true);
                c += 4;
                Q = a.getFloat32(c, true);
                c += 4;
                R = a.getFloat32(c, true);
                c += 4;
                break;
            case 20:
                myPoints = [];
                myIDs = [];
                break;
            case 21:
                qa = a.getInt16(c, true);
                c += 2;
                ra = a.getInt16(c, true);
                c += 2;
                if(!sa) {
                    sa = true;
                    ba = qa;
                    ca = ra;
                }
                break;
            case 32:
                /*new*/onBeforeNewPointPacket();
                myIDs.push(a.getUint32(c, true));
                c += 4;
                break;
            case 49:
                if(null != teamScoreBoard) {
                    break;
                }
                var d$$0 = a.getUint32(c, true);
                c = c + 4;
                scoreboard = [];
                var e = 0;
                for(; e < d$$0; ++e) {
                    var l = a.getUint32(c, true);
                    c = c + 4;
                    scoreboard.push({
                        id: l,
                        name: b$$0()
                    });
                }
                Ja();
                break;
            case 50:
                teamScoreBoard = [];
                d$$0 = a.getUint32(c, true);
                c += 4;
                e = 0;
                for(; e < d$$0; ++e) {
                    teamScoreBoard.push(a.getFloat32(c, true));
                    c += 4;
                }
                Ja();
                break;
            case 64:
                da = a.getFloat64(c, true);
                c += 8;
                ea = a.getFloat64(c, true);
                c += 8;
                fa = a.getFloat64(c, true);
                c += 8;
                ga = a.getFloat64(c, true);
                c += 8;
                P = (fa + da) / 2;
                Q = (ga + ea) / 2;
                R = 1;
                if(0 == myPoints.length) {
                    s = P;
                    t = Q;
                    g = R;
                };
        }
    }

    function $a(a, b) {
        G = +new Date;
        var c = Math.random();
        ta = false;
        var d = a.getUint16(b, true);
        b += 2;
        var e = 0;
        for(; e < d; ++e) {
            var l = nodes[a.getUint32(b, true)];
            var k = nodes[a.getUint32(b + 4, true)];
            b += 8;
            if(l) {
                if(k) {
                    /*new*//*mikey*//*remap*/OnCellEaten(l,k);   ///*new*//*mikey*/OnCellEaten(q,f);
                    k.S();                                       //f.destroy();
                    k.p = k.x;                                   //f.ox = f.x;
                    k.q = k.y;                                   //f.oy = f.y;
                    k.o = k.size;                                //f.oSize = f.size;
                    k.nx = l.x;                                   //f.nx = q.x;
                    k.ny = l.y;                                   //f.ny = q.y;
                    k.nSize = k.size;                                //f.nSize = f.size;
                    k.L = G;                                     //f.updateTime = I;
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
            var h;
            l = a.getInt16(b, true);
            b += 2;
            k = a.getInt16(b, true);
            b += 2;
            h = a.getInt16(b, true);
            b += 2;
            var g = a.getUint8(b++);
            var f = a.getUint8(b++);
            var p = a.getUint8(b++);
            g = (g << 16 | f << 8 | p)
                .toString(16);
            for(; 6 > g.length;) {
                g = "0" + g;
            }
            g = "#" + g;
            f = a.getUint8(b++);
            p = !!(f & 1);
            var r = !!(f & 16);
            if(f & 2) {
                b += 4;
            }
            if(f & 4) {
                b += 8;
            }
            if(f & 8) {
                b += 16;
            }
            var q;
            var n = "";
            for(;;) {
                q = a.getUint16(b, true);
                b += 2;
                if(0 == q) {
                    break;
                }
                n += String.fromCharCode(q);
            }
            q = n;
            n = null;
            if(nodes.hasOwnProperty(d)) {
                n = nodes[d];
                n.K();
                n.p = n.x;
                n.q = n.y;
                n.o = n.size;
                n.color = g;
            } else {
                n = new Ka(d, l, k, h, g, q);
                n.ka = l;
                n.la = k;
            }
            n.isVirus = p;
            n.j = r;
            n.nx = l;
            n.ny = k;
            n.nSize = h;
            n.ja = c;
            n.L = G;
            n.W = f;
            if(q) {
                n.setName(q);
            }
            if(-1 != myIDs.indexOf(d)) {
                if(-1 == myPoints.indexOf(n)) {
                    document.getElementById("overlays")
                        .style.display = "none";
                    myPoints.push(n);
                    if(1 == myPoints.length) {
                        /*new*//*mikey*/OnGameStart(myPoints);
                        s = n.x;
                        t = n.y;
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
            n = nodes[d];
            if(null != n) {
                n.S();
            }
        }
        if(ta) {
            if(0 == myPoints.length) {
                Ca(false);
            }
        }
    }

    function K() {
        /*new*/if(isGrazing){ doGrazing(ws); return; }
        /*new*/if(suspendMouseUpdates){return;}
        var a;
        if(ua()) {
            a = mouseX - p / 2;
            var b = mouseY - q / 2;
            if(!(64 > a * a + b * b)) {
                if(!(0.01 > Math.abs(La - mouseX2) && 0.01 > Math.abs(Ma - mouseY2))) {
                    La = mouseX2;
                    Ma = mouseY2;
                    a = N(21);
                    a.setUint8(0, 16);
                    a.setFloat64(1, mouseX2, true);
                    a.setFloat64(9, mouseY2, true);
                    a.setUint32(17, 0, true);
                    O(a);
                }
            }
        }
    }

    function Ia() {
        if(ua() && null != E) {
            var a = N(1 + 2 * E.length);
            a.setUint8(0, 0);
            var b = 0;
            for(; b < E.length; ++b) {
                a.setUint16(1 + 2 * b, E.charCodeAt(b), true);
            }
            O(a);
        }
    }

    function ua() {
        return null != ws && ws.readyState == ws.OPEN;
    }

    function C(a) {
        if(ua()) {
            var b = N(1);
            b.setUint8(0, a);
            O(b);
        }
    }

    function Ea() {
        oa();
        h$$0.requestAnimationFrame(Ea);
    }

    function Da() {
        p = h$$0.innerWidth;
        q = h$$0.innerHeight;
        ma.width = B.width = p;
        ma.height = B.height = q;
        oa();
    }

    function Na() {
        var a;
        a = 1 * Math.max(q / 1080, p / 1920);
        return a *= D;
    }

    function ab() {
        if(0 != myPoints.length) {
            var a = 0;
            var b = 0;
            for(; b < myPoints.length; b++) {
                a += myPoints[b].size;
            }
            a = Math.pow(Math.min(64 / a, 1), 0.4) * Na();
            g = (9 * g + a) / 10;
            /*new*//*remap*/g = (9 * g + a) / zoomFactor;
        }
    }

    function oa() {
        var a$$0;
        var b$$0 = Date.now();
        ++bb;
        G = b$$0;
        if(0 < myPoints.length) {
            ab();
            var c = a$$0 = 0;
            var d = 0;
            for(; d < myPoints.length; d++) {
                myPoints[d].K();
                a$$0 += myPoints[d].x / myPoints.length;
                c += myPoints[d].y / myPoints.length;
            }
            P = a$$0;
            Q = c;
            R = g;
            s = (s + a$$0) / 2;
            t = (t + c) / 2;
        } else {
            s = (29 * s + P) / 30;
            t = (29 * t + Q) / 30;
            g = (9 * g + R * Na()) / 10;
        }
        Ta();
        na();
        if(!va) {
            globalCtx.clearRect(0, 0, p, q);
        }
        if(va) {
            globalCtx.fillStyle = isNightMode ? "#111111" : "#F2FBFF";
            globalCtx.globalAlpha = 0.05;
            globalCtx.fillRect(0, 0, p, q);
            globalCtx.globalAlpha = 1;
        } else {
            cb();
        }
        items.sort(function (a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size;
        });
        globalCtx.save();
        globalCtx.translate(p / 2, q / 2);
        globalCtx.scale(g, g);
        globalCtx.translate(-s, -t);
        d = 0;
        for(; d < H.length; d++) {
            H[d].T();
        }
        d = 0;
        for(; d < items.length; d++) {
            items[d].T();
        }
        /*new*/drawRescaledItems(globalCtx);

        if(sa) {
            ba = (3 * ba + qa) / 4;
            ca = (3 * ca + ra) / 4;
            globalCtx.save();
            globalCtx.strokeStyle = "#FFAAAA";
            globalCtx.lineWidth = 10;
            globalCtx.lineCap = "round";
            globalCtx.lineJoin = "round";
            globalCtx.globalAlpha = 0.5;
            globalCtx.beginPath();
            d = 0;
            for(; d < myPoints.length; d++) {
                globalCtx.moveTo(myPoints[d].x, myPoints[d].y);
                globalCtx.lineTo(ba, ca);
            }
            globalCtx.stroke();
            globalCtx.restore();
        }
        globalCtx.restore();
        if(w) {
            if(w.width) {
                globalCtx.drawImage(w, p - w.width - 10, 10);
            }
        }
        /*new*//*mikey*/OnDraw(globalCtx);
        I = Math.max(I, db());
        /*new*//*remap*/ var extras = " " + getScoreBoardExtrasString(I);
        if(0 != I) {
            if(null == ia) {
                ia = new ja(24, "#FFFFFF");
            }
            ia.setValue("Score: " + ~~(I / 100));
            /*new*/ /*remap*/ ia.setValue("Score: " + ~~(I / 100) + extras);
            c = ia.render();
            a$$0 = c.width;
            globalCtx.globalAlpha = 0.2;
            globalCtx.fillStyle = "#000000";
            globalCtx.fillRect(10, q - 10 - 24 - 10, a$$0 + 10, 34);
            globalCtx.globalAlpha = 1;
            globalCtx.drawImage(c, 15, q - 10 - 24 - 5);
            /*new*//*mikey*//*remap*/(myPoints&&myPoints[0]&&OnUpdateMass(db()));
        }
        eb();
        b$$0 = Date.now() - b$$0;
        if(b$$0 > 1E3 / 60) {
            y -= 0.01;
        } else {
            if(b$$0 < 1E3 / 65) {
                y += 0.01;
            }
        }
        if(0.4 > y) {
            y = 0.4;
        }
        if(1 < y) {
            y = 1;
        }
        /*new*//*remap*/displayDebugText(globalCtx,ja); // second param is same as above 'new ??(24,  "#FFFFFF");'
    }

    function cb() {
        globalCtx.fillStyle = isNightMode ? "#111111" : "#F2FBFF";
        globalCtx.fillRect(0, 0, p, q);
        globalCtx.save();
        globalCtx.strokeStyle = isNightMode ? "#AAAAAA" : "#000000";
        globalCtx.globalAlpha = 0.2;
        globalCtx.scale(g, g);
        var a = p / g;
        var b = q / g;
        var c = -0.5 + (-s + a / 2) % 50;
        for(; c < a; c += 50) {
            globalCtx.beginPath();
            globalCtx.moveTo(c, 0);
            globalCtx.lineTo(c, b);
            globalCtx.stroke();
        }
        c = -0.5 + (-t + b / 2) % 50;
        for(; c < b; c += 50) {
            globalCtx.beginPath();
            globalCtx.moveTo(0, c);
            globalCtx.lineTo(a, c);
            globalCtx.stroke();
        }
        globalCtx.restore();
    }

    function eb() {
        if(Aa && wa.width) {
            var a = p / 5;
            globalCtx.drawImage(wa, 5, 5, a, a);
        }
    }

    function db() {
        var a = 0;
        var b = 0;
        for(; b < myPoints.length; b++) {
            a += myPoints[b].nSize * myPoints[b].nSize;
        }
        return a;
    }

    function Ja() {
        w = null;
        if(null != teamScoreBoard || 0 != scoreboard.length) {
            if(null != teamScoreBoard || ka) {
                w = document.createElement("canvas");
                var a = w.getContext("2d");
                var b = 60;
                b = null == teamScoreBoard ? b + 24 * scoreboard.length : b + 180;
                /*new*/b = null == teamScoreBoard ? b + 24 * scoreboard.length : b + 180;
                var c = Math.min(200, 0.3 * p) / 200;
                w.width = 200 * c;
                w.height = b * c;
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
                if(null == teamScoreBoard) {
                    a.font = "20px Ubuntu";
                    b = 0;
                    for(; b < scoreboard.length; ++b) {
                        c = scoreboard[b].name || "An unnamed cell";
                        if(!ka) {
                            c = "An unnamed cell";
                        }
                        if(-1 != myIDs.indexOf(scoreboard[b].id)) {
                            if(myPoints[0].name) {
                                c = myPoints[0].name;
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
                    for(; b < teamScoreBoard.length; ++b) {
                        var d = c + teamScoreBoard[b] * Math.PI * 2;
                        a.fillStyle = fb[b + 1];
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

    function Ka(a, b, c, d, e, l) {
        items.push(this);
        nodes[a] = this;
        this.id = a;
        this.p = this.x = b;
        this.q = this.y = c;
        this.o = this.size = d;
        this.color = e;
        this.a = [];
        this.l = [];
        this.R();
        this.setName(l);
        /*new*/this.splitTime = Date.now();
    }

    function ja(a, b, c, d) {
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
    var $ = h$$0.location.protocol;
    var Va = "https:" == $;
    var ma;                                             //var canvas2;
    var globalCtx;                                      //var globalCtx;
    var B;                                              //var canvas;
    var p;                                              //var width;
    var q;                                              //var height;
    var L = null;                                       //var context = null;
    var ws = null;                                       //var ws = null;
    var s = 0;                                          //var px = 0;
    var t = 0;                                          //var py = 0;
    var myIDs = [];                                         //var myIDs = [];
    var myPoints = [];                                         //var myPoints = [];
    var nodes = {};                                         //var nodes = {};
    var items = [];                                         //var items = [];
    var H = [];                                         //var sprites = [];
    var scoreboard = [];                                //var scoreboard = [];
    var mouseX = 0;                                          //var mouseX = 0;
    var mouseY = 0;                                          //var mouseY = 0;
    var mouseX2 = -1;                                         //var mouseX2 = -1;
    var mouseY2 = -1;                                         //var mouseY2 = -1;
    var bb = 0;                                         //var Ba = 0;
    var G = 0;                                          //var timestamp = 0;
    var E = null;                                       //var result = null;
    var da = 0;                                         //var left = 0;
    var ea = 0;                                         //var bottom = 0;
    var fa = 1E4;                                       //var right = 1E4;
    var ga = 1E4;                                       //var top = 1E4;
    var g = 1;                                          //var ratio = 1;
    var v = null;                                       //var dest = null;
    var showSkins = true;                                      //var showSkins = true;
    var ka = true;                                      //var nickName = true;
    var xa = false;                                     //var isColors = false;
    var ta = false;                                     //var isSpectating = false
    var I = 0;
    var isNightMode = false;                                     //var isNightMode = false;
    var isShowMass = false;                             //var isShowMass = true;
    var P = s = ~~((da + fa) / 2);
    var Q = t = ~~((ea + ga) / 2);
    var R = 1;
    var M = "";
    var teamScoreBoard = null;
    var la = false;
    var sa = false;
    var qa = 0;
    var ra = 0;
    var ba = 0;
    var ca = 0;
    var Qa = 0;
    var fb = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
    var va = false;
    var D = 1;
    var Aa = "ontouchstart" in h$$0 && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var wa = new Image;
    wa.src = "img/split.png";
    var Ra = document.createElement("canvas");
    if("undefined" == typeof console || ("undefined" == typeof DataView || ("undefined" == typeof WebSocket || (null == Ra || (null == Ra.getContext || null == h$$0.localStorage))))) {
        alert("You browser does not support this game, we recommend you to use Firefox to play this");
    } else {
        var Z = null;
        h$$0.setNick = function (a) {
            Ga();
            E = a;
            Ia();
            I = 0;
            /*new*/GM_setValue("nick", a);
            /*new*/console.log("Storing '" + a + "' as nick");
        };
        h$$0.setRegion = V;
        h$$0.setSkins = function (a) {
            showSkins = a;
        };
        h$$0.setNames = function (a) {
            ka = a;
        };
        h$$0.setDarkTheme = function (a) {
            isNightMode = a;
        };
        h$$0.setColors = function (a) {
            xa = a;
        };
        h$$0.setShowMass = function (a) {
            isShowMass = a;
        };
        h$$0.spectate = function () {
            E = null;
            C(1);
            Ga();
        };
        h$$0.setGameMode = function (a) {
            if(a != M) {
                M = a;
                W();
            }
        };
        h$$0.setAcid = function (a) {
            va = a;
        };
        if(null != h$$0.localStorage) {
            if(null == h$$0.localStorage.AB8) {
                h$$0.localStorage.AB8 = 0 + ~~(100 * Math.random());
            }
            Qa = +h$$0.localStorage.AB8;
            h$$0.ABGroup = Qa;
        }
        f.get($ + "//gc.agar.io", function (a) {
            var b = a.split(" ");
            a = b[0];
            b = b[1] || "";
            if(-1 == "DE IL PL HU BR AT UA".split(" ")
                    .indexOf(a)) {
                ya.push("nazi");
            }
            if(-1 == ["UA"].indexOf(a)) {
                ya.push("ussr");
            }
            if(S.hasOwnProperty(a)) {
                if("string" == typeof S[a]) {
                    if(!v) {
                        V(S[a]);
                    }
                } else {
                    if(S[a].hasOwnProperty(b)) {
                        if(!v) {
                            V(S[a][b]);
                        }
                    }
                }
            }
        }, "text");
        setTimeout(function () {}, 3E5);
        var S = {
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
        h$$0.connect = Ha;
        var aa = 500;
        var La = -1;
        var Ma = -1;
        var w = null;
        var y = 1;
        var ia = null;
        var J = {};
        var ya = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook".split(";");
        var gb = ["8", "nasa"];
        var hb = ["m'blob"];
        Ka.prototype = {
            id: 0,
            a: null,
            l: null,
            name: null,
            nameCache: null,
            J: null,
            x: 0,
            y: 0,
            size: 0,
            p: 0,
            q: 0,
            o: 0,
            nx: 0,
            ny: 0,
            nSize: 0,
            W: 0,
            L: 0,
            ja: 0,
            ba: 0,
            destroyed: false,
            isVirus: false,
            j: false,
            M: true,
            S: function () {
                var a;
                a = 0;
                for(; a < items.length; a++) {
                    if(items[a] == this) {
                        items.splice(a, 1);
                        break;
                    }
                }
                delete nodes[this.id];
                a = myPoints.indexOf(this);
                if(-1 != a) {
                    ta = true;
                    myPoints.splice(a, 1);
                }
                a = myIDs.indexOf(this.id);
                if(-1 != a) {
                    myIDs.splice(a, 1);
                }
                this.destroyed = true;
                H.push(this);
            },
            h: function () {
                return Math.max(~~(0.3 * this.size), 24);
            },
            setName: function (a) {
                if(this.name = a) {
                    if(null == this.nameCache) {
                        this.nameCache = new ja(this.h(), "#FFFFFF", true, "#000000");
                    } else {
                        this.nameCache.H(this.h());
                    }
                    this.nameCache.setValue(this.name);
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
                var a = 10;
                if(20 > this.size) {
                    a = 0;
                }
                if(this.isVirus) {
                    a = 30;
                }
                var b = this.size;
                if(!this.isVirus) {
                    b *= g;
                }
                b *= y;
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
                var k = this;
                var h = this.isVirus ? 0 : (this.id / 1E3 + G / 1E4) % (2 * Math.PI);
                d = 0;
                for(; d < c; ++d) {
                    var f = a$$0[d].e;
                    e = a$$0[(d - 1 + c) % c].e;
                    l = a$$0[(d + 1) % c].e;
                    if(15 < this.size && (null != L && 20 < this.size * g)) {
                        var m = false;
                        var p = a$$0[d].x;
                        var q = a$$0[d].y;
                        L.ia(p - 5, q - 5, 10, 10, function (a) {
                            if(a.Q != k) {
                                if(25 > (p - a.x) * (p - a.x) + (q - a.y) * (q - a.y)) {
                                    m = true;
                                }
                            }
                        });
                        if(!m) {
                            if(a$$0[d].x < da || (a$$0[d].y < ea || (a$$0[d].x > fa || a$$0[d].y > ga))) {
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
                    if(this.isVirus) {
                        if(0 == d % 2) {
                            l += 5;
                        }
                    }
                    a$$0[d].x = this.x + Math.cos(e * d + h) * l;
                    a$$0[d].y = this.y + Math.sin(e * d + h) * l;
                }
            },
            K: function () {
                var a;
                a = (G - this.L) / 120;
                a = 0 > a ? 0 : 1 < a ? 1 : a;
                var b = 0 > a ? 0 : 1 < a ? 1 : a;
                this.h();
                if(this.destroyed && 1 <= b) {
                    var c = H.indexOf(this);
                    if(-1 != c) {
                        H.splice(c, 1);
                    }
                }
                this.x = a * (this.nx - this.p) + this.p;
                this.y = a * (this.ny - this.q) + this.q;
                this.size = b * (this.nSize - this.o) + this.o;
                return b;
            },
            I: function () {
                return this.x + this.size + 40 < s - p / 2 / g || (this.y + this.size + 40 < t - q / 2 / g || (this.x - this.size - 40 > s + p / 2 / g || this.y - this.size - 40 > t + q / 2 / g)) ? false : true;
            },
            T: function () {
                if(this.I()) {
                    var a = !this.isVirus && (!this.j && 0.4 > g);
                    if(5 > this.C()) {
                        a = true;
                    }
                    if(this.M && !a) {
                        var b = 0;
                        for(; b < this.a.length; b++) {
                            this.a[b].e = this.size;
                        }
                    }
                    this.M = a;
                    globalCtx.save();
                    this.ba = G;
                    b = this.K();
                    if(this.destroyed) {
                        globalCtx.globalAlpha *= 1 - b;
                    }
                    globalCtx.lineWidth = 10;
                    globalCtx.lineCap = "round";
                    globalCtx.lineJoin = this.isVirus ? "miter" : "round";
                    if(xa) {
                        globalCtx.fillStyle = "#FFFFFF";
                        globalCtx.strokeStyle = "#AAAAAA";
                    } else {
                        globalCtx.fillStyle = this.color;
                        globalCtx.strokeStyle = this.color;
                    }
                    /*new*//*remap*/ drawCellInfos(xa, globalCtx, this);
                    if(a) {
                        globalCtx.beginPath();
                        globalCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
                    } else {
                        this.ha();
                        globalCtx.beginPath();
                        var c = this.C();
                        globalCtx.moveTo(this.a[0].x, this.a[0].y);
                        b = 1;
                        for(; b <= c; ++b) {
                            var d = b % c;
                            globalCtx.lineTo(this.a[d].x, this.a[d].y);
                        }
                    }
                    globalCtx.closePath();
                    c = this.name.toLowerCase();
                    //if(!this.j && (Oa && ":teams" != M)) {
                    //    if(-1 != ya.indexOf(c)) {
                    //        if(!J.hasOwnProperty(c)) {
                    //            J[c] = new Image;
                    //            J[c].src = "skins/" + c + ".png";
                    //        }
                    //        b = 0 != J[c].width && J[c].complete ? J[c] : null;
                    //    } else {
                    //        b = null;
                    //    }
                    //} else {
                    //    b = null;
                    //}
                    /*new*//*remap*/var b = customSkins(this.name, ya, J, showSkins, M);
                    b = (d = b) ? -1 != hb.indexOf(c) : false;
                    if(!a) {
                        globalCtx.stroke();
                    }
                    globalCtx.fill();
                    /*new*/globalCtx.globalAlpha = isSpecialSkin(this.name.toLowerCase()) || _.contains(myIDs, this.id)  ? 1 : 0.5;

                    if(!(null == d)) {
                        if(!b) {
                            globalCtx.save();
                            globalCtx.clip();
                            globalCtx.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                            globalCtx.restore();
                        }
                    }
                    if(xa || 15 < this.size) {
                        if(!a) {
                            globalCtx.strokeStyle = "#000000";
                            globalCtx.globalAlpha *= 0.1;
                            globalCtx.stroke();
                        }
                    }
                    globalCtx.globalAlpha = 1;
                    if(null != d) {
                        if(b) {
                            globalCtx.drawImage(d, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                        }
                    }
                    b = -1 != myPoints.indexOf(this);
                    a = ~~this.y;
                    if((ka || b) && (this.name && (this.nameCache && (null == d || -1 == gb.indexOf(c)))) || this.isVirus) {
                        /*new*/if(this.isVirus && null == this.nameCache){
                            /*new*/     this.setName(getVirusShotsNeededForSplit(this.nSize).toString());
                            /*new*/}
                        d = this.nameCache;
                        d.setValue(this.name);
                        /*new*/setCellName(this, d);
                        d.H(this.h());
                        c = Math.ceil(10 * g) / 10;
                        d.setScale(c);

                        if(d.toString() == 20){console.log("found it!")}

                        /*new*/setVirusInfo(this, d, c);
                        d = d.render();
                        var f = ~~(d.width / c);
                        var l = ~~(d.height / c);
                        /*new*/if(shouldRelocateName.call(this))
                        /*new*/    { globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a + ~~(l ), f, l); a += d.height / 2 / c + 8; }
                        /*new*/else
                            globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(l / 2), f, l);
                        a += d.height / 2 / c + 4;
                    }
                    /*new*/var massValue = (~~(this.size * this.size / 100)).toString();
                    /*new*/if(showVisualCues){
                        /*new*/if(_.contains(myIDs, this.id)) {massValue += " (" + getBlobShotsAvailable(this).toString() + ")";}
                        /*new*/}
                    if(isShowMass) {
                        if(b || 0 == myPoints.length && ((!this.isVirus || this.j) && 20 < this.size)) {
                            if(null == this.J) {
                                this.J = new ja(this.h() / 2, "#FFFFFF", true, "#000000");
                            }
                            b = this.J;
                            b.H(this.h() / 2);
                            b.setValue(~~(this.size * this.size / 100));
                            /*new*/b.setValue(massValue);

                            c = Math.ceil(10 * g) / 10;
                            b.setScale(c);
                            /*new*/b.setScale(c * ( shouldRelocateName.call(this) ? 2 : 1));

                            d = b.render();
                            f = ~~(d.width / c);
                            l = ~~(d.height / c);
                            /*new*/if(shouldRelocateName.call(this))
                            /*new*/    globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a + ~~(l), f, l);
                            /*new*/else
                                globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(l / 2), f, l);
                        }
                    }
                    globalCtx.restore();
                }
            }
        };
        ja.prototype = {
            _value: "",
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
            setScale: function (a) {
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
            setValue: function (a) {
                if(a != this._value) {
                    this._value = a;
                    this.g = true;
                }
            },
            render: function () {
                if(null == this.m) {
                    this.m = document.createElement("canvas");
                    this.O = this.m.getContext("2d");
                }
                if(this.g) {
                    this.g = false;
                    var a = this.m;
                    var b = this.O;
                    var c = this._value;
                    var d = this.v;
                    var e = this.r;
                    var l = e + "px Ubuntu";
                    b.font = l;
                    var k = ~~(0.2 * e);
                    a.width = (b.measureText(c)
                            .width + 6) * d;
                    a.height = (e + k) * d;
                    b.font = l;
                    b.scale(d, d);
                    b.globalAlpha = 1;
                    b.lineWidth = 3;
                    b.strokeStyle = this.s;
                    b.fillStyle = this.N;
                    if(this.P) {
                        b.strokeText(c, 3, e - k / 2);
                    }
                    b.fillText(c, 3, e - k / 2);
                }
                return this.m;
            }
        };
        if(!Date.now) {
            Date.now = function () {
                return(new Date)
                    .getTime();
            };
        }
        var Ua = {
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
        h$$0.onload = Sa;
    }
})(unsafeWindow, unsafeWindow.jQuery);


unsafeWindow.angal_data = {
    entities : {
        me : {
            max : 0,
            total : 0
        }
    },
    mapDoc : null,
    infoDoc : null,
    server: {
        name: "",
        list : [],
        set: function(name) {
            this.name = name;
            jQuery("#angal_server").html(name);
            this.list.push(name);
            if (this.list.length > 10) {
                this.list = this.list.slice(-10);
            }
            this.updateList();
            this.saveList();
        },
        updateList : function() {
            var list_tag = jQuery("#angal_serverList");
            list_tag.html("");
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i] == this.name) {
                    list_tag.prepend('<li>[S] <b>' + this.list[i] + '</b></li>');
                } else {
                    list_tag.prepend('<li><a onClick="window.angal_connectDirect(\'' + this.list[i] + '\')">[C]</a> ' + this.list[i] + '</li>');
                }
            }
        },
        saveList : function() {
            GM_setValue("angal_server_list", this.list);
        },
        loadList : function() {
            this.list = GM_getValue("angal_server_list");
            if (this.list == null || this.list == undefined) {
                this.list = [];
            }
        }
    }
};



unsafeWindow.op_onLoad = function() {
    console.log("Running onload");
    unsafeWindow.angal_data.server.loadList();
    unsafeWindow.angal_data.server.updateList();

    jQuery("#overlays").append(
        '<div style="position: absolute; left: 0px; right: 0px; top: 0px; z-index: 3; display: block;">'
        + '<div style="height: 50px; width: 500px; margin: 3px auto;">'
        + '<div style="height: 80px; width: 240px; float:left; background-color: #FFFFFF; margin: 0px 5px; border-radius: 15px; padding: 5px 15px 5px 15px;">'
        + '<center>Version : ' + _version_ + "</center>Thanks to <a href='http://pastebin.com/wE1LN8fW'>angal & DiaLight's script</a> for server select code & UI.<BR />"
        + '<br /> '
        + '</div>'
        + '<div style="height: 50px; width: 240px; float:left; background-color: #FFFFFF; margin: 0px 5px; border-radius: 15px; padding: 5px 15px 5px 15px;">'
        + 'IP: <b id="angal_server">None</b> <br /> '
        + '<a id="angal_server_reconnect">Reconnect</a> || <a id="angal_server_change">Change</a> || <a id="angal_server_copy">Copy</a>'
        + '</div>'
        + '</div>'
        + '</div>'
    );
    jQuery("#overlays").append(
        //'<div style="height: 1px; position: absolute; left: 0px; right: 0px; top: 0px; z-index: 1; display: block;">'
        //+ '<div style="height: 1px; width: 950px; margin: 100px auto;">'
        //+ '<div style="height: 50px; width: 200px; float:left; background-color: #FFFFFF; margin: 0px 5px; border-radius: 15px; padding: 5px 15px 5px 15px;">'
        //+ 'Agar.io client by <br /><b>angal</b> and <b>DiaLight</b>'
        //+ '</div>'
        //+ '</div>'
        //+ '</div>'

        '<div style="height: 641px; width: 225px; position: absolute; top: 50%;transform: translate(0px, -50%);left: 1225px; background-color: #FFFFFF; margin: 0px 5px; border-radius: 15px; padding: 5px 15px 5px 15px;">'
        + 'Last servers: <br /> '
        + '<ol id="angal_serverList"></ol>'
        + '</div>'
    );
    jQuery("#angal_server_copy").click(function() {
        GM_setClipboard(unsafeWindow.angal_data.server.name, "text");
    });
    jQuery("#angal_server_change").click(function() {
        var name = prompt("Server Ip:", unsafeWindow.angal_data.server.name);
        if (name == null) {
            return;
        }
        unsafeWindow.angal_connectDirect(name);
    });
    jQuery("#angal_server_reconnect").click(function() {
        unsafeWindow.angal_connectDirect(unsafeWindow.angal_data.server.name);
    });
}

// ====================================== Stats Screen ===========================================================

var __STORAGE_PREFIX = "mikeyk730__";
var chart_update_interval = 10;
jQuery('body').append('<div id="chart-container" style="display:none; position:absolute; height:176px; width:300px; left:10px; bottom:44px"></div>');
var checkbox_div = jQuery('#settings input[type=checkbox]').closest('div');
AppendCheckbox(checkbox_div, 'chart-checkbox', 'Show chart', display_chart, OnChangeDisplayChart);
AppendCheckbox(checkbox_div, 'stats-checkbox', 'Show stats', display_stats, OnChangeDisplayStats);
jQuery("#helloDialog").css('left','230px');
jQuery('#overlays').append('<div id="stats" style="position: absolute; top:50%; left: 450px; width: 750px; background-color: #FFFFFF; border-radius: 15px; padding: 5px 15px 5px 15px; transform: translate(0,-50%)"><div id="statArea" style="vertical-align:top; width:350px; display:inline-block;"></div><div id="pieArea" style="vertical-align: top; width:350px; height:250px; display:inline-block; vertical-align:top"> </div><div id="gainArea" style="width:350px; display:inline-block; vertical-align:top"></div><div id="lossArea" style="width:350px; display:inline-block;"></div><div id="chartArea" style="width:700px; display:inline-block; vertical-align:top"></div></div>');
jQuery('#stats').hide(0);

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
    chart_counter = 0;
    jQuery('#chart-container').empty();
}

function UpdateChartData(mass)
{
    chart_counter++;
    if (chart_counter%chart_update_interval > 0)
        return false;

    chart_data.push({
        x: chart_counter,
        y: mass/100
    });
    return true;
}

function CreateChart(e, color, interactive)
{
    return new CanvasJS.Chart(e,{
        interactivityEnabled: interactive,
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
};

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
    if (other.isVirus){
        stats.viruses.num++;
        stats.viruses.mass += mass; //TODO: shouldn't add if  game mode is teams
    }
    else if (Math.floor(mass) <= 400 && !other.name){
        stats.pellets.num++;
        stats.pellets.mass += mass;
    }
    // heuristic to determine if mass is 'w', not perfect
    else if (!other.name && mass <= 1444 && (mass >= 1369 || (other.x == other.ox && other.y == other.oy))){
        //console.log('w', mass, other.name, other);
        if (other.color != me.color){ //don't count own ejections, again not perfect
            stats.w.num++;
            stats.w.mass += mass;
        }
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
    }
}

function OnLoseMass(me, other)
{
    var mass = me.size * me.size;
    var key = other.name + ':' + other.color;
    if (stats.losses[key] == undefined)
        stats.losses[key] = {num: 0, mass: 0};;
    stats.losses[key].num++;
    stats.losses[key].mass += mass;
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

function GetTopN(n, p)
{
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

function AppendTopN(n, p, list)
{
    var a = GetTopN(n,p);
    for (var i = 0; i < a.length; ++i){
        var text = a[i].name + ' (' + (p == 'gains' ? '+' : '-') + a[i].mass + ' mass)';
        list.append('<li style="font-size: 20px; "><div style="width: 20px; height: 20px; border-radius: 50%; margin-right:5px; background-color: ' + a[i].color + '; display: inline-block;"></div>' + text + '</li>');
    }
    return a.length > 0;
}

function DrawStats(game_over)
{
    if (!stats) return;

    jQuery('#statArea').empty();
    jQuery('#pieArea').empty();
    jQuery('#gainArea').empty();
    jQuery('#lossArea').empty();
    jQuery('#chartArea').empty();
    jQuery('#stats').show();

    if (game_over){
        stats.time_of_death = Date.now();
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
        jQuery('#chartArea').width(700).height(250);
        stat_chart = CreateChart('chartArea', my_color, true);
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
}

var g_stat_spacing = 0;
var g_display_width = 220;
var g_layout_width = g_display_width;

function AppendText(text, context, style)
{
    context.globalAlpha = styles[style].alpha;
    context.font = styles[style].font;
    g_stat_spacing += styles[style].spacing;

    var width = context.measureText(text).width;
    g_layout_width = Math.max(g_layout_width, width);
    context.fillText(text, g_layout_width/2 - width/2, g_stat_spacing);
}

function RenderStats(reset)
{
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

unsafeWindow.OnGameStart = function(cells)
{
    my_cells = cells;
    ResetChart();
    ResetStats();
    RenderStats(true);
}

unsafeWindow.OnShowOverlay = function(game_in_progress)
{
    DrawStats(!game_in_progress);
}

unsafeWindow.OnUpdateMass = function(mass)
{
    stats.high_score = Math.max(stats.high_score, mass);
    UpdateChart(mass, GetRgba(my_cells[0].color,0.4));
}

unsafeWindow.OnCellEaten = function(predator, prey)
{
    if (!my_cells) return;

    if (my_cells.indexOf(predator) != -1){
        OnGainMass(predator, prey);
        RenderStats(false);
    }
    if (my_cells.indexOf(prey) != -1){
        OnLoseMass(prey, predator);
        RenderStats(false);
    }
}

unsafeWindow.OnLeaderboard = function(position)
{
    stats.top_slot = Math.min(stats.top_slot, position);
}

unsafeWindow.OnDraw = function(context)
{
    display_stats && stat_canvas && context.drawImage(stat_canvas, 10, 10);
}


// ===============================================================================================================
$("label:contains(' Dark Theme') input").prop('checked', true);
setDarkTheme(true);
$("label:contains(' Show mass') input").prop('checked', true);
setShowMass(true);
$('#nick').val(GM_getValue("nick", ""));
// default helloDialog has a margin of 10 px. take that away to make it line up with our other dialogs.
$("#helloDialog").css("marginTop", "0px");


var agariomodsSkins = ("1up;8ball;agariomods.com;albania;android;anonymous;apple;atari;awesome;baka;bandaid;bane;baseball;basketball;batman;beats;bender;bert;bitcoin;blobfish;bobross;bobsaget;boo;boogie2988;borg;bp;breakfast;buckballs;burgundy;butters;byzantium;charmander;chechenya;chickfila;chocolate;chrome;cj;coca cola;cokacola;controless;converse;cornella;creeper;cyprus;czechrepublic;deadpool;deal with it;deathstar;derp;dickbutt;doge;doggie;dolan;domo;domokun;dong;donut;dreamcast;drunken;ebin;egg;egoraptor;egypt;electrokitty;epicface;expand;eye;facebook;fast forward;fastforward;fbi;fidel;finn;firefox;fishies;flash;florida;freeman;freemason;friesland;frogout;fuckfacebook;gaben;garfield;gaston;generikb;getinmybelly;getinthebox;gimper;github;giygas;gnomechild;gonzo;grayhat;halflife;halflife3;halo;handicapped;hap;hatty;hebrew;heisenburg;helix;hipsterwhale;hitler;honeycomb;hydro;iceland;ie;illuminati;imgur;imperial japan;imperialjapan;instagram;isaac;isis;isreal;itchyfeetleech;ivysaur;james bond;java;jew;jewnose;jimmies;kappa;kenny;kingdomoffrance;kingjoffrey;kirby;kitty;klingon;knightstemplar;knowyourmeme;kyle;ladle;lenny;lgbt;libertyy;liechtenstien;linux;love;luigi;macedonia;malta;mario;mars;maryland;masterball;mastercheif;mcdonalds;meatboy;meatwad;megamilk;mike tyson;mlg;moldova;mortalkombat;mr burns;mr.bean;mr.popo;n64;nasa;nazi;nick;nickelodeon;nipple;northbrabant;nosmoking;notch;nsa;obey;osu;ouch;pandaexpress;pedo;pedobear;peka;pepe;pepsi;pewdiepie;pi;pig;piggy;pika;pinkfloyd;pinkstylist;piratebay;pizza;playstation;poop;potato;quantum leap;rageface;rewind;rockstar;rolfharris;rss;satan;serbia;shell;shine;shrek;sinistar;sir;skull;skype;skyrim;slack;slovakia;slovenia;slowpoke;smash;snafu;snapchat;soccer;soliare;solomid;somalia;space;spawn;spiderman;spongegar;spore;spy;squirtle;stalinjr;starbucks;starrynight;stitch;stupid;summit1g;superman;taco;teamfortress;tintin;transformer;transformers;triforce;trollface;tubbymcfatfuck;turkey;twitch;twitter;ukip;uppercase;uruguay;utorrent;voyager;wakawaka;wewlad;white  light;windows;wwf;wykop;yinyang;ylilauta;yourmom;youtube;zoella;zoidberg").split(";");
