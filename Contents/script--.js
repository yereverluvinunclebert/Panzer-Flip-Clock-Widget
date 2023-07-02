/*
    Panzer Flip Clock Widget

    Created by Dean Beedell
    Re-coded by Dean Beedell
    Visuals added to and enhanced by Dean Beedell
    Sorted by Harry Whitfield

    23 September, 2018

    email: dean.beedell@lightquick.co.uk
    http//lightquick.co.uk
*/

/*jslint for, multivar, this */

/*property
    clockSize, event, face, frame, getHours, getMinutes, getSeconds, hOffset,
    height, interval, keyCode, leftChar, leftflipperBottomExtended,
    leftflipperTopExtended, length, name, onKeyDown, onMouseDown,
    onPreferencesChanged, onTimerFired, onWakeFromSleep, onload, opacity,
    platform, reScale, rightChar, rightflipperBottomExtended,
    rightflipperTopExtended, slice, soundPref, src, ticking, toString, value,
    visible, width, writeFile, yFlag
*/

"use strict";

var mainWindow, FlipClockGauge, buildVitality, mainScreen, createLicence, setmenu,  // imports
        tankHelp, helpWindow, minsLeftChar, minsRightChar, secsLeftChar, secsRightChar;


var currIcon = "Resources/images/dock.png";
var widgetName = widget.name;

var counter = "Resources/sounds/counter.mp3";
var lock = "Resources/sounds/lock.mp3";
var till = "Resources/sounds/till01.mp3";
var ting = "Resources/sounds/ting.mp3";
var mistake = "Resources/sounds/mistake.wav";
var thhhh = "Resources/sounds/thhhh.mp3";
var winding = "Resources/sounds/winding.mp3";
var flip = "Resources/sounds/flip.mp3";
var hrsFlipping = 1; //WIP

include("functions.js");
include("vitality.js");
include("flipClockGauge.js");
include("Resources/Licence/licence.js");

var scale = Number(preferences.clockSize.value) / 100;
var hourGauge = new FlipClockGauge(mainWindow, 0, 0, 1, scale, true);
var minGauge = new FlipClockGauge(mainWindow, 575 * scale, 0, 1, scale, true);
var secGauge = new FlipClockGauge(mainWindow, 1150 * scale, 0, 1, scale, true);

var oldHrsLeftChar;
var oldHrsRightChar;
var oldMinsLeftChar;
var oldMinsRightChar;
var oldSecsLeftChar;
var oldSecsRightChar;

var oldhrs;
var oldmins;
var oldsecs;

// diagnostic printing on macintosh
var print;
if (system.platform === "macintosh") {
    print = function (s) {
        filesystem.writeFile("~/Desktop/PCW Log.txt", s + "\n", true);
    };
}


//=================================
// widget inline button timer setup
//=================================
var theTimer = new Timer();
theTimer.ticking = true;
theTimer.interval = 1;  //preferences.sampleIntervalPref.value;
//=================================
// timer ends
//=================================



//=====================
// function hrsClear
//=====================
function hrsClearRight() {
    var i;

    for (i = 0; i < 10; i += 1) {
        hourGauge["right" + i].opacity = 0;
    }
}
//=====================
//End function
//=====================

//=====================
// function hrsClear
//=====================
function hrsClearLeft() {
    var i;

    for (i = 0; i < 10; i += 1) {
        hourGauge["left" + i].opacity = 0;
    }
}
//=====================
//End function
//=====================

//=====================
// function minsClear
//=====================
function minsClearLeft() {
    var i;

    for (i = 0; i < 10; i += 1) {
        minGauge["left" + i].opacity = 0;
    }
}
//=====================
//End function
//=====================

//=====================
// function minsClear
//=====================
function minsClearRight() {
    var i;

    for (i = 0; i < 10; i += 1) {
        minGauge["right" + i].opacity = 0;
    }
}
//=====================
//End function
//=====================

//=====================
// function secsClear
//=====================
function secsClearRight() {
    var i;

    for (i = 0; i < 10; i += 1) {
        secGauge["right" + i].opacity = 0;
    }
}
//=====================
//End function
//=====================


//=====================
// function secsClear
//=====================
function secsClearLeft() {
    var i;

    for (i = 0; i < 10; i += 1) {
        secGauge["left" + i].opacity = 0;
    }
}
//=====================
//End function
//=====================

//===============================================================
// this function is called by a timer, it does the main date work
//===============================================================
var flipTimerRight = new Timer();
flipTimerRight.interval = 0.03;
flipTimerRight.ticking = false;
var flipTimerLeft = new Timer();
flipTimerLeft.interval = 0.03;
flipTimerLeft.ticking = false;
var lFlipState = 0;
var rFlipState = 0;
var gGaugeL;
var gGaugeR;

