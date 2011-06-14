
 $(document).ready(function(){
	var id = "#msg";
	function show(id) {
		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();

		//Set heigth and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});

		//transition effect
		$('#mask').fadeTo("slow",0.8);

		//Set the popup window to center
        varTopPossition = winH/2-$(".modal-border").height()/2;
		$(id).css('top',  (varTopPossition<0)?0:varTopPossition);
		$(id).css('left', (winW/2-$(".modal-border").width()/2));

		//transition effect
		$(id).fadeIn(100);
	}

	$(".action-open-contact").click(function(e){
		//Cancel the link behavior
        $("#msg").hide();
		e.preventDefault();
		id = "#contact";
		show(id);
	});

	//if close button is clicked
	$('.action-close-contact').click(function (e) {
		//Cancel the link behavior
        id = "#contact";
		e.preventDefault();
		$('#mask').hide();
		$(id).hide();
	});

	//if mask is clicked
	$('#mask').click(function () {
		$(this).hide();
		$(id).hide();
	});

	id = "#msg";
	if ($(id).size()) show(id);

});