import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import { PostFrontMatter } from "../../lib/interfaces/Post.interface";

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));

  // Return the possible paths for pre-render. Throw a 404 if not found.
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const fileName = fs.readFileSync(`posts/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export default function PostPage({
  frontmatter,
  content,
}: {
  frontmatter: PostFrontMatter;
  content: string;
}) {
  return (
    <div className="prose mx-auto">
      <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
    </div>
  );
}