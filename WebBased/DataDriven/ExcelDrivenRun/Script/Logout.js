﻿//USEUNIT Logger
function logout()
{
  let browser = Aliases.browser;
  let page = browser.pageOrangehrm;
  Logger.fn_createteststep("DONE","Click Logout");
  page.linkWelcome.Click();
  page.link.Click();
  browser.pageLogin.Wait();
  Logger.fn_createteststep("PASS","Logged Out by User:"+Project.Variables.Username);
}