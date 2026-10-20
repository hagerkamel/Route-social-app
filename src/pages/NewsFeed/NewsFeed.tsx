import { useEffect, useState } from "react";
import PostCard from "../../components/PostCard/PostCard";
import Sidebar from "../../components/Sidebar/Sidebar";
import SuggestionsSidebar from "../../components/SuggestionsSidebar/SuggestionsSidebar";
import { getNewsFeed } from "../../services/newsfeed.services";
import type { PostCardI } from "../../types/postCard";
import PostCardSkeleton from "../../components/PostCard/PostSkeleton";
import AddPost from "../../components/PostCard/AddPost";
import PublishingPostCard from "../../components/PostCard/PublishingPostCard";
import usePageTitle from "../../hooks/usePageTitle";

type PendingPost = {
  tempId: string;
  body: string;
  imageUrl?: string;
  progress: number;
};

export default function Newsfeed() {
  usePageTitle("Home Feed")
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingPost, setPendingPost] = useState<PendingPost | null>(null);

  async function getPosts() {
    try {
      const { data } = await getNewsFeed();
      const posts: PostCardI[] = data.data.posts;
      setPosts(posts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
      <div className="xl:order-1">
        <Sidebar />
      </div>

      <div className="xl:order-3">
        <SuggestionsSidebar />
      </div>

      <section aria-label="Posts feed" className="space-y-4  xl:order-2">
        <AddPost
          refatchPosts={getPosts}
          onPendingPost={setPendingPost}
          onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])}
        />

        {pendingPost && (
          <PublishingPostCard
            body={pendingPost.body}
            imageUrl={pendingPost.imageUrl}
            progress={pendingPost.progress}
          />
        )}

        {isLoading ? (
          <PostCardSkeleton />
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} refatchPosts={getPosts} />
          ))
        )}
      </section>
    </div>
  );
}
