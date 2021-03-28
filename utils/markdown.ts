import rehypePrism from "@mapbox/rehype-prism";
import html from "rehype-stringify";
import gfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import unified from "unified";
import remarkHeadings from "remark-autolink-headings";

export async function markdownToHtml(markdown: string) {
  console.log("zzz", markdown);
  const result = await unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(remarkHeadings)
    .use(html)
    .process(markdown);
  return result.toString();
}
