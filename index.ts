#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { gzipSize } from 'gzip-size';

const url = process.argv[2] || "https://www.npmjs.com/";
const json = process.argv[3] === "--json";

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

    const measurments: Promise<void>[] = [];

    // Listen to network requests
    page.on('response', (response) => {
        measurments.push((async () => {
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
        })());
       
    });

    await page.goto(url);

    await browser.close();

    await Promise.all(measurments);

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-US', {maximumFractionDigits: 2});
    }

    if (json) {
        console.log(JSON.stringify(sizes, null, 2));
        return;
    }
    console.log(``);
    console.log(`Stats for ${url}`);
    console.log(``);
    console.log(`JavaScript download size (${sizes.js.count} file${sizes.js.count === 1 ? '' : 's'})`);
    console.log(`Raw size: ${formatNumber(sizes.js.raw)} bytes`);
    console.log(`Gzip size: ${formatNumber(sizes.js.gzip)} bytes`);
    console.log(``);
    console.log(`CSS download size (${sizes.css.count} file${sizes.css.count === 1 ? '' : 's'})`);
    console.log(`Raw size: ${formatNumber(sizes.css.raw)} bytes`);
    console.log(`Gzip size: ${formatNumber(sizes.css.gzip)} bytes`);
    console.log(``);
    
})()