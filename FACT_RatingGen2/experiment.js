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
  
 /* ups = _.range(18).map(function(){return 0.75});
  downs = _.range(18).map(function(){return 0.25});
  
  if (Math.random() < 0.5)
    {var pUP_private = ups.concat(downs);}
  else 
    {var pUP_private = downs.concat(ups);}*/
    
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

timeout_screen: function(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct,thisAdvisor){
  
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
      setTimeout(function(){experiment.social_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime)
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
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime)
      break
    }
  },

learn_description: function(){
  showSlide("end_private")
},
    
learn_description2: function(){
  face_prac = new Image();
  face_prac.src = "images/face_prac.png";

  face1 = new Image();
  face2 = new Image();
  face3 = new Image();
  face4 = new Image();
  face5 = new Image();
  face6 = new Image();
  all_ad_img = new Image();

  face1.src = "images/face1.png";
  face2.src = "images/face2.png";
  face3.src = "images/face3.png";
  face4.src = "images/face4.png";
  face5.src = "images/face5.png";
  face6.src = "images/face6.png";
              
  $("img.img_prac").attr("src", face_prac.src);
  $(".noun").html("analyst")

  showSlide("end_private2")
  
  var FaceOrder = experiment.face_order;
  $("img.Ad1_Instructions").attr("src","images/face" + FaceOrder[0] + ".png");
  $("img.Ad2_Instructions").attr("src","images/face" + FaceOrder[1] + ".png");
  $("img.Ad3_Instructions").attr("src","images/face" + FaceOrder[2] + ".png");
    
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

learn_description3: function(){
    showSlide("end_private3")
    $(document).keydown(function(event) {
    var keyCode = event.which;

    if (keyCode == 71) {
      $(document).unbind("keydown");
      setTimeout(experiment.start_attentioncheck, 500);
    }
  })  
},
    
start_attentioncheck:function(){
    experiment.AC_trial = experiment.AC_trial + 1;
    $(".AC_no").html(experiment.AC_trial);
    experiment.thisAC_Ad = experiment.AC_order.shift();
    
    if (typeof experiment.thisAC_Ad  == "undefined") {
        return experiment.final_attention();
    }
    
    thisFace = experiment.thisAC_Ad - 1;
    
    var FaceOrder = experiment.face_order;
    $("img.Ad_AC").attr("src","images/face" + FaceOrder[thisFace] + ".png");
    $(".wrongans").hide();
    $(".warning1").hide();
    showSlide("AC_screen");   
},
    
check_attention:function(){
    AC = $('input[name="AC_Button"]:checked').val();
    
    if (AC == undefined){
        $(".warning1").show();
    } else if (AC == experiment.thisAC_Ad) {
         $("input[type='radio'][name='AC_Button']:checked").prop('checked', false)
        experiment.start_attentioncheck();
    } else {
        $(".wrongans").show();
    }
},
    
final_attention:function(){
   showSlide("Final_AC_screen");    
},

ready_social: function(){
   AC = [];
   AC[0] = $('input[name="AC_F1_Button"]:checked').val();
   AC[1] = $('input[name="AC_F2_Button"]:checked').val();    
   AC[2] = $('input[name="AC_F3_Button"]:checked').val();         

   experiment.AC_final = AC;    
   if (AC[0] == 1 && AC[1] == 2 && AC[2] == 3) {
       experiment.AC_passed = "TRUE";
   }
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
  experiment.parmsSocial.push(parms_social)
  experiment.social_screen(pUP_Social,"social",trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct)
},

social_screen: function(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct){
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
    $("img.AdvisorElement").attr("src", "images/" + Ad2);
    this_AdvisorCorrect = Advisor2Correct.shift();  
    break

    case 3:
    $("img.AdvisorElement").attr("src", "images/" + Ad3);
    this_AdvisorCorrect = Advisor3Correct.shift();  
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

  timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct,this_Advisor)}, experiment.MaxResponseTime);

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
  experiment.parmsJoint.push(parms_joint)
  experiment.joint_screen(pUP,"joint",trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct)
},

