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

var forbiddenIds = ["A1E0GR2W1GJO0E","AEXYBW3COL9JM","A6UCL995Y1LFC","A21XD6CWE1JNMQ","A1FBO95OVBYOH1",
"A2DZ3OFTXRZVNY","A1VO8E1TC7IJFY","AJOC8JZT3FEBF","AH31QLJ57XC8W","A38PKJM1ZRMDT8","A3NS1DN6J7Z3EU","A24F1UPER626KR",
"A25D66AC4QUW2U","AUVC78LEL0T6L","A3HZ31VAGTVQMQ","A1VLZL3CA1WMPT","A2CKW83ERUX07J","A3JI3B5GTVA95F","A19WXHQSBB6P6",
"A1RATFICCKLCQ"];

// Block turkers who have done a version of this experiment before
if (_(forbiddenIds).contains(turk.workerId)) {
  location.href = "already.html"
}

// random(a,b); Returns random number between a and b, inclusive
function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

// Shuffles Array
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

// Compute Median
function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half-1] + values[half]) / 2.0;
    }
}

// Compute next pUP
function compute_next_pUP(this_pUP){
  var mu = this_pUP;
  var variance = 0.07*0.07;
  var alpha = mu * (( (mu * (1 - mu)) / variance)- 1);
  var beta = (1 - mu) * (((mu * (1 - mu)) /variance)-1);
  var next_pUP = jStat.beta.sample(alpha,beta);
  while (next_pUP > 0.9 || next_pUP < 0.1)
    {
      next_pUP = jStat.beta.sample(alpha,beta);
    }
  return next_pUP;
}

// Generate sequence of pUPs
function gen_pUP(trials){
  var rerun = 1;
  while (rerun)
  {
    var pUP = [];
    pUP[0] = Math.random();
    for (i = 1; i < trials; i++)
    {
      pUP[i] = compute_next_pUP(pUP[i-1]);
    }
    if (jStat.mean(pUP) < 0.55 && jStat.mean(pUP) >0.45 && jStat.median(pUP) < 0.55 && jStat.median(pUP) > 0.45 && jStat.stdev(pUP) > 0.18)
    {
      rerun = 0;
    } 
  }
  return pUP;
}

// Generate sequences of advisor outcomes
function get_AdvisorCorrect(nTrials,PctCorrect){
  AdvisorCorrect = _.range(nTrials*PctCorrect).map(function(){return 1});
  AdvisorWrong = _.range(nTrials*(1-PctCorrect)).map(function(){return 0});
  AdvisorCorrect = AdvisorCorrect.concat(AdvisorWrong);
  AdvisorCorrect = AdvisorCorrect.shuffle();

  return AdvisorCorrect
}

/* showSlide(id); Displays each slide */
function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

/*
Show the instructions slide — this is what we want subjects to see first.
*/

showSlide("instructions");

var experiment = {
  nTrials_Private: 36,
  nTrials_Social: 36,
  nTrials_Joint: 36,
  tally: 0,
  bonus: 0,
  AC1 : "Fail",
  AC2 : "Fail",
  condition: "white", //_.sample(["white","black","algorithm"]),
  browser: BrowserDetect.browser,
  mobile: "",
  face_order: _.shuffle([1, 2, 3, 4, 5, 6]),
  
  OutcomeTime: 1000,
  MaxResponseTime: 4000,
  
  // Demographics
  gender: "",
  age:"",
  comments:"",

  dataPrivate: [],
  dataSocial: [],
  dataJoint:[],

// Goes to description slide
description: function() {
  showSlide("description");

  if (turk.previewMode) {
    alert ( "Please accept the HIT before continuing." );
  }

  $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 90) {
      $(document).unbind("keydown");
      $(".right").hide();
      setTimeout(experiment.description2, 500);
    }
  })
},

description2: function() {
  showSlide("description2");
  $(".left").show();
  $(".right").show();

  $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 77) {
      $(document).unbind("keydown");
      $(".left").hide();
      setTimeout(experiment.description3, 500);
    }
  })
},

