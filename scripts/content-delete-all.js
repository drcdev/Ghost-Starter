const GhostAdminAPI = require("@tryghost/admin-api");

const apiLocal = new GhostAdminAPI({
  url: process.env.LOCAL_GHOST_ADMIN_API_URL,
  key: process.env.LOCAL_GHOST_ADMIN_API_KEY,
  version: "v6.0",
});

async function deleteAllContent() {
  console.log("Starting content deletion...");

  try {
    // Delete all posts
    const posts = await apiLocal.posts.browse({ limit: "all" });
    console.log(`Found ${posts.length} posts to delete`);
    
    for (const post of posts) {
      try {
        await apiLocal.posts.delete({ id: post.id });
        console.log(`Deleted post: ${post.title}`);
      } catch (error) {
        console.error(`Failed to delete post "${post.title}":`, error.message);
      }
    }

    // Delete all pages
    const pages = await apiLocal.pages.browse({ limit: "all" });
    console.log(`Found ${pages.length} pages to delete`);
    
    for (const page of pages) {
      try {
        await apiLocal.pages.delete({ id: page.id });
        console.log(`Deleted page: ${page.title}`);
      } catch (error) {
        console.error(`Failed to delete page "${page.title}":`, error.message);
      }
    }

    console.log("Content deletion completed!");
  } catch (error) {
    console.error("Failed to delete content:", error);
    process.exit(1);
  }
}

deleteAllContent();