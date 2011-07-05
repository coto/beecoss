var effectGlobal = "fromRight";
$L.effectBack = "fromLeft";

goHome = function(evt) {
	evt.preventDefault();
	$L.renderView('home', {'effect': $L.effectBack});
}
$('.homeButton').live("click", goHome);


$(document).ready(function() {
	$L.initialize();
	$L.renderView('home', {'effect': effectGlobal});

});
