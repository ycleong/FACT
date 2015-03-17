/*
ChangeLog
3 Mar 13, Friday (For Version 30)
- Social version: Two simultaneous spinners
Added browser detection

8 Nov 12, Thursday (for Version 3)
- Added 50 colors, have sectors be randomized colors
- Fixed code to allow random sampling of the spinner values from a large dataset instead of a fixed one.
- Added "SpinnerID" to uniquely identify a spinner/win combination.
- Fixed "presentation Order" bug
- Added lots more "low-level" data (as opposed to keeping the winProbs, winChoice etc in data.trial)
  - e.g. added payoff1Array, payoff2Array, payoff3Array,
                prob1Array, prob2Array, prob3Array,
                winChoiceArray, winArray, winProbArray
- Populated new spinner dataset.
*/



var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
         string: navigator.userAgent,
         subString: "iPhone",
         identity: "iPhone/iPod"
      },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};
BrowserDetect.init();

/*
showSlide(id)
Displays each slide
*/

function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

/* 
random(a,b)
Returns random number between a and b, inclusive
*/

function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}


/* 
Array.prototype.random
Randomly shuffles elements in an array. Useful for condition randomization.
*/

Array.prototype.random = function() {
  return this[random(this.length)];
}

/* 
Produces an array with numbers 0~arrLength
in random order. Kind of spurious--use 
Array.prototype.random instead
*/

function shuffledArray(arrLength)
{
  var j, tmp;
  var arr = new Array(arrLength);
  for (i = 0; i < arrLength; i++)
  {
    arr[i] = i;
  }
  for (i = 0; i < arrLength-1; i++)
  {
    j = Math.floor((Math.random() * (arrLength - 1 - i)) + 0.99) + i;
    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/* 
Gets the value of the checked radio button
*/

function getRadioCheckedValue(formNum, radio_name)
{
   var oRadio = document.forms[formNum].elements[radio_name];
   for(var i = 0; i < oRadio.length; i++)
   {
      if(oRadio[i].checked)
      {
         return oRadio[i].value;
      }
   }
   return '';
}

function setQuestion(array) {
    var i = random(0, array.length - 1);
    var q = array[i];
    return q;
}


/* 
Clears value from form
*/

function clearForm(oForm) {
    
  var elements = oForm.elements; 
    
  oForm.reset();

  for(i=0; i<elements.length; i++) {
      
	field_type = elements[i].type.toLowerCase();
	
	switch(field_type) {
	
		case "text": 
		case "password": 
		case "textarea":
	        case "hidden":	
			
			elements[i].value = ""; 
			break;
        
		case "radio":
		case "checkbox":
  			if (elements[i].checked) {
   				elements[i].checked = false; 
			}
			break;

		case "select-one":
		case "select-multi":
            		elements[i].selectedIndex = -1;
			break;

		default: 
			break;
	}
    }
}

 Raphael.fn.printWin = function(x, y, num) {
  return this.text(x, y, "Bob won $" + num, this.getFont("Myriad")).attr("font-size", "24");
  };


Raphael.fn.triangle = function(x, y, size) {
  var path = ["M", x, y];
  path = path.concat(["L", (x + size / 2), (y + size)]);
  path = path.concat(["L", (x - size / 2), (y + size)]);
  return this.path(path.concat(["z"]).join(" "));
};

Raphael.fn.pieChart = function (cx, cy, r, ProbValues, PayoffValues, colors, fontSize, stroke) { 
  var paper = this,
  rad = Math.PI / 180,
  chart = this.set();
  

  function sector(cx, cy, r, startAngle, endAngle, params) {
    var x1 = cx + r * Math.cos(-startAngle * rad),
    x2 = cx + r * Math.cos(-endAngle * rad),
    y1 = cy + r * Math.sin(-startAngle * rad),
    y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  }
  function writeInSector(cx, cy, r, angle, PayoffValue, fontSize, params) {
    return paper.text(cx + (r*0.6) * Math.cos(-angle * rad),
      cy + (r*0.6) * Math.sin(-angle * rad),
      "$" + PayoffValue, paper.getFont("Myriad")).attr("font-size", fontSize);
  }

  var angle = 0,
  total = 0,
  start = 0,
  chosenColors = [],
  process = function (j) {
    var value = ProbValues[j],
    angleplus = 360 * value / total,
    popangle = angle + (angleplus / 2),
    color_name = 0;
    ms = 500,
    delta = 30,
    bcolor = Raphael.hsb(start, 1, 1),
    // color="90-" + bcolor + "-" + Raphael.hsb(start, .75, 1);
      
      color = colors[j].color;
    var p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, stroke: stroke, "stroke-width": 10});
    p.start = angle;
    p.end =  angle + angleplus;
    var pFont = writeInSector(cx, cy, r, angle+angleplus/2, PayoffValues[j], fontSize);
    p.color_name =  color_name;
    p.val= Math.round(100*(value/total));
    angle += angleplus;

    chart.push(p);
    chart.push(pFont);
    

    start += .1;
  };
  for (var i = 0, ii = ProbValues.length; i < ii; i++) {
    total += ProbValues[i];
  }
  for (i = 0; i < ii; i++) {
    process(i);
  }
  return chart;
};





// Input Data for the wheel



