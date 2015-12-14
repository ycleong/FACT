// random(a,b); Returns random number between a and b, inclusive
function random(a, b) {
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

/* showSlide(id); Displays each slide */
function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

var forbiddenIds = ["A1E0GR2W1GJO0E","AEXYBW3COL9JM","A6UCL995Y1LFC","A21XD6CWE1JNMQ","A1FBO95OVBYOH1",
"A2DZ3OFTXRZVNY","A1VO8E1TC7IJFY","AJOC8JZT3FEBF","AH31QLJ57XC8W","A38PKJM1ZRMDT8","A3NS1DN6J7Z3EU","A24F1UPER626KR",
"A25D66AC4QUW2U","AUVC78LEL0T6L","A3HZ31VAGTVQMQ","A1VLZL3CA1WMPT","A2CKW83ERUX07J","A3JI3B5GTVA95F","A19WXHQSBB6P6",
"A1RATFICCKLCQ","A2R9VWNAOREXQ7","AAHZCL4LIPCBQ","AKBA41GHW86JD","A3F8G26PENQ6EO","AYDILOZLKOAS8","AFKZZEURTCR8U",
"A36LOA6VLJU157","A1VOWQJOBWOVKG","A2OG7XGWOX5ZEF","A3JI91CQIA5FWO","A33OQJ5NRKXQU3","A1VQFU1WBONADA","A1JV64BL3WCK0G",
"A2HPEX0788BPXI","A2BKLF1MNZ3L4X","A320QA9HJFUOZO","AEAR5XR4T0DLT","A2KVYRNL2CK95F","AW7J1S3K29XOA","AVI7K876BV3QL",
"AT282OSJ1UOXU","AQVP5IH2S6WCB","A1153ZIEQX0ZJ8","A1DY4DM16TBFPL","A2KPR3Y3H32ZX0","A3PQUGIQQBPR98","A16TESTJICU76L",
"A2HHKBW8HQWI66","A1MB3A5MC58LK6","A44UBOEPI5FUV","A2DH89LMRRM5GQ","A4N6HMS8AW9ZB","A30VNIFO2AI53T","A2O6BXB6U3AOII",
"A1R93MQYAFEVX1","A1HH2KZIFLXRJL","ATKG4FI2S5MVL","AVKH1VGAQC71N","A3BUX2X4NAIB3K","A33SMNMTMIOJ6T","AEKCK3L7OKCY9",
"A2UX7ZJEGGU5","APV3PPXOUJNF0","A249TNDSY03Z7Y","A1N783M0TDDHQA","A2A4EX36X0JB4R","A2Y5DDEPG81LLJ","A3ANNQ73J8M158",
"A2NPNKSW89BODS","A00236363DL2ZN8A4FD78","A19FK8L3UPPO17","A4TE7LF9CEVGA","A35GMYX2G8OVY5","A194HYD53ONJOY",
"A3UTW7XFV7DQT2","A1H198MRIM37T1","A1GY4Z89KWHWZB","A21QMMJHOSG779","A1N4AZ1QXPOPXH","A8JBMLRR037DE","A33SOB4X1L5L1G",
"A1XQLUUL2K4DC7","A3QU3KM3IYWHIF","A1P8M5BKOTAA8I","A1ETJBNTO9ZWZ8","A3MZ9RQJX9T656","A12EU7P50BDSWH","A3OV174HQJIJK8",
"A3F860SIC4JJ2R","A2Y0SIZH81B265","A2ASUHWXLJDG0M","A2MY0C5ZKLE8HI","A1102MP1CZI32V","A1ZBP0B1FAZAH1","A3MINXTRD9D578",
"A2PGTCN71FKOYF","A3K43RI91Y567E","A1H95TGQZSN1P1","A3L2Y7T97M2REM","A2DSQT79EPX7MY","A1KBZZ37OPYFFK","A37LY5UTJV2KYZ",
"A1A4UNSXPGLYVY","A3RUUTINBKU8YE","A2G7N0X0PNX0EE","AVX3SWFMBEPMZ","A21PQ8OB80F4NP","A2WIDZJ2KTSK84","A38R2NKZDQXOPW",
"A2W3QPD493MHEI","AFQZKQ9Z7OW4I","A38240X9B0EBKE","A2QJEZZWUPNL4A","AOPG07J95DDJT","A3VP27UUQ34OXK","AYYSG3O9FNU15",
"A20ALQT1HIVSAH","A37533SGF100SL","A3KGCSWBL2BJ0F","A21SFV3QQBIUXM","A9GNNAGBWOFAM","AUAN582MLI96N","A1VZSFHTU51JP0",
"A3V4JW77WA5TRK","A2J9RNKXNLRKVC","AL0IT4RSPIWGK","ATP2BJPDK4K2B","AEFZ7E5M1QZ0P","A2JUYWXAPL950O","APMSYAC9UK511",
"A2U4B3M43Z92LE","A1650FELH3UL2F","AS1QMPXIT1EGX","A2C7VUFGB8WGCG","A3U71YO6ST0270","A1BPM1ILXOS3BF","AGFWV1U4CJXP5",
"A150GMV1YQWWB3","A2OJMQGSQBEKEQ","A1IWH8U88QA4H2","A1XDXU43RJY8X7","AKLV0WIZZ356X","A37BU4T906EXCT","A2A1PXQV5ZKPCC",
"A2JCK494NV7TFX","A3MJ47AD05HGC","AO63KMU3PGNJA","A1MYLQQL8BBOYT","A2NZYQORZFRM4R","A22051NK9RQ4FV","A2F79GFUWU5O96",
"AK9ZPW1WLYRL7","A1A3TGZ7DKJWRW","A78RWQ5BX61DS","A2447POQVQCP8A","A1KFP5MDIL0QN1","A1YC558J4E5KZ","A3N7R7P9HP2YB6",
"A2MPEWSVKPP8BM","A6HR4PTSCMZ4L","A33B85TN97HQ33","A3PN17H3QT51O","A80VSGAD9H8VE","A3G5IPGLH1IIZN","A2VDLRRPXV3N59",
"AWYOPNO42D0NI","A1DGNROKR9QK50","AVZWILVYCMUQF","A33CDILGS3FXBM","A12VU5YSHGQH2V","A1WR8ERYDDCWLN","A19WXHQSBB6P6O",
"A2S9LVXWHNUZQP","A27CTOSCYAGCHV","A3PAKT8TH3N2ZZ","AVXEDARJC5HLU","A229PBL3A53GIY","A757KD6CSFAKF","AS4WHZ0EVURW",
"A3PUU1XU4C1A3V","A3G55RJTW3BSGM","AFLMX1U0XZRL2","A388O5WS4R70DA","A2BTZWR768WQDL","A29CKVKSYJXIQ0","AEISWC78MXIR5",
"A2UO3QJZNC2VOE","AKHAW85QJ3BBY","AZ9BZONG644TU","A2TYLR23CHRULH","A6LXQAPN30FCT","A2HJILSBIS7TQS","A2WQTSU6SSBUWC",
"A1PVGRW9HBOAHV","A8TOL4XEUTTT4","AOUZBLGN7NVT0","A3FURNEHDNA7AR","A1XQPDHAN5IY0R","A100VV1V2XDQI7","AMM44H2YGFFYB",
"A351PQHZ7KOX56","AOGT0KZDUX8CC","A1EIBJSACH8DKX","A3DKCN0XUVGJ1H","A32L4PNSU74OZY","A2WUZL1WL7NDRC","A2541C8MY0BYV3",
"AYUIMF5P6V7KD","ANK8K5WTHJ61C","AZ2HZXO2JMWPQ","A1DH493HKY9ZQ","AGP4H7SIK0F24","A3A455FPMMTIRZ","A2R76CKAHFJ6JM",
"ATFR6CBO2048I","A1N15R6BXTL13W","A21QVUASJAWJ7B","A1X608L4OJFBF4","A2NJ7N8INZOB00","A2HLSI949ZLJRX","A1R8A1ZKR80MRA",
"A7R1OLLU1Z6RA","A39C1BN9ZSQ0R2","AUYQMHXDKD6V0","A29VL3MZE7YPBZ","AAO99PANYUZQ3","A36H3PO6JZD414","A1XSTWO3EUJ937",
"A9KHK0MZRZS39","A6POINAX7CLM1","A2Q3ROE34VT95J","AO2LJAB0IA1DX","A3VHPIUPC4RE0Z","A27BKFN6UB1LDP","AUAQNF31UH6H4",
"A1YU3NAUQFSN7W","A36DDHDQ56N60C","A8P29A15BMK3V","A3C128W9KLV1QL","A3BL2ZEODD79AZ","A1945USNZHTROX","A3FGGW0ANB54AM",
"A19ED8FYO6CA36","AYC97GMI4V7Y4","A280RC0S51YKFT","A27ZYAW0NH371F","A4RVMJDFCXAO9","AE0TVG579FFR9","A1T51IL25UC4WR",
"A3BPTARPGHYU1N","A138BU1VWM2RKN","A3G7NL91BRY9JL","A12YM8XYCDEA3","ATGF05HW5Q63J","A28CPT853V8G3D","A3S47AGOSSHAQQ",
"A24XIBJY3LDPWW","A1QB42OYEG1553","A2I6SK5KL0WMJS","A1PBRB03XWPH89","AWH1ADU3OJMMK","A1AGHQOA9Y3VH0","A1UCB0D27PY623",
"A35HWFC20JEARY","A2IIFLNPOHCIH2","A1OYZYZY9KKACR","A3LHCHJR0HYFQ5","A1BQCRF5Q76YFY","A1T56P6L5730HG","A115UFR6VA6OM1",
"A2XUADP5L61HQ5","A3DIRN48SZVNRE","A3F55JJCVTTCCW","A1UL0HQUZQPMSX","ALWMGDUMRBQID","A2NKWQBUT6Y0RA","A21M99RZ0G8SCK",
"A2J6WFWSKTYJQM","A2P1VYBQ79Y92Q","A27QLSB53XTM7U","AYXIDCIGUA037","A2K2T23JWSB8R4","A1SQ385J95FIOQ","A15K0L6NGQXOM0",
"A2DZW5E52SJ93H","A37DTVGS7RX6AG","AVQGY7FCU80XP","A3QOYFPCF1CNWN","A1FGN2JF4LCF9B","A3N9RW6LVXXOVJ","AD7CUW86FWEKT",
"A1UUNYHX3M8O3O","A2EL86RL5S3QLK","A290OV59Q76QC8","A1FHH3XEFEQYV7","A3HPLIWSXW3XV8","A256FHXGSY0E5D","A2CMTWGF8QXWQ2",
"A30MLBCTI3OWIR","A5HICC1DQ2HCV","A2HBI8BAE2C5QH","A3BO1974J24P8B","A2BNOEYZ3VRW2R","A12COX2QIZTF6O","A1VJ6QICDRM1E2",
"A2BEB0ZYGTTR0H","AO3NZXSI6KQSZ","A28VLQAH7JLSN9","A2CEXG9VDKI9NP","A2B0FLA55RH047","A130X6CF795CQ5","A2K9HSMVUUZJSI",
"A2VBE0DAYKZ4BV","A1JNOFVI58L10O","A1WT9MM10MY00E","A1SEH8A8YN51RB","A36470UBRH28GO","A3UQM89QJ1V6M4","A347XXV5JH19PB",
"AJ96T4J2PFLWG","A8R3X1V9EGM44","A3TDA1NWHNQFE3","A1IA4CST74I1Q8","A2GPB1VNB5A08N","A2Z11BHUBDVKMB","A3IO4P2AU6NA18",
"A3AIX82WZQZB5A","AGSJDRTI0DUWU","A31F3CWD719718","A1BIJGB7XA0GME","A2I4A4WGWII18Z","A3VMRA1QTI88FT","AOV4U0YLQ2L4X",
"A28JD7KES2CTTS","A2A31K7C8BCZCO","AW2LIJBEY8QUE","A2DBMTMB6IHKJE","A3U2WCPN59KBX5","A1YH9ISLIETE7K","A2WX9BYW5TI8OA",
"ADSGYF5VGS4JW","A35KO5LPASBFI9","A3D5B9OIWI8RFL","A2O5OJXCUFQ3FV","A3M4C5VPP7M4T1","AN5DX7ARYCC74","A13AYDBBTFY5ZK",
"A16AVRDSVD10B6","A1R4KVYEV07CAJ","A3SJSRPM5Y9BD3","A248G7WMC2OS7F","A19WXS1CLVLEEX","A1LSEVXPEYMJL7","A248LF7KKHXZ14",
"A1M03LLSAGQNDW","AM7IS7GW84HQR","A2IB6M3TAYO525","ARNVB51ESK8MO","A21PWQXUIXKVZS","A2R40R4O6G0YBY","A13E24T6Q6AJ8Z",
"A1IIJM8NAU3HVY","A1FE8XKP4Q5JKD","ARSXA2ZPDMVVL","A3E5RC4DCJNK8L","A2WUQGSG1LUJG0","A2YOVR4PQQQJX8","AGMSPB6VYCCFK",
"A18G2CLYSTENK","A36MTY8RSWBZU7","A1AZAC9CPBEP6K","AYR7LGHO906BV","AMZE7O09XBRBA","A3SST36IDLIZIZ","A1GIA6WCGRJRY7",
"AHEVIE2NY1W1Z","A34K11GBKWDGK0","A2YBZFSUD5OP7W","A1DCPMWRNPJSGX","A3TQ7M1WPR7Q44","A2ZMO6F9N2UZ0F","A2UAK4EBPXJKJF",
"A4J4GGMKJ68L0","A34SUZWGLXIWM8","A2UTDZAZV1DF0N","APZEIAO75NCHM","A2A4MCD6TG88ZB","A1UURQF07IOXBO","A2P76QVLSGJR45",
"A2IA303OT5BBX0","A1NHX7328JESI","A19ARQGBT86K3D","A3J37B7UBIE8MJ","A1T9P8G11D2FG3","A3G4SJREB8K0BG","A2LXPQS44US390",
"ATOMPVWZKAE0E","AM2WGEJDWJY1I","A100QL2RZ1WM6C","A1TLNLB9D87H6","A3M01W8KKZF99X","A2AO7QP5THYKQF","A3BI0AX5T5GVO3",
"AVVXFDH5UUYLT", "A3672FHRNOYTSS", "A2P5YOZVJ2ZWAD", "A2R02DYCDLY75U", "A1POQWMOWKNQCN", "ANZKTE853UXSD", "A26UIS59SY4NM6", 
"AYHXK9JTG8IV3", "A3LC1KRWMHUH9I", "A2NA2OJT15COZY", "A1POZ8CU7KPXN1", "A3QJJR5Y3XE92N", "A3UR1AE3D5U7F", "A3CIUPLZ6614U2", 
"A2MW2KLUNJ5SF8", "A2SENAPNSXG9L", "AC4LBMA5QJJ1I", "A13VU5Q5QN807G", "A34DI1JD8SF2N9", "A36XEP5H6KBQIB", "A251BVRUXN0QRW", 
"A12U7YNO0GKNKZ", "A27W025UEXS1G0", "A1JQI98NY1RMNS", "AY25KKNLTK9D3", "A3BUWQ5C39GRQC", "AO7FM98CP90CL", "A248P03SBIGVNH", 
"A1WDUICI1FG9F", "A239EUWY6SNDEZ", "A3BY2WDCY8YLDE", "A24LC97AU3QC7G", "A3VWJW0RTDKBFB", "A315ZG72CPNAHV", "A177EXELDLWTWV", 
"A25AX0DNHKJCQT", "AHMUTLVC3F7M7", "A3AY0315YWWNXY", "A2BWTQWFM1J2IN", "A2DPKKEEW2I6QK", "A1N4407DBWS3KA", "AW4AHMQ7EN4QI", 
"A2NAKIXS3DVGAA", "A1A70T3F5D0A6E", "A3QY5DKE908JP1", "A1LRJ4U04532TM", "AK8ONB60Q4RJ5", "ANV6ZN93YM99J", "A1J8TVICSRC70W", 
"A1EAEZ7VIHKQ2", "A13XNKKN2LI6DF", "A1ZZ7YO3YASNIP", "A1GXFMAC759VRM", "A1GZOEMTN2KYDA", "A1KFGU5623A7H", "A2WJGI7XNUBRND", 
"A1LAZ3AO0NYBC1", "A3KKXA7COL5JHL", "A2U6D0T6GFXZIF", "A37I4XSK8N2XGI", "A33L61XKPX76DB", "AS8BGRD5QFUTQ", "A3V1VK1A3NYN17", 
"A28JIPBK8BEKHS", "A5T9IFDZ3W4T6", "A4T1X0PO5N1G9", "A2WQT33K6LD9Z5", "A2S4YDJ9UGAXFQ", "A2P18KT7WGSZA4", "A2RVEG53L48BAE", 
"A1T29BTOVBSEA6", "A1D0C0LV5259S6", "A3FJWFCS4WM9ER", "ADOK52PBQ5S0U", "AIOF4ZQQ9UDZ4", "A1VFHUO2KA78DG", "A3VBSPUPG256EK", 
"A1LJ4WAEDGELVL", "AW5FP8MFB3F7X", "ADP7UNGJZKRSK", "AW2TBYJM32KBE", "A2P065E9CYMYJL", "A2K94MIAGMDM2W", "A3D3NEQ158WUB0", 
"A5EU1AQJNC7F2", "ASF5V3K4IFP4K", "A2DXEPC4QFV4R1", "A3IW9415ZOO0EX", "A2VBSFSJXLZZ7A", "A19TL7AJ0FB1JG", "AK467M5VTG7N4", 
"A1W7QLLENVP2AE", "A3DS5B06ZCD3E3", "A24D98LB6OALQY", "A2PXJTMWGUE5DC", "A22MNN3ZTBSAY3", "ALEJV7D94ZLHF", "A10DEO061A6L3O", 
"AAWMZ1HKXEFNY", "A3D61CCA0LVMWV","A34PK1C7TPHWG3"];

// Block turkers who have done a version of this experiment before
if (_(forbiddenIds).contains(turk.workerId)) {
  location.href = "already.html"
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
    
      /* if (Math.random < 0.5){
          pUP[0] = 0.7;
      } else {
          pUP[0] = 0.3;
      }*/
      pUP[0] = 0.40 + (0.60-0.40)*Math.random();
    
      for (i = 1; i < trials; i++)
    {
      pUP[i] = compute_next_pUP(pUP[i-1]);
    }
    if (jStat.mean(pUP) < 0.55 && jStat.mean(pUP) >0.45 && jStat.median(pUP) < 0.55 && jStat.median(pUP) > 0.45 && jStat.stdev(pUP) > 0.15)
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
  AdvisorCorrect = _.range(nTrials*PctCorrect).map(function(){return 1});
  AdvisorWrong = _.range(nTrials*(1-PctCorrect)).map(function(){return 0});
  AdvisorCorrect = AdvisorCorrect.concat(AdvisorWrong);
  AdvisorCorrect = AdvisorCorrect.shuffle();
  return AdvisorCorrect
}
