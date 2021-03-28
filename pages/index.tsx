import { GetStaticProps } from "next";
import React from "react";
import { getAllPosts, PostItem } from "../utils/content";
import Layout from "../components/Layout";
import Link from "../components/Link";


interface Props {
  posts: PostItem[];
}

// title: string;
//   description: string;
//   tags: string;
//   createAt: string;
//   updatedAt: string;

const Index = (props: Props) => {
  const { posts = [] } = props;

  return (
    <>
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          게시글
        </h1>
        {/* <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {siteMetadata.description}
        </p> */}
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => {
          const { title, tags, slug, createdAt, description } = post;

          return (
            <li className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={createdAt}>
                        {new Date(createdAt).toLocaleDateString()}
                      </time>
                    </dd>
                    {/* {/* </dd> */}
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link href={`/posts/${slug}`}>{title}</Link>

                          {/* <Link
                            // href={`/blog/${slug}`}
                            // className="text-gray-900 dark:text-gray-100"
                          >
                            {title}
                          </Link> */}
                        </h2>
                        <div className="space-x-3">
                          {tags?.split(",").map((tag) => (
                            <a className="uppercase text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                              {tag}
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="prose text-gray-500 max-w-none dark:text-gray-400">
                        {description}
                      </div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/posts/${slug}`}
                        className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                        aria-label={`Read "${title}"`}
                      >
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPosts([
    "title",
    "description",
    "createdAt",
    "updatedAt",
    "slug",
    "tags",
  ]);

  return {
    props: {
      posts,
    },
  };
};

export default Index;
