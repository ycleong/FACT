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

// Get Advisor Order
function get_AdvisorOrder(){
    AdvisorOrder = [[1,2,3,2,1,3,1,3,2,3,1,2,1,2,3,2,1,3,1,3],
    [2,3,1,3,2,1,2,1,3,1,2,3,2,3,1,3,2,1,2,1],
    [3,1,2,1,3,2,3,2,1,2,3,1,3,1,2,1,3,2,3,2]];

    row_order = [0,1,2].shuffle();
    
    AdvisorOrder = AdvisorOrder[row_order[0]].concat(AdvisorOrder[row_order[1]],AdvisorOrder[row_order[2]]);
    return AdvisorOrder
}


// Generate sequences of advisor outcomes
function get_AdvisorCorrect(nTrials,PctCorrect){
  AdvisorCorrect = Array.apply(null, new Array(nTrials*PctCorrect)).map(Number.prototype.valueOf,1);
  AdvisorWrong = Array.apply(null, new Array(nTrials*(1-PctCorrect))).map(Number.prototype.valueOf,0);
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
  nTrials_Social: 60,
  nTrials_Joint: 60,
  tally: 0,
  face_order: [1,2,3].shuffle(),
  OutcomeTime: 1000,
  MaxResponseTime: 4000,
  
  // Demographics
  gender: "",
  age:"",
  comments:"",

  data: [],

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
  var pUP_private = gen_pUP(nTrials);
  var trial_num = 0;

  var parms_private = {
    nTrials: nTrials,
    pUP: pUP_private
  }
  experiment.data.push(parms_private)
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
       experiment.data.push(data)
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
      experiment.data.push(data)
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
  var outcome_text = (outcome == 1) ? "correct" : "wrong";
  var outcome_points = (outcome == 1) ? "+ 1 cent" : "- 1 cent"

  $("#Outcome_text_id").html(outcome_text);
  $("#Outcome_points_id").html(outcome_points);
  showSlide("outcome_page")
  },

  timeout_screen: function(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct){
  
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
        Advisor: NaN,
        Advice: NaN,
        AdvisorCorrect: NaN
      }
      experiment.data.push(data)

      showSlide("slow")
      $(document).unbind("keydown");
      setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime)
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
        Advisor: NaN,
        Advice: NaN,
        AdvisorCorrect: NaN
      }
      experiment.data.push(data)

      showSlide("slow")
      $(document).unbind("keydown");
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime)
      break
    }
  },

/*
The function that gets called when the sequence is finished.
*/

learn_description: function(){
  face_prac = new Image();
  face_prac.src = "images/face_prac.png";

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
        experiment.startSocial();}
      })
    }})
  },

startSocial: function(){
  var nTrials = experiment.nTrials_Social;
  var pUP_Social = gen_pUP(nTrials);
  var trial_num = 0;  
  var AdvisorOrder = get_AdvisorOrder();
  var FaceOrder = experiment.face_order;
  var Advisor1Correct = get_AdvisorCorrect((nTrials/3),0.75);
  var Advisor2Correct = get_AdvisorCorrect((nTrials/3),0.50);
  var Advisor3Correct = get_AdvisorCorrect((nTrials/3),0.25);

  var parms_social = {
    nTrials: nTrials,
    pUP: pUP_Social,
    AdvisorOrder: AdvisorOrder,
    FaceOrder: FaceOrder,
    Advisor1Correct: Advisor1Correct,
    Advisor2Correct: Advisor2Correct,
    Advisor3Correct: Advisor3Correct
  }
  experiment.data.push(parms_social)
  experiment.social_screen(pUP_Social,"social",trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct)
},

social_screen: function(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct){
  var startTime = (new Date()).getTime();

  showSlide("social_screen")
  trial_num = trial_num + 1;

  var this_pUP = pUP.shift() ;
  var this_Advisor = AdvisorOrder.shift();

  Ad1 = "face" + FaceOrder[0] + ".png";
  Ad2 = "face" + FaceOrder[1] + ".png";
  Ad3 = "face" + FaceOrder[2] + ".png";

  switch (this_Advisor) {
    case 1:
    $("img.AdvisorElement").attr("src", "images/" + Ad1);
    this_AdvisorCorrect = Advisor1Correct.shift(); 
    break


    case 2:
    $("img.AdvisorElement").attr("src", "images/" + Ad2);
    this_AdvisorCorrect = Advisor2Correct.shift();  
    break

    case 3:
    $("img.AdvisorElement").attr("src", "images/" + Ad3);
    this_AdvisorCorrect = Advisor3Correct.shift();  
    break
  }

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
  $(".advisor_id").html(this_Advisor); 

  timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct)}, experiment.MaxResponseTime);

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
        Advisor: this_Advisor,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
       experiment.data.push(data);
       setTimeout(function(){experiment.advice_screen(Advice);}, experiment.OutcomeTime);
       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime*2);
       setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*3);
       setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime*4);
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
      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally,
        Advisor: this_Advisor,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
      experiment.data.push(data)
      setTimeout(function(){experiment.advice_screen(Advice);}, experiment.OutcomeTime);
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime*2);
      setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*3);
      setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime*4);
      clearTimeout(timeout);
    }
  })
},

