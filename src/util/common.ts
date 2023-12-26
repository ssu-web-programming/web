import { load } from 'cheerio';
import { marked } from 'marked';
import { convert } from 'html-to-text';
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

export const makeClipboardData = async (markdown: string) => {
  const html = await markdownToHtml(markdown);
  let text = undefined;
  if (html) {
    text = convert(html);
  }

  return {
    text,
    html
  };
};

const CHAT_PDF_PAGE_PARSE_REG = /\[(P\d+\s*,?\s*)*\]/g;
export const parseRefPages = (contents: string) => {
  const pages = contents.match(CHAT_PDF_PAGE_PARSE_REG)?.reduce((acc, cur) => {
    cur
      .replace(/\[|\]|p|P|\s/g, '')
      .split(',')
      .forEach((p) => acc.push(parseInt(p)));

    return acc;
  }, [] as number[]);
  return pages;
};

export const removeRefPages = (contents: string) => {
  return contents.replaceAll(CHAT_PDF_PAGE_PARSE_REG, '');
};

export const setCookie = (cname: string, cvalue: string, exdays: number) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  const domain = 'polarisoffice.com';
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/;' + 'domain=' + domain + ';';
};