description3: function() {
  showSlide("description3");

  $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 71) {
      $(document).unbind("keydown");
      setTimeout(experiment.startPrivate, 500);
    }
  })
},

startPrivate: function(){
  var nTrials = experiment.nTrials_Private;
  //var pUP_private = gen_pUP(nTrials);
  
  ups = _.range(18).map(function(){return 0.80});
  downs = _.range(18).map(function(){return 0.20});
  
  if (Math.random() < 0.5)
    {var pUP_private = ups.concat(downs);}
  else 
    {var pUP_private = downs.concat(ups);}

  var trial_num = 0;
  experiment.choice_screen(pUP_private,"private",trial_num)
},


choice_screen: function(pUP,type,trial_num) {
  var startTime = (new Date()).getTime();

  showSlide("choice_screen")
  $(".left").show();
  $(".right").show();
  trial_num = trial_num + 1;

  var this_pUP = pUP.shift() 

  if (typeof this_pUP == "undefined") {
      return experiment.learn_description();
    }
  
  if (Math.random() < this_pUP)
  {var stock_outcome = 1;}
  else
  {var stock_outcome = -1;}

  $(".pUP_id").html(this_pUP);
  $(".StockOutcome_id").html([stock_outcome])
  $(".trial_num_id").html(trial_num)

  timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num)}, experiment.MaxResponseTime);

  $(document).keydown(function(event) {
    var keyCode = event.which;
    if (keyCode == 90) {
    clearTimeout(timeout);
    var choice = 1;
      $(document).unbind("keydown");
      $(".right").hide();
      var outcome = (stock_outcome == 1) ? 1:-1;
      $("#PlayerOutcome_id").html(outcome);
      experiment.tally = experiment.tally + outcome;
      var endTime = (new Date()).getTime();

      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally
      }
       experiment.dataPrivate.push(data)
       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
       setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
       setTimeout(function(){experiment.choice_screen(pUP,type,trial_num);},experiment.OutcomeTime*3);
       clearTimeout(timeout);
     }
     else if (keyCode == 77){
      clearTimeout(timeout);
      var choice = 0;
      $(document).unbind("keydown");
      $(".left").hide();
      var outcome = (stock_outcome == 1) ? -1:1;
      $("#PlayerOutcome_id").html(outcome);
      experiment.tally = experiment.tally + outcome;
      var endTime = (new Date()).getTime();
      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally
      }
      experiment.dataPrivate.push(data)
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
      setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
      setTimeout(function(){experiment.choice_screen(pUP,type,trial_num);},experiment.OutcomeTime*3);
      clearTimeout(timeout);
    }
  })
},

stock_outcome: function(stock_outcome){
  if (stock_outcome==1) {showSlide("UP_page")}
  else {showSlide("DOWN_page")}
},

player_outcome: function(outcome){
  var outcome_text = (outcome == 1) ? "You were correct!" : "Sorry, you were wrong.";
  var outcome_points = (outcome == 1) ? "+ 4 cents" : "- 4 cents"

  $("#Outcome_text_id").html(outcome_text);
  $("#Outcome_points_id").html(outcome_points);
  showSlide("outcome_page")
},

timeout_screen: function(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorCorrect){

  switch(type){

    case "private":
    var data = {
      type: type,
      trial_num: trial_num, 
      pUP:this_pUP,
      choice: NaN,
      stock_outcome: NaN,
        outcome: NaN,
        rt: NaN,
        tally: experiment.tally
      }
      experiment.dataPrivate.push(data)
      showSlide("slow")
      $(document).unbind("keydown");
      setTimeout(function(){experiment.choice_screen(pUP,type,trial_num);}, experiment.OutcomeTime)
      break

      case "social":

      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: NaN,
        stock_outcome: NaN,
        outcome: NaN,
        rt: NaN,
        tally: experiment.tally,
        Advice: NaN,
        AdvisorCorrect: NaN
      }
      experiment.dataSocial.push(data)

      showSlide("slow")
      $(document).unbind("keydown");
      setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorCorrect);}, experiment.OutcomeTime)
      break

    case "joint":

      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: NaN,
        stock_outcome: NaN,
        outcome: NaN,
        rt: NaN,
        tally: experiment.tally,
        Advice: NaN,
        AdvisorCorrect: NaN
      }
      experiment.dataJoint.push(data)

      showSlide("slow")
      $(document).unbind("keydown");
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorCorrect);}, experiment.OutcomeTime)
      break
    }
  },

