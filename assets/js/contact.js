window.onload = myInfo;
function myInfo(){
	var idName = document.getElementById("form1");//id="form1"
	var thisInput = idName.getElementsByTagName("input");//input
	for(i=0; i<thisInput.length; i++){
		thisInput[i].onfocus = function(){
			this.style.backgroundColor = "#f2f2f2";
		}
		thisInput[i].onblur = function(){
			this.style.backgroundColor = "";
		}
	}
	
	var thisTextarea = idName.getElementsByTagName("textarea");//textarea
	thisTextarea.onfocus = function(){
		this.style.backgroundColor = "#f2f2f2";
	}
	thisTextarea.onblur = function(){
		this.style.backgroundColor = "";
	}
}
function resets1(){
		document.form1.reset();
}
function resets2(){
		document.form2.reset();
}

function reset_form(form_name)
{
	var frm = "form"+form_name;
	var forms = $('form');
	$.each(forms,function(){
	
		var id = $(this).attr('name');
		
		if(id == frm)
		{
			this.reset();
		}
	})
}

function reset_all()
{
	var frm = "form";
	var forms = $('form');
	$.each(forms,function(){
	
		this.reset();

	})
}