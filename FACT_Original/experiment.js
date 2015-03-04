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

/* 
Array.prototype.random
Randomly shuffles elements in an array. Useful for condition randomization.
*/
Array.prototype.random = function() {
  return this[random(this.length)];
}

function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half-1] + values[half]) / 2.0;
    }
}

/*
Show the instructions slide — this is what we want subjects to see first.
*/

showSlide("instructions");

var experiment = {
  nTrials_Private: 36,
  nTrials_Social: 54,
  nTrials_Joint: 54,
  tally: 0,
  startTime: 0,
  endTime: 0,
  
  // Demographics
  gender: "",
  age:"",
  nativeLanguage:"",
  comments:"",

 //trials: myTrialOrder,

/*
An array to store the data that we’re collecting.
*/

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
  
  if (Math.random() < pUP[0])
  {var stock_outcome = 1;}
  else
  {var stock_outcome = 0;}

  $("#pUP_id").html(pUP[0]);
  $("#StockOutcome_id").html([stock_outcome])
  $("#trial_num_id").html(trial_num)

  timeout = setTimeout(function(){experiment.timeout_screen(pUP,type,trial_num)}, 5000);

  $(document).keydown(function(event) {
    var keyCode = event.which;
    if (keyCode == 90) {
    clearTimeout(timeout);
    var choice = 1;
      $(document).unbind("keydown");
      $(".right").hide();
      var outcome = (stock_outcome == 1) ? 1:0;
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
       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, 500);
       setTimeout(function(){experiment.player_outcome(outcome);}, 1500);
       setTimeout(function(){experiment.choice_screen(pUP,type,trial_num);}, 2500);
       clearTimeout(timeout);
     }
     else if (keyCode == 77){
      clearTimeout(timeout);
      var choice = 0;
      $(document).unbind("keydown");
      $(".right").hide();
      var outcome = (stock_outcome == 1) ? 0:1;
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
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, 500);
      setTimeout(function(){experiment.player_outcome(outcome);}, 1500);
      setTimeout(function(){experiment.choice_screen(pUP,type,trial_num);}, 2500);
    }
  })
},

stock_outcome: function(stock_outcome){
  if (stock_outcome) {showSlide("UP_page")}
  else {showSlide("DOWN_page")}
},

player_outcome: function(outcome){
  var outcome_text = outcome ? "correct" : "wrong";
  var outcome_points = outcome ? "+ 1 cent" : "- 1 cent"

  $("#Outcome_text_id").html(outcome_text);
  $("#Outcome_points_id").html(outcome_points);
  showSlide("outcome_page")
  },

  timeout_screen: function(pUP,type,trial_num){
  var data = {
        type: type,
        trial_num: trial_num, 
        pUP:pUP[0],
        choice: NaN,
        stock_outcome: NaN,
        outcome: NaN,
        rt: NaN,
        tally: experiment.tally
      }
   showSlide("slow")
   $(document).unbind("keydown");
   setTimeout(function(){experiment.choice_screen(pUP,type,trial_num);}, 2500)
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
        experiment.description2();}
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
        experiment.description2();}
      })
    }})
  },

startSocial: function(){
  var nTrials = experiment.nTrials_Social
  var pUP_Social = gen_pUP(nTrials);
  var trial_num = 0;

  var parms_social = {
    nTrials: nTrials,
    pUP: pUP_Social
  }
  experiment.data.push(parms_social)
  experiment.social_screen(pUP_social,"social",trial_num)
},






  end: function() {
  	// Records demographics
    //experiment.gender = $('input[name="genderButton"]:checked').val();
    //experiment.age = $('select[name="ageRange"]').val();
    //experiment.age = $('#ageRange').val();
    //experiment.comments = $('textarea[name="commentsTextArea"]').val();

    // Show the finish slide.
    showSlide("description");

    /*
    Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know we’re just submitting properties [i.e. data])
    */
    setTimeout(function() { turk.submit(experiment);}, 1500);
  },

};