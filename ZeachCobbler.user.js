// ==UserScript==
// @name         Zeach Cobbler
// @namespace    https://github.com/RealDebugMonkey/ZeachCobbler
// @updateURL    https://rawgit.com/RealDebugMonkey/ZeachCobbler/master/ZeachCobbler.user.js
// @downloadURL  https://rawgit.com/RealDebugMonkey/ZeachCobbler/master/ZeachCobbler.user.js
// @contributer  The White Light -- You rock the maths.
// @contributer  Angal - For the UI additions and server select code
// @contributer  Agariomods.com (and Electronoob) for the innovative imgur style skins
// @contributer  Agariomods.com again for maintaining the best extended repo out there.
// @codefrom     debug text output derived from Apostolique's bot code -- https://github.com/Apostolique/Agar.io-bot
// @version      0.09.5
// @description  Agario powerups.
// @author       DebugMonkey
// @match        http://agar.io
// @changes     0.09.0 - Fixed script break caused by recent changes
//                   1 - Shots display next to mass restored
//                     - Added possible fix for times we might somehow (?!) miss player spawning.
//                   2 - Press 'A' to toggle acid mode
//                   3 - Name still moved for bitdo skins even with visual assist turned off
//                   4 - Changed repos (again)
//                   5 - O/P keys didn't match documentation. Changed keys to match documentation.
//                       O now enables/disables virus firing via mouse, P is for target fixation toggle
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
var _version_ = '0.09.5';
console.log("Running Zeach Cobbler v2 the reckoning!");
$.getScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash.min.js");


