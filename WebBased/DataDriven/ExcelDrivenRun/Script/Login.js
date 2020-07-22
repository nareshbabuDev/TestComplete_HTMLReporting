//USEUNIT Logger
function login()
{
  let browser = Aliases.browser;
  Browsers.Item(btIExplorer).Run();
  Browsers.Item(btIExplorer).Navigate("https://opensource-demo.orangehrmlive.com/index.php/dashboard");
  aqUtils.Delay(5000);
  let page = browser.pageOrangehrm;
  let form = page.formFrmlogin;
  let textbox = form.textboxTxtusername;
  textbox.SetText(Project.Variables.Username);
  aqUtils.Delay(5000);
  Logger.fn_createteststep("DONE","Set UserName");
  form.passwordboxTxtpassword.SetText(Project.Variables.Password1);
  aqUtils.Delay(5000);
  Logger.fn_createteststep("DONE","Set Password");
  form.submitbuttonLogin.ClickButton();
  aqUtils.Delay(5000);
  page.Wait();
  Logger.fn_createteststep("PASS","Logged by User:"+Project.Variables.Username);
}

