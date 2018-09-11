const Alexa = require('alexa-sdk');
var board = require('./board.json');


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        var self = this;
        this.attributes['Category']='';
      //  this.attributes['Amount'] = '';

      //  let jeopardy = JSON.parse(board);

      //  this.attributes['jeopardy'] = board;

       let speechOutput = "Welcome to ICC Jeopardy! Please select a category and amount";
       self.response.speak(speechOutput).listen(speechOutput);
      console.log("THIS.EVENT = " + JSON.stringify(this.event));
        self.emit(':responseReady');

    },

    'ICCJeopardyIntent': function () {

        console.log("THIS.EVENT = " + JSON.stringify(this.event));
        //console.log("SLOT IS :" + JSON.stringify(this.event.request.intent.slots.Category));

        // let category = this.event.request.intent.slots.Category.value.toString().toLowerCase();

        console.log("Category is :"+ this.event.request.intent.slots.Category.resolutions.resolutionsPerAuthority[0].values[0].value.name);

        let category = this.event.request.intent.slots.Category.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        this.attributes['Category'] = category;
        this.attributes['Amount'] ='';


        let existsCategory = checkCategoryExists(category);

        if(existsCategory){

         let speechAmount = "Great! Please select an amount";
         this.response.speak(speechAmount).listen(speechAmount);
         this.emit('CaptureAmountIntent');

         /*console.log("THIS.EVENT = " + JSON.stringify(this.event));
         console.log("SLOTS ARE:" + JSON.stringify(this.event.request.intent.slots));

         //let amount = this.event.request.intent.slots.Amount.value.toString().toLowerCase();

         console.log("Amount is :"+ this.event.request.intent.slots.Amount.resolutions.resolutionsPerAuthority[0].values[0].value.name)

         let amount =  this.event.request.intent.slots.Amount.resolutions.resolutionsPerAuthority[0].values[0].value.name;

          let existsAmount = checkAmountExists(amount);

            if(existsAmount){

              let jeopardyAnswer = tellJeopardyAnswer(category,amount);

              this.response.speak(jeopardyAnswer).listen(jeopardyAnswer);

              // let name = this.event.request.intent.slots['Women'].value.toString().toLowerCase();

              console.log("Name of women is :"+ this.event.request.intent.slots.Women.resolutions.resolutionsPerAuthority[0].values[0].value.name)

              let name = this.event.request.intent.slots.Women.resolutions.resolutionsPerAuthority[0].values[0].value.name;

              let isCorrectQuestion = verifyJeopardyQuestion(name, category, amount);

                  if(isCorrectQuestion){
                    this.response.speak('Correct Answer');

                  } else{
                    this.response.speak('Wrong Answer');
                  }

            }else {

              let errorAmount = 'Sorry! Incorrect amount';

              this.response.speak(errorAmount);
              // this.emit('ICCJeopardyIntent');
            }*/
        }
        else{

          let errorCategory = 'Sorry! Incorrect category!Please start ICC jeopardy again';
          this.response.speak(errorAmount);
          this.emit('ICCJeopardyIntent');
        }

        this.emit(':responseReady')
    },
    'CaptureAmountIntent': function (){
      console.log("AMOUNT INTENT THIS.EVENT = " + JSON.stringify(this.event));
      console.log("AMOUNT INTENT SLOT is:" + JSON.stringify(this.event.request.intent.slots));

      //let amount = this.event.request.intent.slots.Amount.value.toString().toLowerCase();

      console.log("Amount is :"+ this.event.request.intent.slots.Amount.resolutions.resolutionsPerAuthority[0].values[0].value.name)

      let amount =  this.event.request.intent.slots.Amount.resolutions.resolutionsPerAuthority[0].values[0].value.name;

       let existsAmount = checkAmountExists(amount);

         if(existsAmount){

           let jeopardyAnswer = tellJeopardyAnswer(category,amount);

           this.response.speak(jeopardyAnswer).listen(jeopardyAnswer);
         }
    },
    'SessionEndedRequest' : function() {

   },
   'Unhandled': function (){
       this.response.speak('I did not understand that!Please start again!');
       this.emit(':responseReady')
   }

};

function checkCategoryExists(category){

    let categories = "";

    for (var variable in board) {
      if (board.hasOwnProperty(variable)) {
          if(variable == category){
            return true;
          }
      }
    }
  return false;
}

function checkAmountExists(amount){

   if (amount == "100" || amount == "200" || amount == "300" || amount == "400" || amount == "500" ) {
        return true;
   }
   return false;
}

function tellJeopardyAnswer(category,amount){
	let answer = board[category][amount].answer;
	this.response.speak(answer);
}

function verifyJeopardyQuestion(question, category, amount){
    question = "who is " + question.toString().toLowerCase();

    let boardQuestion = board[category][amount].question.toLowerCase();

    if (question == boardQuestion) {
        return true;
    }
    return false;

/*	let question = "who is" + question.toString().toLowerCase();
	let answer = board[category][amount].answer.toLowerCase();
	if (question == answer) {
		return true;
	}
	return false;
  */

}
