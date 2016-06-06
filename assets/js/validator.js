/*
  USAGE:

  <form onsubmit="return Validator.Validate(this,1)">

	  Email:<input type="text" name="Confirm_Email" dataType="Email" msg="Emails Do not Match" /><br />
	
	  Confirm Email: <input type="text" name="Email" dataType="Repeat" to="Confirm_Email" msg="Must be a valid email"/><br />
	
	  Custom Regex: <input type="text" name="Custom"  dataType="Custom" regexp="[A-Z]+" msg="Must be Uppercase Charectors"/><br />
	
	  <input type="submit"/>

  </form>   

*/
var Validator = {

	Require : /.+/,
	Email : /^[a-zA-Z0-9\_\-]+([.a-zA-Z0-9\_\-]+)?[a-zA-Z0-9\_\-]+[@]{1}[a-zA-Z0-9\_\-]+([.a-zA-Z0-9\_\-]+)?[a-zA-Z0-9\_\-]+[.]{1}[a-zA-Z0-9\_\-]+$/,
	Phone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
	Mobile : /^((\(\d{3}\))|(\d{3}\-))?13\d{9}$/,
	Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	IdCard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
	Currency : /^\d+(\.\d+)?$/,
	Number : /^\d+$/,
	Zip : /^[1-9]\d{5}$/,
	QQ : /^[1-9]\d{4,8}$/,
	Integer : /^[-\+]?\d+$/,
	Double : /^[-\+]?\d+(\.\d+)?$/,
	English : /^[A-Za-z]+$/,
	Chinese : /^[\u0391-\uFFE5]+$/,
	UnSafe : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	IsSafe : function(str){return !this.UnSafe.test(str);},
	SafeString : "this.IsSafe(value)",
	Limit : "this.limit(value.length,getAttribute('min'), getAttribute('max'))",
	LimitB : "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
	Date : "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
	Repeat : "value == document.getElementsByName(getAttribute('to'))[0].value",
	Range : "getAttribute('min') < value && value < getAttribute('max')",
	Compare : "this.compare(value,getAttribute('operator'),getAttribute('to'))",
	Custom : "this.Exec(value, getAttribute('regexp'))",
	//i changed the getAttribute('name') to getAttribute('class')
	// to make use of the function mustChecked properly by calling its class
	Group : "this.MustChecked(getAttribute('id'), getAttribute('min'), getAttribute('max'))",
	Checked : "this.IsChecked(getAttribute('id'))",
	GroupCheck : "this.OnceChecked(getAttribute('id'))",
	
	ErrorItem : [document.forms[0]],
	ErrorMessage : ["エラー: 必須項目を入力してください"],
	
	Validate : function(theForm, mode)
	{
		var obj = theForm || event.srcElement;
		var count = obj.elements.length;
		this.ErrorMessage.length = 1;
		this.ErrorItem.length = 1;
		this.ErrorItem[0] = obj;

		for(var i=0;i<count;i++){
			with(obj.elements[i]){
				var _dataType = getAttribute("dataType");
				if(typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined") continue;
				this.ClearState(obj.elements[i]);
				if(getAttribute("require") == "false" && value == "") continue;
				
				switch(_dataType){
				case "Date" :
				case "Repeat" :					
				case "Range" :					
				case "Compare" :					
				case "Custom" :					
				case "Group" : 
				case "Limit" :					
				case "LimitB" :				
				case "SafeString" :
				case "Checked" :
				case "GroupCheck" :
					console.log(getAttribute('class'));
					if(!eval(this[_dataType])) {
						this.AddError(i, getAttribute("msg"));
					}
				break;
				default :
					if(!this[_dataType].test(value)){
						this.AddError(i, getAttribute("msg"));
					}
				break;
				}
			}
		}

		if(this.ErrorMessage.length > 1){
			this.exception_handler(mode);
			return false;
		}
		
		// var is_check = $('#i18').is(':checked');

		// if(is_check == false)
		// {
		// 		alert('Error\n\n1.確認するチェックボックスをオンにします。');
		// 		return false;
		// }
		// i.submit_inquiry();
		return true;
		
		
		
	}, // end function validate

	limit : function(len,min, max)
	{
		min = min || 0;
		max = max || Number.MAX_VALUE;
		return min <= len && len <= max;
	},

	LenB : function(str)
	{
		return str.replace(/[^\x00-\xff]/g,"**").length;
	},

	ClearState : function(elem)
	{
		with(elem){
			if(style.color == "red") { style.color = ""; }
			var lastNode = parentNode.childNodes[parentNode.childNodes.length-1];
			if(lastNode.id == "__ErrorMessagePanel") { parentNode.removeChild(lastNode); }
		}
	},

	AddError : function(index, str)
	{
		this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
		this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + ":" + str;
	},

	Exec : function(op, reg)
	{
		return new RegExp(reg,"g").test(op);
	},

	compare : function(op1,operator,op2)
	{
		switch (operator) {
		case "NotEqual":
			return (op1 != op2);
		case "GreaterThan":
			return (op1 > op2);
		case "GreaterThanEqual":
			return (op1 >= op2);
		case "LessThan":
			return (op1 < op2);
		case "LessThanEqual":
			return (op1 <= op2);
		default:
			return (op1 == op2); 
		}
	},

	MustChecked : function(name, min, max)
	{	
		var namee = document.getElementById(name).className;
		var groups = this.getElementsByClassName(document.body,namee);		
		//console.log(name + ":" + groups.length);
		
		//console.log(name + ":" + min + ":" +max);
		var hasChecked = 0;
		min = min || 1;
		max = max || groups.length;
		for(var i=groups.length-1;i>=0;i--)
			{
			if(groups[i].checked)
				{
					hasChecked++;
					return min <= hasChecked && hasChecked <= max;
				}
			}

	},
	
	OnceChecked : function(name)
	{	
		var namex = document.getElementById(name).className;
		var isCheck = false;
			for(var i = 0; i < checkBoxes.length; i++){
				if(checkBoxes[i].checked){
						isCheck = true;
						return (namex && namex.checked);
					}
				}

	},
	
	IsChecked : function(name)
	{	
		var obj = document.getElementById(name);
		console.log(obj);
		return (obj && obj.checked);		
	},

	IsDate : function(op, formatString)
	{
		formatString = formatString || "ymd";
		var m, year, month, day;
		switch(formatString){
		case "ymd" :
			m = op.match(new RegExp("^\\s*((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})\\s*$"));
			if(m == null ) return false;
			day = m[6];
			month = m[5]--;
			year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
			break;
		case "dmy" :
			m = op.match(new RegExp("^\\s*(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))\\s*$"));
			if(m == null ) return false;
			day = m[1];
			month = m[3]--;
			year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
			break;
		default :
			break;

		}

		var date = new Date(year, month, day);
		return (typeof(date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate());

		function GetFullYear(y){return ((y<30 ? "20" : "19") + y)|0;}

	},
	
	exception_handler : function(mode)
	{
		mode = mode || 1;
		var errCount = this.ErrorItem.length;
		
		switch(mode){
		case 2 :
			for(var i=1;i<errCount;i++) { this.ErrorItem[i].style.color = "red"; }		
		case 1 :
			alert(this.ErrorMessage.join("\n"));
			this.ErrorItem[1].focus();
			break;
		case 3 :
			for(var i=1;i<errCount;i++){
				try{
					var span = document.createElement("SPAN");
					span.id = "__ErrorMessagePanel";
					span.style.color = "red";
					this.ErrorItem[i].parentNode.appendChild(span);
					span.innerHTML = this.ErrorMessage[i].replace(/\d+:/,"*");
				} catch(e){
					alert(e.description);
				}
			}
			this.ErrorItem[1].focus();
			break;
		default :
			alert(this.ErrorMessage.join("\n"));
			break;

		}		
	},
	//added new function. for IE7 and IE8 support
	//by Anthony
	getElementsByClassName : function(node, classname) {
	    var a = [];
	    var re = new RegExp('(^| )'+classname+'( |$)');
	    var els = node.getElementsByTagName("*");
	    for(var i=0,j=els.length; i<j; i++)
	        if(re.test(els[i].className))a.push(els[i]);
	    return a;
	}

} // end class Validator