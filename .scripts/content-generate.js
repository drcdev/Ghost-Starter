const GhostAdminAPI = require("@tryghost/admin-api");

const count = 15;

const apiLocal = new GhostAdminAPI({
    url: process.env.LOCAL_GHOST_ADMIN_API_URL,
    key: process.env.LOCAL_GHOST_ADMIN_API_KEY,
    version: "v6.0",
});

// Realistic tag categories
const tagCategories = {
    technology: [
        "JavaScript",
        "React",
        "Node.js",
        "TypeScript",
        "CSS",
        "HTML",
        "Web Development",
    ],
    topics: [
        "Tutorial",
        "Best Practices",
        "Performance",
        "Security",
        "Testing",
        "Architecture",
    ],
    tools: ["Git", "Docker", "VS Code", "npm", "Webpack", "TailwindCSS"],
    concepts: [
        "Responsive Design",
        "Accessibility",
        "SEO",
        "Progressive Web Apps",
        "API Design",
    ],
};

// Realistic post templates
const postTemplates = [
    {
        titleTemplate: "Building Modern {tech} Applications: A Complete Guide",
        excerptTemplate:
            "Learn how to build scalable and maintainable applications using {tech} with best practices and real-world examples.",
        contentType: "tutorial",
        tags: ["tutorial", "technology", "tools"],
    },
    {
        titleTemplate: "The Ultimate Guide to {concept}",
        excerptTemplate:
            "Everything you need to know about {concept}, from basic principles to advanced implementation strategies.",
        contentType: "guide",
        tags: ["topics", "concepts"],
    },
    {
        titleTemplate: "{tech} vs {tech2}: Which Should You Choose in 2024?",
        excerptTemplate:
            "An in-depth comparison of {tech} and {tech2}, helping you make the right choice for your next project.",
        contentType: "comparison",
        tags: ["technology", "topics"],
    },
    {
        titleTemplate: "10 {concept} Tips Every Developer Should Know",
        excerptTemplate:
            "Boost your development workflow with these essential {concept} tips and tricks used by industry professionals.",
        contentType: "tips",
        tags: ["topics", "concepts"],
    },
    {
        titleTemplate: "Getting Started with {tool}: A Beginner's Guide",
        excerptTemplate:
            "Master {tool} from scratch with this comprehensive beginner's guide, complete with practical examples.",
        contentType: "beginner",
        tags: ["tools", "tutorial"],
    },
];

// Feature image URLs (using Unsplash for consistent professional images)
const featureImages = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=600&fit=crop",
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateRealisticContent(template, replacements) {
    const paragraphs = [
        `<p>In today's rapidly evolving tech landscape, ${
            template.contentType === "tutorial"
                ? "mastering new technologies"
                : "staying updated with best practices"
        } is crucial for developers at all levels.</p>`,
        `<p>This comprehensive guide will walk you through the essential concepts, providing practical examples and real-world applications that you can implement immediately in your projects.</p>`,
        `<h2>Getting Started</h2><p>Before diving into the technical details, let's establish a solid foundation by understanding the core principles and setting up your development environment properly.</p>`,
        `<p>We'll cover everything from basic setup to advanced configuration options, ensuring you have all the tools needed to follow along effectively.</p>`,
        `<h2>Core Concepts</h2><p>Understanding the fundamental concepts is essential for building robust and scalable applications. Let's explore the key principles that will guide our implementation.</p>`,
        `<p>These concepts form the backbone of modern development practices and are widely adopted across the industry for their proven effectiveness.</p>`,
        `<h2>Implementation</h2><p>Now that we have a solid understanding of the theory, let's put these concepts into practice with hands-on examples and code snippets.</p>`,
        `<p>Each example is designed to be practical and immediately applicable to your own projects, with clear explanations of why certain approaches are preferred.</p>`,
        `<h2>Best Practices</h2><p>Following industry best practices ensures your code is maintainable, scalable, and follows established conventions that other developers can easily understand.</p>`,
        `<p>We'll cover common pitfalls to avoid and share insights from experienced developers who have successfully implemented these solutions in production environments.</p>`,
        `<h2>Conclusion</h2><p>By implementing these strategies and techniques, you'll be well-equipped to tackle complex challenges and build professional-grade applications.</p>`,
        `<p>Remember that continuous learning and practice are key to mastering any technology. Don't hesitate to experiment and adapt these concepts to your specific use cases.</p>`,
    ];

    return paragraphs.join("\n");
}