//edited until here
learn_description: function(){
  if (experiment.condition == "white"){

  face1 = new Image();
  face2 = new Image();
  face3 = new Image();
  face4 = new Image();
  face5 = new Image();
  face6 = new Image();

  face1.src = "images/w1.png";
  face2.src = "images/w2.png";
  face3.src = "images/w3.png";
  face4.src = "images/w4.png";
  face5.src = "images/w5.png";
  face6.src = "images/w6.png";

  temp = "In Part 2 of the experiment, you will evaluate the performance another analyst playing the task. " +
  "In each time period, you will be presented with a photo of him. " +
  "He will make a prediction about whether the stock will go up or go down. " +
  "Prior to seeing his prediction, you will have to guess if his prediction will be accurate.";

  $("#end_private1").html(temp);

  temp = "If you think he will make an accurate prediction, press Z to select FOR. " +
  "If you think he will make an inaccurate prediction, press M to select AGAINST.";

  $("#end_private2").html(temp);

  Ad1 = "images/w" + experiment.face_order[0] + ".png";

  $("img.img_prac").attr("src", Ad1);

  $(".noun").html("analyst")

} else if (experiment.condition == "black") {
  face1 = new Image();
  face2 = new Image();
  face3 = new Image();
  face4 = new Image();
  face5 = new Image();
  face6 = new Image();

  face1.src = "images/b1.png";
  face2.src = "images/b2.png";
  face3.src = "images/b3.png";
  face4.src = "images/b4.png";
  face5.src = "images/b5.png";
  face6.src = "images/b6.png";

  temp = "In Part 2 of the experiment, you will evaluate the performance another analyst playing the task. " +
  "In each time period, you will be presented with a photo of him. " +
  "He will make a prediction about whether the stock will go up or go down. " +
  "Prior to seeing his prediction, you will have to guess if his prediction will be accurate.";

  $("#end_private1").html(temp);

  temp = "If you think he will make an accurate prediction, press Z to select FOR. " +
  "If you think he will make an inaccurate prediction, press M to select AGAINST.";

  $("#end_private2").html(temp);

  Ad1 = "images/w" + experiment.face_order[0] + ".png";

  $("img.img_prac").attr("src", Ad1);

  $(".noun").html("analyst") //edited until here

}

else if (experiment.condition == "algorithm") {

  frac1 = new Image();
  frac2 = new Image();
  frac3 = new Image();
  frac4 = new Image();
  frac5 = new Image();
  frac6 = new Image();

  frac1.src = "images/frac1.png";
  frac2.src = "images/frac2.png";
  frac3.src = "images/frac3.png";
  frac4.src = "images/frac4.png";
  frac5.src = "images/frac5.png";
  frac6.src = "images/frac6.png";

  temp = "In Part 2 of the experiment, you will evaluate how well different computer algorithms predict the stock. " +
  "In each time period, you will be presented with an icon that represents a computer algorithm. " +
  "The algorithm will provide a prediction about whether the stock will go up or go down. " +
  "Prior to seeing this prediction, you will have to guess if the prediction will be accurate.";

  $("#end_private1").html(temp);

  temp = "If you think the algorithm's prediction will be accurate, press Z to select FOR. " +
  "If you think the algorithm's prediction will be inaccurate, press M to select AGAINST.";

  $("#end_private2").html(temp)

  Ad1 = "images/frac" + experiment.face_order[0] + ".png";

  $("img.img_prac").attr("src", Ad1);

  $(".noun").html("algorithm")
}

  $("#tally_id").html(experiment.tally);
  showSlide("end_private")

    $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 90) {
      $(document).unbind("keydown");
      $(".right").hide();
      $("#learn1").show();
      $('#for').show();

      $(document).keydown(function(event) {
      var keyCode = event.which;
      if (keyCode == 71) {
        $(document).unbind("keydown");
        experiment.AC1 = "Pass";
        experiment.startSocial();}
      })
    }
    
    else if (keyCode == 77){
      $(document).unbind("keydown");
      $(".left").hide();
      $("#learn1").show();
      $('#against').show();
      
      $(document).keydown(function(event) {
      var keyCode = event.which;
      if (keyCode == 71) {
        $(document).unbind("keydown");
        experiment.AC1 = "Pass";
        experiment.startSocial();}
      })
    }})
  },

