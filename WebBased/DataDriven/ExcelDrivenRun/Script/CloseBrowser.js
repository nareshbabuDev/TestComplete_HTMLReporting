//USEUNIT Logger
function closebrowser(){
  var processName = "iexplore"; 
  Sys.Refresh(); 
  while (Sys.WaitBrowser(processName).Exists)
    Sys.WaitBrowser(processName).Close();
    Logger.fn_createteststep("PASS","Close all Browser")
}