const GhostAdminAPI = require("@tryghost/admin-api");
const GhostContentAPI = require("@tryghost/content-api");

const apiLocal = new GhostAdminAPI({
  url: process.env.LOCAL_GHOST_ADMIN_API_URL,
  key: process.env.LOCAL_GHOST_ADMIN_API_KEY,
  version: "v6.0",
});

const apiProd = new GhostContentAPI({
  url: process.env.PROD_GHOST_CONTENT_API_URL,
  key: process.env.PROD_GHOST_CONTENT_API_KEY,
  version: "v6.0",
});

async function syncAllContent() {
  console.log("Starting content sync from production to local...");

  try {
    // Sync posts
    console.log("Fetching posts from production...");
    const posts = await apiProd.posts.browse({
      limit: "all",
      include: "tags,authors",
    });
    console.log(`Found ${posts.length} posts to sync`);

    for (const post of posts) {
      try {
        await apiLocal.posts.add(
          {
            title: post.title,
            slug: post.slug,
            html: post.html,
            featured: post.featured,
            status: "published",
            feature_image: post.feature_image,
            custom_excerpt: post.custom_excerpt,
            visibility: post.visibility,
            published_at: post.published_at,
            tags: post.tags,
          },
          { source: "html" }
        );
        console.log(`Synced post: ${post.title}`);
      } catch (error) {
        console.error(`Failed to sync post "${post.title}":`, error.message);
      }
    }

    // Sync pages
    console.log("Fetching pages from production...");
    const pages = await apiProd.pages.browse({
      limit: "all",
      include: "tags,authors,lexical",
    });
    console.log(`Found ${pages.length} pages to sync`);

    for (const page of pages) {
      try {
        await apiLocal.pages.add(
          {
            title: page.title,
            slug: page.slug,
            html: page.html,
            status: "published",
            feature_image: page.feature_image,
            custom_excerpt: page.custom_excerpt,
            visibility: page.visibility,
            published_at: page.published_at,
            tags: page.tags,
          },
          { source: "html" }
        );
        console.log(`Synced page: ${page.title}`);
      } catch (error) {
        console.error(`Failed to sync page "${page.title}":`, error.message);
      }
    }

    console.log("Content sync completed!");
  } catch (error) {
    console.error("Failed to sync content:", error);
    process.exit(1);
  }
}

syncAllContent();