(function(f, g) {
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
    var showCheats = true;
    var grazingTargetFixation = false;
    var visualizeGrazing = GM_getValue('visualizeGrazing', true);
    var selectedBlobID = null;
    var isAcid = false;
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
        My_Color ="#3371FF";

    // ====================== Virtual Point System ==============================================================

    // ======================   Utility code    ==================================================================
    function getSelectedBlob(){
        if(!_.includes(myIDs, selectedBlobID)){
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

    // Gets any item which is a threat including bigger players and viruses
    function getThreats(blobArray, myMass) {
        var threatArray = _.filter(blobArray, function(element){
            var elementMass = getMass(element.size);
            if(element.isVirus) {
                return myMass >= elementMass;
            }
            return elementMass > myMass * Large;
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
        //console.log("pelletCount: " + pelletCount);
        return pelletCount;
    }
// ======================   UI stuff    ==================================================================
// UI stuff

    function drawRescaledItems(ctx) {
        if (showCheats && isPlayerAlive()) {
            drawGrazingLines(ctx);
            drawMapBorders(ctx, isNightMode);
            drawSplitGuide(ctx, getSelectedBlob());
        }
    }
    function getScoreBoardExtrasString(F) {
        var extras = " ";
        if (showCheats) {
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
        if (showCheats) {
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
        if(!showCheats){
            return cell.color;
        }
        var color = cell.color;
        if (myPoints.length > 0 && !isTeamMode()) {
            var size_this =  getMass(cell.size);
            var size_that =  ~~(getSelectedBlob().size * getSelectedBlob().size / 100);
            if (cell.isVirus || myPoints.length === 0) {
                color = "#666666"; // Viruses are always gray, and everything is gray when dead
            } else if (~myPoints.indexOf(cell)) {
                color = "#3371FF";
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
            if (isPlayerAlive()) {
                debugStrings.push("Location: " + Math.floor(getSelectedBlob().x) + ", " + Math.floor(getSelectedBlob().y));
            }
        }
        if(2 <= displayDebugInfo) {
            debugStrings.push("M - suspend mouse: " + (suspendMouseUpdates ? "On" : "Off"));
            debugStrings.push("O - grazing target fixation :" + (grazingTargetFixation ? "On" : "Off"));
            if(grazingTargetFixation){ debugStrings.push("  (T) to retarget");}
            debugStrings.push("P - right click: " + (rightClickFires ? "Fires @ virus" : "Default"))
            debugStrings.push("V - visualize grazing: " + (visualizeGrazing ? "On" : "Off"))
            debugStrings.push("Z - zoom: " + zoomFactor.toString());
            debugStrings.push("myIDs.length " + myIDs.length + " myPoints.length: " + myPoints.length);
        }
        var offsetValue = 20;
        var text = new agarTextFunction(textSize, (isNightMode ? '#F2FBFF' : '#111111'));

        for (var i = 0; i < debugStrings.length; i++) {
            text.setValue(debugStrings[i]);
            var textRender = text.render();
            d.drawImage(textRender, 20, offsetValue);
            offsetValue += textRender.height;
        }
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
        // HACK: On update change this function name to correct function
        var fireFunction = B;
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
    var agariomodsSkins = ("1up;8ball;LLhyy5H;agariomods.com;albania;android;anonymous;apple;atari;awesome;baka;bandaid;bane;baseball;basketball;" +
    "batman;beats;bender;bert;bitcoin;blobfish;bobross;bobsaget;boo;boogie2988;borg;bp;breakfast;buckballs;burgundy;butters;byzantium;" +
    "charmander;chechenya;chickfila;chocolate;chrome;cj;coca cola;cokacola;controless;converse;cornella;creeper;cyprus;czechrepublic;deadpool;" +
    "deal with it;deathstar;derp;dickbutt;doge;doggie;dolan;domo;domokun;dong;donut;dreamcast;ebin;egg;egoraptor;egypt;epicface;expand;eye;" +
    "facebook;fast forward;fastforward;fbi;fidel;finn;firefox;fishies;flash;florida;freeman;freemason;friesland;frogout;fuckfacebook;gaben;" +
    "garfield;gaston;getinmybelly;getinthebox;gimper;github;giygas;gnomechild;gonzo;grayhat;halflife;halflife3;halo;handicapped;hap;hatty;" +
    "hebrew;heisenburg;helix;hipsterwhale;hitler;honeycomb;hydro;iceland;ie;illuminati;imgur;imperial japan;imperialjapan;instagram;isaac;" +
    "isis;isreal;itchyfeetleech;ivysaur;james bond;java;jew;jewnose;jimmies;kappa;kenny;kingdomoffrance;kingjoffrey;kirby;klingon;knightstemplar;" +
    "knowyourmeme;kyle;ladle;lenny;lgbt;libertyy;liechtenstien;linux;love;luigi;macedonia;malta;mario;mars;maryland;masterball;mastercheif;" +
    "mcdonalds;meatboy;meatwad;megamilk;mike tyson;mlg;moldova;mortalkombat;mr burns;mr.bean;mr.popo;n64;nasa;nazi;nick;nickelodeon;nipple;" +
    "northbrabant;nosmoking;notch;nsa;obey;osu;ouch;pandaexpress;pedo;pedobear;peka;pepe;pepsi;pewdiepie;pi;pig;piggy;pika;pinkfloyd;pinkstylist;" +
    "piratebay;pizza;playstation;poop;potato;quantum leap;rageface;rewind;rockstar;rolfharris;rss;satan;serbia;shell;shine;shrek;sinistar;sir;skull;" +
    "skype;skyrim;slack;slovakia;slovenia;slowpoke;smash;snafu;snapchat;soccer;soliare;solomid;somalia;space;spawn;spiderman;spongegar;spore;spy;" +
    "squirtle;starbucks;starrynight;stitch;stupid;superman;taco;teamfortress;tintin;transformers;triforce;trollface;tubbymcfatfuck;turkey;twitch;" +
    "twitter;ukip;uppercase;uruguay;utorrent;voyager;wakawaka;wewlad;white  light;windows;wwf;wykop;yinyang;ylilauta;yourmom;youtube;zoella;zoidberg;" +
    "kitty;electrokitty").split(";");

    var extendedSkins = {
        "billy mays" : "http://i.imgur.com/HavxFJu.jpg",
        "stannis": "http://i.imgur.com/JyZr0CI.jpg",
        "shrek is love" : "http://i.imgur.com/ZErUBRq.jpg",
        "shrek is life" : "http://i.imgur.com/ZErUBRq.jpg",
        "white light" : "http://i.imgur.com/cAlKdho.jpg",
        "blueeyes" : "http://i.imgur.com/wxCfUws.jpg",
        "ygritte"  : "http://i.imgur.com/lDIFCT1.png",
    }

    var skinsSpecial = {
        "white  light": "https://i.imgur.com/4y8szAE.png",
        "tubbymcfatfuck" : "http://tinyurl.com/TubbyMcFatFuck",
        "texas  doge" : "http://i.imgur.com/MVsLldL.jpg",
        "doge  helper" : "http://i.imgur.com/FzZebpk.jpg",
        "controless" : "https://i.imgur.com/uD5SW8X.jpg",
        "sqochit" : "http://i.imgur.com/AnowvFI.jpg",
        "drunken" : "http://i.imgur.com/JeKNRss.png",
        "lord kience" : "http://i.imgur.com/b2UXk15.png",
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
            var indexloc = _.indexOf(myIDs, selectedBlobID)
            d.preventDefault();
            if(-1 === indexloc){
                selectedBlobID = myPoints[0].id;
                console.log("Had to select new blob. Its id is " + selectedBlobID);
                return nodes[selectedBlobID];
            }
            indexloc += 1;
            if(indexloc >= myIDs.length){
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
            showCheats = !showCheats;
            if(!showCheats) {
                zoomFactor = 10;
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
            B(20);
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
        if (0 == myIDs.length){
            timeSpawned = Date.now();
        }
    }
    function setCellName(cell, d) {
        if (showCheats) {
            if (-1 != myIDs.indexOf(cell.id) && myIDs.length > 1) {
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
        if (showCheats) {
            if (cell.isVirus) {
                cell.nameCache.setValue(getVirusShotsNeededForSplit(cell.nSize));
                var nameSizeMultiplier = 4;
                d.setScale(c * 4);
            }
        }
        if (cell.isVirus && !showCheats) {
            cell.nameCache.setValue(" ");
        }
    }
// ======================   Start main    ==================================================================

    function Pa() {
        ja = true;
        xa();
        setInterval(xa, 18E4);
        A = ka = document.getElementById("canvas");
        globalCtx = A.getContext("2d");
        /*new*/ A.onmousewheel = function (e) {zoomFactor = e.wheelDelta > 0 ? 10 : 11;}
        A.onmousedown = function(a) {
            /*new*/if(isPlayerAlive() && rightClickFires){fireAtVirusNearestToCursor();}
            /*new*/ return;
            /*new*/ //event.preventDefault(); // FUTURE: Electronoob mousedrag fix. is this needed?
            if (ya) {
                var b = a.clientX - (5 + p / 5 / 2);
                var c = a.clientY - (5 + p / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= p / 5 / 2) {
                    K();
                    B(17);
                    return;
                }
            }
            S = a.clientX;
            T = a.clientY;
            la();
            K();
        };
        A.onmousemove = function(a) {
            S = a.clientX;
            T = a.clientY;
            la();
        };
        A.onmouseup = function(a) {};
        if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", za, false);
        } else {
            document.body.onmousewheel = za;
        }
        var a = false;
        var b = false;
        var c = false;
        f.onkeydown = function(d) {
            if (!(32 != d.keyCode)) {
                if (!a) {
                    K();
                    B(17);
                    a = true;
                }
            }
            if (!(81 != d.keyCode)) {
                if (!b) {
                    B(18);
                    b = true;
                }
            }
            if (!(87 != d.keyCode)) {
                if (!c) {
                    K();
                    B(21);
                    c = true;
                }
            }
            if (27 == d.keyCode) {
                Aa(true);
            }
            /*new*/customKeyDownEvents(d);
        };
        f.onkeyup = function(d) {
            if (32 == d.keyCode) {
                a = false;
            }
            if (87 == d.keyCode) {
                c = false;
            }
            if (81 == d.keyCode) {
                if (b) {
                    B(19);
                    b = false;
                }
            }
        };
        f.onblur = function() {
            B(19);
            c = b = a = false;
        };
        f.onresize = Ba;
        Ba();
        if (f.requestAnimationFrame) {
            f.requestAnimationFrame(Ca);
        } else {
            setInterval(ma, 1E3 / 60);
        }
        setInterval(K, 40);
        if (u) {
            g("#region").val(u);
        }
        Da();
        U(g("#region").val());
        if (null == ws) {
            if (u) {
                V();
            }
        }
        g("#overlays").show();
        /*new*/op_onLoad();
    }

    function za(a) {
        C *= Math.pow(0.9, a.wheelDelta / -120 || (a.detail || 0));
        if (1 > C) {
            C = 1;
        }
        if (C > 4 / h$$0) {
            C = 4 / h$$0;
        }
    }

    function Qa() {
        if (0.35 > h$$0) {
            L = null;
        } else {
            var a = Number.POSITIVE_INFINITY;
            var b = Number.POSITIVE_INFINITY;
            var c = Number.NEGATIVE_INFINITY;
            var d = Number.NEGATIVE_INFINITY;
            var e = 0;
            var q = 0;
            for (; q < items.length; q++) {
                if (items[q].shouldRender()) {
                    e = Math.max(items[q].size, e);
                    a = Math.min(items[q].x, a);
                    b = Math.min(items[q].y, b);
                    c = Math.max(items[q].x, c);
                    d = Math.max(items[q].y, d);
                }
            }
            L = QUAD.init({
                minX: a - (e + 100),
                minY: b - (e + 100),
                maxX: c + (e + 100),
                maxY: d + (e + 100)
            });
            q = 0;
            for (; q < items.length; q++) {
                if (a = items[q], a.shouldRender()) {
                    b = 0;
                    for (; b < a.points.length; ++b) {
                        L.insert(a.points[b]);
                    }
                }
            }
        }
    }

    function la() {
        mouseX2 = (S - p / 2) / h$$0 + s;
        mouseY2 = (T - r / 2) / h$$0 + t;
    }

    function xa() {
        if (null == Y) {
            Y = {};
            g("#region").children().each(function() {
                var a = g(this);
                var b = a.val();
                if (b) {
                    Y[b] = a.text();
                }
            });
        }
        g.get(F + "//m.agar.io/info", function(a) {
            var b = {};
            var c;
            for (c in a.regions) {
                var d = c.split(":")[0];
                b[d] = b[d] || 0;
                b[d] += a.regions[c].numPlayers;
            }
            for (c in b) {
                g('#region option[value="' + c + '"]').text(Y[c] + " (" + b[c] + " players)");
            }
        }, "json");
    }

    function Ea() {
        g("#adsBottom").hide();
        g("#overlays").hide();
        Da();
    }

    function U(a) {
        if (a) {
            if (a != u) {
                if (g("#region").val() != a) {
                    g("#region").val(a);
                }
                u = f.localStorage.location = a;
                g(".region-message").hide();
                g(".region-message." + a).show();
                g(".btn-needs-server").prop("disabled", false);
                if (ja) {
                    V();
                }
            }
        }
    }

    function Aa(a) {
        D = null;
        g("#overlays").fadeIn(a ? 200 : 3E3);
        if (!a) {
            g("#adsBottom").fadeIn(3E3);
        }
    }

    function Da() {
        if (g("#region").val()) {
            f.localStorage.location = g("#region").val();
        } else {
            if (f.localStorage.location) {
                g("#region").val(f.localStorage.location);
            }
        }
        if (g("#region").val()) {
            g("#locationKnown").append(g("#region"));
        } else {
            g("#locationUnknown").append(g("#region"));
        }
    }

    function na() {
        console.log("Find " + u + M);
        g.ajax(F + "//m.agar.io/", {
            error: function() {
                setTimeout(na, 1E3);
            },
            success: function(a) {
                a = a.split("\n");
                if ("45.79.222.79:443" == a[0]) {
                    na();
                } else {
                    Fa("ws://" + a[0]);
                    /*new*/ serverIP = a[0];
                }
            },
            dataType: "text",
            method: "POST",
            cache: false,
            crossDomain: true,
            data: u + M || "?"
        });
    }

    function V() {
        if (ja) {
            if (u) {
                g("#connecting").show();
                na();
            }
        }
    }

    function Fa(a) {
        if (ws) {
            /*new*/f.angal_data.server.set(a);
            ws.onopen = null;
            ws.onmessage = null;
            ws.onclose = null;
            try {
                ws.close();
            } catch (b) {}
            ws = null;
        }
        var c = f.location.search.slice(1);
        if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+$/.test(c)) {
            a = "ws://" + c;
        }
        if (Ga) {
            a = a.split(":");
            a = a[0] + "s://ip-" + a[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+a[2] + 2E3);
        }
        myIDs = [];
        myPoints = [];
        nodes = {};
        items = [];
        G = [];
        scoreboard = [];
        v = w = null;
        H = 0;
        console.log("Connecting to " + a);
        ws = new WebSocket(a, Ga ? ["binary", "base64"] : []);
        ws.binaryType = "arraybuffer";
        ws.onopen = Ra;
        ws.onmessage = Sa;
        ws.onclose = Ta;
        ws.onerror = function() {
            console.log("socket error");
        };
    }

    /*new*/f.angal_connectDirect = Fa;

    function Ra(a) {
        Z = 500;
        g("#connecting").hide();
        console.log("socket open");
        a = new ArrayBuffer(5);
        var b = new DataView(a);
        b.setUint8(0, 254);
        b.setUint32(1, 4, true);
        ws.send(a);
        a = new ArrayBuffer(5);
        b = new DataView(a);
        b.setUint8(0, 255);
        b.setUint32(1, 673720360, true);
        ws.send(a);
        Ha();
    }

    function Ta(a) {
        console.log("socket close");
        setTimeout(V, Z);
        Z *= 1.5;
    }

    function Sa(a$$0) {
        function b$$0() {
            var a = "";
            for (;;) {
                var b = d.getUint16(c, true);
                c += 2;
                if (0 == b) {
                    break;
                }
                a += String.fromCharCode(b);
            }
            return a;
        }
        var c = 0;
        var d = new DataView(a$$0.data);
        if (240 == d.getUint8(c)) {
            c += 5;
        }
        switch (d.getUint8(c++)) {
            case 16:
                Ua(d, c);
                onAfterUpdatePacket();
                break;
            case 17:
                N = d.getFloat32(c, true);
                c += 4;
                O = d.getFloat32(c, true);
                c += 4;
                P = d.getFloat32(c, true);
                c += 4;
                break;
            case 20:
                myPoints = [];
                myIDs = [];
                break;
            case 21:
                oa = d.getInt16(c, true);
                c += 2;
                pa = d.getInt16(c, true);
                c += 2;
                if (!qa) {
                    qa = true;
                    $ = oa;
                    aa = pa;
                }
                break;
            case 32:
                onBeforeNewPointPacket();
                myIDs.push(d.getUint32(c, true));
                c += 4;
                break;
            case 49:
                if (null != w) {
                    break;
                }
                a$$0 = d.getUint32(c, true);
                c += 4;
                scoreboard = [];
                var e = 0;
                for (; e < a$$0; ++e) {
                    var q = d.getUint32(c, true);
                    c = c + 4;
                    scoreboard.push({
                        id: q,
                        name: b$$0()
                    });
                }
                Ia();
                break;
            case 50:
                w = [];
                a$$0 = d.getUint32(c, true);
                c += 4;
                e = 0;
                for (; e < a$$0; ++e) {
                    w.push(d.getFloat32(c, true));
                    c += 4;
                }
                Ia();
                break;
            case 64:
                ba = d.getFloat64(c, true);
                c += 8;
                ca = d.getFloat64(c, true);
                c += 8;
                da = d.getFloat64(c, true);
                c += 8;
                ea = d.getFloat64(c, true);
                c += 8;
                N = (da + ba) / 2;
                O = (ea + ca) / 2;
                P = 1;
                if (0 == myPoints.length) {
                    s = N;
                    t = O;
                    h$$0 = P;
                };
        }
    }

    function Ua(a, b) {
        I = +new Date;
        var c = Math.random();
        ra = false;
        var d = a.getUint16(b, true);
        b += 2;
        var e = 0;
        for (; e < d; ++e) {
            var q = nodes[a.getUint32(b, true)];
            var f = nodes[a.getUint32(b + 4, true)];
            b += 8;
            if (q) {
                if (f) {
                    f.destroy();
                    f.ox = f.x;
                    f.oy = f.y;
                    f.oSize = f.size;
                    f.nx = q.x;
                    f.ny = q.y;
                    f.nSize = f.size;
                    f.updateTime = I;
                }
            }
        }
        e = 0;
        for (;;) {
            d = a.getUint32(b, true);
            b += 4;
            if (0 == d) {
                break;
            }
            ++e;
            var g;
            q = a.getInt16(b, true);
            b += 2;
            f = a.getInt16(b, true);
            b += 2;
            g = a.getInt16(b, true);
            b += 2;
            var h = a.getUint8(b++);
            var m = a.getUint8(b++);
            var p = a.getUint8(b++);
            h = (h << 16 | m << 8 | p).toString(16);
            for (; 6 > h.length;) {
                h = "0" + h;
            }
            h = "#" + h;
            var k = a.getUint8(b++);
            m = !!(k & 1);
            p = !!(k & 16);
            if (k & 2) {
                b += 4;
            }
            if (k & 4) {
                b += 8;
            }
            if (k & 8) {
                b += 16;
            }
            var n;
            k = "";
            for (;;) {
                n = a.getUint16(b, true);
                b += 2;
                if (0 == n) {
                    break;
                }
                k += String.fromCharCode(n);
            }
            n = k;
            k = null;
            if (nodes.hasOwnProperty(d)) {
                k = nodes[d];
                k.updatePos();
                k.ox = k.x;
                k.oy = k.y;
                k.oSize = k.size;
                k.color = h;
            } else {
                k = new Ja(d, q, f, g, h, n);
                k.pX = q;
                k.pY = f;
            }
            k.isVirus = m;
            k.isAgitated = p;
            k.nx = q;
            k.ny = f;
            k.nSize = g;
            k.updateCode = c;
            k.updateTime = I;
            if (n) {
                k.setName(n);
            }
            if (-1 != myIDs.indexOf(d)) {
                if (-1 == myPoints.indexOf(k)) {
                    document.getElementById("overlays").style.display = "none";
                    myPoints.push(k);
                    if (1 == myPoints.length) {
                        s = k.x;
                        t = k.y;
                    }
                }
            }
        }
        c = a.getUint32(b, true);
        b += 4;
        e = 0;
        for (; e < c; e++) {
            d = a.getUint32(b, true);
            b += 4;
            k = nodes[d];
            if (null != k) {
                k.destroy();
            }
        }
        if (ra) {
            if (0 == myPoints.length) {
                Aa(false);
            }
        }
    }

    function K() {
        /*new*/if(isGrazing){ doGrazing(ws); return; }
        /*new*/if(suspendMouseUpdates){return;}
        if (sa()) {
            var a = S - p / 2;
            var b = T - r / 2;
            if (!(64 > a * a + b * b)) {
                if (!(Ka == mouseX2 && La == mouseY2)) {
                    Ka = mouseX2;
                    La = mouseY2;
                    a = new ArrayBuffer(21);
                    b = new DataView(a);
                    b.setUint8(0, 16);
                    b.setFloat64(1, mouseX2, true);
                    b.setFloat64(9, mouseY2, true);
                    b.setUint32(17, 0, true);
                    ws.send(a);
                }
            }
        }
    }

    function Ha() {
        if (sa() && null != D) {
            var a = new ArrayBuffer(1 + 2 * D.length);
            var b = new DataView(a);
            b.setUint8(0, 0);
            var c = 0;
            for (; c < D.length; ++c) {
                b.setUint16(1 + 2 * c, D.charCodeAt(c), true);
            }
            ws.send(a);
        }
    }

    function sa() {
        return null != ws && ws.readyState == ws.OPEN;
    }

    function B(a) {
        if (sa()) {
            var b = new ArrayBuffer(1);
            (new DataView(b)).setUint8(0, a);
            ws.send(b);
        }
    }

    function Ca() {
        ma();
        f.requestAnimationFrame(Ca);
    }

    function Ba() {
        p = f.innerWidth;
        r = f.innerHeight;
        ka.width = A.width = p;
        ka.height = A.height = r;
        ma();
    }

    function Ma() {
        var a;
        a = 1 * Math.max(r / 1080, p / 1920);
        return a *= C;
    }

    function Va() {
        if (0 != myPoints.length) {
            var a = 0;
            var b = 0;
            for (; b < myPoints.length; b++) {
                a += myPoints[b].size;
            }
            a = Math.pow(Math.min(64 / a, 1), 0.4) * Ma();
            h$$0 = (9 * h$$0 + a) / 10;
            /*new*/h$$0 = (9 * h$$0 + a) / zoomFactor;

        }
    }

    function ma() {
        var a$$0;
        var b$$0;
        var c = +new Date;
        ++Wa;
        I = +new Date;
        if (0 < myPoints.length) {
            Va();
            var d = a$$0 = b$$0 = 0;
            for (; d < myPoints.length; d++) {
                myPoints[d].updatePos();
                b$$0 += myPoints[d].x / myPoints.length;
                a$$0 += myPoints[d].y / myPoints.length;
            }
            N = b$$0;
            O = a$$0;
            P = h$$0;
            s = (s + b$$0) / 2;
            t = (t + a$$0) / 2;
        } else {
            s = (29 * s + N) / 30;
            t = (29 * t + O) / 30;
            h$$0 = (9 * h$$0 + P * Ma()) / 10;
        }
        Qa();
        la();
        if (!ta) {
            globalCtx.clearRect(0, 0, p, r);
        }
        if (ta) {
            globalCtx.fillStyle = isNightMode ? "#111111" : "#F2FBFF";
            globalCtx.globalAlpha = 0.05;
            globalCtx.fillRect(0, 0, p, r);
            globalCtx.globalAlpha = 1;
        } else {
            globalCtx.fillStyle = isNightMode ? "#111111" : "#F2FBFF";
            globalCtx.fillRect(0, 0, p, r);
            globalCtx.save();
            globalCtx.strokeStyle = isNightMode ? "#AAAAAA" : "#000000";
            globalCtx.globalAlpha = 0.2;
            globalCtx.scale(h$$0, h$$0);
            b$$0 = p / h$$0;
            a$$0 = r / h$$0;
            d = -0.5 + (-s + b$$0 / 2) % 50;
            for (; d < b$$0; d += 50) {
                globalCtx.beginPath();
                globalCtx.moveTo(d, 0);
                globalCtx.lineTo(d, a$$0);
                globalCtx.stroke();
            }
            d = -0.5 + (-t + a$$0 / 2) % 50;
            for (; d < a$$0; d += 50) {
                globalCtx.beginPath();
                globalCtx.moveTo(0, d);
                globalCtx.lineTo(b$$0, d);
                globalCtx.stroke();
            }
            globalCtx.restore();
        }
        items.sort(function(a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size;
        });
        globalCtx.save();
        globalCtx.translate(p / 2, r / 2);
        globalCtx.scale(h$$0, h$$0);
        globalCtx.translate(-s, -t);
        d = 0;
        for (; d < G.length; d++) {
            G[d].draw();
        }
        d = 0;
        for (; d < items.length; d++) {
            items[d].draw();
        }
        /*new*/drawRescaledItems(globalCtx);
        if (qa) {
            $ = (3 * $ + oa) / 4;
            aa = (3 * aa + pa) / 4;
            globalCtx.save();
            globalCtx.strokeStyle = "#FFAAAA";
            globalCtx.lineWidth = 10;
            globalCtx.lineCap = "round";
            globalCtx.lineJoin = "round";
            globalCtx.globalAlpha = 0.5;
            globalCtx.beginPath();
            d = 0;
            for (; d < myPoints.length; d++) {
                globalCtx.moveTo(myPoints[d].x, myPoints[d].y);
                globalCtx.lineTo($, aa);
            }
            globalCtx.stroke();
            globalCtx.restore();
        }
        globalCtx.restore();
        if (v) {
            if (v.width) {
                globalCtx.drawImage(v, p - v.width - 10, 10);
            }
        }
        H = Math.max(H, Xa());
        /*new*/ var extras = " " + getScoreBoardExtrasString(H);
        if (0 != H) {
            if (null == ga) {
                ga = new ha(24, "#FFFFFF");
            }
            ga.setValue("Score: " + ~~(H / 100) +/*new*/ extras);
            a$$0 = ga.render();
            b$$0 = a$$0.width;
            globalCtx.globalAlpha = 0.2;
            globalCtx.fillStyle = "#000000";
            globalCtx.fillRect(10, r - 10 - 24 - 10, b$$0 + 10, 34);
            globalCtx.globalAlpha = 1;
            globalCtx.drawImage(a$$0, 15, r - 10 - 24 - 5);
        }
        Ya();
        c = +new Date - c;
        if (c > 1E3 / 60) {
            x -= 0.01;
        } else {
            if (c < 1E3 / 65) {
                x += 0.01;
            }
        }
        if (0.4 > x) {
            x = 0.4;
        }
        if (1 < x) {
            x = 1;
        }
        /*new*/displayDebugText(globalCtx,ha); // second param is same as above 'new ??(24,  "#FFFFFF");'
    }

    function Ya() {
        if (ya && ua.width) {
            var a = p / 5;
            globalCtx.drawImage(ua, 5, 5, a, a);
        }
    }

    function Xa() {
        var a = 0;
        var b = 0;
        for (; b < myPoints.length; b++) {
            a += myPoints[b].nSize * myPoints[b].nSize;
        }
        return a;
    }

    function Ia() {
        v = null;
        if (null != w || 0 != scoreboard.length) {
            if (null != w || ia) {
                v = document.createElement("canvas");
                var a = v.getContext("2d");
                var b = 60;
                /*new*///b = null == w ? b + 24 * z.length : b + 180;
                /*new*/b = null == w ? b + 24 * scoreboard.length : b + 180;
                var c = Math.min(200, 0.3 * p) / 200;
                v.width = 200 * c;
                v.height = b * c;
                a.scale(c, c);
                a.globalAlpha = 0.4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c).width / 2, 40);
                if (null == w) {
                    a.font = "20px Ubuntu";
                    b = 0;
                    for (; b < scoreboard.length; ++b) {
                        c = scoreboard[b].name || "An unnamed cell";
                        if (!ia) {
                            c = "An unnamed cell";
                        }
                        if (-1 != myIDs.indexOf(scoreboard[b].id)) {
                            if (myPoints[0].name) {
                                c = myPoints[0].name;
                            }
                            a.fillStyle = "#FFAAAA";
                        } else {
                            a.fillStyle = "#FFFFFF";
                        }
                        c = b + 1 + ". " + c;
                        a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
                    }
                } else {
                    b = c = 0;
                    for (; b < w.length; ++b) {
                        angEnd = c + w[b] * Math.PI * 2;
                        a.fillStyle = Za[b + 1];
                        a.beginPath();
                        a.moveTo(100, 140);
                        a.arc(100, 140, 80, c, angEnd, false);
                        a.fill();
                        c = angEnd;
                    }
                }
            }
        }
    }

    function Ja(a, b, c, d, e, f) {
        items.push(this);
        nodes[a] = this;
        this.id = a;
        this.ox = this.x = b;
        this.oy = this.y = c;
        this.oSize = this.size = d;
        this.color = e;
        this.points = [];
        this.pointsAcc = [];
        this.createPoints();
        this.setName(f);
        /*new*/this.splitTime = Date.now();
    }

    function ha(a, b, c, d) {
        if (a) {
            this._size = a;
        }
        if (b) {
            this._color = b;
        }
        this._stroke = !!c;
        if (d) {
            this._strokeColor = d;
        }
    }
    var F = f.location.protocol;
    var Ga = "https:" == F;
    if ("agar.io" != f.location.hostname && ("localhost" != f.location.hostname && "10.10.2.13" != f.location.hostname)) {
        f.location = F + "//agar.io/";
    } else {
        if (f.top != f) {
            f.top.location = F + "//agar.io/";
        } else {
            var ka;                                  //var canvas2;
            var globalCtx;                           //var globalCtx;
            var A;                                   //var canvas;
            var p;                                   //var width;
            var r;                                   //var height;
            var L = null;                            //var context = null;
            var ws = null;                           //var ws = null;
            var s = 0;                               //var px = 0;
            var t = 0;                               //var py = 0;
            var myIDs = [];                          //var myIDs = [];
            var myPoints = [];                       //var myPoints = [];
            var nodes = {};                          //var nodes = {};
            var items = [];                          //var items = [];
            var G = [];                              //var sprites = [];
            var scoreboard = [];                     //var scoreboard = [];
            var S = 0;                               //var mouseX = 0;
            var T = 0;                               //var mouseY = 0;
            var mouseX2 = -1;                        //var mouseX2 = -1;
            var mouseY2 = -1;                        //var mouseY2 = -1;
            var Wa = 0;                              //var Ba = 0;
            var I = 0;                               //var timestamp = 0;
            var D = null;                            //var result = null;
            var ba = 0;                              //var left = 0;
            var ca = 0;                              //var bottom = 0;
            var da = 1E4;                            //var right = 1E4;
            var ea = 1E4;                            //var top = 1E4;
            var h$$0 = 1;                            //var ratio = 1;
            var u = null;                            //var dest = null;
            var Na = true;                           //var showSkins = true;
            var ia = true;                           //var nickName = true;
            var va = false;                          //var isColors = false;
            var ra = false;                          //var isSpectating = false
            var H = 0;
            var isNightMode = false;                 //var isNightMode = false;
            var isShowMass = false;                  //var isShowMass = true;
            var N = s = ~~((ba + da) / 2);
            var O = t = ~~((ca + ea) / 2);
            var P = 1;
            var M = "";
            var w = null;
            var ja = false;
            var qa = false;
            var oa = 0;
            var pa = 0;
            var $ = 0;
            var aa = 0;
            var Q = 0;
            var Za = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
            var ta = false;
            var C = 1;
            var ya = "ontouchstart" in f && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            var ua = new Image;
            ua.src = "img/split.png";
            Q = document.createElement("canvas");
            if ("undefined" == typeof console || ("undefined" == typeof DataView || ("undefined" == typeof WebSocket || (null == Q || (null == Q.getContext || null == f.localStorage))))) {
                alert("You browser does not support this game, we recommend you to use Firefox to play this");
            } else {
                var Y = null;
                f.setNick = function(a) {
                    Ea();
                    D = a;
                    Ha();
                    H = 0;
                    /*new*/GM_setValue("nick", a);
                    /*new*/console.log("Storing '" + a + "' as nick");
                };
                f.setRegion = U;
                f.setSkins = function(a) {
                    Na = a;
                };
                f.setNames = function(a) {
                    ia = a;
                };
                f.setDarkTheme = function(a) {
                    isNightMode = a;
                };
                f.setColors = function(a) {
                    va = a;
                };
                f.setShowMass = function(a) {
                    isShowMass = a;
                };
                f.spectate = function() {
                    D = null;
                    B(1);
                    Ea();
                };
                f.setGameMode = function(a) {
                    if (a != M) {
                        M = a;
                        V();
                    }
                };
                f.setAcid = function(a) {
                    ta = a;
                };
                if (null != f.localStorage) {
                    if (null == f.localStorage.AB8) {
                        f.localStorage.AB8 = 0 + ~~(100 * Math.random());
                    }
                    Q = +f.localStorage.AB8;
                    f.ABGroup = Q;
                }
                g.get(F + "//gc.agar.io", function(a) {
                    var b = a.split(" ");
                    a = b[0];
                    b = b[1] || "";
                    if (-1 == "DE IL PL HU BR AT UA".split(" ").indexOf(a)) {
                        wa.push("nazi");
                    }
                    if (-1 == ["UA"].indexOf(a)) {
                        wa.push("ussr");
                    }
                    if (R.hasOwnProperty(a)) {
                        if ("string" == typeof R[a]) {
                            if (!u) {
                                U(R[a]);
                            }
                        } else {
                            if (R[a].hasOwnProperty(b)) {
                                if (!u) {
                                    U(R[a][b]);
                                }
                            }
                        }
                    }
                }, "text");
                setTimeout(function() {}, 3E5);
                var R = {
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
                f.connect = Fa;
                var Z = 500;
                var Ka = -1;
                var La = -1;
                var v = null;
                var x = 1;
                var ga = null;
                var J = {};
                var wa = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal".split(";");
                var $a = ["8", "nasa"];
                var ab = ["m'blob"];
                Ja.prototype = {
                    id: 0,
                    points: null,
                    pointsAcc: null,
                    name: null,
                    nameCache: null,
                    sizeCache: null,
                    x: 0,
                    y: 0,
                    size: 0,
                    ox: 0,
                    oy: 0,
                    oSize: 0,
                    nx: 0,
                    ny: 0,
                    nSize: 0,
                    updateTime: 0,
                    updateCode: 0,
                    drawTime: 0,
                    destroyed: false,
                    isVirus: false,
                    isAgitated: false,
                    wasSimpleDrawing: true,
                    destroy: function() {
                        var a;
                        a = 0;
                        for (; a < items.length; a++) {
                            if (items[a] == this) {
                                items.splice(a, 1);
                                break;
                            }
                        }
                        delete nodes[this.id];
                        a = myPoints.indexOf(this);
                        if (-1 != a) {
                            ra = true;
                            myPoints.splice(a, 1);
                        }
                        a = myIDs.indexOf(this.id);
                        if (-1 != a) {
                            myIDs.splice(a, 1);
                        }
                        this.destroyed = true;
                        G.push(this);
                    },
                    getNameSize: function() {
                        return Math.max(~~(0.3 * this.size), 24);
                    },
                    setName: function(a) {
                        if (this.name = a) {
                            if (null == this.nameCache) {
                                this.nameCache = new ha(this.getNameSize(), "#FFFFFF", true, "#000000");
                            } else {
                                this.nameCache.setSize(this.getNameSize());
                            }
                            this.nameCache.setValue(this.name);
                        }
                    },
                    createPoints: function() {
                        var a = this.getNumPoints();
                        for (; this.points.length > a;) {
                            var b = ~~(Math.random() * this.points.length);
                            this.points.splice(b, 1);
                            this.pointsAcc.splice(b, 1);
                        }
                        if (0 == this.points.length) {
                            if (0 < a) {
                                this.points.push({
                                    c: this,
                                    v: this.size,
                                    x: this.x,
                                    y: this.y
                                });
                                this.pointsAcc.push(Math.random() - 0.5);
                            }
                        }
                        for (; this.points.length < a;) {
                            b = ~~(Math.random() * this.points.length);
                            var c = this.points[b];
                            this.points.splice(b, 0, {
                                c: this,
                                v: c.v,
                                x: c.x,
                                y: c.y
                            });
                            this.pointsAcc.splice(b, 0, this.pointsAcc[b]);
                        }
                    },
                    getNumPoints: function() {
                        var a = 10;
                        if (20 > this.size) {
                            a = 5;
                        }
                        if (this.isVirus) {
                            a = 30;
                        }
                        var b = this.size;
                        if (!this.isVirus) {
                            b *= h$$0;
                        }
                        b *= x;
                        return ~~Math.max(b, a);
                    },
                    movePoints: function() {
                        this.createPoints();
                        var a$$0 = this.points;
                        var b = this.pointsAcc;
                        var c = a$$0.length;
                        var d = 0;
                        for (; d < c; ++d) {
                            var e = b[(d - 1 + c) % c];
                            var f = b[(d + 1) % c];
                            b[d] += (Math.random() - 0.5) * (this.isAgitated ? 3 : 1);
                            b[d] *= 0.7;
                            if (10 < b[d]) {
                                b[d] = 10;
                            }
                            if (-10 > b[d]) {
                                b[d] = -10;
                            }
                            b[d] = (e + f + 8 * b[d]) / 10;
                        }
                        var h = this;
                        d = 0;
                        for (; d < c; ++d) {
                            var g = a$$0[d].v;
                            e = a$$0[(d - 1 + c) % c].v;
                            f = a$$0[(d + 1) % c].v;
                            if (15 < this.size && null != L) {
                                var l = false;
                                var m = a$$0[d].x;
                                var n = a$$0[d].y;
                                L.retrieve2(m - 5, n - 5, 10, 10, function(a) {
                                    if (a.c != h) {
                                        if (25 > (m - a.x) * (m - a.x) + (n - a.y) * (n - a.y)) {
                                            l = true;
                                        }
                                    }
                                });
                                if (!l) {
                                    if (a$$0[d].x < ba || (a$$0[d].y < ca || (a$$0[d].x > da || a$$0[d].y > ea))) {
                                        l = true;
                                    }
                                }
                                if (l) {
                                    if (0 < b[d]) {
                                        b[d] = 0;
                                    }
                                    b[d] -= 1;
                                }
                            }
                            g += b[d];
                            if (0 > g) {
                                g = 0;
                            }
                            g = this.isAgitated ? (19 * g + this.size) / 20 : (12 * g + this.size) / 13;
                            a$$0[d].v = (e + f + 8 * g) / 10;
                            e = 2 * Math.PI / c;
                            f = this.points[d].v;
                            if (this.isVirus) {
                                if (0 == d % 2) {
                                    f += 5;
                                }
                            }
                            a$$0[d].x = this.x + Math.cos(e * d) * f;
                            a$$0[d].y = this.y + Math.sin(e * d) * f;
                        }
                    },
                    updatePos: function() {
                        var a;
                        a = (I - this.updateTime) / 120;
                        a = 0 > a ? 0 : 1 < a ? 1 : a;
                        var b = 0 > a ? 0 : 1 < a ? 1 : a;
                        this.getNameSize();
                        if (this.destroyed && 1 <= b) {
                            var c = G.indexOf(this);
                            if (-1 != c) {
                                G.splice(c, 1);
                            }
                        }
                        this.x = a * (this.nx - this.ox) + this.ox;
                        this.y = a * (this.ny - this.oy) + this.oy;
                        this.size = b * (this.nSize - this.oSize) + this.oSize;
                        return b;
                    },
                    shouldRender: function() {
                        return this.x + this.size + 40 < s - p / 2 / h$$0 || (this.y + this.size + 40 < t - r / 2 / h$$0 || (this.x - this.size - 40 > s + p / 2 / h$$0 || this.y - this.size - 40 > t + r / 2 / h$$0)) ? false : true;
                    },
                    draw: function() {
                        if (this.shouldRender()) {
                            var a = !this.isVirus && (!this.isAgitated && 0.35 > h$$0);
                            if (this.wasSimpleDrawing && !a) {
                                var b = 0;
                                for (; b < this.points.length; b++) {
                                    this.points[b].v = this.size;
                                }
                            }
                            this.wasSimpleDrawing = a;
                            globalCtx.save();
                            this.drawTime = I;
                            b = this.updatePos();
                            if (this.destroyed) {
                                globalCtx.globalAlpha *= 1 - b;
                            }
                            globalCtx.lineWidth = 10;
                            globalCtx.lineCap = "round";
                            globalCtx.lineJoin = this.isVirus ? "mitter" : "round";
                            if (va) {
                                globalCtx.fillStyle = "#FFFFFF";
                                globalCtx.strokeStyle = "#AAAAAA";
                            } else {
                                globalCtx.fillStyle = this.color;
                                globalCtx.strokeStyle = this.color;
                            }
                            /*new*/ drawCellInfos(va, globalCtx, this);
                            if (a) {
                                globalCtx.beginPath();
                                globalCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
                            } else {
                                this.movePoints();
                                globalCtx.beginPath();
                                var c = this.getNumPoints();
                                globalCtx.moveTo(this.points[0].x, this.points[0].y);
                                b = 1;
                                for (; b <= c; ++b) {
                                    var d = b % c;
                                    globalCtx.lineTo(this.points[d].x, this.points[d].y);
                                }
                            }
                            globalCtx.closePath();
                            c = this.name.toLowerCase();

                            //if (!this.isAgitated && (Na && "" == M)) {
                            //    if (-1 != wa.indexOf(c)) {
                            //        if (!J.hasOwnProperty(c)) {
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
                            /*new*/var b = customSkins(this.name, wa, J, Na, M);
                            b = (d = b) ? -1 != ab.indexOf(c) : false;
                            if (!a) {
                                globalCtx.stroke();
                            }
                            globalCtx.fill();
                            /*new*/globalCtx.globalAlpha = isSpecialSkin(this.name.toLowerCase()) || -1 != myIDs.indexOf(this.id)  ? 1 : 0.5;
                            if (!(null == d)) {
                                if (!b) {
                                    globalCtx.save();
                                    globalCtx.clip();
                                    globalCtx.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                                    globalCtx.restore();
                                }
                            }
                            if (va || 15 < this.size) {
                                if (!a) {
                                    globalCtx.strokeStyle = "#000000";
                                    globalCtx.globalAlpha *= 0.1;
                                    globalCtx.stroke();
                                }
                            }
                            globalCtx.globalAlpha = 1;
                            if (null != d) {
                                if (b) {
                                    globalCtx.drawImage(d, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                                }
                            }
                            b = -1 != myPoints.indexOf(this);
                            a = ~~this.y;
                            if ((ia || b) && (this.name && (this.nameCache && (null == d || -1 == $a.indexOf(c)))) /*new*/|| this.isVirus) {
                                /*new*/if(this.isVirus && null == this.nameCache){
                                    /*new*/     this.setName(getVirusShotsNeededForSplit(this.nSize).toString());
                                    /*new*/}
                                d = this.nameCache;
                                d.setValue(this.name);
                                /*new*/setCellName(this, d);
                                d.setSize(this.getNameSize());
                                c = Math.ceil(10 * h$$0) / 10;
                                d.setScale(c);
                                /*new*/setVirusInfo(this, d, c);
                                d = d.render();
                                var f = ~~(d.width / c);
                                var g = ~~(d.height / c);
                                /*new*/if(shouldRelocateName.call(this))
                                /*new*/    { globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a + ~~(g ), f, g); a += d.height / 2 / c + 8; }
                                /*new*/else
                                    globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g);
                                a += d.height / 2 / c + 4;
                            }

                            /*new*/var massValue = (~~(this.size * this.size / 100)).toString();
                            /*new*/if(showCheats){
                                /*new*/if(-1 != myIDs.indexOf(this.id)) {massValue += " (" + getBlobShotsAvailable(this).toString() + ")";}
                                /*new*/}
                            if (isShowMass) {
                                if (b || 0 == myPoints.length && ((!this.isVirus || this.isAgitated) && 20 < this.size)) {
                                    if (null == this.sizeCache) {
                                        this.sizeCache = new ha(this.getNameSize() / 2, "#FFFFFF", true, "#000000");
                                    }
                                    b = this.sizeCache;
                                    b.setSize(this.getNameSize() / 2);
                                    b.setValue(~~(this.size * this.size / 100));
                                    /*new*/b.setValue(massValue);
                                    c = Math.ceil(10 * h$$0) / 10;
                                    b.setScale(c);
                                    /*new*/b.setScale(c * ( shouldRelocateName.call(this) ? 2 : 1));
                                    d = b.render();
                                    f = ~~(d.width / c);
                                    g = ~~(d.height / c);
                                    /*new*/if(shouldRelocateName.call(this))
                                    /*new*/    globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a + ~~(g), f, g);
                                    /*new*/else
                                        globalCtx.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g);
                                }
                            }
                            globalCtx.restore();
                        }
                    }
                };
                ha.prototype = {
                    _value: "",
                    _color: "#000000",
                    _stroke: false,
                    _strokeColor: "#000000",
                    _size: 16,
                    _canvas: null,
                    _ctx: null,
                    _dirty: false,
                    _scale: 1,
                    setSize: function(a) {
                        if (this._size != a) {
                            this._size = a;
                            this._dirty = true;
                        }
                    },
                    setScale: function(a) {
                        if (this._scale != a) {
                            this._scale = a;
                            this._dirty = true;
                        }
                    },
                    setColor: function(a) {
                        if (this._color != a) {
                            this._color = a;
                            this._dirty = true;
                        }
                    },
                    setStroke: function(a) {
                        if (this._stroke != a) {
                            this._stroke = a;
                            this._dirty = true;
                        }
                    },
                    setStrokeColor: function(a) {
                        if (this._strokeColor != a) {
                            this._strokeColor = a;
                            this._dirty = true;
                        }
                    },
                    setValue: function(a) {
                        if (a != this._value) {
                            this._value = a;
                            this._dirty = true;
                        }
                    },
                    render: function() {
                        if (null == this._canvas) {
                            this._canvas = document.createElement("canvas");
                            this._ctx = this._canvas.getContext("2d");
                        }
                        if (this._dirty) {
                            this._dirty = false;
                            var a = this._canvas;
                            var b = this._ctx;
                            var c = this._value;
                            var d = this._scale;
                            var e = this._size;
                            var f = e + "px Ubuntu";
                            b.font = f;
                            var g = b.measureText(c).width;
                            var h = ~~(0.2 * e);
                            a.width = (g + 6) * d;
                            a.height = (e + h) * d;
                            b.font = f;
                            b.scale(d, d);
                            b.globalAlpha = 1;
                            b.lineWidth = 3;
                            b.strokeStyle = this._strokeColor;
                            b.fillStyle = this._color;
                            if (this._stroke) {
                                b.strokeText(c, 3, e - h / 2);
                            }
                            b.fillText(c, 3, e - h / 2);
                        }
                        return this._canvas;
                    }
                };
                f.onload = Pa;
            }
        }
    }
    /*new*/})(unsafeWindow, jQuery);


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
        '<div style="height: 1px; position: absolute; left: 0px; right: 0px; top: 0px; z-index: 1; display: block;">' /*
         + '<div style="height: 1px; width: 950px; margin: 100px auto;">'
         + '<div style="height: 50px; width: 200px; float:left; background-color: #FFFFFF; margin: 0px 5px; border-radius: 15px; padding: 5px 15px 5px 15px;">'
         + 'Agar.io client by <br /><b>angal</b> and <b>DiaLight</b>'
         + '</div>'
         + '</div>'
         + '</div>'*/

        + '<div style="height: 1px; position: absolute; left: 0px; right: 0px; top: 0px; z-index: 1; display: block;">'
        + '<div style="height: 1px; width: 950px; margin: 100px auto;">'
        + '<div style="height: 500px; width: 250px; float:right; background-color: #FFFFFF; margin: 0px 5px; border-radius: 15px; padding: 5px 15px 5px 15px;">'
        + 'Last servers: <br /> '
        + '<ol id="angal_serverList"></ol>'
        + '</div>'
        + '</div>'
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
/*new*/$("label:contains(' Dark Theme') input").prop('checked', true);
/*new*/setDarkTheme(true);
/*new*/$("label:contains(' Show mass') input").prop('checked', true);
/*new*/setShowMass(true);

/*new*/$('#nick').val(GM_getValue("nick", ""));