startSocial: function(){
  var nTrials = experiment.nTrials_Social;
  //var pUP_Social = gen_pUP(nTrials);
  
  ups = _.range(18).map(function(){return 0.80});
  downs = _.range(18).map(function(){return 0.20});

  if (Math.random() < 0.5)
    {var pUP_Social = ups.concat(downs,ups);}
  else 
    {var pUP_Social = downs.concat(ups,downs);}

  var trial_num = 0;  
  var FaceOrder = experiment.face_order;
  var AdvisorCorrect = get_AdvisorCorrect(nTrials,0.50);

  experiment.social_screen(pUP_Social,"social",trial_num,FaceOrder,AdvisorCorrect)
},

social_screen: function(pUP,type,trial_num,FaceOrder,AdvisorCorrect){
  var startTime = (new Date()).getTime();

  showSlide("social_screen")
  trial_num = trial_num + 1;

  var this_pUP = pUP.shift();

  if (experiment.condition == "white"){
    Ad1 = "w" + FaceOrder[0] + ".png";
  } else if (experiment.condition == "black") {
    Ad1 = "b" + FaceOrder[0] + ".png";
  } else if (experiment.condition == "algorithm") {
    Ad1 = "frac" + FaceOrder[0] + ".png";
  }

  $("img.AdvisorElement").attr("src", "images/" + Ad1);
  this_AdvisorCorrect = AdvisorCorrect.shift();
  
  $(".left").show();
  $(".right").show();

  if (typeof this_pUP == "undefined") {
    return experiment.joint_description();
  }
  
  if (Math.random() < this_pUP)
    {var stock_outcome = 1;}
  else
    {var stock_outcome = -1;}

  if (this_AdvisorCorrect) 
    {var Advice = stock_outcome;}
  else
    {var Advice = stock_outcome*-1;}

  $(".pUP_id").html(this_pUP);
  $(".StockOutcome_id").html([stock_outcome]);
  $(".trial_num_id").html(trial_num);

  timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorCorrect)}, experiment.MaxResponseTime);

  $(document).keydown(function(event) {
    var keyCode = event.which;
    if (keyCode == 90) {
    clearTimeout(timeout);
    var choice = 1;
      $(document).unbind("keydown");
      $(".right").hide();
      var outcome = (this_AdvisorCorrect) ? 1:-1;
      $("#PlayerOutcome_id").html(outcome);
      experiment.tally = experiment.tally + outcome;
      var endTime = (new Date()).getTime();

      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
       experiment.dataSocial.push(data);
       setTimeout(function(){experiment.advice_screen(Advice);}, experiment.OutcomeTime);
       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime*2);
       setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*3);
       setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorCorrect);}, experiment.OutcomeTime*4);
       clearTimeout(timeout);
     }
     else if (keyCode == 77){
      clearTimeout(timeout);
      var choice = 0;
      $(document).unbind("keydown");
      $(".left").hide();
      var outcome = (this_AdvisorCorrect) ? -1:1;
      $("#PlayerOutcome_id").html(outcome);
      experiment.tally = experiment.tally + outcome;
      var endTime = (new Date()).getTime();
      
      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
      experiment.dataSocial.push(data)
      setTimeout(function(){experiment.advice_screen(Advice);}, experiment.OutcomeTime);
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime*2);
      setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*3);
      setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,AdvisorCorrect);}, experiment.OutcomeTime*4);
      clearTimeout(timeout);
    }
  })
},

