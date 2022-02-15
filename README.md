# my-diary-project

簡介： 此為使用Google Oauth2.0以及LocalStrategy製作登入系統，資料儲存在MongoDB Altas裡。 
使用者可以選擇註冊帳號，或是使用Google本網站。網站抓取到資料後，會顯示您的個人Profile頁面。 
登入個人頁面後，可以新增簡易的日記內容，會包含“標題、內容、日期”，並顯示於個人頁面上。

備註：

1. 本專案使用Local Strategy登入系統，以及Google Oauth2.0，連結至我的MongoDB Altas資料庫。
2. 若要下載使用，請注意Clinet ID, Client secret跟DB_Connect的部分要使用自己的金鑰。
可參考：https://www.passportjs.org/packages/passport-google-oauth20/ 
