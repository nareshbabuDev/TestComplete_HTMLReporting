//Global variables
var htmlTestSteps, htmlTestCaseDescription, htmlTestCaseDuration, S_NO, strTestCaseHTMLFilePath, currentTestCaseStatus,currentTestCaseDesc;
var overAllTestCaseStatus, PASS_COLR = "Green", FAIL_COLOR = "Red" ,WARNING_COLOR = "Orange",DONE_COLOR = "White";
var gTestCaseReportPath,gTestCasePicPath,highlevelhtmlfilename;


var gTestCaseLogPath,currentTestCaseID,gLogPath,listOfModules = Sys.OleObject("Scripting.Dictionary"),listOfEnvironments = Sys.OleObject("Scripting.Dictionary"),gcurtblbordercolor,gPictureLogPath;
var totalTCCount = 0,passTCCount = 0,failTCCount = 0,warningTCCount = 0,exeStartTime,exeEndTime,tcStartTime,tcEndTime,strHTMLHighLevelReport;

function setLogsPath(str_PathToLogs)
{
      if(aqString.SubString(str_PathToLogs,(aqString.GetLength(str_PathToLogs)-1),aqString.GetLength(str_PathToLogs)) != "\\")
      {
            gLogPath =  str_PathToLogs + "\\";         
      }
      else
      {
            gLogPath =  str_PathToLogs;
      }
          
}
function setExecutionStartTime(time_ExecutionStart)
{
      exeStartTime = time_ExecutionStart;
}