joint_screen: function(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct){
      
  var startTime = (new Date()).getTime();
  var this_pUP = pUP.shift() ;
  var this_Advisor = AdvisorOrder.shift();
    
  trial_num = trial_num + 1;
  temp = trial_num + 96;
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
    timeout = setTimeout(function(){experiment.timeout_screen(this_pUP,pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct,this_Advisor)}, experiment.MaxResponseTime);
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
      setTimeout(function(){experiment.joint_screen(pUP,type,trial_num,FaceOrder,AdvisorOrder,Advisor1Correct,Advisor2Correct,Advisor3Correct);}, experiment.OutcomeTime*3);
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

selfreport: function(){
  $(".warning1").hide();
  showSlide("selfreport");

    document.getElementById("F1").src = "images/face1.png";
    document.getElementById("F2").src = "images/face2.png";
    document.getElementById("F3").src = "images/face3.png";
    document.getElementById("F4").src = "images/face4.png";
    document.getElementById("F5").src = "images/face5.png";
    document.getElementById("F6").src = "images/face6.png";

    document.getElementById("mF1").src = "images/face1.png";
    document.getElementById("mF2").src = "images/face2.png";
    document.getElementById("mF3").src = "images/face3.png";
    document.getElementById("mF4").src = "images/face4.png";
    document.getElementById("mF5").src = "images/face5.png";
    document.getElementById("mF6").src = "images/face6.png";
},

recordanswer:function(){
  
  self = $("input[name = 'selfacc']").val();
  faceacc =[];
  faceacc[1] = $('input[name="F1Button"]:checked').val();
  faceacc[2] = $('input[name="F2Button"]:checked').val();
  faceacc[3] = $('input[name="F3Button"]:checked').val();
  faceacc[4] = $('input[name="F4Button"]:checked').val();
  faceacc[5] = $('input[name="F5Button"]:checked').val();
  faceacc[6] = $('input[name="F6Button"]:checked').val();
  
  if (faceacc[1] == undefined || faceacc[2] == undefined || faceacc[3] == undefined || faceacc[4] == undefined || faceacc[5] == undefined || faceacc[6] == undefined){
    $(".warning1").show();
  } else {
    showSlide("memorytest_screen");
  }  
},
    
demographics: function() {
    
self = $("input[name = 'selfacc']").val();
faceacc =[];
faceacc[1] = $('input[name="F1Button"]:checked').val();
faceacc[2] = $('input[name="F2Button"]:checked').val();
faceacc[3] = $('input[name="F3Button"]:checked').val();
faceacc[4] = $('input[name="F4Button"]:checked').val();
faceacc[5] = $('input[name="F5Button"]:checked').val();
faceacc[6] = $('input[name="F6Button"]:checked').val();
  
 memory = []; 
 memory[1] = $("input[name = 'f1acc']").val();
 memory[2] = $("input[name = 'f2acc']").val();
 memory[3] = $("input[name = 'f3acc']").val();
 memory[4] = $("input[name = 'f4acc']").val();
 memory[5] = $("input[name = 'f5acc']").val();
 memory[6] = $("input[name = 'f6acc']").val();
    
  analyst = [];
  foil = [];
    
  bonus = experiment.tally * 5 + 150;
  if (bonus > 350){bonus = 350}
  if (bonus < 140){bonus = 140 + _.sample([5,10,15,20])}
  experiment.bonus = bonus;
    
  bonus = experiment.bonus/100;

  $("#tally_id3").html(bonus);

  analyst[0] = faceacc[experiment.face_order[0]];
  analyst[1] = faceacc[experiment.face_order[1]];
  analyst[2] = faceacc[experiment.face_order[2]];
  foil[0] = faceacc[experiment.face_order[3]];
  foil[1] = faceacc[experiment.face_order[4]];
  foil[2] = faceacc[experiment.face_order[5]];
    
  experiment.understand = $('input[name="assess"]:checked').val();

  experiment.selfreport_data = {
    self: self,
    analyst: analyst,
    foil: foil,
    all_faces: faceacc,
    memory: memory
  }

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