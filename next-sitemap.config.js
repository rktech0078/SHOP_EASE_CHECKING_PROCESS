/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://rushk.pk/',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/studio/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/studio/*', '/api/*'],
      },
    ],
    additionalSitemaps: [
      'https://rushk.pk/sitemap.xml',
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
}
