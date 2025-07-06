import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent, createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound.js";
import { fetchPost } from "~/utils/posts.js";

export const Route = createFileRoute("/_authed/posts/$slug")({
  loader: ({ params: { slug } }) => fetchPost({ data: slug }),
  errorComponent: PostErrorComponent,
  component: PostComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>;
  },
});

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

function PostComponent() {
  const post = Route.useLoaderData();

  return (
    <div>
      <h4>{post.title}</h4>
      <div>{post.body}</div>
    </div>
  );
}
