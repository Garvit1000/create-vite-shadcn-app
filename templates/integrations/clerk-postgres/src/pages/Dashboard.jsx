import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useUser } from "@/hooks/useUser";
import { postsApi } from "@/lib/api";
import { Plus, Edit, Trash2, Calendar, User, FileText } from "lucide-react";

export default function Dashboard() {
  const { clerkUser, dbUser, isLoading, getUserStats } = useUser();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!clerkUser) return;

      try {
        // Load user's posts
        const userPosts = await postsApi.getByUser(clerkUser.id, true);
        setPosts(userPosts);

        // Load user stats
        const userStats = await getUserStats();
        setStats(userStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoadingPosts(false);
      }
    }

    loadDashboardData();
  }, [clerkUser, getUserStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {dbUser?.firstName || clerkUser?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your account.</p>
          </div>
          <Button asChild>
            <Link to="/posts/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalPosts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Account created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Profile status
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link to="/profile">Manage Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Recent Posts</CardTitle>
            <CardDescription>Manage your published and draft articles</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPosts ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start writing your first post to share your thoughts with the world.
                </p>
                <Button asChild>
                  <Link to="/posts/new">Create Your First Post</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {post.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{post.published ? 'Published' : 'Draft'}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/posts/${post.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {posts.length > 5 && (
                  <div className="text-center pt-4">
                    <Button asChild variant="outline">
                      <Link to="/posts">View All Posts</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/posts/new">
                  <Plus className="w-6 h-6" />
                  New Post
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/posts">
                  <FileText className="w-6 h-6" />
                  All Posts
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/profile">
                  <User className="w-6 h-6" />
                  Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/">
                  <Calendar className="w-6 h-6" />
                  Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );

  async function handleDeletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsApi.delete(postId, clerkUser.id);
      setPosts(posts.filter(p => p.id !== postId));
      
      // Refresh stats
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  }
}