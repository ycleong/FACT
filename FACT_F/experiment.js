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
  nTrials_Social: 20,
  nTrials_Joint: 20,
  tally: 0,
  bonus: 0,
  AC_order: [1,2,3,2,3,1,3,2,1],
  AC_trial: 0,
  AC_final:[],
  AC_passed: "FAIL",
  thisAC_Ad:0,
  
  condition: "advisor",
  browser: BrowserDetect.browser,
  mobile: "",
  face_order: _.shuffle([1, 2, 3, 4, 5, 6]),
  OutcomeTime: 1200,
  MaxResponseTime: 5000,
  
  // Demographics
  gender: "",
  age:"",
  comments:"",

  dataPrivate: [],
  dataSocial: [],
  dataJoint:[],
  dataAC:[],
  parmsPrivate:[],
  parmsSocial:[],
  parmsJoint:[],

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
},

description4:function(){
    showSlide("description4");
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
  experiment.parmsPrivate.push(parms_private)
  experiment.choice_screen(pUP_private,"private",trial_num)
},

choice_screen: function(pUP,type,trial_num) {
  var startTime = (new Date()).getTime();
    
  trial_num = trial_num + 1;
  $(".trial_no").html(trial_num)
  
  showSlide("choice_screen")
  $(".left").show();
  $(".right").show();

  var this_pUP = pUP.shift() 

  if (typeof this_pUP == "undefined") {
      return experiment.learn_description();
    }
  
  if (Math.random() < this_pUP)
  {var stock_outcome = 1;}
  else
  {var stock_outcome = -1;}

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
  var outcome_points = (outcome == 1) ? "+ 5 cents" : "- 5 cents"

  $("#Outcome_text_id").html(outcome_text);
  $("#Outcome_points_id").html(outcome_points);
  showSlide("outcome_page")
  },

timeout_screen: function(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,thisAdvisor){
  
    switch(type){

      case "private":
      var data = {
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
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: NaN,
        stock_outcome: NaN,
        outcome: NaN,
        rt: NaN,
        tally: experiment.tally,
        Advisor: thisAdvisor,
        Advice: NaN,
        AdvisorCorrect: NaN
      }
      experiment.dataSocial.push(data)

      showSlide("slow")
      $(document).unbind("keydown");
      setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct);}, experiment.OutcomeTime)
      break

    case "joint":
      var data = {
        trial_num: trial_num, 
        pUP: this_pUP,
        choice: NaN,
        stock_outcome: NaN,
        outcome: NaN,
        rt: NaN,
        tally: experiment.tally,
        Advisor: thisAdvisor,
        Advice: NaN,
        AdvisorCorrect: NaN
      }
      experiment.dataJoint.push(data)

      showSlide("slow")
      $(document).unbind("keydown");
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct);}, experiment.OutcomeTime)
      break
    }
  },

learn_description: function(){
  showSlide("end_private")
},
    
learn_description2: function(){
  face1 = new Image();
  face2 = new Image();
  face3 = new Image();
  face4 = new Image();
  face5 = new Image();
  face6 = new Image();

  face1.src = "images/face1.png";
  face2.src = "images/face2.png";
  face3.src = "images/face3.png";
  face4.src = "images/face4.png";
  face5.src = "images/face5.png";
  face6.src = "images/face6.png";
    
  showSlide("end_private2")
  
  var FaceOrder = experiment.face_order;
  $("img.img_prac").attr("src", "images/face" + FaceOrder[0] + ".png");
    
  $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 90) {
      $(document).unbind("keydown");
      $(".right").hide();
      $("#learn1").show();
      $('#for').show();
    }
    
    else if (keyCode == 77){
      $(document).unbind("keydown");
      $(".left").hide();
      $("#learn1").show();
      $('#against').show();
    }})
},


ready_social: function(){
    showSlide("ready_social_screen")
        $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 71) {
      $(document).unbind("keydown");
      setTimeout(experiment.startSocial, 500);
    }
  })  
}, 
    
