// const { SitemapStream, streamToPromise } = require('sitemap');
// const { createWriteStream } = require('fs');
//
// const sitemap = new SitemapStream({ hostname: 'https://topdental.te.ua' });
//
// sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
// sitemap.write({ url: '/about', changefreq: 'weekly', priority: 0.8 });
// sitemap.write({ url: '/services', changefreq: 'weekly', priority: 0.8 });
// sitemap.write({ url: '/contacts', changefreq: 'weekly', priority: 0.8 });
//
// sitemap.end();
//
// streamToPromise(sitemap)
//     .then((data) => {
//         createWriteStream('./public/sitemap.xml').write(data);
//         console.log('Sitemap has been generated!');
//     })
//     .catch((err) => console.error('Error creating sitemap', err));