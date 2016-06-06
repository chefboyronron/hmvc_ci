$(document).ready(function() {
	
	$('#submit').click(function(e) {
	
		var fname     = $('#txtfname').val();
		var lname     = $('#txtlname').val();
		var email     = $('#txtEmail').val();
		var bday      = $('#txtBirthdate').val();
		var password  = $('#txtpassword').val();
		var confpass  = $('#txtconfirmpassword').val();
		var gender    = $('#selectgender').val();
		var cont_num  = $('#txtcontactnum').val();
		var errormessage = "";
		
		if( gender == "") {
			errormessage += "Gender is Required! \n";
			alert(errormessage);
		
		} else {		
		
			if(password == confpass) {
				e.preventDefault();
				$.ajax({
					url : "../php/addmember.php",
					type : "POST",
					cache : "false",
					data : {
						Fname       : fname,
						Lname       : lname,
						Email       : email,
						Bday        :  bday,
						Password    : password,
						Gender      : gender,
						Cont_Num    : cont_num,
						
					},
					beforeSend : function(){

					},
					success : function(result){
						console.log(result);
						if(result == "Success!") {
							alert('Your account can access to all Hallo Hallo Websites!');
							location.href='http://helpkids.hallohallo.ph/index.php';
						}
					},
					fail :function(e){
						console.log(e);
					},
					error : function(ex) {
						console.log(ex);
					}
				});
			
			} else {	
				alert("Passwords Mismatch!");
			}
		}
	});
});