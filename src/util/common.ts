import { load } from 'cheerio';
import { marked } from 'marked';

const htmlBody = `
<html>
<head>
<style>
table{
  border-collapse: collapse ;
  border-radius: 6px;
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
  border: 1px solid #555;
}
</style>
</head>
<body>
<!--StartFragment-->

<!--EndFragment-->
</body>
</html>`;

export const insertDoc = async (content: string) => {
  try {
    const tt = await marked(content);
    const $ = load(htmlBody);
    const body = $('body');

    body.html(tt);

    await window._Bridge.insertHtml($.html());
  } catch (error) {}
};
