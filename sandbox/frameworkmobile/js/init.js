var effectGlobal = "fromRight";
$L.effectBack = "fromLeft";

$(document).ready(function() {
	$L.initialize();
	$L.renderView('table', {'effect': effectGlobal});
});
