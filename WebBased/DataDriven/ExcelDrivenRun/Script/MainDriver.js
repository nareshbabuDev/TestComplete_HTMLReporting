﻿//USEUNIT Logger
function driver(){
  
    Logger.setLogsPath("HTMLReporting");
    Logger.setExecutionStartTime(aqDateTime.Time());
    
    var masterSheet = Project.Variables.MasterSheet;
    masterSheet.Reset();
    
    Log.AppendFolder("Excel Driver Run");
    
    if(!masterSheet.IsEOF()){
      
        while(!masterSheet.IsEOF())    {
          
            var runFlag = masterSheet.Value("RunFlag");
            var functionsToRun = masterSheet.Value("Function");
            var testcaseID = masterSheet.Value("TestCaseID");
            var testdescription = masterSheet.Value("TestCaseDescription");
            
            Logger.setTestCaseExeStartTime(aqDateTime.Time());          
            Logger.fn_createtestcasedescription(testcaseID,functionsToRun,testdescription);
            
            if(aqString.Compare(runFlag,"YES",false) == 0){
              
                Log.AppendFolder("Test case : " + testcaseID);
                
                try{
                    
                    Runner.CallMethod(functionsToRun);
                    
                }catch(ex){
                    Log.Error("Unable to run " + testcaseID + " error is : " + ex.stack);
                }
            }
            Log.PopLogFolder();
            
            masterSheet.Next();
            
             Logger.setTestCaseExeEndTime(aqDateTime.Time());
             Logger.fn_createtestcaseduration();
             Logger.fn_completetestcase();
        }
    }else{
        Log.Warning("There is no data found to execute");
    }
    
    Log.PopLogFolder();
    
    
     Logger.fn_generatehighlevelreport();
}

