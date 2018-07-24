document.addEventListener("DOMContentLoaded", function(){
    
    var inputBox = document.getElementById("textInput");

    if(inputBox){  
                
        function interpreter(){

            var text = "\n" + inputBox.value; //Value of textbox.
            var elements = text.split("\n\\"); //Array of user inputted expressions.
            var toBeRendered = []; //Stack for rendering React elements.
            
            for(i = elements.length-1; i >= 0; i--){

                var expression = elements[i];
                toBeRendered.push(tagId(expression));

            }
            
            console.log(toBeRendered);
            
            var bodyScreenplay = document.getElementById('rendering-window').contentWindow.document;
                        
            bodyScreenplay.open();
            bodyScreenplay.write('<link rel="stylesheet" type="text/css" href="style.css"><body id = "body-screenplay"');
            
            while(toBeRendered.length != 0){
                console.log("DEXTER");
                if(toBeRendered[toBeRendered.length - 1] == undefined){toBeRendered.pop();}
                bodyScreenplay.write(tagRender(toBeRendered.pop()));
            }
            bodyScreenplay.write('</body>');
            bodyScreenplay.close();
            
        }
        
        inputBox.oninput = interpreter;   
    
    }

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
            
            var element = {
                tag: "character-parenthesized",
                character: firstParen,
                pnote: secondParen,
                speech: bracket
            }
                        
            return element;
            
        }
        
        if(tag == "ce"){ //Character-Extension Tag (stage directions next to character name.)
            
            var element = {
                tag: "character-extension",
                character: firstParen,
                enote: secondParen,
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
                enote: secondParen,
                pnote: thirdParen,
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

function tagRender(element){
    
    var tag = element.tag;
    console.log("RENDERING... " + tag);
    
    if(tag == "character"){ return "<p class = \"base character\">" + element.character + "</p> <p class = \"base dialogue\"> " + element.speech + "</p>"; }
    
    if(tag == "character-extension"){ return '<p class = \"base character\">' + element.character + '(' + element.enote + ')</p> <p class = \"base dialogue\">' + element.speech + '</p>'; }
    
    if(tag == "character-parenthesized"){ return "<p class = \"base character\">" + element.character + "</p> <p class = \"base parenthetical\"> (" + element.pnote + ") </p> <p class = \"base dialogue\">" + element.speech + "</p>"; }
    
    if(tag == "character-extension-parenthesized"){ return "<p class = \"base character\">" + element.character +  "(" + element.enote + ")</p> <p class = \"base parenthetical\"> (" + element.pnote + ")</p> <p class = \"base dialogue\">" + element.speech + "</p>"; }
    
    if(tag == "slugline"){ return "<p class = \"base slugline\">" + element.intOrExt + "." + element.setting +  "-"  + element.timeOfDay + "</p>"; }
    
    if(tag == "subheader"){ return "<p class = \"base subheader\">" + element.setting + "</p>"; }
    
    if(tag == "action"){ return "<p class = \"base action\">" + element.action + "</p>"; }
    
    if(tag == "transition"){ return "<p class = \"base transition\">" + element.transition + "</p>"; }
    
}