startSocial: function(){
  var nTrials = experiment.nTrials_Social;
  var pUP_Social = gen_pUP(nTrials);
  var trial_num = 0;  
  var AdvisorOrder = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  var FaceOrder = experiment.face_order;
  var Advisor1Correct = get_AdvisorCorrect((nTrials),0.50);
    
  var parms_social = {
    nTrials: nTrials,
    pUP: pUP_Social,
    AdvisorOrder: AdvisorOrder,
    FaceOrder: FaceOrder,
    Advisor1Correct: Advisor1Correct
  }
  experiment.parmsSocial.push(parms_social)
  experiment.social_screen(pUP_Social,"social",trial_num,FaceOrder,AdvisorOrder,Advisor1Correct)
},

social_screen: function(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct){
  var startTime = (new Date()).getTime();
  
  trial_num = trial_num + 1;
  temp = trial_num + 36;
  $(".trial_no").html(temp)
  var this_pUP = pUP.shift() ;
  var this_Advisor = AdvisorOrder.shift();

  if (experiment.condition == "advisor"){
    Ad1 = "face" + FaceOrder[0] + ".png";
    Ad2 = "face" + FaceOrder[1] + ".png";
    Ad3 = "face" + FaceOrder[2] + ".png";
  } else {
    Ad1 = "frac" + FaceOrder[0] + ".png";
    Ad2 = "frac" + FaceOrder[1] + ".png";
    Ad3 = "frac" + FaceOrder[2] + ".png";
  }

  switch (this_Advisor) {
    case 1:
    $("img.AdvisorElement").attr("src", "images/" + Ad1);
    this_AdvisorCorrect = Advisor1Correct.shift(); 
    break

    case 2:
//  $("img.AdvisorElement").attr("src", "images/" + Ad2);
//    this_AdvisorCorrect = Advisor2Correct.shift();  
    break

    case 3:
//    $("img.AdvisorElement").attr("src", "images/" + Ad3);
//    this_AdvisorCorrect = Advisor3Correct.shift();  
    break
  }
  showSlide("social_screen")
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

  timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,this_Advisor)}, experiment.MaxResponseTime);

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
       experiment.dataSocial.push(data);
       setTimeout(function(){experiment.advice_screen(Advice);}, experiment.OutcomeTime);
       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime*2);
       setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*3);
       setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct);}, experiment.OutcomeTime*4);
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
      experiment.dataSocial.push(data)
      setTimeout(function(){experiment.advice_screen(Advice);}, experiment.OutcomeTime);
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime*2);
      setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*3);
      setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct);}, experiment.OutcomeTime*4);
      clearTimeout(timeout);
    }
  })
},

advice_screen: function(advice){
  if (advice==1) {showSlide("predictUp_page")}
  else {showSlide("predictDown_page")}
},

joint_description: function(){
    
 Ad = experiment.face_order[0];
 $("img.Scheme3Element").attr("src", "images/scheme3_" + Ad +".png");
    
  showSlide("end_social")
        $(document).keydown(function(event) {
      var keyCode = event.which;
      if (keyCode == 71) {
        $(document).unbind("keydown");
        experiment.startJoint();}
      })
  },

startJoint: function(){
  var nTrials = experiment.nTrials_Joint;
  var pUP = gen_pUP(nTrials);

  var trial_num = 0;  
  var AdvisorOrder = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  var FaceOrder = experiment.face_order;
  var Advisor1Correct = get_AdvisorCorrect((nTrials),0.50);
  //var Advisor2Correct = get_AdvisorCorrect((nTrials/3),0.50);
  //var Advisor3Correct = get_AdvisorCorrect((nTrials/3),0.25);
  document.getElementById("logo_pic").src = "images/logo3.png"

  var parms_joint = {
    nTrials: nTrials,
    pUP: pUP,
    AdvisorOrder: AdvisorOrder,
    FaceOrder: FaceOrder,
    Advisor1Correct: Advisor1Correct,
//    Advisor2Correct: Advisor2Correct,
//    Advisor3Correct: Advisor3Correct
  }
  experiment.parmsJoint.push(parms_joint)
  experiment.joint_screen(pUP,"joint",trial_num,FaceOrder,AdvisorOrder,Advisor1Correct)
},