function flipLeft(theGauge) {
    var leftChar = theGauge.leftChar;
//  var yFlag = theGauge.yFlag;

    lFlipState += 1;

    switch (lFlipState) {
    case 1:
        gGaugeL = theGauge;
        theGauge["left" + leftChar].opacity = 0;
        theGauge.leftflipperTopExtended.opacity = 255;
        flipTimerLeft.ticking = true;
        break;
    case 2:
        theGauge.leftflipperTopExtended.opacity = 0;
        theGauge.leftflipperBottomExtended.opacity = 255;
        flipTimerLeft.ticking = true;
        break;
    case 3:
        theGauge.leftflipperBottomExtended.opacity = 0;
        flipTimerLeft.ticking = true;
        if (preferences.soundPref.value !== "disabled") {
            play(flip, false);
        }
        break;
    case 4:
        theGauge["left" + leftChar].opacity = 255;
        lFlipState = 0;
        break;
    }
}

function flipRight(theGauge) {
    var rightChar = theGauge.rightChar;
//  var yFlag = theGauge.yFlag;

    rFlipState += 1;

    switch (rFlipState) {
    case 1:
        gGaugeR = theGauge;
        theGauge["right" + rightChar].opacity = 0;
        theGauge.rightflipperTopExtended.opacity = 255;
        flipTimerRight.ticking = true;
        break;
    case 2:
        theGauge.rightflipperTopExtended.opacity = 0;
        theGauge.rightflipperBottomExtended.opacity = 255;
        flipTimerRight.ticking = true;
        break;
    case 3:
        theGauge.rightflipperBottomExtended.opacity = 0;
        flipTimerRight.ticking = true;
        if (preferences.soundPref.value !== "disabled") {
            play(flip, false);
        }
        break;
    case 4:
        theGauge["right" + rightChar].opacity = 255;
        rFlipState = 0;
        break;
    }
}

flipTimerLeft.onTimerFired = function () {
    flipTimerLeft.ticking = false;
    flipLeft(gGaugeL);
};

flipTimerRight.onTimerFired = function () {
    flipTimerRight.ticking = false;
    flipRight(gGaugeR);
};

var lGaugeTimer = new Timer();
lGaugeTimer.interval = 0.4; // Must be about 10 * flipTimer.interval
lGaugeTimer.ticking = false;
var lGaugeState = 0;

var rGaugeTimer = new Timer();
rGaugeTimer.interval = 0.4; // Must be about 10 * flipTimer.interval
rGaugeTimer.ticking = false;
var rGaugeState = 0;

function flipLeftGauge(switchIt) {
    if (lFlipState !== 0) {
        print("lFlipState !== 0");
        lGaugeTimer.ticking = true;
        return;
    }

    if (switchIt) {
        lGaugeState = switchIt;
    } else {
        lGaugeState += 1;
    }

    switch (lGaugeState) {
    case 1:
        hrsClearLeft();
        flipLeft(hourGauge);
        lGaugeTimer.ticking = true;
        break;
    case 2:
        minsClearLeft();
        flipLeft(minGauge);
        lGaugeTimer.ticking = true;
        break;
    case 3:
        secsClearLeft();
        flipLeft(secGauge);
        lGaugeState = 0;
        break;
    }
}

function flipRightGauge(switchIt) {
    if (rFlipState !== 0) {
        print("rFlipState !== 0");
        rGaugeTimer.ticking = true;
        return;
    }

    if (switchIt) {
        rGaugeState = switchIt;
    } else {
        rGaugeState += 1;
    }

    switch (rGaugeState) {
    case 1:
        hrsClearRight();
        flipRight(hourGauge);
        rGaugeTimer.ticking = true;
        break;
    case 2:
        minsClearRight();
        flipRight(minGauge);
        rGaugeTimer.ticking = true;
        break;
    case 3:
        secsClearRight();
        flipRight(secGauge);
        rGaugeState = 0;
        break;
    }
}

lGaugeTimer.onTimerFired = function () {
    lGaugeTimer.ticking = false;
    flipLeftGauge(0);
};

rGaugeTimer.onTimerFired = function () {
    rGaugeTimer.ticking = false;
    flipRightGauge(0);
};



