var effectGlobal = "fromRight";
$L.effectBack = "fromLeft";
var myScroll;

goHome = function(evt) {
	evt.preventDefault();
	$L.renderView('home', {'effect': $L.effectBack});
}
$('.homeButton').live("click", goHome);


$(document).ready(function() {
	$L.initialize();
	$L.renderView('home', {'effect': effectGlobal});
    myScroll = new iScroll('wrapper', { checkDOMChanges: true });
});
