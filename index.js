const express = require('express'); 
const app = express();    
const port = 5000;                  

const puppeteer = require('puppeteer');

var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: true }));


async function getWebContent(url) {
    console.log('getWebContent called')
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36')
    await page.goto(url, {waitUntil: 'networkidle0'});
    // const html = await page.content(); 

    const html = await page.evaluate(() => {
        document.querySelectorAll('script').forEach(function(node){
            node.remove();
        })
        return document.querySelector('*').outerHTML;
    });

    await browser.close();
    return html;
  }



app.post('/cache_page', async (req, res) => { 
    console.log('cache_page - POST called');

    var targetUrl = req.body.targetUrl;
    console.log('targetUrl: ' + targetUrl);
    var mutatedTargetUrl = targetUrl;
    var mutatedTargetUrl = 'http://sbtokyorc226jul2022.service-now/kb/swarnim' + targetUrl.substring(targetUrl.indexOf('http://sbtokyorc226jul2022.service-now/kb') + 24,);

    var htmlContent = '';
    if (targetUrl){
        htmlContent = await getWebContent(mutatedTargetUrl);
        console.log("htmlContent: " + htmlContent.substring(0,10));
    }
    res.send(200, { message: 'ok', htmlContent: htmlContent });
});

app.get('/cache_page', (req, res) => { 
    console.log('cache_page - GET called');
    res.send(200, { message: 'ok' });
});


app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}...`); 
});





