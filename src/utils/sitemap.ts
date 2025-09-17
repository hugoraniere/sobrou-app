import { BlogService } from '@/services/blogService';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl = 'https://sobrou.app';
  
  private staticPages: SitemapUrl[] = [
    {
      loc: this.baseUrl,
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: `${this.baseUrl}/blog`,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: `${this.baseUrl}/suporte`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: `${this.baseUrl}/auth`,
      changefreq: 'monthly',
      priority: 0.6
    }
  ];

  async generateSitemap(): Promise<string> {
    const urls: SitemapUrl[] = [...this.staticPages];
    
    try {
      // Get all blog posts using instance method
      const blogService = new BlogService();
      const blogPosts = await blogService.getPublicBlogPostsByCategory(undefined, 1000, 0);
      
      blogPosts.forEach(post => {
        urls.push({
          loc: `${this.baseUrl}/blog/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.6
        });
      });
      
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }

    return this.generateXml(urls);
  }

  private generateXml(urls: SitemapUrl[]): string {
    const urlsXml = urls.map(url => {
      let urlXml = `    <url>\n      <loc>${url.loc}</loc>\n`;
      
      if (url.lastmod) {
        urlXml += `      <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        urlXml += `      <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        urlXml += `      <priority>${url.priority}</priority>\n`;
      }
      
      urlXml += `    </url>`;
      return urlXml;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }

  async generateRobotsTxt(): Promise<string> {
    return `User-agent: *
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Block admin and auth pages
Disallow: /admin
Disallow: /auth
Disallow: /dashboard`;
  }
}