function setExecutionEndTime(time_ExecutionEnd)
{
      exeEndTime = time_ExecutionEnd;   
}
function setTestCaseExeStartTime(time_Value)
{
      tcStartTime = time_Value;
}
function setTestCaseExeEndTime(time_Value)
{
      tcEndTime = time_Value;
}
//TestCase HTML Reports
//#########################################################################################################################################
//Returns  Test Case overview
function fn_createtestcasedescription(strModuleName,strTestCaseID,strTestCaseDescription,strEnvironment)
{
      var tempCode;
	tempCode = fn_fontstart() + fn_htmlstarttable(0) + fn_htmlcreateheaders("Module Name|Test Case Name|Test Case Description|Environment Name | Machine Name") ;
	tempCode = tempCode + fn_htmlstartrow() + fn_htmlrowdata(strModuleName,"Center","White") ;
	tempCode = tempCode + fn_htmlrowdata(strTestCaseID,"Center","White") ;
	tempCode = tempCode + fn_htmlrowdata(strTestCaseDescription,"Left","White") ;
	tempCode = tempCode + fn_htmlrowdata(strEnvironment,"Center","#F5F5DC") ;
	tempCode = tempCode + fn_htmlrowdata(Sys.HostName ,"Center","White") ;
	tempCode = tempCode + fn_htmlendrow() + fn_htmlclosetable() + fn_fontend();
	
	htmlTestCaseDescription = tempCode;
	S_NO = 1;
	currentTestCaseStatus = "";
      htmlTestSteps = "";
	htmlTestCaseDuration = "";
      
      currentTestCaseID = strTestCaseID;
      currentTestCaseDesc = strTestCaseDescription;
      
      if(!listOfModules.Exists(strModuleName))
      {
            listOfModules.Add(strModuleName,strModuleName);
      }
      
      if(!listOfEnvironments.Exists(strEnvironment))
      {
            listOfEnvironments.Add(strEnvironment,strEnvironment);
      }
         
      var tempunquePath = fn_getuniquefilename();
      
      gTestCaseLogPath = gLogPath + strTestCaseID;
      aqFileSystem.CreateFolder(gTestCaseLogPath);
      gTestCaseLogPath = gLogPath + strTestCaseID + "\\";
      
      gPictureLogPath = gTestCaseLogPath + "Picture";
      aqFileSystem.CreateFolder(gPictureLogPath);
      gPictureLogPath = gPictureLogPath + "\\";
      
      gTestCasePicPath = gTestCaseReportPath + "\\Picture\\";
      
	strTestCaseHTMLFilePath = gTestCaseLogPath + strTestCaseID+ "-" + tempunquePath + ".htm";
      gTestCaseReportPath = strTestCaseID + "\\" + strTestCaseID + "-" + tempunquePath + ".htm";

}
//Returns  Test Case run details
function fn_createtestcaseduration()
{
      var tempCode,tempcurrentTestCaseStatus,tempcurrentTestCaseStatusColor;
       
	if(aqString.Find(currentTestCaseStatus,"Fail",1) != -1)
      { 
            tempcurrentTestCaseStatus = "Fail";
            tempcurrentTestCaseStatusColor = FAIL_COLOR;
            failTCCount = failTCCount + 1
      }
      else if(aqString.Find(currentTestCaseStatus,"Warning",1) != -1)
      {
            tempcurrentTestCaseStatus = "Warning";
            tempcurrentTestCaseStatusColor = WARNING_COLOR;
            warningTCCount = warningTCCount + 1;
      }
      else if(aqString.Find(currentTestCaseStatus,"Pass",1) != -1)
      {
            tempcurrentTestCaseStatus = "Pass";
            tempcurrentTestCaseStatusColor = PASS_COLR;
            passTCCount = passTCCount + 1;
      }
      else if(aqString.Find(currentTestCaseStatus,"Done",1) != -1)
      {
            tempcurrentTestCaseStatus = "Done";
            tempcurrentTestCaseStatusColor = DONE_COLOR;
      }
	
      totalTCCount = totalTCCount + 1;
      
	tempCode = fn_fontstart() + fn_htmlstarttable(0) + fn_htmlcreateheaders("Status|Execution Date|Start Time|End Time|Duration ") ;
	tempCode = tempCode + fn_htmlstartrow() + fn_htmlrowdata(tempcurrentTestCaseStatus,"Center",tempcurrentTestCaseStatusColor) ;
	tempCode = tempCode + fn_htmlrowdata(fn_formatdate(tcStartTime),"Center","White") ;
	tempCode = tempCode + fn_htmlrowdata(fn_formatdatetime(tcStartTime),"Center","White") ;
	tempCode = tempCode + fn_htmlrowdata(fn_formatdatetime(tcEndTime),"Center","White") ;
	tempCode = tempCode + fn_htmlrowdata(fn_gettimediff(tcEndTime,tcStartTime),"Center","White") ;
	tempCode = tempCode +  fn_htmlendrow() + fn_htmlclosetable() + fn_fontend();
	tempCode = tempCode + fn_htmlnewline()  + fn_htmlnewline() + fn_fontstart() + fn_htmlstarttable(1) + fn_htmlcreateheaders("S.No|Test Steps|Expected Result|Actual Result|Status|Test Data|Picture ") ;
	
	htmlTestCaseDuration = tempCode;
      
      strHTMLHighLevelReport = strHTMLHighLevelReport + fn_htmlstartrow() + fn_htmlrowdata(totalTCCount,"center","White") + fn_htmlrowdata(currentTestCaseID,"Left","White") + fn_htmlrowdata(currentTestCaseDesc,"Left","White")  + fn_htmlrowdata(tempcurrentTestCaseStatus,"Center",tempcurrentTestCaseStatusColor) + fn_htmlrowdata(fn_createlink(gTestCaseReportPath) ,"Center","White") + fn_htmlendrow() ;
	
	S_NO = 1;
}
//Returns  Test Step
function fn_createteststep(strStatus,strTestStep,strExpected,strActual,strTestData,wantScreenShot)
{
	var tempCode,statusColor,strImgLink="";
	
      switch (strStatus) 
	{
		case "PASS"://PASS
			statusColor = PASS_COLR;
			strStatus = "Pass";
			Log.Checkpoint(strActual,strExpected);
			break;
		case "FAIL": //FAIL
			statusColor = FAIL_COLOR;
			strStatus = "Fail";
			strImgLink = fn_getscreenshotlink();
			Log.Error(strActual,strExpected);
			break;		
		case "WARNING"://WARNING
			statusColor = WARNING_COLOR;
			strStatus = "Warning";
			Log.Warning(strActual,strExpected);
			break;		
		case "DONE"://DONE
			statusColor = DONE_COLOR;
			strStatus = "Done";
			Log.Event(strActual,strExpected);
			break;		
	} 
      
	if(wantScreenShot)
      {
            strImgLink = fn_getscreenshotlink();          
      }
      
	tempCode = fn_htmlstartrow() + fn_htmlrowdata(S_NO,"Center","White") ;
	tempCode = tempCode + fn_htmlrowdata(strTestStep,"Left","White") ;
	if(strExpected != "" && strActual !=""){
		tempCode = tempCode + fn_htmlrowdata(strExpected,"Left","White") ;
		tempCode = tempCode + fn_htmlrowdata(strActual,"Left","White") ;
	}
	else{
	  	tempCode = tempCode + fn_htmlrowdata("" ,"Center","White") ;
	}
    
	tempCode = tempCode + fn_htmlrowdata(strStatus,"Center",statusColor) ;
	if(strTestData != ""){
		tempCode = tempCode + fn_htmlrowdata(strTestData,"Left","White") ;
  }
	else{
		tempCode = tempCode + fn_htmlrowdata("" ,"Center","White") ;
	}
	if (strImgLink != "")
	{
		tempCode = tempCode + fn_htmlrowdata(fn_createlink(gTestCasePicPath) ,"Center","White") ;
	}
	else
	{
		tempCode = tempCode + fn_htmlrowdata("" ,"Center","White") ;
	}
      tempCode = tempCode +  fn_htmlendrow();
      currentTestCaseStatus = currentTestCaseStatus + "," + strStatus;
	overAllTestCaseStatus = overAllTestCaseStatus + "," + strStatus;
      
	htmlTestSteps = htmlTestSteps + tempCode;
	S_NO = S_NO + 1;
     
  
}
//Consolidate the Test Case Overview, run details and Test Steps
function fn_completetestcase()
{
	var strforHTMLReport;
	
      //strTestCaseHTMLFilePath = gTestCaseLogPath + Project.Variables.gTestCaseID + "-" + fn_getuniquefilename() + ".htm";
	
	strforHTMLReport = fn_starthtmlbodycolor("#FAF0E6") + fn_header("Automation Execution Report - " + currentTestCaseID) +  htmlTestCaseDescription;
	strforHTMLReport = strforHTMLReport + fn_htmlnewline()  + fn_htmlnewline();
	strforHTMLReport = strforHTMLReport + htmlTestCaseDuration;
	strforHTMLReport = strforHTMLReport + htmlTestSteps + fn_htmlclosetable() +   fn_htmlnewline() +  fn_htmlnewline(); 
	strforHTMLReport = strforHTMLReport + fn_endhtml();
	strforHTMLReport = aqString.Replace(strforHTMLReport,"undefined","-");
      
	if(aqFile.WriteToTextFile(strTestCaseHTMLFilePath,strforHTMLReport,20,true))
      {
            Log.Message("Log created for " + currentTestCaseID);
      }
      else
      {
            Log.Message("Log created for " + currentTestCaseID);     
      }
	htmlTestSteps = "";
	htmlTestCaseDuration = "";
	htmlTestCaseDescription = "";
      
}
//#########################################################################################################################################
function fn_generatehighlevelreport()
{
//	#F5DEB3,#F5F5DC
	var htmlreport,strModuleName = "",strExecutedEnvs = "";
      
      
      if(aqString.Find(overAllTestCaseStatus,"Fail",1) != -1)
      { 
            tempOverAllStatus = "Fail";
            tempOverAllstatusColor = FAIL_COLOR;
      }
      else if(aqString.Find(overAllTestCaseStatus,"Warning",1) != -1)
      {
            tempOverAllStatus = "Warning";
            tempOverAllstatusColor = WARNING_COLOR;
      }
      else if(aqString.Find(overAllTestCaseStatus,"Pass",1) != -1)
      {
            tempOverAllStatus = "Pass";
            tempOverAllstatusColor = PASS_COLR;
      }
      else if(aqString.Find(overAllTestCaseStatus,"Done",1) != -1)
      {
            tempOverAllStatus = "Done";
            tempOverAllstatusColor = DONE_COLOR;
      }
      
      var tempModule = new Array(listOfModules.Items());
      
      for (var im = 0; im < tempModule.length ; im++)
      {
            if(strModuleName =="")
            {
                  strModuleName = aqConvert.VarToStr(tempModule[im]);  
            }
            else
            {
                  strModuleName = strModuleName + ", " + aqConvert.VarToStr(tempModule[im]);
            } 
      }
      var tempEnv = new Array(listOfEnvironments.Items());
      
      for (var ie = 0; ie < tempEnv.length; ie++)
      {
            if(strExecutedEnvs =="")
            {
                  strExecutedEnvs = aqConvert.VarToStr(tempEnv[ie]);  
            }
            else
            {
                  strExecutedEnvs = strExecutedEnvs + ", " + aqConvert.VarToStr(tempEnv[ie]);
            } 
      }
      
	
	highlevelhtmlfilename = gLogPath + "Automation_HighlevelReport_" + fn_getuniquefilename() + ".htm"; 
      
	htmlreport = fn_starthtmlbodycolor("White") + fn_htmlnewline() + fn_fontstart() + fn_header("Automation Highlevel Report"); 
	htmlreport = htmlreport + fn_htmlstarttable(1) + fn_htmlcreateheaders("Module Name(s)|OverAll Status|Executed Environments|Machine Name") ;
	htmlreport = htmlreport + fn_htmlrowdata(strModuleName,"Center","White") ;
	htmlreport = htmlreport + fn_fontcolor("White") + "<b>" + fn_htmlrowdata( tempOverAllStatus,"Center",tempOverAllstatusColor)  + "</b>" + fn_fontcolor("Black") ;
	htmlreport = htmlreport + fn_htmlrowdata(strExecutedEnvs,"Center","#F5F5DC") ;
	htmlreport = htmlreport + fn_htmlrowdata(Sys.HostName,"Center","White") +   fn_htmlendrow() + fn_htmlclosetable();
	
	htmlreport = htmlreport +fn_htmlnewline() + fn_htmlnewline() +  fn_htmlstarttable(1) + fn_htmlcreateheaders("Execution Date|Start Time|End Time|Total Duration") ;
	htmlreport = htmlreport + fn_htmlrowdata(fn_formatdate(exeStartTime),"Center","White") ;
	htmlreport = htmlreport + fn_htmlrowdata(fn_formatdatetime(exeStartTime) ,"Center","White") ;
	htmlreport = htmlreport + fn_htmlrowdata(fn_formatdatetime(exeEndTime),"Center","White") ;
	htmlreport = htmlreport + fn_htmlrowdata(fn_gettimediff(exeEndTime,exeStartTime),"Center","White") ;
	htmlreport = htmlreport + fn_htmlendrow() + fn_htmlclosetable()  + fn_htmlnewline() +  fn_htmlnewline() ;
	
	htmlreport = htmlreport  + "<center>" + fn_initializeCricle("total",totalTCCount) + fn_initializeCricle("Pass",passTCCount) + fn_initializeCricle("Fail",failTCCount) + fn_initializeCricle("Warning",warningTCCount)
	htmlreport = htmlreport  + fn_htmlnewline() +    fn_htmlnewline() + fn_htmlnewline()  + "</center>";
	htmlreport = htmlreport +  fn_htmlstarttable(1) + fn_htmlcreateheaders("S.No|Test Case ID|Test Case Description|Status|Report") ;
	htmlreport = htmlreport +  strHTMLHighLevelReport + fn_htmlclosetable()  + fn_htmlnewline() +  fn_htmlnewline();	
	//htmlreport = aqString.Replace(htmlreport,"NaN","");	
      htmlreport = aqString.Replace(htmlreport,"undefined","-");
	aqFile.WriteToTextFile(highlevelhtmlfilename,htmlreport,20,true);
      
      mailBodyString = htmlreport;
      //Browsers.Item("iexplore").Run(highlevelhtmlfilename);
}

