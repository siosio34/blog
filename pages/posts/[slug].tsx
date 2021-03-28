import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import { getAllPosts, PostItem } from "../../utils/content";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { markdownToHtml } from "../../utils/markdown";
import Link from "../../components/Link";

type UrlProps = {
  slug: string;
};

interface Props {
  post: PostItem;
  prev: PostItem | null;
  next: PostItem | null;
}

const renderers = {
  code: ({ language, value }) => {
    return <SyntaxHighlighter language={language} children={value} />;
  },
};

const Post = (props: Props) => {
  const { post, prev, next } = props;
  console.log("content", post.content);
  return (
    <>
      <header className="pt-6 xl:pb-6">
        <div className="space-y-1 text-center">
          <dl className="space-y-10">
            <div>
              <dt className="sr-only">Published on</dt>
              <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </dd>
            </div>
          </dl>
          <div>
            <h1 className="text-3xl leading-9 font-extrabold text-gray-900 dark:text-gray-100 tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
              {post.title}
            </h1>
          </div>
        </div>
      </header>

      <div
        // eslint-disable-next-line react/no-danger
        className="prose dark:prose-dark max-w-none pt-10 pb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="text-sm font-medium leading-5 xl:divide-y divide-gray-200 dark:divide-gray-700 xl:col-start-1 xl:row-start-2">
        <div className="py-4 xl:py-8">
          <h2 className="text-xs tracking-wide uppercase text-gray-500 dark:text-gray-400">
            Tags
          </h2>
          <div className="space-x-3">
            {post.tags?.split(",").map((tag) => (
              <a className="uppercase text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                {tag}
              </a>
            ))}
          </div>
        </div>

        {(next || prev) && (
          <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
            {prev && (
              <div>
                <h2 className="text-xs tracking-wide uppercase text-gray-500 dark:text-gray-400">
                  Previous Article
                </h2>
                <div className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                  <Link href={`/posts/${prev.slug}`}>{prev.title}</Link>
                </div>
              </div>
            )}
            {next && (
              <div>
                <h2 className="text-xs tracking-wide uppercase text-gray-500 dark:text-gray-400">
                  Next Article
                </h2>
                <div className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                  <Link href={`/posts/${next.slug}`}>{next.title}</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </footer>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<UrlProps> = async () => {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, UrlProps> = async ({
  params,
}) => {
  const posts = getAllPosts([
    "title",
    "description",
    "createdAt",
    "updatedAt",
    "slug",
    "tags",
    "content",
  ]);

  const cur = posts.findIndex((post) => params.slug === post.slug);
  const prevPost = posts[cur + 1] || null;
  const nextPost = posts[cur - 1] || null;

  const post = posts[cur];

  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
      prev: prevPost,
      next: nextPost,
    },
  };
};

export default Post;
