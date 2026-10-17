import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',timeout:45000,workers:1,
 outputDir:'.local/browser-results',reporter:'list',
 use:{baseURL:'http://127.0.0.1:5181',reducedMotion:'reduce',trace:'retain-on-failure'},
 webServer:{command:'npm run dev -- --port 5181 --strictPort',url:'http://127.0.0.1:5181',reuseExistingServer:!process.env.CI},
 projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'firefox',use:{browserName:'firefox',...(process.env.FIREFOX_PATH?{launchOptions:{executablePath:process.env.FIREFOX_PATH}}:{})}},{name:'webkit',use:{browserName:'webkit'}}],
});