/*#########################################################################################################################################
*Support Libraries
#########################################################################################################################################*/
//Returns the HTML tag 
function fn_starthtmlbodycolor(strbodyColor)
{
      return "<html> <body bgcolor = " + strbodyColor + ">" + Chr(10);
}
//Returns the HTML end tag
function fn_endhtml()
{
      return " </body> </html>" + + Chr(10);
}
//Returns  HTML Table
function fn_htmlstarttable(intTableType)
{
      var tempCode;
	switch ( intTableType)
 	{
   	      case 1:
		      tempCode = "<table width=" + Chr(34) +  "80%" +  Chr(34) + "cellspacing=" +Chr(34) +  "2" +  Chr(34)  + " cellpadding=" + Chr(34) + "0" + Chr(34) + " border=" + Chr(34) + "0" + Chr(34) + " align=" + Chr(34) + "center" + Chr(34) + " bgcolor=" + Chr(34) + "#556B2F" + Chr(34) + " font face=" + Chr(34) + "Calibri" + Chr(34) +">" ;
			gcurtblbordercolor = "#556B2F";
			return tempCode + Chr(10);	
     			break;
   		case 2:
 			tempCode = "<table width=" + Chr(34) +  "80%" +  Chr(34) + "cellspacing=" +Chr(34) +  "2" +  Chr(34)  + " cellpadding=" + Chr(34) + "0" + Chr(34) + " border=" + Chr(34) + "0" + Chr(34) + " align=" + Chr(34) + "center" + Chr(34) + " bgcolor=" + Chr(34) + "#191970" + Chr(34) + " font face=" + Chr(34) + "Calibri" + Chr(34) +">";
			gcurtblbordercolor = "#191970";
			return tempCode + Chr(10);
     			break;
		case 3:
 			tempCode = "<table width=" + Chr(34) +  "80%" +  Chr(34) + "cellspacing=" +Chr(34) +  "2" +  Chr(34)  + " cellpadding=" + Chr(34) + "0" + Chr(34) + " border=" + Chr(34) + "0" + Chr(34) + " align=" + Chr(34) + "center" + Chr(34) + " bgcolor=" + Chr(34) + "#000000" + Chr(34) + " font face=" + Chr(34) + "Calibri" + Chr(34) +">";
			gcurtblbordercolor = "#000000";
			return tempCode + Chr(10);
     			break;
   		default:
			tempCode = "<table width=" + Chr(34) +  "80%" +  Chr(34) + "cellspacing=" +Chr(34) +  "2" +  Chr(34)  + " cellpadding=" + Chr(34) + "0" + Chr(34) + " border=" + Chr(34) + "0" + Chr(34) + " align=" + Chr(34) + "center" + Chr(34) + " bgcolor=" + Chr(34) + "#2F4F4F" + Chr(34) + " font face=" + Chr(34) + "Calibri" + Chr(34) +">";
			gcurtblbordercolor = "#2F4F4F";		
			return tempCode + Chr(10);
 	}
		  
}
//Closing the HTML Table
function fn_htmlclosetable()
{
	var tempCode;
	tempCode = "</table>";
	return tempCode + Chr(10);
}
//Returns  HTML headers
function fn_htmlcreateheaders(strHTMLHeaders)
{
	var tempCode;
	aqString.ListSeparator = "|" ;
	if(strHTMLHeaders != "")
	{
	      tempCode = "<thead align = " + chr(34) + "center" + chr(34) + " bgcolor = " + chr(34) + gcurtblbordercolor + chr(34) + "> <tr> ";
		for(var i = 0; i < aqString.GetListLength(strHTMLHeaders) ; i++)
            {
		      tempCode = tempCode + "  <th>" + fn_fontcolor("White") + aqString.GetListItem(strHTMLHeaders,i) + "</th>";
            }
		tempCode = tempCode + " </tr> </thead>";
		return tempCode + Chr(10);
	}
	else
	{
		return "";
	} 
}
//Starting code of theHTML row 
function fn_htmlstartrow()
{ 
      return "<tr>" + Chr(10); 
}
//Ending code of theHTML row
function fn_htmlendrow()
{ 
      return "</tr>" + Chr(10); 
}
//Inserting row data into HTML table
function fn_htmlrowdata(strHTMLRowData,stralign,bgcolor)
{
	var tempCode;
	if(strHTMLRowData == "" )
	{ 
            strHTMLRowData = "-";
      }
	tempCode = "<td bgcolor = " + chr(34) + bgcolor + chr(34) + "align = " + chr(34) + stralign + chr(34) + ">" + strHTMLRowData + "</td>";
	return tempCode + Chr(10);
}
//Returns  Font tag with default font as Calibri
function fn_fontstart()
{ 
      return "<font face = " + chr(34) +"Calibri" + chr(34) + ">"  + Chr(10);
}
//Ending the Font limit
function fn_fontend()
{ 
      return "</font>" + Chr(10); 
}
//Changing thefont color 
function fn_fontcolor(strColorName)
{
	var tempCode;
	tempCode = "<font color = " + chr(34) + strColorName + chr(34) + ">";
	return tempCode + Chr(10);
}
//Returns  HTML Header data
function fn_header(strValue)
{
	return "<H2> <center> <font color = " + chr(34) + "#2F4F4F" + chr(34) + ">" + strValue +"</center></H2>" + Chr(10);
}
//Returns  HTML new line
function fn_htmlnewline()
{
	return "<br>" + Chr(10);
}
//Returns  HTML hyber link
function fn_createlink(strImgLink)
{
	var tempCode;
	tempCode = "<a href = " + chr(34) + strImgLink + chr(34) + "> View </a>";
	return tempCode + Chr(10);
}
function fn_initializeCricle(strStatus,intCount)
{
	var tempCode;
	switch(strStatus)
	{
		case "Pass":
			tempCode = "   Passed  " + "<style type=" + chr(34) + "text/css" + chr(34) + ">" + ".passCircle {    display:inline-block;    border-radius:50%;    border:2px solid;  border-color:Green; font-size:32px;}"
			tempCode = tempCode + ".passCircle:before,.passCircle:after {    content:'\\200B';    display:inline-block;    line-height:0px;    padding-top:50%;    padding-bottom:50%;}"
			tempCode = tempCode + ".passCircle:before {    padding-left:8px;}.passCircle:after {    padding-right:8px;} </style>"
			tempCode = tempCode + "<span class=" + chr(34) + "passCircle" + chr(34) + ">" + intCount +"</span>"
			return tempCode + Chr(10);
			break;
		case "Fail":
			tempCode ="  Failed  " +  "<style type=" + chr(34) + "text/css" + chr(34) + ">" + ".failCircle {    display:inline-block;    border-radius:50%;    border:2px solid;  border-color: Red; font-size:32px;}"
			tempCode = tempCode + ".failCircle:before,.failCircle:after {    content:'\\200B';    display:inline-block;    line-height:0px;    padding-top:50%;    padding-bottom:50%;}"
			tempCode = tempCode + ".failCircle:before {    padding-left:8px;}.failCircle:after {    padding-right:8px;} </style>"			
			tempCode = tempCode + "<span class=" + chr(34) + "failCircle" + chr(34) + ">" + intCount +"</span>"
			return tempCode + Chr(10);
			break;			
		case "Warning":
			tempCode = "  Warning  " + "<style type=" + chr(34) + "text/css" + chr(34) + ">" + ".warningCircle {    display:inline-block;    border-radius:50%;    border:2px solid;  border-color: Orange; font-size:32px;}"
			tempCode = tempCode + ".warningCircle:before,.warningCircle:after {    content:'\\200B';    display:inline-block;    line-height:0px;    padding-top:50%;    padding-bottom:50%;}"
			tempCode = tempCode + ".warningCircle:before {    padding-left:8px;}.warningCircle:after {    padding-right:8px;} </style>"			
			tempCode = tempCode + "<span class=" + chr(34) + "warningCircle" + chr(34) + ">" + intCount +"</span>"
			return tempCode + Chr(10);
			break;			
		case "total":
			tempCode = "  Total Test Case(s)  " + "<style type=" + chr(34) + "text/css" + chr(34) + ">" + ".totalCircle {    display:inline-block;    border-radius:50%;    border:2px solid;  border-color: Blue; font-size:36px;}"
			tempCode = tempCode + ".totalCircle:before,.totalCircle:after {    content:'\\200B';    display:inline-block;    line-height:0px;    padding-top:50%;    padding-bottom:50%;}"
			tempCode = tempCode + ".totalCircle:before {    padding-left:8px;}.totalCircle:after {    padding-right:8px;} </style>"			
			tempCode = tempCode + "<span class=" + chr(34) + "totalCircle" + chr(34) + ">" + intCount +"</span>"
			return tempCode + Chr(10);
			break;			
	}	
}

