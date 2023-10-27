#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { gzipSize } from 'gzip-size';

const url = process.argv[2] || "https://www.npmjs.com/";

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
    });
    const page = await browser.newPage();

    const sizes = {
        js: {
            count: 0,
            raw: 0,
            gzip: 0,
        },
        css: {
            count: 0,
            raw: 0,
            gzip: 0,
        },
    }

    // Listen to network requests
    page.on('response', async (response) => {
        const url = response.url();
        const type = response.request().resourceType();

        if (type === 'script') {
            const content = (await response.text());
            sizes.js.raw += content.length;
            sizes.js.gzip += await gzipSize(content);
            sizes.js.count++;
        }
        else if (type === 'stylesheet') {
            const content = (await response.text());
            sizes.css.raw += content.length;
            sizes.css.gzip += await gzipSize(content);
            sizes.css.count++;
        }
    });

    await page.goto(url);

    await browser.close();

    console.log(`Stats for ${url}`);
    console.log(`JavaScript download size (${sizes.js.count} file${sizes.js.count === 1 ? '' : 's'})`);
    console.log(`Raw size: ${sizes.js.raw} bytes`);
    console.log(`Gzip size: ${sizes.js.gzip} bytes`);
    console.log(``);
    console.log(`CSS download size (${sizes.css.count} file${sizes.css.count === 1 ? '' : 's'})`);
    console.log(`Raw size: ${sizes.css.raw} bytes`);
    console.log(`Gzip size: ${sizes.css.gzip} bytes`);
})()