function updateFlipClock() {
    var hrs;
    var mins;
    var secs;
    var hrsLeftChar;
    var hrsRightChar;
//  var leftChar;
//  var rightChar;
    var theDate;
//  var timerInterval;
    var d0;
    var d1;

//  var advance = 0;    //  10.25 * 3600; // fiddle for testing

    theDate = new Date();

    hrs = theDate.getHours();
    mins = theDate.getMinutes();
    secs = theDate.getSeconds();

    hrs = hrs.toString();
    if (hrs.length === 1) {
        hrsLeftChar = "0";
        hrsRightChar = hrs;
    } else {
        hrsLeftChar = hrs[0];
        hrsRightChar = hrs[1];
    }
    hourGauge.leftChar = hrsLeftChar;
    hourGauge.rightChar = hrsRightChar;
    hourGauge.yFlag = 0;

    mins = mins.toString();
    if (mins === "60") {
        mins = "00";
    }

    if (mins.length === 1) {
        minsLeftChar = "0";
        minsRightChar = mins;
    } else {
        minsLeftChar = mins[0];
        minsRightChar = mins[1];
    }
    minGauge.leftChar = minsLeftChar;
    minGauge.rightChar = minsRightChar;
    minGauge.yFlag = 0;

    secs = secs.toString();
    secs = String("0" + secs).slice(-2);

    secsLeftChar = secs[0];
    secsRightChar = secs[1];

    //print("leftChar "+ leftChar);
    //print("rightChar "+ rightChar);

    secGauge.leftChar = secsLeftChar;
    secGauge.rightChar = secsRightChar;
    secGauge.yFlag = 1;

    if (oldHrsRightChar !== hrsRightChar) {
        flipRightGauge(1);
    }
    if (oldHrsLeftChar !== hrsLeftChar) {
        flipLeftGauge(1);
    }

    if (oldMinsRightChar !== minsRightChar) {
        flipRightGauge(2);
    }
    if (oldMinsLeftChar !== minsLeftChar) {
        flipLeftGauge(2);
    }

    if (oldSecsRightChar !== secsRightChar) {
        flipRightGauge(3);
    }
    if (oldSecsLeftChar !== secsLeftChar) {
        flipLeftGauge(3);
    }

    oldHrsLeftChar = hrsLeftChar;
    oldHrsRightChar = hrsRightChar;
    oldMinsLeftChar = minsLeftChar;
    oldMinsRightChar = minsRightChar;
    oldSecsLeftChar = secsLeftChar;
    oldSecsRightChar = secsRightChar;

    if (secs.length === 1) {
        d0 = "left0.png";
        d1 = "right" + secs + ".png";
    } else {
        d0 = "left" + secs[0] + ".png";
        d1 = "right" + secs[1] + ".png";
    }

    d0 = "Resources/images/" + d0;
    d1 = "Resources/images/" + d1;

    if (hrs.length === 1) {
        d0 = "";
    }

    buildVitality(currIcon, d0, d1);
}
//=====================
//End function
//=====================

//=====================
// function setFace
//=====================
function setFace() {
    hourGauge.face.src = "Resources/images/facehrs.png";
    minGauge.face.src = "Resources/images/facemins.png";
    secGauge.face.src = "Resources/images/facesecs.png";
}
//=====================
//End function
//=====================

//===============================================================
// function startup
//===============================================================
function startup() {
    mainScreen();

    createLicence(mainWindow);
    updateFlipClock();
    setmenu();
    setFace();
}
//=====================
//End function
//=====================

tankHelp.onMouseDown = function () {
    helpWindow.visible = false;
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
};

function tankHelpShow() {
    helpWindow.visible = true;
    if (preferences.soundPref.value !== "disabled") {
        play(till, false);
    }
}

//=================================
// timer to fade the buttons
//=================================
theTimer.onTimerFired = function () {
    updateFlipClock();
};
//=====================
//End function
//=====================


//===============================================================
// this function is called when the widget loads
//===============================================================
widget.onload = function () {
    mainWindow.width = 1950 * scale;
    mainWindow.height = 660 * scale;
    startup();
};
//=====================
//End function
//=====================

function reScale(scale) {
    mainWindow.width = 1950 * scale;
    mainWindow.height = 660 * scale;

    hourGauge.reScale(scale);
    minGauge.reScale(scale);
    secGauge.reScale(scale);

    hourGauge.frame.hOffset = 0;
    minGauge.frame.hOffset = 575 * scale;
    secGauge.frame.hOffset = 1150 * scale;
}

//===============================================================
// this function is called when the widget prefs are changed
//===============================================================
widget.onPreferencesChanged = function () {
    scale = Number(preferences.clockSize.value) / 100;
    reScale(scale);
    startup();
};
//=====================
//End function
//=====================


//===============================================================
// this function is called when the widget wakes up from sleep
//===============================================================
widget.onWakeFromSleep = function () {
    updateFlipClock();
};
//=====================
//End function
//=====================

//===============================================================
// this function defines the keyboard events captured
//===============================================================
mainWindow.onKeyDown = function () {
    if (system.event.keyCode === 116) {
        print("pressing " + system.event.keyCode);
        reloadWidget();
    }
};
//=====================
//End function
//=====================

