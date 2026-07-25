import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/sync-profile', async (req, res) => {
  const { linkedinUrl, memberId } = req.body;
  if (!linkedinUrl || !memberId) {
    return res.status(400).json({ error: 'Missing linkedinUrl or memberId' });
  }

  let browser;
  try {
    console.log(`Starting sync for ${memberId} via ${linkedinUrl}...`);
    browser = await puppeteer.launch({
      headless: true, // Use new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    // Set a common browser User-Agent to avoid immediate bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(linkedinUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Extract the og:image meta tag, which LinkedIn provides even on the authwall page
    const imageUrl = await page.evaluate(() => {
      const meta = document.querySelector('meta[property="og:image"]');
      return meta ? meta.getAttribute('content') : null;
    });

    if (!imageUrl) {
      throw new Error('Could not find profile image (og:image) on the page.');
    }

    console.log(`Found image URL for ${memberId}:`, imageUrl);

    // Fetch the image data
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Failed to download image from LinkedIn: ${imageRes.statusText}`);
    }
    
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to public directory, overwriting the local avatar
    const fileNameMap: Record<string, string> = {
      'prince-tagadiya': 'prince_memoji.png',
      'nisarg-patel': 'nisarg_memoji.png',
      'khushi-belani': 'khushi_memoji.png',
      'rudra-chauhan': 'rudra_memoji.png'
    };
    const fileName = fileNameMap[memberId] || `${memberId}.jpg`;
    const savePath = path.join(__dirname, 'public', fileName);
    
    fs.writeFileSync(savePath, buffer);
    console.log(`Successfully saved to ${savePath}`);

    res.json({ success: true, avatarUrl: `/${fileName}`, message: 'Profile synced successfully!' });
  } catch (error: any) {
    console.error('Error syncing profile:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend syncing server running on http://localhost:${PORT}`);
});
