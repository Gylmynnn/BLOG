import fs from 'fs';
const content = fs.readFileSync('src/posts/my-software-post.md', 'utf8');
const match = content.match(/<Images[^>]*src=["']([^"']+)["']/i);
const matchMd = content.match(/!\[.*?\]\(["']?([^"'\)]+)["']?\)/i);
console.log('Component Match:', match ? match[1] : null);
console.log('MD Match:', matchMd ? matchMd[1] : null);
