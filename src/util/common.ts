import { load } from 'cheerio';
import { convert } from 'html-to-text';
import { marked } from 'marked';

import Bridge, { fileToString } from './bridge';

const renderer = new marked.Renderer();
renderer.image = (href, title, text) =>
  `<img src="${href}" alt="${text}" style="width: 100%; height: auto">`;
renderer.paragraph = (text) => {
  return `<p>${text}</p>`;
};

marked.use({
  renderer: renderer,
  mangle: false,
  headerIds: false
});

const htmlBody = `

<html>
<head>
<style>
table{
  border-collapse: collapse ;
  border-radius: 6px;
  width: 100%;
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
</html>
`;

export const markdownToHtml = async (markdown: string) => {
  try {
    const converted = marked.parse(markdown);
    const $ = load(htmlBody);
    const body = $('body');

    body.html(converted);
    $('a').each((_, el) => {
      $(el).attr('target', '_blank').attr('rel', 'noopener noreferrer');
    });

    return $.html();
  } catch (err) {
    /* empty */
  }
};

export const insertDoc = async (markdown: string) => {
  try {
    const html = await markdownToHtml(markdown);
    await Bridge.callBridgeApi('insertHtml', html);
  } catch (error) {
    /* empty */
  }
};

export const calLeftCredit = (headers: Headers) => {
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

export const makeClipboardData = async (target: string | Blob) => {
  let text = undefined;
  let html = undefined;
  let image = undefined;
  if (typeof target !== 'string') {
    image = await fileToString(target);
  } else {
    html = await markdownToHtml(target);
    if (html) {
      text = convert(html);
    }
  }

  return {
    text,
    html,
    image
  };
};

export const base64ToBlob = (base64: string, contentType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
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

export const setCookie = (name: string, value: string, minutes = 525600) => {
  const maxAge = minutes * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
};

export const getCookie = (name: string) => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
};

export const isHigherVersion = (targetVersion: string, currentVersion: string | null) => {
  if (currentVersion === null) return false;

  const targetParts = targetVersion.split('.').map(Number);
  const currentParts = currentVersion.split('.').map(Number);

  while (targetParts.length < 4) targetParts.push(0);
  while (currentParts.length < 4) currentParts.push(0);

  for (let i = 0; i < 4; i++) {
    if (targetParts[i] > currentParts[i]) {
      return false;
    } else if (targetParts[i] < currentParts[i]) {
      return true;
    }
  }

  return true;
};

export const getFileExtension = (filename: string) => {
  return `.${filename.split('.').pop()}`;
};

export const getFileName = (filename: string) => {
  const parts = filename.split('.');
  if (parts.length > 1) {
    parts.pop();
    return parts.join('.');
  }
  return filename;
};

export const sliceFileName = (name: string, index = 20) => {
  const fileName = name;
  if (fileName.length > index) {
    const fileNameWithoutExt = fileName.slice(0, index);
    return `${fileNameWithoutExt}...`;
  }
  return fileName;
};