advice_screen: function(advice){
  if (advice==1) {showSlide("predictUp_page")}
  else {showSlide("predictDown_page")}
},

joint_description: function(){
  face_prac = new Image();
  face_prac.src = "images/face_prac.png";

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
        experiment.startJoint();}
      })
    }})
  },

  startJoint: function(){
  var nTrials = experiment.nTrials_Joint;
  var pUP = gen_pUP(nTrials);
  var trial_num = 0;  
  var AdvisorOrder = get_AdvisorOrder();
  var FaceOrder = experiment.face_order;
  var Advisor1Correct = get_AdvisorCorrect((nTrials/3),0.75);
  var Advisor2Correct = get_AdvisorCorrect((nTrials/3),0.50);
  var Advisor3Correct = get_AdvisorCorrect((nTrials/3),0.25);
  document.getElementById("logo_pic").src = "images/logo3.png"

  var parms_joint = {
    nTrials: nTrials,
    pUP: pUP,
    AdvisorOrder: AdvisorOrder,
    FaceOrder: FaceOrder,
    Advisor1Correct: Advisor1Correct,
    Advisor2Correct: Advisor2Correct,
    Advisor3Correct: Advisor3Correct
  }
  experiment.data.push(parms_joint)
  experiment.joint_screen(pUP,"joint",trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct)
},

joint_screen: function(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct){
  var startTime = (new Date()).getTime();
  var this_pUP = pUP.shift() ;
  var this_Advisor = AdvisorOrder.shift();
  trial_num = trial_num + 1;

  Ad1 = "face" + FaceOrder[0] + ".png";
  Ad2 = "face" + FaceOrder[1] + ".png";
  Ad3 = "face" + FaceOrder[2] + ".png";

  switch (this_Advisor) {
    case 1:
    $("img.AdvisorElement").attr("src", "images/" + Ad1);
    this_AdvisorCorrect = Advisor1Correct.shift(); 
    break

    case 2:
    $("img.AdvisorElement").attr("src", "images/" + Ad2);
    this_AdvisorCorrect = Advisor2Correct.shift();  
    break

    case 3:
    $("img.AdvisorElement").attr("src", "images/" + Ad3);
    this_AdvisorCorrect = Advisor3Correct.shift();  
    break
  }

  if (Math.random() < this_pUP)
    {var stock_outcome = 1;}
  else
    {var stock_outcome = -1;}

  if (this_AdvisorCorrect) 
    {var Advice = stock_outcome;}
  else
    {var Advice = stock_outcome*-1;}

  experiment.advice_screen(Advice);

  setTimeout(function(){showSlide("choice_screen")},1500);
  setTimeout(function(){$(".left").show()},1500);
  setTimeout(function(){$(".right").show()},1500);

  if (typeof this_pUP == "undefined") {
    return experiment.selfreport();
  }

  $(".pUP_id").html(this_pUP);
  $(".StockOutcome_id").html([stock_outcome]);
  $(".trial_num_id").html(trial_num);

  setTimeout(function(){
    timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct)}, experiment.MaxResponseTime);
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
        Advisor: this_Advisor,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
       experiment.data.push(data);

       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
       setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
       setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime*3);
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
      var data = {
        type: type,
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: choice,
        stock_outcome: stock_outcome,
        outcome: outcome,
        rt: endTime - startTime,
        tally: experiment.tally,
        Advisor: this_Advisor,
        Advice: Advice,
        AdvisorCorrect: this_AdvisorCorrect
      }
      experiment.data.push(data)
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
      setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime*3);
      clearTimeout(timeout);
    }
  })
},1500);
},

selfreport: function(){
  document.getElementById("analyst1").src = "images/face1.png";
  document.getElementById("analyst2").src = "images/face2.png";
  document.getElementById("analyst3").src = "images/face3.png";

  showSlide("selfreport")
},

demographics: function() {
 
  analyst = [];
  $("#tally_id3").html(experiment.tally);

  self = $("input[name = 'selfacc']").val();
  analyst[jQuery.inArray(1, experiment.face_order)] = $("input[name = 'analyst1acc']").val();
  analyst[jQuery.inArray(2, experiment.face_order)] = $("input[name = 'analyst2acc']").val();
  analyst[jQuery.inArray(3, experiment.face_order)] = $("input[name = 'analyst3acc']").val();

  experiment.selfreport_data = {
    self: self,
    analyst: analyst
  }

  // Show the finish slide.
  showSlide("demographics")

  },

  end: function() {
  experiment.gender = $('input[name="genderButton"]:checked').val();
  experiment.age = $("input[name = 'age']").val();
  experiment.comments = $('textarea[name="commentsTextArea"]').val();
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
  
  setTimeout(function() { turk.submit(experiment);}, 1500);
  },

};