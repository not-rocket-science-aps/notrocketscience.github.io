import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const PORT = process.argv[2] || 3000;
const ROOT = new URL('.', import.meta.url).pathname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml':  'application/xml; charset=utf-8',
    '.txt':  'text/plain; charset=utf-8',
    '.vcf':  'text/vcard; charset=utf-8',
    '.ico':  'image/x-icon',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.woff2':'font/woff2',
    '.woff': 'font/woff',
};

async function resolve(pathname) {
    let file = join(ROOT, decodeURIComponent(pathname));
    try {
        const s = await stat(file);
        if (s.isDirectory()) file = join(file, 'index.html');
    } catch {}
    return file;
}

createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const file = await resolve(url.pathname);

    try {
        const body = await readFile(file);
        const ext = extname(file);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(body);
    } catch {
        const body = await readFile(join(ROOT, '404.html')).catch(() => '404');
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(body);
    }
}).listen(PORT, () => {
    console.log(`\n  Not Rocket Science™ — http://localhost:${PORT}\n`);
});
