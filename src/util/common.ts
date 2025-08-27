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
.markdown {
    h1 {
      font-size: 28px;
      line-height: 130%;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #26282b;
      margin-bottom: 40px;
    }
    h2 {
      font-size: 24px;
      line-height: 140%;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #26282b;
      margin-bottom: 24px;
    }
    h3 {
      font-size: 20px;
      line-height: 140%;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #26282b;
      margin-bottom: 24px;
    }
    h4 {
      font-size: 18px;
      line-height: 140%;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #26282b;
      margin-bottom: 24px;
    }
    h5 {
      font-size: 20px;
      line-height: 140%;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #26282b;
      margin-bottom: 24px;
    }
    h6 {
      font-size: 18px;
      line-height: 140%;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #26282b;
      margin-bottom: 24px;
    }
    
    p {
      font-size: 16px;
      line-height: 160%;
      font-weight: 500;
      letter-spacing: -0.01em;
      color: #454c53;
      margin-bottom: 16px;
    }
    sub,
    small {
      font-size: 14px;
      line-height: 160%;
      font-weight: 500;
      letter-spacing: -0.01em;
      color: #454c53;
      margin-bottom: 12px;
    }
    
    b,
    strong {
      font-weight: 700;
    }
    em, 
    i {
      font-style: italic;
      font-weight: 500;
    }
    mark,
    .highlight {
      background: #fff4cc;
    }
    blockquote {
      border-left: 4px solid #b3b8bd;
      border-radius: 2px;
      padding-left: 24px;
    }
    hr {
      width: 100%;
      height: 1px;
      color: #c9cdd2;
      margin-top: 32px;
      margin-bottom: 32px;
    }
    
    ul {
      list-style: disc;
    }
    ul li {
      list-style: disc;
    }
    ol {
      list-style: decimal;
    }
    ol li {
      list-style: decimal;
    }
    ul,
    ol {
      padding-left: 24px;
      margin-bottom: 24px;
    }
    li {
      font-size: 16px;
      line-height: 160%;
      font-weight: 500;
      letter-spacing: -0.01em;
      color: #454c53;
    }
    li + li {
      margin-top: 8px;
    }
    
    a:hover {
      color: #004de6;
      text-decoration-thickness: 2px;
    }
    a:visited {
      color: #551a8b;
      text-decoration-thickness: 2px;
    }
    
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #c9cdd2;
      margin-top: 0;
      margin-bottom: 24px;
      overflow: hidden;
    }
    tr,
    td,
    th {
      border: 1px solid #e8ebed;
      border-radius: unset;
      padding: 12px 8px;
      background: #ffffff;
    }
    th {
      background: #f7f8f9;
      font-weight: 700;
      font-size: 16px;
      line-height: 160%;
      letter-spacing: -0.01em;
      color: #454c53;
      text-align: center;
    }
    
    pre {
      width: 100%;
      background: #f1f1f1;
      border: 1px solid #e8ebed;
      border-radius: 4px;
      padding: 8.8px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    code {
      display: flex;
      width: 100%;
      font-family: 'Source Code Pro', monospace;
      font-size: 16px;
      word-wrap: break-word;
      overflow: hidden;
      white-space: pre-wrap;
      color: #454C53;
    }
    
    p img,
    img {
      width: 200px !important;
      height: 200px !important;
      border-radius: 16px;
    }
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

    body.html(`<div class="markdown">${converted}</div>`);

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

export const setCookie = (name: string, value: string, minutes = 1) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${minutes * 60}; path=/; SameSite=Lax; Secure`;
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
