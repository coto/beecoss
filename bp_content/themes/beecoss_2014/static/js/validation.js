
/* Warnings while validating form */
    $(document).ready(function(){
        
    $("#contact").validate({
    		rules: {
    			fullname: {
    				required: true
    			},
    			email: {
    				required: true,
    				email: true
    			},
				message: {
    				required: true
    			},
    		},
    		messages: {
    			fullname: "Your full name is required ",
    			email: " Your email address is required",
				message: "You must enter a message to send form",
    		},
            submitHandler: function(form) {
                $.ajax({
                   type: "POST",
                   url: "send-email.php",
                   data: $('#contact').serializeArray() ,
                   success: function(msg){
                    $('#fullname').val('');
                    $('#email').val('');
                    $('#phone').val('');
                    $('#subject').val('');
					$('#message').val('');
                     $('#mess').html('Form was successfully sent, we will get back to you asap.');
                   }
                 });
                return false;
            }        
    	});
    });