var allConditions = [
[
{"Version":"30", "SpinnerPairID":"1", "SpinnerID_1":"4",  "probabilityVector1":[.5, .31, .19],   "payoffVector1":[10, 35, 75],  "winChoice1":1,
                 "pairCode":"12",     "SpinnerID_2":"11", "probabilityVector2":[.41, .35, .24],  "payoffVector2":[20, 45, 70],  "winChoice2":2},
{"Version":"30", "SpinnerPairID":"2", "SpinnerID_1":"41", "probabilityVector1":[.27, .40, .33],  "payoffVector1":[0, 40, 95],   "winChoice1":2,
                 "pairCode":"21",     "SpinnerID_2":"31", "probabilityVector2":[.54, .30, .16],  "payoffVector2":[45, 60, 90],  "winChoice2":1},
{"Version":"30", "SpinnerPairID":"3", "SpinnerID_1":"8",  "probabilityVector1":[.49, .27, .24],  "payoffVector1":[15, 70, 80],  "winChoice1":2,
                 "pairCode":"23",     "SpinnerID_2":"3",  "probabilityVector2":[.41, .37, .22],  "payoffVector2":[0, 30, 60],   "winChoice2":3},
{"Version":"30", "SpinnerPairID":"4", "SpinnerID_1":"36", "probabilityVector1":[.39, .25, .36],  "payoffVector1":[30, 50, 90],  "winChoice1":3,
                 "pairCode":"32",     "SpinnerID_2":"23", "probabilityVector2":[.34, .22, .44],  "payoffVector2":[20, 60, 90],  "winChoice2":2},
{"Version":"30", "SpinnerPairID":"5", "SpinnerID_1":"37", "probabilityVector1":[.28, .19, .53],  "payoffVector1":[20, 50, 90],  "winChoice1":1,
                 "pairCode":"13",     "SpinnerID_2":"15", "probabilityVector2":[.30, .30, .40],  "payoffVector2":[30, 50, 95],  "winChoice2":3},
{"Version":"30", "SpinnerPairID":"6", "SpinnerID_1":"21", "probabilityVector1":[.30, .30, .40],  "payoffVector1":[25, 45, 80],  "winChoice1":3,
                 "pairCode":"31",     "SpinnerID_2":"46", "probabilityVector2":[.26, .53, .21],  "payoffVector2":[55, 70, 85],  "winChoice2":1},
{"Version":"30", "SpinnerPairID":"7", "SpinnerID_1":"43", "probabilityVector1":[.55, .28, .17],  "payoffVector1":[10, 50, 75],  "winChoice1":1,
                 "pairCode":"11",     "SpinnerID_2":"19", "probabilityVector2":[.31, .32, .37],  "payoffVector2":[25, 45, 80],  "winChoice2":1},
{"Version":"30", "SpinnerPairID":"8", "SpinnerID_1":"11", "probabilityVector1":[.41, .35, .24],  "payoffVector1":[20, 45, 70],  "winChoice1":2,
                 "pairCode":"22",     "SpinnerID_2":"50", "probabilityVector2":[.32, .50, .18],  "payoffVector2":[50, 75, 90],  "winChoice2":2},
{"Version":"30", "SpinnerPairID":"9", "SpinnerID_1":"26", "probabilityVector1":[.24, .40, .36],  "payoffVector1":[15, 50, 75],  "winChoice1":2,
                 "pairCode":"22",     "SpinnerID_2":"29", "probabilityVector2":[.38, .34, .28],  "payoffVector2":[40, 65, 100],  "winChoice2":2},
{"Version":"30", "SpinnerPairID":"10", "SpinnerID_1":"9",  "probabilityVector1":[.45, .29, .26],  "payoffVector1":[15, 70, 80],  "winChoice1":3,
                 "pairCode":"33",      "SpinnerID_2":"18", "probabilityVector2":[.43, .35, .22],  "payoffVector2":[25, 60, 100], "winChoice2":3}
],
[
{"Version":"30", "SpinnerID":"1",  "probabilityVector":[.38, .36, .26],  "payoffVector":[0, 30, 60],   "winChoice":1},
{"Version":"30", "SpinnerID":"2",  "probabilityVector":[.42, .31, .27],  "payoffVector":[0, 30, 60],   "winChoice":2},
{"Version":"30", "SpinnerID":"3",  "probabilityVector":[.41, .37, .22],  "payoffVector":[0, 30, 60],   "winChoice":3},
{"Version":"30", "SpinnerID":"4",  "probabilityVector":[.5, .31, .19],   "payoffVector":[10, 35, 75],  "winChoice":1},
{"Version":"30", "SpinnerID":"5",  "probabilityVector":[.515, .3, .185], "payoffVector":[10, 35, 75],  "winChoice":2},
{"Version":"30", "SpinnerID":"6",  "probabilityVector":[.5, .32, .18],   "payoffVector":[10, 35, 75],  "winChoice":3},
{"Version":"30", "SpinnerID":"7",  "probabilityVector":[.47, .28, .25],  "payoffVector":[15, 70, 80],  "winChoice":1},
{"Version":"30", "SpinnerID":"8",  "probabilityVector":[.49, .27, .24],  "payoffVector":[15, 70, 80],  "winChoice":2},
{"Version":"30", "SpinnerID":"9",  "probabilityVector":[.45, .29, .26],  "payoffVector":[15, 70, 80],  "winChoice":3},
{"Version":"30", "SpinnerID":"10", "probabilityVector":[.43, .39, .18],  "payoffVector":[20, 45, 70],  "winChoice":1},
{"Version":"30", "SpinnerID":"11", "probabilityVector":[.41, .35, .24],  "payoffVector":[20, 45, 70],  "winChoice":2},
{"Version":"30", "SpinnerID":"12", "probabilityVector":[.40, .34, .26],  "payoffVector":[20, 45, 70],  "winChoice":3},
{"Version":"30", "SpinnerID":"13", "probabilityVector":[.31, .25, .44],  "payoffVector":[30, 50, 95],  "winChoice":1},
{"Version":"30", "SpinnerID":"14", "probabilityVector":[.33, .29, .38],  "payoffVector":[30, 50, 95],  "winChoice":2},
{"Version":"30", "SpinnerID":"15", "probabilityVector":[.30, .30, .40],  "payoffVector":[30, 50, 95],  "winChoice":3},
{"Version":"30", "SpinnerID":"16", "probabilityVector":[.45, .37, .18],  "payoffVector":[25, 60, 100], "winChoice":1},
{"Version":"30", "SpinnerID":"17", "probabilityVector":[.42, .38, .20],  "payoffVector":[25, 60, 100], "winChoice":2},
{"Version":"30", "SpinnerID":"18", "probabilityVector":[.43, .35, .22],  "payoffVector":[25, 60, 100], "winChoice":3},
{"Version":"30", "SpinnerID":"19", "probabilityVector":[.31, .32, .37],  "payoffVector":[25, 45, 80],  "winChoice":1},
{"Version":"30", "SpinnerID":"20", "probabilityVector":[.26, .32, .42],  "payoffVector":[25, 45, 80],  "winChoice":2},
{"Version":"30", "SpinnerID":"21", "probabilityVector":[.30, .30, .40],  "payoffVector":[25, 45, 80],  "winChoice":3},
{"Version":"30", "SpinnerID":"22", "probabilityVector":[.32, .16, .52],  "payoffVector":[20, 60, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"23", "probabilityVector":[.34, .22, .44],  "payoffVector":[20, 60, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"24", "probabilityVector":[.33, .20, .47],  "payoffVector":[20, 60, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"25", "probabilityVector":[.21, .36, .43],  "payoffVector":[15, 50, 75],  "winChoice":1},
{"Version":"30", "SpinnerID":"26", "probabilityVector":[.24, .40, .36],  "payoffVector":[15, 50, 75],  "winChoice":2},
{"Version":"30", "SpinnerID":"27", "probabilityVector":[.25, .38, .37],  "payoffVector":[15, 50, 75],  "winChoice":3},
{"Version":"30", "SpinnerID":"28", "probabilityVector":[.36, .40, .24],  "payoffVector":[40, 65, 100], "winChoice":1},
{"Version":"30", "SpinnerID":"29", "probabilityVector":[.38, .34, .28],  "payoffVector":[40, 65, 100], "winChoice":2},
{"Version":"30", "SpinnerID":"30", "probabilityVector":[.37, .32, .31],  "payoffVector":[40, 65, 100], "winChoice":3},
{"Version":"30", "SpinnerID":"31", "probabilityVector":[.54, .30, .16],  "payoffVector":[45, 60, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"32", "probabilityVector":[.52, .29, .19],  "payoffVector":[45, 60, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"33", "probabilityVector":[.50, .30, .20],  "payoffVector":[45, 60, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"34", "probabilityVector":[.43, .23, .34],  "payoffVector":[30, 50, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"35", "probabilityVector":[.41, .24, .35],  "payoffVector":[30, 50, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"36", "probabilityVector":[.39, .25, .36],  "payoffVector":[30, 50, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"37", "probabilityVector":[.28, .19, .53],  "payoffVector":[20, 50, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"38", "probabilityVector":[.30, .18, .52],  "payoffVector":[20, 50, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"39", "probabilityVector":[.32, .18, .50],  "payoffVector":[20, 50, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"40", "probabilityVector":[.27, .38, .35],  "payoffVector":[0, 40, 95],   "winChoice":1},
{"Version":"30", "SpinnerID":"41", "probabilityVector":[.27, .40, .33],  "payoffVector":[0, 40, 95],   "winChoice":2},
{"Version":"30", "SpinnerID":"42", "probabilityVector":[.26, .42, .32],  "payoffVector":[0, 40, 95],   "winChoice":3},
{"Version":"30", "SpinnerID":"43", "probabilityVector":[.55, .28, .17],  "payoffVector":[10, 50, 75],  "winChoice":1},
{"Version":"30", "SpinnerID":"44", "probabilityVector":[.58, .24, .18],  "payoffVector":[10, 50, 75],  "winChoice":2},
{"Version":"30", "SpinnerID":"45", "probabilityVector":[.60, .24, .16],  "payoffVector":[10, 50, 75],  "winChoice":3},
{"Version":"30", "SpinnerID":"46", "probabilityVector":[.26, .53, .21],  "payoffVector":[55, 70, 85],  "winChoice":1},
{"Version":"30", "SpinnerID":"47", "probabilityVector":[.28, .51, .21],  "payoffVector":[55, 70, 85],  "winChoice":2},
{"Version":"30", "SpinnerID":"48", "probabilityVector":[.25, .52, .23],  "payoffVector":[55, 70, 85],  "winChoice":3},
{"Version":"30", "SpinnerID":"49", "probabilityVector":[.30, .52, .18],  "payoffVector":[50, 75, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"50", "probabilityVector":[.32, .50, .18],  "payoffVector":[50, 75, 90],  "winChoice":2}
],
[
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2}
]
];






/* Experimental Variables */
// Number of conditions in experiment
var numConditions = 1; //allConditions.length;

// Randomly select a condition number for this particular participant
var chooseCondition = 1; // random(0, numConditions-1);

// Based on condition number, choose set of input (trials)
var allTrialOrders = allConditions[chooseCondition-1];

// Number of trials in each condition
var numTrials = 5; //not necessarily allTrialOrders.length;

// Produce random order in which the trials will occur
var shuffledOrder = shuffledArray(allTrialOrders.length);

// Keep track of current trial 
var currentTrialNum = 0;

// A variable special for this experiment because we're randomly
// choosing word orders as well
// var wordOrder = 100;
var trial;

// Keep track of how many trials have been completed
var numComplete = 0;


var colors = [{color_name:"AliceBlue",color:"#F0F8FF"}, 
            {color_name:"AntiqueWhite",color:"#FAEBD7"},
            {color_name:"Aqua",color:"#00FFFF"},
            {color_name:"Aquamarine",color:"#7FFFD4"},
            {color_name:"Bisque",color:"#FFE4C4"},
            {color_name:"Chocolate",color:"#D2691E"},
            {color_name:"CornflowerBlue",color:"#6495ED"},
            {color_name:"Crimson",color:"#DC143C"},
            {color_name:"DarkCyan",color:"#008B8B"},
            {color_name:"DarkGoldenRod",color:"#B8860B"},
            {color_name:"DarkKhaki",color:"#BDB76B"},
            {color_name:"DarkOliveGreen",color:"#556B2F"},
            {color_name:"DarkOrange",color:"#FF8C00"},
            {color_name:"DarkSalmon",color:"#E9967A"},
            {color_name:"DeepPink",color:"#FF1493"},
            {color_name:"DeepSkyBlue",color:"#00BFFF"},
            {color_name:"DodgerBlue",color:"#1E90FF"},
            {color_name:"ForestGreen",color:"#228B22"},
            {color_name:"Gold",color:"#FFD700"},
            {color_name:"GoldenRod",color:"#DAA520"},
            {color_name:"Gray",color:"#808080"},
            {color_name:"GreenYellow",color:"#ADFF2F"},
            {color_name:"IndianRed",color:"#CD5C5C"},
            {color_name:"Khaki",color:"#F0E68C"},
            {color_name:"Lavender",color:"#E6E6FA"},
            {color_name:"LemonChiffon",color:"#FFFACD"},
            {color_name:"LightBlue",color:"#ADD8E6"},
            {color_name:"LightCoral",color:"#F08080"},
            {color_name:"LightCyan",color:"#E0FFFF"},
            {color_name:"LightGray",color:"#D3D3D3"},
            {color_name:"MistyRose",color:"#FFE4E1"},
            {color_name:"Orange",color:"#FFA500"},
            {color_name:"OrangeRed",color:"#FF4500"},
            {color_name:"PaleGoldenRod",color:"#EEE8AA"},
            {color_name:"PaleGreen",color:"#98FB98"},
            {color_name:"PaleTurquoise",color:"#AFEEEE"},
            {color_name:"PaleVioletRed",color:"#DB7093"},
            {color_name:"PeachPuff",color:"#FFDAB9"},
            {color_name:"Peru",color:"#CD853F"},
            {color_name:"Pink",color:"#FFC0CB"},
            {color_name:"Plum",color:"#DDA0DD"},
            {color_name:"PowderBlue",color:"#B0E0E6"},
            {color_name:"SeaGreen",color:"#2E8B56"},
            {color_name:"Sienna",color:"#A0522D"},
            {color_name:"Silver",color:"#C0C0C0"},
            {color_name:"SteelBlue",color:"#4682B4"},
            {color_name:"Tan",color:"#D2B48C"},
            {color_name:"Tomato",color:"#FF6347"},
            {color_name:"Turquoise",color:"#40E0D0"},
            {color_name:"YellowGreen",color:"#9ACD32"}
            ];


/*
Show the instructions slide — this is what we want subjects to see first.
*/

if (BrowserDetect.browser != 'Chrome' && BrowserDetect.browser != 'Safari' && BrowserDetect.browser != 'Firefox') {
    alert ("Warning: We have not tested this HIT with your browser. We recommend Chrome, Firefox or Safari");
    $("#startButton").attr("disabled", "disabled");
}

$("#progressBar").hide();
showSlide("instructions");


// Updates the progress bar
$("#trial-num").html(numComplete);
$("#total-num").html(numTrials);

/*
The actual variable that will be returned to MTurk. The experiment object with various variables that you want to keep track of and return as results.

More practically, you should stick everything in an object and submit that whole object so that you don’t lose data (e.g. randomization parameters, what condition the subject is in, etc). Don’t worry about the fact that some of the object properties are functions — mmturkey (the Turk submission library) will strip these out.
*/

var experiment = {

/*
Parameters for this sequence.
*/
  condition: 1,

  startTime: 0,
  endTime: 0,

  showEarlierWheelFirst: Math.round(Math.random()),

  // An array of subjects' responses to each trial (NOTE: in the order in which
  // you initially listed the trials, not in the order in which they appeared)
  //results: new Array(numTrials),

  // The order in which each trial appeared
  //orders: new Array(numTrials),

  // The order in which each trial is presented. i.e. 
  // presentationOrder[i] = j means the i-th trial is the j-th one in the trial sequence.
  // Note that presentationOrder is now obsolete with spinnerIDArray
  // presentationOrder: new Array(numTrials),

  orderArray: new Array(numTrials),
  askAboutLeftWheelFirstArray: new Array(numTrials),
  showFirstOfPairFirstArray: new Array(numTrials),
  spinnerPairIDArray: new Array(numTrials),
  spinnerPairCodeArray: new Array(numTrials),

  spinnerID_1Array: new Array(numTrials),
  payoff1_1Array: new Array(numTrials),
  payoff2_1Array: new Array(numTrials),
  payoff3_1Array: new Array(numTrials),
  prob1_1Array: new Array(numTrials),
  prob2_1Array: new Array(numTrials),
  prob3_1Array: new Array(numTrials),
  winChoice_1Array: new Array(numTrials),
  win_1Array: new Array(numTrials),
  winProb_1Array: new Array(numTrials),

  spinnerID_2Array: new Array(numTrials),
  payoff1_2Array: new Array(numTrials),
  payoff2_2Array: new Array(numTrials),
  payoff3_2Array: new Array(numTrials),
  prob1_2Array: new Array(numTrials),
  prob2_2Array: new Array(numTrials),
  prob3_2Array: new Array(numTrials),
  winChoice_2Array: new Array(numTrials),
  win_2Array: new Array(numTrials),
  winProb_2Array: new Array(numTrials),

  
  // My Results:
  happy1responseArray: new Array(numTrials),
  sad1responseArray: new Array(numTrials),
  content1responseArray: new Array(numTrials),
  disapp1responseArray: new Array(numTrials),
  relief1responseArray: new Array(numTrials),
  regret1responseArray: new Array(numTrials),
  
  happy2responseArray: new Array(numTrials),
  sad2responseArray: new Array(numTrials),
  content2responseArray: new Array(numTrials),
  disapp2responseArray: new Array(numTrials),
  relief2responseArray: new Array(numTrials),
  regret2responseArray: new Array(numTrials),

  happy3responseArray: new Array(numTrials),
  sad3responseArray: new Array(numTrials),
  content3responseArray: new Array(numTrials),
  disapp3responseArray: new Array(numTrials),
  relief3responseArray: new Array(numTrials),
  regret3responseArray: new Array(numTrials),
  

  attentionCheck1Array: new Array(numTrials),
  attentionCheck2Array: new Array(numTrials),

  attentionCheckTime1Array: new Array(numTrials),
  attentionCheckTime2Array: new Array(numTrials),

  angleProportion_1Array: new Array(numTrials),
  angleProportion_2Array: new Array(numTrials),

  reactionTimeArray: new Array(numTrials),



  // Demographics
  gender: "",
  age:"",
  nativeLanguage:"",
  browser: BrowserDetect.browser,
  browserVersion: BrowserDetect.version,
  browserOS: BrowserDetect.OS,
  comments:"",

 //trials: myTrialOrder,

/*
An array to store the data that we’re collecting.
*/

  data: [],

// Goes to description slide
  description: function() {
    $("#progressBar").show();
    showSlide("description");
    $("#tot-num").html(numTrials);

    if(experiment.showEarlierWheelFirst==1) {
      $("#whichTimeFirst").html("10am wheel (the wheel that was played earlier)");
    } else {

    }

    if (turk.previewMode) {
      alert ( "Please accept the HIT before continuing." );;
    }   
  },

/*
The function that gets called when the sequence is finished.
*/

  end: function() {
  	// Records demographics
    experiment.gender = $('input[name="genderButton"]:checked').val();
    //experiment.age = $('select[name="ageRange"]').val();
    experiment.age = $('#ageRange').val();
    experiment.nativeLanguage = $('input[name="nativeLanguage"]').val();
    experiment.comments = $('textarea[name="commentsTextArea"]').val();

    // Show the finish slide.
    showSlide("finished");

    /*
    Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know we’re just submitting properties [i.e. data])
    */
    setTimeout(function() { turk.submit(experiment);}, 1500);
  },





  next: function() {
        var charNameList = ["Alex", "Bob", "Charlie", "Chris", 
        "David", "Eric", "Frank", "George", "Jacob", "Jake", 
        "James", "John", "Josh", "Mike", "Scott", "Steve", "Tom", 
        "Will", "Zach", "Vince", "Ted", "Sean", "Ron", "Peter", 
        "Paul", "Mark", "Joe", "Nick", "Carl", "Kevin"];

        function refreshCharName() {
            return(charNameList[Math.floor(Math.random()*charNameList.length)]);
        };
        var bobName = refreshCharName(); 
        
        $('#CharName1').html(bobName);
        $('#CharName2').html(bobName);
        $('#CharName3').html(bobName);
        $('#CharName4').html(bobName);
        $('#CharName5').html(bobName);
        $('#CharName6').html(bobName);

    var probabilityVector_leftTotal, probabilityVector_rightTotal;
    var angleStart, angleStart_2;
    var angleEnd, angleEnd_2;
    var randProportion, randProportion_2;
    //var bobStickFigure, hand_left, bobNameText, spinnerL, goButton, goButtonLabel;
    //var charlesStickFigure, hand_right, charlesNameText, spinnerR;
    
  showSlide("stage");
  $("#responseDiv1").hide();
  $("#responseDiv2").hide();
  $("#responseDiv3").hide();
  $('#firstWheelInstruction').show(); 
  $('#secondWheelInstruction').hide(); 
  
  if (numComplete == 0) { // First trial: create canvas.
      canvas=Raphael('wheel', 1000, 300);
  }
  
  // If this is not the first trial, record variables
  if (numComplete > 0) {
    canvas.clear();

          // if(experiment.askAboutLeftWheelFirstArray[numComplete-1]==1) {
            experiment.happy1responseArray[numComplete-1] = $('input[name="happy1"]:checked').val();
            experiment.sad1responseArray[numComplete-1] = $('input[name="sad1"]:checked').val();
            experiment.content1responseArray[numComplete-1] = $('input[name="content1"]:checked').val();
            experiment.disapp1responseArray[numComplete-1] = $('input[name="disapp1"]:checked').val();
            experiment.relief1responseArray[numComplete-1] = $('input[name="relief1"]:checked').val();
            experiment.regret1responseArray[numComplete-1] = $('input[name="regret1"]:checked').val();
            
            experiment.happy2responseArray[numComplete-1] = $('input[name="happy2"]:checked').val();
            experiment.sad2responseArray[numComplete-1] = $('input[name="sad2"]:checked').val();
            experiment.content2responseArray[numComplete-1] = $('input[name="content2"]:checked').val();
            experiment.disapp2responseArray[numComplete-1] = $('input[name="disapp2"]:checked').val();
            experiment.relief2responseArray[numComplete-1] = $('input[name="relief2"]:checked').val();
            experiment.regret2responseArray[numComplete-1] = $('input[name="regret2"]:checked').val();

            experiment.attentionCheck1Array[numComplete-1] = $('#attentionCheck1').val();
            experiment.attentionCheck2Array[numComplete-1] = $('#attentionCheck2').val();

            experiment.attentionCheckTime1Array[numComplete-1] = $('input[name="attentionCheck1a"]:checked').val();
            experiment.attentionCheckTime2Array[numComplete-1] = $('input[name="attentionCheck2a"]:checked').val();
          // } else {
          //   experiment.happy2responseArray[numComplete-1] = $('input[name="happy1"]:checked').val();
          //   experiment.sad2responseArray[numComplete-1] = $('input[name="sad1"]:checked').val();
          //   experiment.content2responseArray[numComplete-1] = $('input[name="content1"]:checked').val();
          //   experiment.disapp2responseArray[numComplete-1] = $('input[name="disapp1"]:checked').val();
          //   experiment.relief2responseArray[numComplete-1] = $('input[name="relief1"]:checked').val();
          //   experiment.regret2responseArray[numComplete-1] = $('input[name="regret1"]:checked').val();
            
          //   experiment.happy1responseArray[numComplete-1] = $('input[name="happy2"]:checked').val();
          //   experiment.sad1responseArray[numComplete-1] = $('input[name="sad2"]:checked').val();
          //   experiment.content1responseArray[numComplete-1] = $('input[name="content2"]:checked').val();
          //   experiment.disapp1responseArray[numComplete-1] = $('input[name="disapp2"]:checked').val();
          //   experiment.relief1responseArray[numComplete-1] = $('input[name="relief2"]:checked').val();
          //   experiment.regret1responseArray[numComplete-1] = $('input[name="regret2"]:checked').val();

          //   experiment.attentionCheck2Array[numComplete-1] = $('#attentionCheck1').val();
          //   experiment.attentionCheck1Array[numComplete-1] = $('#attentionCheck2').val();
          // }
            
            experiment.happy3responseArray[numComplete-1] = $('input[name="happy3"]:checked').val();
            experiment.sad3responseArray[numComplete-1] = $('input[name="sad3"]:checked').val();
            experiment.content3responseArray[numComplete-1] = $('input[name="content3"]:checked').val();
            experiment.disapp3responseArray[numComplete-1] = $('input[name="disapp3"]:checked').val();
            experiment.relief3responseArray[numComplete-1] = $('input[name="relief3"]:checked').val();
            experiment.regret3responseArray[numComplete-1] = $('input[name="regret3"]:checked').val();
            

            experiment.endTime = (new Date()).getTime();
            experiment.reactionTimeArray[numComplete-1] = experiment.endTime - experiment.startTime;

            experiment.data.push(trial);
            
            $('input[name="happy1"]:').prop('checked', false);
            $('input[name="sad1"]:').prop('checked', false);
            $('input[name="content1"]:').prop('checked', false);
            $('input[name="relief1"]:').prop('checked', false);
            $('input[name="regret1"]:').prop('checked', false);
            $('input[name="disapp1"]:').prop('checked', false);
            
            $('input[name="happy2"]:').prop('checked', false);
            $('input[name="sad2"]:').prop('checked', false);
            $('input[name="content2"]:').prop('checked', false);
            $('input[name="relief2"]:').prop('checked', false);
            $('input[name="regret2"]:').prop('checked', false);
            $('input[name="disapp2"]:').prop('checked', false);

            $('input[name="happy3"]:').prop('checked', false);
            $('input[name="sad3"]:').prop('checked', false);
            $('input[name="content3"]:').prop('checked', false);
            $('input[name="relief3"]:').prop('checked', false);
            $('input[name="regret3"]:').prop('checked', false);
            $('input[name="disapp3"]:').prop('checked', false);

            $('#attentionCheck1').val('');
            $('#attentionCheck2').val('');

            $('input[name="attentionCheck1a"]:').prop('checked', false);
            $('input[name="attentionCheck2a"]:').prop('checked', false);
          }
        // If subject has completed all trials, update progress bar and
        // show slide to ask for demographic info
        if (numComplete >= numTrials) {
          $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
          $("#trial-num").html(numComplete);
          $("#total-num").html(numTrials);
          showSlide("askInfo");
        // Otherwise, if trials not completed yet, update progress bar
        // and go to next trial based on the order in which trials are supposed
        // to occur
      } else {
        $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
        $("#trial-num").html(numComplete);
        $("#total-num").html(numTrials);


        //currentTrialNum is used for randomizing later
        currentTrialNum = shuffledOrder[numComplete]; //numComplete //allTrialOrders[numComplete];
        trial = allTrialOrders[currentTrialNum];


        showFirstOfPairFirst = Math.round(Math.random());
        askAboutLeftWheelFirst = Math.round(Math.random());

        if(showFirstOfPairFirst) {
          experiment.spinnerID_1Array[numComplete] = trial.SpinnerID_1;
          experiment.spinnerID_2Array[numComplete] = trial.SpinnerID_2;

          if(askAboutLeftWheelFirst) {
            probabilityVector_left = trial.probabilityVector1;
            payoffVector_left = trial.payoffVector1;
            winChoice_left = trial.winChoice1;

            probabilityVector_right = trial.probabilityVector2;
            payoffVector_right = trial.payoffVector2;
            winChoice_right = trial.winChoice2;
          } else {
            probabilityVector_left = trial.probabilityVector2;
            payoffVector_left = trial.payoffVector2;
            winChoice_left = trial.winChoice2;

            probabilityVector_right = trial.probabilityVector1;
            payoffVector_right = trial.payoffVector1;
            winChoice_right = trial.winChoice1;
          }  
        } else {
          experiment.spinnerID_1Array[numComplete] = trial.SpinnerID_2;
          experiment.spinnerID_2Array[numComplete] = trial.SpinnerID_1;

          if(askAboutLeftWheelFirst) {
            probabilityVector_left = trial.probabilityVector2;
            payoffVector_left = trial.payoffVector2;
            winChoice_left = trial.winChoice2;

            probabilityVector_right = trial.probabilityVector1;
            payoffVector_right = trial.payoffVector1;
            winChoice_right = trial.winChoice1;
          } else {
            probabilityVector_left = trial.probabilityVector1;
            payoffVector_left = trial.payoffVector1;
            winChoice_left = trial.winChoice1;

            probabilityVector_right = trial.probabilityVector2;
            payoffVector_right = trial.payoffVector2;
            winChoice_right = trial.winChoice2;
          }  
        }
        






        
        // winningAngle = 3000;

        // simple routine to calculate win angle.
        // normalizing 
        probabilityVector_leftTotal=0;
        probabilityVector_rightTotal=0;
        angleStart_left = 0;
        angleStart_right = 0;
        for (var i = 0; i < probabilityVector_left.length; i++) {
          probabilityVector_leftTotal += probabilityVector_left[i];
          probabilityVector_rightTotal += probabilityVector_right[i];
          if (i<winChoice_left-1) {
            angleStart_left += probabilityVector_left[i];
          };
          if (i<winChoice_right-1) {
            angleStart_right += probabilityVector_right[i];
          };
        };
        for (var i = 0; i < probabilityVector_left.length; i++) {
          probabilityVector_left[i] = probabilityVector_left[i] / probabilityVector_leftTotal;
          probabilityVector_right[i] = probabilityVector_right[i] / probabilityVector_rightTotal;
        }
        angleStart_left = angleStart_left / probabilityVector_leftTotal;
        angleStart_right = angleStart_right / probabilityVector_rightTotal;
        angleEnd_left = angleStart_left + probabilityVector_left[winChoice_left-1];
        angleEnd_right = angleStart_right + probabilityVector_right[winChoice_right-1];
        // now the desired winning angle is between [angleStart, angleEnd] * 360 degrees
        randProportion_left = Math.random();
        randProportion_right = Math.random();
        // calculate winning angle = uniform draw from [angleStart, angleEnd] * 360 degrees
        // plus 5-10 rounds. Remember to offset - 90 degrees because the angles are calculated
        // from the positive x axis while the pointer is along the positive y axis.
        winningAngle_left = ((angleStart_left * (1-randProportion_left) + angleEnd_left * randProportion_left) 
        + 5 + Math.floor(Math.random()*5)) * 360 - 90;
        winningAngle_right = ((angleStart_right * (1-randProportion_right) + angleEnd_right * randProportion_right) 
        + 5 + Math.floor(Math.random()*5)) * 360 - 90;
        
        //probabilityVector = [.1, .3, .6];
        //payoffVector = [10, 5, 2];
            
            experiment.orderArray[numComplete] = numComplete+1;
            experiment.askAboutLeftWheelFirstArray[numComplete] = askAboutLeftWheelFirst;
            experiment.showFirstOfPairFirstArray[numComplete] = showFirstOfPairFirst;
        
            experiment.spinnerPairIDArray[numComplete] = trial.SpinnerPairID;
            experiment.spinnerPairCodeArray[numComplete] = trial.pairCode;

            if(experiment.showEarlierWheelFirst==1) {
              if(askAboutLeftWheelFirst) {
                $("#earlierWheelSide").html("left");
                $("#laterWheelSide").html("right");
              
                earlierLabel = canvas.text(150,260,"(played at 10am)").attr({'font-size': 24});;
                laterLabel = canvas.text(850,260,"(played at 2pm)").attr({'font-size': 24});;
              } else {

                $("#earlierWheelSide").html("right");
                $("#laterWheelSide").html("left");
                earlierLabel = canvas.text(150,260,"(played at 2pm)").attr({'font-size': 24});;
                laterLabel = canvas.text(850,260,"(played at 10am)").attr({'font-size': 24});;
              }
            } else {
              if(askAboutLeftWheelFirst) {

                $("#earlierWheelSide").html("right");
                $("#laterWheelSide").html("left");
                earlierLabel = canvas.text(150,260,"(played at 2pm)").attr({'font-size': 24});;
                laterLabel = canvas.text(850,260,"(played at 10am)").attr({'font-size': 24});;
              } else {
                $("#earlierWheelSide").html("left");
                $("#laterWheelSide").html("right");
              
                earlierLabel = canvas.text(150,260,"(played at 10am)").attr({'font-size': 24});;
                laterLabel = canvas.text(850,260,"(played at 2pm)").attr({'font-size': 24});;
              }
            }
              


            if(askAboutLeftWheelFirst) {
              experiment.payoff1_1Array[numComplete] = payoffVector_left[0] ;
              experiment.payoff2_1Array[numComplete] = payoffVector_left[1] ;
              experiment.payoff3_1Array[numComplete] = payoffVector_left[2] ;
              experiment.prob1_1Array[numComplete] = probabilityVector_left[0] ;
              experiment.prob2_1Array[numComplete] = probabilityVector_left[1] ;
              experiment.prob3_1Array[numComplete] = probabilityVector_left[2] ;
              experiment.angleProportion_1Array[numComplete] = Math.round(randProportion_left*1000)/1000;
              experiment.winChoice_1Array[numComplete] = winChoice_left;
              experiment.win_1Array[numComplete] = payoffVector_left[winChoice_left-1];
              experiment.winProb_1Array[numComplete] = probabilityVector_left[winChoice_left-1];

              experiment.payoff1_2Array[numComplete] = payoffVector_right[0] ;
              experiment.payoff2_2Array[numComplete] = payoffVector_right[1] ;
              experiment.payoff3_2Array[numComplete] = payoffVector_right[2] ;
              experiment.prob1_2Array[numComplete] = probabilityVector_right[0] ;
              experiment.prob2_2Array[numComplete] = probabilityVector_right[1] ;
              experiment.prob3_2Array[numComplete] = probabilityVector_right[2] ;
              experiment.angleProportion_2Array[numComplete] = Math.round(randProportion_right*1000)/1000;
              experiment.winChoice_2Array[numComplete] = winChoice_right;
              experiment.win_2Array[numComplete] = payoffVector_right[winChoice_right-1];
              experiment.winProb_2Array[numComplete] = probabilityVector_right[winChoice_right-1];
            } else {
              experiment.payoff1_2Array[numComplete] = payoffVector_left[0] ;
              experiment.payoff2_2Array[numComplete] = payoffVector_left[1] ;
              experiment.payoff3_2Array[numComplete] = payoffVector_left[2] ;
              experiment.prob1_2Array[numComplete] = probabilityVector_left[0] ;
              experiment.prob2_2Array[numComplete] = probabilityVector_left[1] ;
              experiment.prob3_2Array[numComplete] = probabilityVector_left[2] ;
              experiment.angleProportion_2Array[numComplete] = Math.round(randProportion_left*1000)/1000;
              experiment.winChoice_2Array[numComplete] = winChoice_left;
              experiment.win_2Array[numComplete] = payoffVector_left[winChoice_left-1];
              experiment.winProb_2Array[numComplete] = probabilityVector_left[winChoice_left-1];

              experiment.payoff1_1Array[numComplete] = payoffVector_right[0] ;
              experiment.payoff2_1Array[numComplete] = payoffVector_right[1] ;
              experiment.payoff3_1Array[numComplete] = payoffVector_right[2] ;
              experiment.prob1_1Array[numComplete] = probabilityVector_right[0] ;
              experiment.prob2_1Array[numComplete] = probabilityVector_right[1] ;
              experiment.prob3_1Array[numComplete] = probabilityVector_right[2] ;
              experiment.angleProportion_1Array[numComplete] = Math.round(randProportion_right*1000)/1000;
              experiment.winChoice_1Array[numComplete] = winChoice_right;
              experiment.win_1Array[numComplete] = payoffVector_right[winChoice_right-1];
              experiment.winProb_1Array[numComplete] = probabilityVector_right[winChoice_right-1];
            }

        chosenColorsNum = shuffledArray(colors.length);        
        chosenColors_left = [];
        chosenColors_right = [];
        for (var l = 0; l<3; l++) {
          chosenColors_left[l] = colors[chosenColorsNum[l]];
          chosenColors_right[l] = colors[chosenColorsNum[l+5]];
        }

            


        // Creates spinner
        // if(askAboutLeftWheelFirst) {
          spinnerL = canvas.pieChart(150, 125, 100, probabilityVector_left, payoffVector_left,
            chosenColors_left, 24);

          spinnerR = canvas.pieChart(850, 125, 100, probabilityVector_right, payoffVector_right,
            chosenColors_right, 24);

          // spinnerL = canvas.pieChart(canvas.width/4, 150, 125, probabilityVector_left, payoffVector_left,
          //   chosenColors_left, 24);

          // spinnerR = canvas.pieChart(canvas.width/4*3, 150, 125, probabilityVector_right, payoffVector_right,
          //   chosenColors_right, 24);

        // } else {
        //   spinnerL = canvas.pieChart(canvas.width/4, 150, 125, probabilityVector_right, payoffVector_right,
        //     chosenColors_2, 24);

        //   spinnerR = canvas.pieChart(canvas.width/4*3, 150, 125, probabilityVector_left, payoffVector_left,
        //     chosenColors, 24);
        // }
        
        // Adds pointers
        canvas.triangle(150, 5, 15).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");
        canvas.triangle(850, 5, 15).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");


        bobStickFigure = canvas.image("https://www.stanford.edu/~dco/common/images/bob.jpeg", 500 -25 -50-50-25, 65, 52, 128);
        bobStickFigure2 = canvas.image("https://www.stanford.edu/~dco/common/images/bob.jpeg", 500 -25 +50+50+25, 65, 52, 128);
        hand_right = canvas.image("https://www.stanford.edu/~dco/common/images/hand.png", 500 + 5 +50+50+25, 112, 64, 48).transform("r90");
        hand_left = canvas.image("https://www.stanford.edu/~dco/common/images/hand_flip.png", 500 - 65 -50-50-25, 112, 64, 48).transform("r270");

        pause_right = canvas.image("https://www.stanford.edu/~dco/common/images/pause.png", 500 +50+20, 5, 64, 64);
        pause_left = canvas.image("https://www.stanford.edu/~dco/common/images/pause.png", 500 - 65 -50-25, 5, 64, 64);

        bobNameText_left = canvas.text(500 -25 -50-50-25 +20, 260, bobName).attr({'font-size': 24});
        bobNameText_right = canvas.text(500 -25 +50+50+25 +20, 260, bobName).attr({'font-size': 24});

        goButton1 = canvas.rect(500-45,20,90,25,0).attr({fill: "#0f0"});
        //goButtonLabel = canvas.text(canvas.width/4+25,10,"Go!");

        goButton2 = canvas.rect(500-45,30,90,25,0).attr({fill: "#00f"});

        TV_left = canvas.rect(150 -125, 3, 400, 280, 10);
        TV_right = canvas.rect(3*250 -180, 3, 400, 280, 10);


        //goButton.hide();
        //goButtonLabel.hide();

        goButton2.hide();

        if(askAboutLeftWheelFirst) {
          $('#whichWheelFirst_span1').html("left");
          $('#whichWheelFirst_span2').html("left");
          $('#whichWheelFirst_span3').html("right");
          $('#whichWheelFirst_span4').html("right");

          goButton1.click(function() {
            hand_left.animate(
              {transform: "r270,T" + (-350 + 170 +50+50) + ",0"}, 1000, '<>',  
                function() {
                  spinnerL.animate(
                    {transform: "r" + winningAngle_left + " " + 150 + " " + 125}, 3000, '>',
                    afterSpin1);
                    // hand_left.animate({transform: "r90,T" + (canvas.width/4 - 200) + ",0"}, 500, '<>');
                    hand_left.animate({transform: "r270,T" + (-350 + 200 +50+50) + ",0"}, 500, '<>');
                    }
                );
            goButton1.hide();
            pause_left.hide();
          });
          goButton2.click(function() {
            hand_right.animate(
              {transform: "r90,T" + (350 - 170 - 50-50) + ",0"}, 1000, '<>',  
                function() {
                  spinnerR.animate(
                    {transform: "r" + winningAngle_right + " " + 850 + " " + 125}, 3000, '>',
                    afterSpin2);
                    // hand_right.animate({transform: "r270,T" + (-canvas.width/4 + 200) + ",0"}, 500, '<>');
                    hand_right.animate({transform: "r90,T" + (350 - 200 -50-50) + ",0"}, 500, '<>');
                    }
                );
            goButton2.hide();
            pause_right.hide();
          });
        } else {
          $('#whichWheelFirst_span1').html("right");
          $('#whichWheelFirst_span2').html("right");
          $('#whichWheelFirst_span3').html("left");
          $('#whichWheelFirst_span4').html("left");

          goButton2.click(function() {
            hand_left.animate(
              {transform: "r270,T" + (-350 + 170 +50+50) + ",0"}, 1000, '<>',  
                function() {
                  spinnerL.animate(
                    {transform: "r" + winningAngle_left + " " + 150 + " " + 125}, 3000, '>',
                    afterSpin2);
                    // hand_left.animate({transform: "r90,T" + (canvas.width/4 - 200) + ",0"}, 500, '<>');
                    hand_left.animate({transform: "r270,T" + (-350 + 200+50+50) + ",0"}, 500, '<>');
                    }
                );
            goButton2.hide();
            pause_left.hide();
          });
          goButton1.click(function() {
            hand_right.animate(
              {transform: "r90,T" + (350 - 170 -50-50) + ",0"}, 1000, '<>',  
                function() {
                  spinnerR.animate(
                    {transform: "r" + winningAngle_right + " " + 850 + " " + 125}, 3000, '>',
                    afterSpin1);
                  // hand_right.animate({transform: "r270,T" + (-canvas.width/4 + 200) + ",0"}, 500, '<>');
                    hand_right.animate({transform: "r90,T" + (350 - 200 -50-50) + ",0"}, 500, '<>');
                    }
                );
            goButton1.hide();
            pause_right.hide();
          });
        }

        // goButton1.click(function() {
        //     hand_left.animate(
        //       {transform: "r90,T" + (canvas.width/4 - 170) + ",0"}, 1000, '<>',  
        //         function() {
        //           spinnerL.animate(
        //             {transform: "r" + winningAngle_left + " " + canvas.width/4 + " " + 150}, 3000, '>',
        //             afterSpin);
        //             hand_left.animate({transform: "r90,T" + (canvas.width/4 - 200) + ",0"}, 500, '<>');
        //             }
        //         );
        //     hand_right.animate(
        //       {transform: "r270,T" + (-canvas.width/4 + 170) + ",0"}, 1000, '<>',  
        //         function() {
        //           spinnerR.animate(
        //             {transform: "r" + winningAngle_right + " " + canvas.width/4*3 + " " + 150}, 3000, '>');
        //           hand_right.animate({transform: "r270,T" + (-canvas.width/4 + 200) + ",0"}, 500, '<>');
        //             }
        //         );
        // });


              function afterSpin1() {
                $("#responseDiv1").show(); 
                experiment.startTime = (new Date()).getTime();
              }

              function afterSpin2() {
                $("#responseDiv2").show(); 
              }



              function afterSpin() {
                var winningPayoff_left = payoffVector_left[winChoice-1];
                var winningPayoff_right = payoffVector_right[winChoice_right-1];
                
                // outline the selected character
                // canvas.rect(x of tl corner,y of tl corner,width,height, radius of rounded corners)
                
                $('#Outcome1').html(winningPayoff_left);
                $('#Outcome2').html(winningPayoff_right);
                
                if(askAboutLeftWheelFirst) {
                  $('#whichWheelFirst_span1').html("left");
                  $('#whichWheelFirst_span2').html("left");
                  $('#whichWheelFirst_span3').html("right");
                  $('#whichWheelFirst_span4').html("right");
                //   canvas.rect(1, 50, 80, 175, 20).attr({stroke: "#f00"});
                } else {
                  $('#whichWheelFirst_span1').html("right");
                  $('#whichWheelFirst_span2').html("right");
                  $('#whichWheelFirst_span3').html("left");
                  $('#whichWheelFirst_span4').html("left");
                //   canvas.rect(canvas.width-81-50, 50, 80, 175, 20).attr({stroke: "#f00"});
                }

                $("#response").show(); 
                experiment.startTime = (new Date()).getTime();
              }
    numComplete++;
    }
  }

  


};