advice_screen: function(advice){
  if (advice==1) {showSlide("predictUp_page")}
  else {showSlide("predictDown_page")}
},

joint_description: function(){

  $("#tally_id2").html(experiment.tally);
  showSlide("end_social")

    $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 90) {
      $(document).unbind("keydown");
      $(".right").hide();
      $("#joint1").show();
      $('#for').show();

      $(document).keydown(function(event) {
      var keyCode = event.which;
      if (keyCode == 71) {
        $(document).unbind("keydown");
        experiment.AC2 = "Pass";
        experiment.startJoint();}
      })
    }
    
    else if (keyCode == 77){
      $(document).unbind("keydown");
      $(".left").hide();
      $("#joint1").show();
      $('#against').show();
      
      $(document).keydown(function(event) {
      var keyCode = event.which;
      if (keyCode == 71) {
        $(document).unbind("keydown");
        experiment.AC2 = "Pass";
        experiment.startJoint();}
      })
    }})
  },

  startJoint: function(){
  var nTrials = experiment.nTrials_Joint;
  //var pUP = gen_pUP(nTrials);

    ups = _.range(18).map(function(){return 0.80});
  downs = _.range(18).map(function(){return 0.20});

  if (Math.random() < 0.5)
    {var pUP = ups.concat(downs,ups);}
  else 
    {var pUP = downs.concat(ups,downs);}
  
  var trial_num = 0;  
  var FaceOrder = experiment.face_order;
  var AdvisorCorrect = get_AdvisorCorrect(nTrials,0.50);

  document.getElementById("logo_pic").src = "images/logo3.png"

  experiment.joint_screen(pUP,"joint",trial_num,FaceOrder,AdvisorCorrect)
},

joint_screen: function(pUP,type,trial_num,FaceOrder,AdvisorCorrect){
  var startTime = (new Date()).getTime();
  var this_pUP = pUP.shift() ;
  trial_num = trial_num + 1;
  
  if (experiment.condition == "white"){
    Ad1 = "w" + FaceOrder[0] + ".png";
  } else if (experiment.condition == "black") {
    Ad1 = "b" + FaceOrder[0] + ".png";
  } else if (experiment.condition == "algorithm") {
    Ad1 = "frac" + FaceOrder[0] + ".png";
  }

  $("img.AdvisorElement").attr("src", "images/" + Ad1);
  this_AdvisorCorrect = AdvisorCorrect.shift(); 


  if (Math.random() < this_pUP)
    {var stock_outcome = 1;}
  else
    {var stock_outcome = -1;}

  if (this_AdvisorCorrect) 
    {var Advice = stock_outcome;}
  else
    {var Advice = stock_outcome*-1;}

  if (typeof this_pUP == "undefined") {
    return experiment.selfreport();
  }

  experiment.advice_screen(Advice);

  setTimeout(function(){
    showSlide("choice_screen");
    $(".left").show();
    $(".right").show();},1500)

  $(".pUP_id").html(this_pUP);
  $(".StockOutcome_id").html([stock_outcome]);
  $(".trial_num_id").html(trial_num);

  setTimeout(function(){
    timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorCorrect)}, experiment.MaxResponseTime);
    $(document).keydown(function(event) {
    var keyCode = event.which;
    if (keyCode == 90) {
    clearTimeout(timeout);
    var choice = 1;
      $(document).unbind("keydown");
      $(".right").hide();
      var outcome = (stock_outcome==1) ? 1:-1;
      $("#PlayerOutcome_id").html(outcome);
      experiment.tally = experiment.tally + outcome;
      var endTime = (new Date()).getTime();

      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
       experiment.dataJoint.push(data);

       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
       setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
       setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorCorrect);}, experiment.OutcomeTime*3);
       clearTimeout(timeout);
     }
     else if (keyCode == 77){
      clearTimeout(timeout);
      var choice = 0;
      $(document).unbind("keydown");
      $(".left").hide();
      var outcome = (stock_outcome==1) ? -1:1;
      $("#PlayerOutcome_id").html(stock_outcome);
      experiment.tally = experiment.tally + outcome;
      var endTime = (new Date()).getTime();
      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
      experiment.dataJoint.push(data)
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
      setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorCorrect);}, experiment.OutcomeTime*3);
      clearTimeout(timeout);
    }
  })
},1500);
},

