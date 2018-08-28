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
        this.attributes['Amount'] = '';

        let jeopardy = JSON.parse(board);

        this.attributes['jeopardy'] = jeopardy;

        let speechOutput = "Welcome to ICC Jeopardy! Please select a category";
        self.response.speak(speechOutput).listen(speechOutput);

        this.emit('ICCJeopardyIntent');
    },

    'ICCJeopardyIntent': function () {

        let category = this.event.request.intent.slots['Category'].value.toString().toLowerCase();

        let existsCategory = checkCategoryExists(category);

        if(existsCategory){

          let speechAmount = "Great! Please select an amount";
          this.response.speak(speechAmount).listen(speechAmount);

          let amount = this.event.request.intent.slots['Amount'].value.toString().toLowerCase();

          let existsAmount = checkAmountExists(amount);

            if(existsAmount){

              let jeopardyAnswer = tellJeopardyAnswer(category,amount);

              this.response.speak(jeopardyAnswer).listen(jeopardyAnswer);

              let name = this.event.request.intent.slots['Women'].value.toString().toLowerCase();

              let isCorrectQuestion = verifyJeopardyQuestion(name);

                  if(isCorrectQuestion){
                    this.response.speak('Correct Answer');

                  } else{
                    this.response.speak('Wrong Answer');
                  }

            }else {

              let errorAmount = 'Sorry! Incorrect amount';

              this.response.speak(errorAmount);
              this.emit('ICCJeopardyIntent');
            }
        }
        else{

        }

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

function verifyJeopardyQuestion(question){
	let question = "who is" + board[category][amount].question.toString().toLowerCase();
	let answer = board[category][amount].answer.toLowerCase();
	if (question == answer) {
		return true;
	}
	return false;
}