function createRealisticPost(index) {
    const template = getRandomElement(postTemplates);

    // Generate replacements for template variables
    const techOptions = [...tagCategories.technology, ...tagCategories.tools];
    const tech = getRandomElement(techOptions);
    const tech2 = getRandomElements(
        techOptions.filter((t) => t !== tech),
        1
    )[0];
    const concept = getRandomElement(tagCategories.concepts);
    const tool = getRandomElement(tagCategories.tools);

    const replacements = { tech, tech2, concept, tool };

    // Generate title and excerpt
    let title = template.titleTemplate;
    let excerpt = template.excerptTemplate;

    Object.keys(replacements).forEach((key) => {
        title = title.replace(`{${key}}`, replacements[key]);
        excerpt = excerpt.replace(`{${key}}`, replacements[key]);
    });

    // Generate tags based on template
    const postTags = [];
    template.tags.forEach((tagCategory) => {
        const categoryTags = tagCategories[tagCategory];
        if (categoryTags) {
            postTags.push({ name: getRandomElement(categoryTags) });
        }
    });

    // Add some additional random tags
    if (Math.random() > 0.5) {
        postTags.push({
            name: getRandomElement([
                ...tagCategories.topics,
                ...tagCategories.concepts,
            ]),
        });
    }

    // Generate realistic publication date (within last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    const publishedAt = new Date(
        sixMonthsAgo.getTime() +
            Math.random() * (now.getTime() - sixMonthsAgo.getTime())
    );

    return {
        title,
        status: "published",
        featured: Math.random() > 0.7, // 30% chance of being featured
        feature_image: getRandomElement(featureImages),
        custom_excerpt: excerpt,
        html: generateRealisticContent(template, replacements),
        meta_title: `${title} | Developer Guide`,
        meta_description:
            excerpt.length > 160 ? excerpt.substring(0, 157) + "..." : excerpt,
        tags: postTags,
        published_at: publishedAt.toISOString(),
        visibility: "public",
    };
}

