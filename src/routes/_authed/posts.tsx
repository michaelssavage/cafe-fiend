import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { fetchPosts } from "~/utils/posts.js";

export const Route = createFileRoute("/_authed/posts")({
  loader: () => fetchPosts(),
  component: PostsComponent,
});

function PostsComponent() {
  const posts = Route.useLoaderData();

  return (
    <div>
      <ul>
        {[...posts, { id: "i-do-not-exist", title: "Non-existent Post" }].map(
          (post) => {
            return (
              <li key={post.id}>
                <Link
                  to="/posts/$slug"
                  params={{
                    slug: post.id,
                  }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </li>
            );
          }
        )}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