joint_screen: function(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct){
      
  var startTime = (new Date()).getTime();
  var this_pUP = pUP.shift() ;
  var this_Advisor = AdvisorOrder.shift();
    
  trial_num = trial_num + 1;
  temp = trial_num + 56;
  $(".trial_no").html(temp)
  
  if (experiment.condition == "advisor"){
    Ad1 = "face" + FaceOrder[0] + ".png";
    Ad2 = "face" + FaceOrder[1] + ".png";
    Ad3 = "face" + FaceOrder[2] + ".png";
  } else {
    Ad1 = "frac" + FaceOrder[0] + ".png";
    Ad2 = "frac" + FaceOrder[1] + ".png";
    Ad3 = "frac" + FaceOrder[2] + ".png";
  }

  switch (this_Advisor) {
    case 1:
    $("img.AdvisorElement").attr("src", "images/" + Ad1);
    this_AdvisorCorrect = Advisor1Correct.shift(); 
    break

    case 2:
 //   $("img.AdvisorElement").attr("src", "images/" + Ad2);
//    this_AdvisorCorrect = Advisor2Correct.shift();  
    break

    case 3:
//    $("img.AdvisorElement").attr("src", "images/" + Ad3);
//    this_AdvisorCorrect = Advisor3Correct.shift();  
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

  if (typeof this_pUP == "undefined") {
    return experiment.selfreport1();
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
    timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,this_Advisor)}, experiment.MaxResponseTime);
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
       experiment.dataJoint.push(data);

       setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
       setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
       setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct);}, experiment.OutcomeTime*3);
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
      var endTime = (new Date()).getTime;
      
      var data = {
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
      experiment.dataJoint.push(data)
      setTimeout(function(){experiment.stock_outcome(stock_outcome);}, experiment.OutcomeTime);
      setTimeout(function(){experiment.player_outcome(outcome);}, experiment.OutcomeTime*2);
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct);}, experiment.OutcomeTime*3);
      clearTimeout(timeout);
    }
  })
},1500);
},
    
check: function(){
  code =  $("input[name = 'code']").val();
  if (_(forbiddenIds).contains(code)) {
    alert ( "You have done a version of this HIT before, please DO NOT accept this HIT." );
  } else {
    alert ( "You are eligible for this HIT. Please accept the hit and continue.")
  }
},

selfreport1: function(){
  $(".warning1").hide();
  showSlide("selfreport1");
  
  var F1_src = "images/face" + experiment.face_order[2] + ".png"
  var F2_src = "images/face" + experiment.face_order[1] + ".png"
  var F3_src = "images/face" + experiment.face_order[0] + ".png"
    
  document.getElementById("F1").src = F1_src
  document.getElementById("F2").src = F2_src
  document.getElementById("F3").src = F3_src
},
    

recordanswer:function(){

  self = $("input[name = 'selfacc']").val();
  analyst = $("input[name = 'otheracc3']").val();
  foil = [];
  foil[0] = $("input[name = 'otheracc1']").val();
  foil[1] = $("input[name = 'otheracc2']").val();  
    
  experiment.selfreport_acc = {
    self: self,
    analyst: analyst,
    foil: foil,
  }
 
  showSlide("selfreport2");  

  var mF1_src = "images/face" + experiment.face_order[2] + ".png"
  var mF2_src = "images/face" + experiment.face_order[0] + ".png"
  var mF3_src = "images/face" + experiment.face_order[1] + ".png"
    
  document.getElementById("mF1").src = mF1_src
  document.getElementById("mF2").src = mF2_src
  document.getElementById("mF3").src = mF3_src
  
},
    
demographics: function() {
    
facestar =[];
facestar[0] = $('input[name="F2Button"]:checked').val();
facestar[1] = $('input[name="F3Button"]:checked').val();
facestar[2] = $('input[name="F1Button"]:checked').val();

experiment.facestar = {
    facestar: facestar,
  }
  
// Hacking bonus
bonus = experiment.tally * 5 + 100;
if (bonus > 200){bonus = 200}
if (bonus < 100){bonus = 100 + _.sample([5,10,15,20])}
    
  experiment.bonus = bonus;
  bonus = experiment.bonus/100;

  $("#tally_id3").html(bonus);
    
  experiment.understand = $('input[name="assess"]:checked').val();


  // Show the finish slide.
  showSlide("demographics")

  },

  end: function() {
  bonus = experiment.bonus/100;
  $("#tally_id4").html(bonus);
  
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
  setTimeout(function() {turk.submit(experiment);}, 2000);
  },

};