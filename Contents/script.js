/*
    Panzer Flip Clock Widget

    Created by Dean Beedell
    Re-coded by Dean Beedell
    Visuals added to and enhanced by Dean Beedell
    Sorted by Harry Whitfield

    16 October, 2018

    email: dean.beedell@lightquick.co.uk
    http//lightquick.co.uk
*/

/*jslint for, multivar, this */

/*property
    clockSize, dockFormatPref, event, face, frame, getHours, getMinutes,
    getSeconds, hOffset, height, interval, keyCode, leftChar,
    leftflipperBottomExtended, leftflipperTopExtended, length, name, onKeyDown,
    onMouseDown, onPreferencesChanged, onTimerFired, onWakeFromSleep, onload,
    opacity, reScale, rightChar, rightflipperBottomExtended,
    rightflipperTopExtended, soundPref, src, ticking, toString, value, visible,
    width
*/

"use strict";

var mainWindow, AnonGauge, buildVitality, mainScreen, createLicence, setmenu,  // imports
        tankHelp, helpWindow, minsLeftChar, minsRightChar, secsLeftChar, secsRightChar;

var currIcon = "Resources/images/dock.png";
var dockIcon = "Resources/images/dock2.png";
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

include("debug.js");
include("functions.js");
include("vitality.js");
include("anonGauge.js");
include("Resources/Licence/licence.js");

var scale = Number(preferences.clockSize.value) / 100;
var hourGauge = new AnonGauge(mainWindow, 0, 0, 1, scale, true, false, false);
var minGauge = new AnonGauge(mainWindow, 575 * scale, 0, 1, scale, true, false, true);
var secGauge = new AnonGauge(mainWindow, 1150 * scale, 0, 1, scale, true, true, false);

var oldHrsLeftChar = -1;
var oldHrsRightChar = -1;
var oldMinsLeftChar = -1;
var oldMinsRightChar = -1;
var oldSecsLeftChar = -1;
var oldSecsRightChar = -1;

var oldhrs;
var oldmins;
var oldsecs;

var debugFlg = 0;


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
var flipTimerLeft = new Timer();
flipTimerLeft.interval = 0.035;		// less than 40mS
flipTimerLeft.ticking = false;

var flipTimerRight = new Timer();
flipTimerRight.interval = 0.035;	// less than 40mS
flipTimerRight.ticking = false;

var lFlipState = 0;
var rFlipState = 0;

var gGaugeL;
var gGaugeR;

function flipLeft(theGauge) {
    var leftChar = theGauge.leftChar;

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

flipTimerLeft.onTimerFired = function () {
    flipTimerLeft.ticking = false;
    flipLeft(gGaugeL);
};


function flipRight(theGauge) {
    var rightChar = theGauge.rightChar;

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

flipTimerRight.onTimerFired = function () {
    flipTimerRight.ticking = false;
    flipRight(gGaugeR);
};

var gaugeTimer = new Timer();
gaugeTimer.interval = 0.16;	// Must be less than 160mS
gaugeTimer.ticking = false;
var gaugeState = 0;

function flipGauges() {
	if (lFlipState !== 0) {
		print("lFlipState !== 0");
		gaugeTimer.ticking = true;
		return;
	}
	if (rFlipState !== 0) {
		print("rFlipState !== 0");
		gaugeTimer.ticking = true;
		return;
	}

	gaugeState += 1;

	switch (gaugeState) {
	case 1:
		if (oldSecsRightChar !== secGauge.rightChar) {
			oldSecsRightChar = secGauge.rightChar;
        	secsClearRight();
        	flipRight(secGauge);
        }
		gaugeTimer.ticking = true;
		break;
	case 2:
		if (oldSecsLeftChar !== secGauge.leftChar) {
			oldSecsLeftChar = secGauge.leftChar;
			secsClearLeft();
        	flipLeft(secGauge);
        }
		gaugeTimer.ticking = true;
		break;
	case 3:
		if (oldMinsRightChar !== minGauge.rightChar) {
			oldMinsRightChar = minGauge.rightChar;
        	minsClearRight();
        	flipRight(minGauge);
        }
        gaugeTimer.ticking = true;
        break;
    case 4:
        if (oldMinsLeftChar !== minGauge.leftChar) {
        	oldMinsLeftChar = minGauge.leftChar;
        	minsClearLeft();
        	flipLeft(minGauge);
        }
        gaugeTimer.ticking = true;
        break;
    case 5:
        if (oldHrsRightChar !== hourGauge.rightChar) {
        	oldHrsRightChar = hourGauge.rightChar;
        	hrsClearRight();
        	flipRight(hourGauge);
        }
       	gaugeTimer.ticking = true;
        break;
    case 6:
    	if (oldHrsLeftChar !== hourGauge.leftChar) {
        	oldHrsLeftChar = hourGauge.leftChar;
        	hrsClearLeft();
        	flipLeft(hourGauge);
    	}
		gaugeState = 0;
        break;
	}
}

gaugeTimer.onTimerFired = function () {
	gaugeTimer.ticking = false;
	flipGauges();
};

function updateFlipClock() {
    var hrs;
    var mins;
    var secs;
    var hrsLeftChar;
    var hrsRightChar;
    var theDate;
	var d0;
    var d1;

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

    mins = mins.toString();
    if (mins.length === 1) {
        minsLeftChar = "0";
        minsRightChar = mins;
    } else {
        minsLeftChar = mins[0];
        minsRightChar = mins[1];
    }
    minGauge.leftChar = minsLeftChar;
    minGauge.rightChar = minsRightChar;

    secs = secs.toString();
    if (secs.length === 1) {
		secsLeftChar = "0";
		secsRightChar = secs;
    } else {
		secsLeftChar = secs[0];
		secsRightChar = secs[1];
    }
    secGauge.leftChar = secsLeftChar;
    secGauge.rightChar = secsRightChar;

    flipGauges();

    if (preferences.dockFormatPref.value === "seconds") {
		if (secs.length === 1) {
        	d0 = "left0.png";
        	d1 = "right" + secs + ".png";
    	} else {
        	d0 = "left" + secs[0] + ".png";
        	d1 = "right" + secs[1] + ".png";
    	}

    	d0 = "Resources/anonGauge/" + d0;
    	d1 = "Resources/anonGauge/" + d1;

    	buildVitality(currIcon, d0, d1, false);	// seconds format
    } else {
    	d0 = hrsLeftChar + hrsRightChar;
    	d1 = minsLeftChar + minsRightChar;
    	buildVitality(dockIcon, d0, d1, true);	// hhmm format
    }
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

    debugFlg = preferences.debugflgPref.value;
    if (debugFlg === "1") {
        preferences.imageEditPref.hidden = false;
    } else {
        preferences.imageEditPref.hidden = true;
    }

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

////////////// Dummy ////////////// Target Timer Setting ///////////// Dummy /////////////

function dragDropped() {	// (event)
	return;
}

function flipEvent() {		// flipEvent(event, gauge, handed);
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
}

function upperButton() {	// upperButton(event, gauge);
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
}

function middleButton() {		// middleButton(event, gauge);
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
}

function lowerButton() {		// lowerButton(event, gauge);
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
}

//////////////////////////////// End Target Timer Setting ////////////////////////////////

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
	oldHrsLeftChar = -1;
	oldHrsRightChar = -1;
	oldMinsLeftChar = -1;
	oldMinsRightChar = -1;
	oldSecsLeftChar = -1;
	oldSecsRightChar = -1;

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

