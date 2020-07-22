//USEUNIT Logger
function logout()
{
  let browser = Aliases.browser;
  let page = browser.pageOrangehrm;
  Logger.fn_createteststep("DONE","Click Logout");
  page.linkWelcome.Click();
  aqUtils.Delay(5000);
  page.link.Click();
  browser.pageLogin.Wait();
  aqUtils.Delay(5000);
  Logger.fn_createteststep("PASS","Logged Out by User:"+Project.Variables.Username);
}