selfreport: function(){
  showSlide("selfreport");
  if (experiment.condition == "white") {
    document.getElementById("F1").src = "images/w1.png";
    document.getElementById("F2").src = "images/w2.png";
    document.getElementById("F3").src = "images/w3.png";
    document.getElementById("F4").src = "images/w4.png";
    document.getElementById("F5").src = "images/w5.png";
    document.getElementById("F6").src = "images/w6.png";
  } else if (experiment.condition == "black") {
    document.getElementById("F1").src = "images/b1.png";
    document.getElementById("F2").src = "images/b2.png";
    document.getElementById("F3").src = "images/b3.png";
    document.getElementById("F4").src = "images/b4.png";
    document.getElementById("F5").src = "images/b5.png";
    document.getElementById("F6").src = "images/b6.png";
  } else if  (experiment.condition == "algorithm") {
    document.getElementById("F1").src = "images/frac1.png";
    document.getElementById("F2").src = "images/frac2.png";
    document.getElementById("F3").src = "images/frac3.png";
    document.getElementById("F4").src = "images/frac4.png";
    document.getElementById("F5").src = "images/frac5.png";
    document.getElementById("F6").src = "images/frac6.png";
  }
  
},

demographics: function() {
 
  analyst = [];
  foil = [];
  faceacc =[];

  if (experiment.tally < 6) {bonus = 24;} else if (experiment.tally > 37){bonus=150;} else{bonus = experiment.tally*4}

  $("#tally_id3").html(bonus);

  self = $("input[name = 'selfacc']").val();
  
  faceacc[1] = $("input[name = 'face1acc']").val();
  faceacc[2] = $("input[name = 'face2acc']").val();
  faceacc[3] = $("input[name = 'face3acc']").val();
  faceacc[4] = $("input[name = 'face4acc']").val();
  faceacc[5] = $("input[name = 'face5acc']").val();
  faceacc[6] = $("input[name = 'face6acc']").val();

  analyst[0] = faceacc[experiment.face_order[0]];
  foil[0] = faceacc[experiment.face_order[1]];
  foil[1] = faceacc[experiment.face_order[2]];
  foil[2] = faceacc[experiment.face_order[3]];
  foil[3] = faceacc[experiment.face_order[4]];
  foil[4] = faceacc[experiment.face_order[5]];

  experiment.selfreport_data = {
    self: self,
    analyst: analyst,
    foil: foil,
    all_faces: faceacc
  }

  // Show the finish slide.
  showSlide("demographics")

  },

  end: function() {
  if (experiment.tally < 6) {bonus = 24;} else if (experiment.tally > 37){bonus=150;} else{bonus = experiment.tally*4}
  $("#tally_id4").html(bonus);
  experiment.bonus = bonus;
  experiment.gender = $('input[name="genderButton"]:checked').val();
  experiment.age = $("input[name = 'age']").val();
  experiment.comments = $('textarea[name="commentsTextArea"]').val();
  experiment.mobile = $('input[name="mobileButton"]:checked').val();
  var checkboxValues = []
  $('input[type="checkbox"]:checked').each(function(index, elem) {
    checkboxValues.push($(elem).val());
  });
  experiment.race = checkboxValues;


  // Show the finish slide.
  showSlide("end_screen")

  /*
  Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know we’re just submitting properties [i.e. data])
  */
  setTimeout(function() {turk.submit(experiment);}, 1000);
  },

};