// Caputring Screenshot
function fn_getscreenshotlink()
{
      gTestCasePicPath = "Picture\\";
	var tempObject;
      var tempuniquename = fn_getuniquefilename();
	tempObject = gPictureLogPath + "Fail_" + tempuniquename + ".png";
      gTestCasePicPath = gTestCasePicPath + "Fail_" + tempuniquename + ".png";
	Sys.Desktop.ActiveWindow().Picture().SaveToFile(tempObject);
	return tempObject;	
}
//Returns the time difference between two time : Format 12 Hrs 30 Mins 45 Sec
function fn_gettimediff(startDate,endDate)
{
try
{
	var hrDiff,miDiff,secDiff;
	
	hrDiff = aqDateTime.GetHours(aqDateTime.TimeInterval(aqConvert.StrToDateTime(endDate),aqConvert.StrToDateTime(startDate)));
	miDiff = aqDateTime.GetMinutes(aqDateTime.TimeInterval(aqConvert.StrToDateTime(endDate),aqConvert.StrToDateTime(startDate)));
	secDiff = aqDateTime.GetSeconds(aqDateTime.TimeInterval(aqConvert.StrToDateTime(endDate),aqConvert.StrToDateTime(startDate)));
	
	return hrDiff + " Hrs " + miDiff + " Mins " + secDiff + " Sec"	
}
catch(ex)
{
      return "";
}
	
}
//Returns the Unique file name using current date and time 
function fn_getuniquefilename()
{
	var indate,inthr,intmi,intsec;
	indate = aqConvert.DateTimeToFormatStr(aqDateTime.Today(),"%b_%d_%y");
	inthr = aqDateTime.GetHours(aqDateTime.Now());
	intmi = aqDateTime.GetMinutes(aqDateTime.Now());
	intsec = aqDateTime.GetSeconds(aqDateTime.Now());
	return indate + "-" + inthr + "_" + intmi + "_" + intsec;
	
} 
//Returns the specified format of theinputed date : Format - Sep-20-2016  
function fn_formatdate(dtInput)
{
	var tempDate;
	tempDate = aqConvert.DateTimeToFormatStr(dtInput,"%b-%d-%Y");
	return tempDate;
}
//Returns the specified format of theinputed dateand time : Format - Sep-20-2016 12:30:45 AM
function fn_formatdatetime(dtInput)
{
	var tempDate;
	tempDate = aqConvert.DateTimeToFormatStr(dtInput,"%b-%d-%Y %I:%M:%S %p (%z)");
	return tempDate;
}