async function generatePosts() {
    console.log("Starting realistic post generation...");

    try {
        console.log("Note: Posts will be created using the default Ghost user");

        // Generate realistic posts
        console.log(`Generating ${count} realistic posts...`);
        const results = [];

        for (let i = 0; i < count; i++) {
            try {
                const post = createRealisticPost(i);
                const result = await apiLocal.posts.add(post, {
                    source: "html",
                });
                console.log(`Generated post: ${post.title}`);
                results.push(result);

                // Small delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to create post ${i + 1}:`, error.message);
            }
        }

        // Generate additional test page
        console.log("Generating test page...");
        try {
            const testPage = {
                title: "Test",
                status: "published",
                html: `
          <p>This is a comprehensive test page that serves as a "kitchen sink" to demonstrate all the different types of content and HTML elements that the Ghost-Starter theme should render correctly. Use this page to verify that all styling and layout components work properly.</p>
          
          <h1>Heading Level 1</h1>
          <p>This is a paragraph following an H1 heading. It should have proper spacing and typography according to the theme's design system.</p>
          
          <h2>Heading Level 2</h2>
          <p>This is content under an H2 heading. The theme should provide clear visual hierarchy between different heading levels.</p>
          
          <h3>Heading Level 3</h3>
          <p>H3 headings are commonly used for subsections within content.</p>
          
          <h4>Heading Level 4</h4>
          <p>Smaller subsections might use H4 headings.</p>
          
          <h5>Heading Level 5</h5>
          <p>H5 headings for even smaller subsections.</p>
          
          <h6>Heading Level 6</h6>
          <p>The smallest heading level available in HTML.</p>
          
          <h2>Text Formatting</h2>
          <p>This paragraph contains <strong>bold text</strong>, <em>italic text</em>, <code>inline code</code>, and <a href="#test">linked text</a>. It also includes <mark>highlighted text</mark> and <del>strikethrough text</del>.</p>
          
          <p>Here's some <sup>superscript</sup> and <sub>subscript</sub> text for good measure.</p>
          
          <h2>Lists</h2>
          <h3>Unordered List</h3>
          <ul>
            <li>First list item</li>
            <li>Second list item with <strong>bold text</strong></li>
            <li>Third list item with a <a href="#test">link</a></li>
            <li>Fourth list item</li>
          </ul>
          
          <h3>Ordered List</h3>
          <ol>
            <li>Numbered item one</li>
            <li>Numbered item two</li>
            <li>Numbered item three</li>
            <li>Numbered item four</li>
          </ol>
          
          <h3>Nested Lists</h3>
          <ul>
            <li>Parent item
              <ul>
                <li>Nested item</li>
                <li>Another nested item</li>
              </ul>
            </li>
            <li>Another parent item</li>
          </ul>
          
          <h2>Code Blocks</h2>
          <p>Here's a code block to test syntax highlighting and code styling:</p>
          <pre><code>function testFunction() {
    const message = "Hello, World!";
    console.log(message);
    return message;
}
          
// Call the function
testFunction();</code></pre>
          
          <h2>Blockquotes</h2>
          <blockquote>
            <p>This is a blockquote to test how the theme handles quoted content. It should be visually distinct from regular paragraphs with appropriate styling, spacing, and possibly quotation marks or indentation.</p>
          </blockquote>
          
          <h2>Tables</h2>
          <p>Testing responsive table handling:</p>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dark Mode</td>
                <td>✅ Implemented</td>
                <td>Toggle in header</td>
              </tr>
              <tr>
                <td>Responsive Design</td>
                <td>✅ Implemented</td>
                <td>Mobile-first approach</td>
              </tr>
              <tr>
                <td>TailwindCSS</td>
                <td>✅ Implemented</td>
                <td>Utility-first styling</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Images</h2>
          <p>Testing image display (placeholder text since we don't have actual images):</p>
          <p><em>[Image placeholder - in a real implementation, this would test image responsiveness, captions, and lazy loading]</em></p>
          
          <h2>Horizontal Rule</h2>
          <p>Content before horizontal rule.</p>
          <hr>
          <p>Content after horizontal rule.</p>
          
          <h2>Definition Lists</h2>
          <dl>
            <dt>Ghost</dt>
            <dd>A modern open source headless CMS</dd>
            
            <dt>TailwindCSS</dt>
            <dd>A utility-first CSS framework</dd>
            
            <dt>Handlebars</dt>
            <dd>The templating engine used by Ghost themes</dd>
          </dl>
          
          <h2>Long Content Test</h2>
          <p>This section tests how the theme handles longer paragraphs and content flow. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          
          <h2>Conclusion</h2>
          <p>This kitchen sink page should help identify any styling issues or content rendering problems in the Ghost-Starter theme. All elements above should display properly with consistent styling, proper spacing, and responsive behavior.</p>
        `,
                custom_excerpt:
                    "A comprehensive kitchen sink page that demonstrates all content types and HTML elements to test theme rendering and styling.",
                meta_title: "Test | Content Generation Test",
                meta_description:
                    "A simple test page to verify content generation functionality.",
                visibility: "public",
            };

            const result = await apiLocal.pages.add(testPage, {
                source: "html",
            });
            console.log(`Generated test page: ${testPage.title}`);
            results.push(result);
        } catch (error) {
            console.error(`Failed to create test page:`, error.message);
        }

        console.log(`Successfully generated ${results.length} posts!`);
    } catch (error) {
        console.error("Failed to generate posts:", error);
        process.exit(1);
    }
}

generatePosts();
