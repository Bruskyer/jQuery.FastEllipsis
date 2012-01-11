/*

  From: http://dobiatowski.blogspot.com/
  License: MIT

  Requires jQuery to work

  Example usage:

  var myEllipsis = new FastEllipsis("font-family: arial; font-size: 10pt; letter-spacing: 0;");
  var longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
  var ellipsed = myEllipsis.ellipseIt(
    longText, // string to ellipsis
    2,        // maxline number 
    200       // width of container
  );
  $("#containter").html(ellipsed);

*/

var FastEllipsis = function (cssStyle) {
  var _charWidthArray = {},
      _cssStyle = (!!cssStyle) ? cssStyle : "font-family:arial;font-size:12pt",
      _maxWidth = 0;
			
  generateASCIIwidth();
			
  // Generate cache for width of all ASCII chars 
  function generateASCIIwidth() {
    var container, obj, character;
				
    // Temporary container for generated ASCII chars
    container = $("<div id='charWidthContainer' style='visibility:hidden; "+_cssStyle+"'></div>").appendTo("body");
				
    // Space char
    obj = $("<span>&nbsp;</span>");
    obj.appendTo(container);
    _charWidthArray["_ "] = obj.width();
            
    // Other ASCII chars
    for( var i = 33; i <= 126; i++ ) {
      character = String.fromCharCode( i );
      obj = $("<span>" + character + "</span> ");
      obj.appendTo(container);
					
      _charWidthArray["_"+character] = obj.width();
          
      // Finds max width for char - it will be given for every undefined char like: Ą or Ć
      if (_maxWidth < _charWidthArray["_"+character]) {
        _maxWidth = _charWidthArray["_"+character];
      }
    }
				
    // Remove temporary container   
    container.remove();
  };
			
  // Get the width of specified char
  function getCharWidth(myChar) {
        
    // If there is a char in cache
    if (!!_charWidthArray["_"+myChar]) {
      return _charWidthArray["_"+myChar];
    }
        
    // If there is no char in cache set max width and save in cache
    else {
      _charWidthArray["_"+myChar] = _maxWidth;
      return _maxWidth;
    }
        
  };
			
  // Get the width of the word
  function getWordWidth(myWord) {
        
    // Check if this word is already cached
    if (!!_charWidthArray["_"+myWord]) {
      return _charWidthArray["_"+myWord];
    }
        
    // If no, calculate it
    else {
      var sum = 0;
      for (var i = 0, len = myWord.length; i < len; i++) {
        sum = sum + getCharWidth(myWord[i]);
      }
      _charWidthArray["_"+myWord] = sum;
      return sum;
    }
        
  };
      
  // Ellipse text based on CSS styling set in constructor.
  function ellipseIt(myString, maxLine, lineWidth) {
    var lineNo = 1,
        wordsInLineWidth = 0,
        wordArr = myString.split(" "),
        spaceWidth = getCharWidth(" "),
        threeDotsWidth = getWordWidth("...");

    for (var i = 0, len = wordArr.length; i < len; i++) {

      // Adding widths of words in the loop
      wordsInLineWidth += getWordWidth(wordArr[i]) + spaceWidth;

      // Check if the total width of words calculated so far is larger than width of container passed in the parameter
      if (wordsInLineWidth >= lineWidth) {

        // If yes, go to next line and reset the words width
        lineNo++;
        wordsInLineWidth = 0;
                
        // If accessing to the last line subtract width of ellipsis (...) from line width to reserve place for ellipsis
        if (lineNo == maxLine) {
          lineWidth -= threeDotsWidth;
        }

        // When you reached the end of maxLine parameter break the loop and return the result
        else if (lineNo > maxLine) {
          return wordArr.slice(0, i).join(" ") + "...";
        }

        // If the words width was bigger than line width go back in the loop to take last word for use in the beggining of next line
        i--;
      }
    }

    // If there was no need to ellipsis
    return myString;
        
  };
  
  // Public interface
  return {
    getCharWidth: getCharWidth,
    getWordWidth: getWordWidth,
    ellipseIt: ellipseIt
  }
}
