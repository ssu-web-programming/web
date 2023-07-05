import { load } from 'cheerio';
import { marked } from 'marked';
import Bridge from './bridge';

const htmlBody = `
<html>
<head>
<style>
table{
  border-collapse: collapse ;
  border-radius: 6px;
  width: 500px;
}

th ,
td{
  padding: 1em;
  padding-top: .5em;
  padding-bottom: .5em;
}

table,
tr,
td,
th 
{
  border-radius: 6px;
  border: 1px solid #e0d1ff;
  padding: 15px 10px;
}
th
{
  border: 1px solid #e0d1ff;
  color: #6f3ad0;
  background: #f5f1fd;
  padding: 10px 10px;
}
</style>
</head>
<body>
<!--StartFragment-->

<!--EndFragment-->
</body>
</html>`;

export const markdownToHtml = async (markdown: string) => {
  try {
    const converted = await marked(markdown);
    const $ = load(htmlBody);
    const body = $('body');

    body.html(converted);

    return $.html();
  } catch (err) {}
};

export const insertDoc = async (markdown: string) => {
  try {
    const html = await markdownToHtml(markdown);
    await Bridge.callBridgeApi('insertHtml', html);
  } catch (error) {}
};

export const calLeftCredit = (headers: any) => {
  const leftCredit = headers?.get('X-PO-AI-Mayflower-Userinfo-Credit'.toLowerCase());
  const deductionCredit = headers?.get('X-PO-AI-Mayflower-Userinfo-Usedcredit'.toLowerCase());

  return {
    deductionCredit: deductionCredit,
    leftCredit: leftCredit
  };
};

export const openNewWindow = (url: string) => {
  Bridge.callBridgeApi('openWindow', url);
};
