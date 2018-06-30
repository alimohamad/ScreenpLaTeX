document.addEventListener("DOMContentLoaded", function(){
    
    var inputBox = document.getElementById("textInput");

    function interpreter(){
        
        var text = "\n" + inputBox.value; //Value of textbox.
        var elements = text.split("\n\\"); //Array of user inputted expressions.
        var toBeRendered = []; //Stack for rendering React elements.
        
        for(i = elements.length-1; i >= 0; i--){
            
            var expression = elements[i];
            toBeRendered.push(tagId(expression));
            console.log(toBeRendered);       
        }
            
    }

    inputBox.oninput = interpreter;   
    
})


function tagId(expression){
    
    var firstBracket = expression.indexOf("{");
    
    //Brackets.
    var bracketStart = firstBracket + 1;
    var bracketEnd = expression.length -1;
    var bracket = expression.substring(bracketStart, bracketEnd);    
    
    if( expression.includes("(") ){ //All tags except \a, \t, \subheader have () in them.
        
        var tag = expression.substring(0, expression.indexOf("(") );
        
        //First paren.
        var firstParenStart = expression.indexOf("(") + 1;
        var firstParenEnd = expression.indexOf(")");
        var firstParen = expression.substring(firstParenStart, firstParenEnd);
            
        
        
        if(tag == "c"){ //Character Tag.
            
            //Object.
            var element = {
                tag: "character",
                character: firstParen,
                speech: bracket
            }
                        
            return element;
            
        }
        
        
        //Second paren.
        var secondParenStart = firstParenEnd + 2;
        var secondParenEnd = firstBracket - 1;
        var secondParen = expression.substring(secondParenStart, secondParenEnd);
        
        if(tag == "cp"){ //Character-Parenthesized Tag (stage directions below character name.)    
            
            //Object.
            var element = {
                tag: "character-parenthesized",
                character: firstParen,
                note: secondParen,
                speech: bracket
            }
                        
            return element;
            
        }
        
        
        if(tag == "ce"){ //Character-Extension Tag (stage directions next to character name.)
            
            //Object.
            var element = {
                tag: "character-extension",
                character: firstParen,
                note: secondParen,
                speech: bracket
            }
                        
            return element;
            
        }
        
        if(tag == "slugline"){
            
            var element = { //Slugline tag. 
                tag: "slugline",
                intOrExt: firstParen,
                timeOfDay: secondParen,
                setting: bracket
            }
            
            return element;
            
        }    

        
        //Resetting value of second paren, getting third paren.
        secondParenEnd = expression.lastIndexOf("(") - 1;
        secondParen = expression.substring(secondParenStart, secondParenEnd);
        var thirdParenStart = secondParenEnd + 2;
        var thirdParenEnd = firstBracket - 1;
        var thirdParen = expression.substring(thirdParenStart, thirdParenEnd);
        
        if(tag == "cep"){ //Character-Extension-Parenthesized Tag (both p and e are needed.)
            
            var element = {
                tag: "character-extension-parenthesized",
                character: firstParen,
                pnote: secondParen,
                enote: thirdParen,
                speech: bracket
            }
            
            return element;
        }        
    }
    
    else{ //Handler for \a, \t, \subheader.
        
        var tag = expression.substring(0, firstBracket);
        
        if(tag == "a"){ //Action.
             
            var element = { //Slugline tag. 
                tag: "action",
                action: bracket
            }
            
            return element;
            
        }
        
        if(tag == "t"){ //Transition.
            
            var element = { //Slugline tag. 
                tag: "transition",
                transition: bracket
            }
            
            return element;

            
        }
        
        if(tag == "subhead"){ //Subheader.
           
            var element = { //Slugline tag. 
                tag: "subheader",
                setting: bracket
            }
            
            return element;
            
        }           
    }   

}