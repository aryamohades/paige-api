# Paige
Build web page scrapers and web crawlers that run in the cloud. No confusing setup necessary; just create an endpoint, point it at a url, and paste in your page script.

**Features**
* Use JQuery or Underscore as needed. They are injected into the requested page dynamically.
* Tasks can be configured to run synchronously or asynchronously. 
* View the status of any running task at any point through the dashboard.
* Tasks can be scheduled to run automatically at a certain time or repeatedly at certain intervals.
* Take a screenshot by for debugging by passing in an additional query parameter.
* Preview the response data to debug your page script.

You can also request raw visual content information as seen below.
<br><br><br><br>
Example visual response for www.youtube.com
<br><br>
![Alt text](build/example.png?raw=true "Title")
<br><br><br>
Example visual content data response for www.aryamohades.com
<br><br>
<pre>
{
    "title": "Arya Mohades",
    "url": "https://www.aryamohades.com/",
    "pageWidth": 1024,
    "pageHeight": 13866,
    "maxDepth": 4,
    "numElements": 80,
    "elements": [
        {
            "isHidden": false,
            "tagName": "body",
            "className": "",
            "size": {
                "width": 1024,
                "height": 13746
            },
            "position": {
                "x": 0,
                "y": 60
            },
            "id": 0,
            "parentId": null,
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                1
            ],
            "text": "  My Journey to Build the Fastest Website in the World   Arya Mohades  Hello. This probably isn't the fastest website in the world. 'Fastest' is a broad term, and there's a lot more to consider besides just milliseconds (For example, page size). I probably should have titled this page: 'The Most Optimized Website' but that doesn't sound as cool and probably still wouldn't be true. I am a software developer working a lot on the frontend side of things. In this time, I have seen some alarming things in frontend development such as ignoring best practices and not implementing easy performance optimizations.This is not a visually stunning website. There are no fancy fonts or images that fly in as you scroll down. There's nothing wrong with those things, but the purpose of this website is to show a different side of frontend development that focuses mainly on performance (By performance, I mean mostly the time to first byte and content download time. Performance after the page has fully loaded involves broader topics like writing efficient JavaScript). So, we will be focusing on delivering the site to the end user as quickly and as efficiently as possible. \"Gotta go fast!\"I have witnessed an epidemic of websites with beautiful templates but poor performance. I believe what is under the hood is equally as beautiful as the exterior. A beautiful but slow website is like a supercar without an engine. I'm going to outline some of the techniques I used to make this website go very fast. I will start with bigger optimizations and then go into some micro-optimizations later on.Content Delivery Network and Varnish Cache One of the easiest and best performance improvements is to use a CDN or Content Delivery Network. A CDN takes your website and distributes it onto a network of servers located in different geographical regions. Then, when a user makes a request to view your site, that request is served by the closest physical server. This dramatically reduces the amount of time it takes for data to travel on the wire from the server to the client. This is a must-have, especially if you intend to serve global traffic. I looked into a few options and I settled on using the CDN service provided by Fastly because it had a free tier and also had other important features I needed. A serious image of a distributed network because there's nothing funny about using a CDNOne of those important features is Varnish Cache. Varnish Cache is a caching HTTP reverse proxy. In simpler terms, once installed and configured, Varnish acts as a middle layer between each HTTP request and your server, caching the responses to those requests. That way, if the same request is made again, the client is served the cached version of the response. This will typically have a dramatic impact on time to first byte (Time to first byte or TTFB is simply the amount of time it takes for the first byte of data to arrive from the server after making the request). Luckily, Fastly had a sane Varnish configuration right out of the box, so no additional work was needed there. You can verify that the website is being served by Varnish by looking for Via: 1.1 varnish in the response headers for the document request. You can read more about Varnish in this introduction to varnish cache where it is mentioned that Varnish can result in a 30x-100x speed up in some cases. Note: I am also uploading the images used on this site to Cloudinary, a CDN designed specifically for images.Static vs Dynamic Website Right away, I had to decide whether this page would be static or dynamic. A static page simply serves static content, or content that doesn't change. This can be some combination of HTML, CSS, and JavaScript files. A dynamic web server such as Node.js + Express might involve some database queries to fetch some information, and some server side rendering to build up the templates before sending the response. This dynamic rendering involves some overhead in addition to the overhead of a framework like Express. This site is fully static, so I went with a static webpage hosted on Amazon Web Services S3 (Simple Storage Service). I chose S3 for the simplicity and the price (free, unless this page goes viral). Most people use S3 to store and serve static content such as images or scripts, but an S3 bucket can be easily configured to serve a static website as well.Gzipping There's a lot of preoptimization that goes into this site, before the file is even uploaded to S3. One of those optimizations is gzipping the main index.html. Gzipping is a form of data compression. In order to get the browser to recognize this format and decompress the response, I set the Content-Encoding header of the file to 'gzip' through the AWS management console. hamsters.zipIn a dynamic web application, the server will typically gzip the response before sending it out. With Node.js and Express, this can be done using an npm package called compression. This process of gzipping on the fly incurs some overhead. With a static web page, I can avoid this overhead by simply gzipping the file before uploading it. I installed the gzip program using Homebrew and simply ran it on the index.html file from the terminal, resulting in a smaller file size.Minimize or Eliminate Render-Blocking Resources What is meant by 'render-blocking resource'? To understand this, we have to understand how the browser parses and interprets HTML and CSS. Before anything is rendered on a web page, the browser must go through a process to construct the CSSOM or the CSS object model. The reason for blocking the rendering is because a lot of websites would be completely unusable without CSS, and there would be a 'flash of unstyled content' while the browser is downloading and parsing CSS resources, which creates a poor user experience. Right away, I found a built-in system font that looked acceptable to me. This way, I avoided downloading an external font (Fonts are relatively large).In addition to CSS, any JavaScript resources in the <head> of the document without the async keyword on them will be also treated as a render-blocking resource. When linking to an external JavaScript resource in the <head> of the document, you should use some combination of the keywords async and defer on that JavaScript resource. If you use async, the browser will begin downloading the JavaScript file right away while the rest of the page content continues downloading. Once the JavaScript is fully downloaded, it will be executed immediately regardless of whether the document has been fully parsed yet. So, if you need to interact with the DOM in this JavaScript, you will also have to use the keyword defer, to tell the browser to only execute the script once the document has been fully processed (This is the equivalent of putting your JavaScript file at the end of the <body>, but comes with the benefit of starting the content download sooner). If you don't use async and you put the JavaScript resource in the <head>, it will be treated as a render-blocking resources and will hurt page performance. Exaggeration to make a pointNow, I have mentioned all of this just to arrive at this point. You should eliminate any render-blocking resource altogether if possible. Take a step back and ask whether you really need to include a certain stylesheet or JavaScript file. Seriously, youmightnotneedjquery.com. If you only use a small part of a particular library, see if you can pull that functionality out and possibly inline it. By inlining, I mean putting the content of the CSS or JavaScript directly inside the HTML, rather than linking to a URL to download it from. This will eliminate the network request required to go fetch that resource and will allow the browser to begin parsing it much sooner. If you inspect the source of this page, you will see that I have inlined all of the CSS for the page in the <head> of the document. It's not a lot of CSS, which is even more reason to inline it. If my CSS is thousands of lines long, I would first ask myself if that's completely necessary and whether my CSS could be more disciplined (You lack discipline!). If it is necessary, then it's ok to link to an external stylesheet because it will greatly reduce your document size and the browser will cache it anyway after the first visit. If you have tons of JavaScript included on your page, make sure it is bundled as a single file (tools like Webpack will do this for you) so it can all be fetched in a single request.My final point about CSS and JavaScript is to make sure to minify and uglify your CSS and JavaScript. This is one of the easiest things you can do and will reduce your file sizes, allowing them to be downloaded faster. Minification is just removing spaces and newlines that have no effect on the semantics of the page. These spaces and newlines serve to simply make the code more readable, which has no purpose when the site is in production. Uglification serves a similar purpose in that it shortens variable names while not impacting the output of your program. Again, having descriptive variable names only helps during development and has no purpose in production. Obviously, you want to continue using nice variable names and spaces in development, so you should have a script or tool that does the minification and uglification process for you as part of the build process. Lastly, one overlooked thing is minifying the HTML itself. This can give you a quick 10-15% file size reduction of your HTMl files. If you want a good example of all of this, you can go inspect the source of Google's homepage and see that it is completely incomprehensible. Google has implemented all of the above optimizations and if there's any page that should be optimized to the extreme, it's Google's homepage. Minified horse vs regular horseYou will notice on this page that my CSS class names are only one character long. I built a tool to analyze my CSS and shorten my class names, which is a serious micro-optimization that won't have a huge impact on performance and not something I would necessarily recommend. However, being extreme was the point of making this page, so it was necessary in this case.Overall, just remember to deliver the CSS and JavaScript to the page as quickly and efficiently as possible. Here are three easy ways to help do that: 1) Eliminate unused parts of CSS or JavaScript. 2) Inline small amounts of CSS and JavaScript. 3) Minify and uglify your CSS, JavaScript, and HTML.Other Interesting Ideas That I Did Not Implement There are so many more interesting ideas to explore that I did not have a chance to use on this site. The InstantClick library is one of those ideas. From what I understand, InstantClick will cause the browser to automatically begin fetching the contents of a page in the background if the user hovers over a link for a small period of time. That way, the browser is able to cache the results of that new page before the user even click's on the link. When the user actually does click the link, it will load much more quickly, as all the contents have been cached already. I think that is hilarious and a bit of a gimmick, but it's super interesting nonetheless. I think one or more popular browsers had implemented this feature natively but it was a bit controversial.Another idea, perhaps more legitimate, is the AMP Project from Google. AMP or Accelerated Mobile Pages Project is a special type of web page that imposes a series of restrictions (For example, all JavaScript must be async, all CSS must be inline, etc.). Essentially, it requires a lot of the ideas mentioned above. If your page qualifies for AMP, then there is actually a special cache called the Google AMP Cache, which is a content delivery network that ensures your document, your JavaScript, and your images all load from the same origin using HTTP 2.0 for minimal load times. The result is that pages load instantly with an almost native application feel to them. What using AMP feels likeAMP is a great idea that forces developers to stick to best practices. I think this website already implements a lof of the AMP requirements, so it probably would not be too difficult to convert it to an AMP page.Now What? And Some Metrics (Showing Off) After implementing all of these optimizations, it feels like the page is delivered in an instant. One of the biggest remaining bottleneck is the speed of light. Someone accessing this site in a very remote area might still experience average wait times due to the time it takes for electrons to flow on the wire from the CDN server location to their computer. Unfortunately, there's not much I can do about this because I depend on the CDN service I have chosen to do this for me. From here, I will continue researching and exploring new ways to cut corners and optimize this page even further. Here are some metrics Pingdom: This is why I joke about having the fastest page in the world. Testing from different locations such as Sweden, New York, or Australia gives nearly identical stats due to the Fastly CDN. And here are the metrics from Google PageSpeed Insights: I hope this page was informative or at least entertaining. Also, I hope it shows that proper frontend development involves much more than just editing CSS to change font sizes and colors.Keep learning and keep programming. Me typing this article",
            "depth": 0
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "c",
            "size": {
                "width": 682,
                "height": 13746
            },
            "position": {
                "x": 0,
                "y": 60
            },
            "id": 1,
            "parentId": "0",
            "numChildren": 3,
            "borderRadius": "0px",
            "children": [
                2,
                78,
                83
            ],
            "text": " My Journey to Build the Fastest Website in the World   Arya Mohades  Hello. This probably isn't the fastest website in the world. 'Fastest' is a broad term, and there's a lot more to consider besides just milliseconds (For example, page size). I probably should have titled this page: 'The Most Optimized Website' but that doesn't sound as cool and probably still wouldn't be true. I am a software developer working a lot on the frontend side of things. In this time, I have seen some alarming things in frontend development such as ignoring best practices and not implementing easy performance optimizations.This is not a visually stunning website. There are no fancy fonts or images that fly in as you scroll down. There's nothing wrong with those things, but the purpose of this website is to show a different side of frontend development that focuses mainly on performance (By performance, I mean mostly the time to first byte and content download time. Performance after the page has fully loaded involves broader topics like writing efficient JavaScript). So, we will be focusing on delivering the site to the end user as quickly and as efficiently as possible. \"Gotta go fast!\"I have witnessed an epidemic of websites with beautiful templates but poor performance. I believe what is under the hood is equally as beautiful as the exterior. A beautiful but slow website is like a supercar without an engine. I'm going to outline some of the techniques I used to make this website go very fast. I will start with bigger optimizations and then go into some micro-optimizations later on.Content Delivery Network and Varnish Cache One of the easiest and best performance improvements is to use a CDN or Content Delivery Network. A CDN takes your website and distributes it onto a network of servers located in different geographical regions. Then, when a user makes a request to view your site, that request is served by the closest physical server. This dramatically reduces the amount of time it takes for data to travel on the wire from the server to the client. This is a must-have, especially if you intend to serve global traffic. I looked into a few options and I settled on using the CDN service provided by Fastly because it had a free tier and also had other important features I needed. A serious image of a distributed network because there's nothing funny about using a CDNOne of those important features is Varnish Cache. Varnish Cache is a caching HTTP reverse proxy. In simpler terms, once installed and configured, Varnish acts as a middle layer between each HTTP request and your server, caching the responses to those requests. That way, if the same request is made again, the client is served the cached version of the response. This will typically have a dramatic impact on time to first byte (Time to first byte or TTFB is simply the amount of time it takes for the first byte of data to arrive from the server after making the request). Luckily, Fastly had a sane Varnish configuration right out of the box, so no additional work was needed there. You can verify that the website is being served by Varnish by looking for Via: 1.1 varnish in the response headers for the document request. You can read more about Varnish in this introduction to varnish cache where it is mentioned that Varnish can result in a 30x-100x speed up in some cases. Note: I am also uploading the images used on this site to Cloudinary, a CDN designed specifically for images.Static vs Dynamic Website Right away, I had to decide whether this page would be static or dynamic. A static page simply serves static content, or content that doesn't change. This can be some combination of HTML, CSS, and JavaScript files. A dynamic web server such as Node.js + Express might involve some database queries to fetch some information, and some server side rendering to build up the templates before sending the response. This dynamic rendering involves some overhead in addition to the overhead of a framework like Express. This site is fully static, so I went with a static webpage hosted on Amazon Web Services S3 (Simple Storage Service). I chose S3 for the simplicity and the price (free, unless this page goes viral). Most people use S3 to store and serve static content such as images or scripts, but an S3 bucket can be easily configured to serve a static website as well.Gzipping There's a lot of preoptimization that goes into this site, before the file is even uploaded to S3. One of those optimizations is gzipping the main index.html. Gzipping is a form of data compression. In order to get the browser to recognize this format and decompress the response, I set the Content-Encoding header of the file to 'gzip' through the AWS management console. hamsters.zipIn a dynamic web application, the server will typically gzip the response before sending it out. With Node.js and Express, this can be done using an npm package called compression. This process of gzipping on the fly incurs some overhead. With a static web page, I can avoid this overhead by simply gzipping the file before uploading it. I installed the gzip program using Homebrew and simply ran it on the index.html file from the terminal, resulting in a smaller file size.Minimize or Eliminate Render-Blocking Resources What is meant by 'render-blocking resource'? To understand this, we have to understand how the browser parses and interprets HTML and CSS. Before anything is rendered on a web page, the browser must go through a process to construct the CSSOM or the CSS object model. The reason for blocking the rendering is because a lot of websites would be completely unusable without CSS, and there would be a 'flash of unstyled content' while the browser is downloading and parsing CSS resources, which creates a poor user experience. Right away, I found a built-in system font that looked acceptable to me. This way, I avoided downloading an external font (Fonts are relatively large).In addition to CSS, any JavaScript resources in the <head> of the document without the async keyword on them will be also treated as a render-blocking resource. When linking to an external JavaScript resource in the <head> of the document, you should use some combination of the keywords async and defer on that JavaScript resource. If you use async, the browser will begin downloading the JavaScript file right away while the rest of the page content continues downloading. Once the JavaScript is fully downloaded, it will be executed immediately regardless of whether the document has been fully parsed yet. So, if you need to interact with the DOM in this JavaScript, you will also have to use the keyword defer, to tell the browser to only execute the script once the document has been fully processed (This is the equivalent of putting your JavaScript file at the end of the <body>, but comes with the benefit of starting the content download sooner). If you don't use async and you put the JavaScript resource in the <head>, it will be treated as a render-blocking resources and will hurt page performance. Exaggeration to make a pointNow, I have mentioned all of this just to arrive at this point. You should eliminate any render-blocking resource altogether if possible. Take a step back and ask whether you really need to include a certain stylesheet or JavaScript file. Seriously, youmightnotneedjquery.com. If you only use a small part of a particular library, see if you can pull that functionality out and possibly inline it. By inlining, I mean putting the content of the CSS or JavaScript directly inside the HTML, rather than linking to a URL to download it from. This will eliminate the network request required to go fetch that resource and will allow the browser to begin parsing it much sooner. If you inspect the source of this page, you will see that I have inlined all of the CSS for the page in the <head> of the document. It's not a lot of CSS, which is even more reason to inline it. If my CSS is thousands of lines long, I would first ask myself if that's completely necessary and whether my CSS could be more disciplined (You lack discipline!). If it is necessary, then it's ok to link to an external stylesheet because it will greatly reduce your document size and the browser will cache it anyway after the first visit. If you have tons of JavaScript included on your page, make sure it is bundled as a single file (tools like Webpack will do this for you) so it can all be fetched in a single request.My final point about CSS and JavaScript is to make sure to minify and uglify your CSS and JavaScript. This is one of the easiest things you can do and will reduce your file sizes, allowing them to be downloaded faster. Minification is just removing spaces and newlines that have no effect on the semantics of the page. These spaces and newlines serve to simply make the code more readable, which has no purpose when the site is in production. Uglification serves a similar purpose in that it shortens variable names while not impacting the output of your program. Again, having descriptive variable names only helps during development and has no purpose in production. Obviously, you want to continue using nice variable names and spaces in development, so you should have a script or tool that does the minification and uglification process for you as part of the build process. Lastly, one overlooked thing is minifying the HTML itself. This can give you a quick 10-15% file size reduction of your HTMl files. If you want a good example of all of this, you can go inspect the source of Google's homepage and see that it is completely incomprehensible. Google has implemented all of the above optimizations and if there's any page that should be optimized to the extreme, it's Google's homepage. Minified horse vs regular horseYou will notice on this page that my CSS class names are only one character long. I built a tool to analyze my CSS and shorten my class names, which is a serious micro-optimization that won't have a huge impact on performance and not something I would necessarily recommend. However, being extreme was the point of making this page, so it was necessary in this case.Overall, just remember to deliver the CSS and JavaScript to the page as quickly and efficiently as possible. Here are three easy ways to help do that: 1) Eliminate unused parts of CSS or JavaScript. 2) Inline small amounts of CSS and JavaScript. 3) Minify and uglify your CSS, JavaScript, and HTML.Other Interesting Ideas That I Did Not Implement There are so many more interesting ideas to explore that I did not have a chance to use on this site. The InstantClick library is one of those ideas. From what I understand, InstantClick will cause the browser to automatically begin fetching the contents of a page in the background if the user hovers over a link for a small period of time. That way, the browser is able to cache the results of that new page before the user even click's on the link. When the user actually does click the link, it will load much more quickly, as all the contents have been cached already. I think that is hilarious and a bit of a gimmick, but it's super interesting nonetheless. I think one or more popular browsers had implemented this feature natively but it was a bit controversial.Another idea, perhaps more legitimate, is the AMP Project from Google. AMP or Accelerated Mobile Pages Project is a special type of web page that imposes a series of restrictions (For example, all JavaScript must be async, all CSS must be inline, etc.). Essentially, it requires a lot of the ideas mentioned above. If your page qualifies for AMP, then there is actually a special cache called the Google AMP Cache, which is a content delivery network that ensures your document, your JavaScript, and your images all load from the same origin using HTTP 2.0 for minimal load times. The result is that pages load instantly with an almost native application feel to them. What using AMP feels likeAMP is a great idea that forces developers to stick to best practices. I think this website already implements a lof of the AMP requirements, so it probably would not be too difficult to convert it to an AMP page.Now What? And Some Metrics (Showing Off) After implementing all of these optimizations, it feels like the page is delivered in an instant. One of the biggest remaining bottleneck is the speed of light. Someone accessing this site in a very remote area might still experience average wait times due to the time it takes for electrons to flow on the wire from the CDN server location to their computer. Unfortunately, there's not much I can do about this because I depend on the CDN service I have chosen to do this for me. From here, I will continue researching and exploring new ways to cut corners and optimize this page even further. Here are some metrics Pingdom: This is why I joke about having the fastest page in the world. Testing from different locations such as Sweden, New York, or Australia gives nearly identical stats due to the Fastly CDN. And here are the metrics from Google PageSpeed Insights: I hope this page was informative or at least entertaining. Also, I hope it shows that proper frontend development involves much more than just editing CSS to change font sizes and colors.Keep learning and keep programming. Me typing this article",
            "depth": 1,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "s",
            "size": {
                "width": 600,
                "height": 13381
            },
            "position": {
                "x": 41,
                "y": 364.46875
            },
            "id": 2,
            "parentId": "1",
            "numChildren": 51,
            "borderRadius": "0px",
            "children": [
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                23,
                24,
                25,
                29,
                30,
                31,
                32,
                34,
                38,
                39,
                40,
                48,
                50,
                51,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                61,
                62,
                66,
                67,
                68,
                71,
                72,
                74,
                75,
                76,
                77
            ],
            "text": " Hello. This probably isn't the fastest website in the world. 'Fastest' is a broad term, and there's a lot more to consider besides just milliseconds (For example, page size). I probably should have titled this page: 'The Most Optimized Website' but that doesn't sound as cool and probably still wouldn't be true. I am a software developer working a lot on the frontend side of things. In this time, I have seen some alarming things in frontend development such as ignoring best practices and not implementing easy performance optimizations.This is not a visually stunning website. There are no fancy fonts or images that fly in as you scroll down. There's nothing wrong with those things, but the purpose of this website is to show a different side of frontend development that focuses mainly on performance (By performance, I mean mostly the time to first byte and content download time. Performance after the page has fully loaded involves broader topics like writing efficient JavaScript). So, we will be focusing on delivering the site to the end user as quickly and as efficiently as possible. \"Gotta go fast!\"I have witnessed an epidemic of websites with beautiful templates but poor performance. I believe what is under the hood is equally as beautiful as the exterior. A beautiful but slow website is like a supercar without an engine. I'm going to outline some of the techniques I used to make this website go very fast. I will start with bigger optimizations and then go into some micro-optimizations later on.Content Delivery Network and Varnish Cache One of the easiest and best performance improvements is to use a CDN or Content Delivery Network. A CDN takes your website and distributes it onto a network of servers located in different geographical regions. Then, when a user makes a request to view your site, that request is served by the closest physical server. This dramatically reduces the amount of time it takes for data to travel on the wire from the server to the client. This is a must-have, especially if you intend to serve global traffic. I looked into a few options and I settled on using the CDN service provided by Fastly because it had a free tier and also had other important features I needed. A serious image of a distributed network because there's nothing funny about using a CDNOne of those important features is Varnish Cache. Varnish Cache is a caching HTTP reverse proxy. In simpler terms, once installed and configured, Varnish acts as a middle layer between each HTTP request and your server, caching the responses to those requests. That way, if the same request is made again, the client is served the cached version of the response. This will typically have a dramatic impact on time to first byte (Time to first byte or TTFB is simply the amount of time it takes for the first byte of data to arrive from the server after making the request). Luckily, Fastly had a sane Varnish configuration right out of the box, so no additional work was needed there. You can verify that the website is being served by Varnish by looking for Via: 1.1 varnish in the response headers for the document request. You can read more about Varnish in this introduction to varnish cache where it is mentioned that Varnish can result in a 30x-100x speed up in some cases. Note: I am also uploading the images used on this site to Cloudinary, a CDN designed specifically for images.Static vs Dynamic Website Right away, I had to decide whether this page would be static or dynamic. A static page simply serves static content, or content that doesn't change. This can be some combination of HTML, CSS, and JavaScript files. A dynamic web server such as Node.js + Express might involve some database queries to fetch some information, and some server side rendering to build up the templates before sending the response. This dynamic rendering involves some overhead in addition to the overhead of a framework like Express. This site is fully static, so I went with a static webpage hosted on Amazon Web Services S3 (Simple Storage Service). I chose S3 for the simplicity and the price (free, unless this page goes viral). Most people use S3 to store and serve static content such as images or scripts, but an S3 bucket can be easily configured to serve a static website as well.Gzipping There's a lot of preoptimization that goes into this site, before the file is even uploaded to S3. One of those optimizations is gzipping the main index.html. Gzipping is a form of data compression. In order to get the browser to recognize this format and decompress the response, I set the Content-Encoding header of the file to 'gzip' through the AWS management console. hamsters.zipIn a dynamic web application, the server will typically gzip the response before sending it out. With Node.js and Express, this can be done using an npm package called compression. This process of gzipping on the fly incurs some overhead. With a static web page, I can avoid this overhead by simply gzipping the file before uploading it. I installed the gzip program using Homebrew and simply ran it on the index.html file from the terminal, resulting in a smaller file size.Minimize or Eliminate Render-Blocking Resources What is meant by 'render-blocking resource'? To understand this, we have to understand how the browser parses and interprets HTML and CSS. Before anything is rendered on a web page, the browser must go through a process to construct the CSSOM or the CSS object model. The reason for blocking the rendering is because a lot of websites would be completely unusable without CSS, and there would be a 'flash of unstyled content' while the browser is downloading and parsing CSS resources, which creates a poor user experience. Right away, I found a built-in system font that looked acceptable to me. This way, I avoided downloading an external font (Fonts are relatively large).In addition to CSS, any JavaScript resources in the <head> of the document without the async keyword on them will be also treated as a render-blocking resource. When linking to an external JavaScript resource in the <head> of the document, you should use some combination of the keywords async and defer on that JavaScript resource. If you use async, the browser will begin downloading the JavaScript file right away while the rest of the page content continues downloading. Once the JavaScript is fully downloaded, it will be executed immediately regardless of whether the document has been fully parsed yet. So, if you need to interact with the DOM in this JavaScript, you will also have to use the keyword defer, to tell the browser to only execute the script once the document has been fully processed (This is the equivalent of putting your JavaScript file at the end of the <body>, but comes with the benefit of starting the content download sooner). If you don't use async and you put the JavaScript resource in the <head>, it will be treated as a render-blocking resources and will hurt page performance. Exaggeration to make a pointNow, I have mentioned all of this just to arrive at this point. You should eliminate any render-blocking resource altogether if possible. Take a step back and ask whether you really need to include a certain stylesheet or JavaScript file. Seriously, youmightnotneedjquery.com. If you only use a small part of a particular library, see if you can pull that functionality out and possibly inline it. By inlining, I mean putting the content of the CSS or JavaScript directly inside the HTML, rather than linking to a URL to download it from. This will eliminate the network request required to go fetch that resource and will allow the browser to begin parsing it much sooner. If you inspect the source of this page, you will see that I have inlined all of the CSS for the page in the <head> of the document. It's not a lot of CSS, which is even more reason to inline it. If my CSS is thousands of lines long, I would first ask myself if that's completely necessary and whether my CSS could be more disciplined (You lack discipline!). If it is necessary, then it's ok to link to an external stylesheet because it will greatly reduce your document size and the browser will cache it anyway after the first visit. If you have tons of JavaScript included on your page, make sure it is bundled as a single file (tools like Webpack will do this for you) so it can all be fetched in a single request.My final point about CSS and JavaScript is to make sure to minify and uglify your CSS and JavaScript. This is one of the easiest things you can do and will reduce your file sizes, allowing them to be downloaded faster. Minification is just removing spaces and newlines that have no effect on the semantics of the page. These spaces and newlines serve to simply make the code more readable, which has no purpose when the site is in production. Uglification serves a similar purpose in that it shortens variable names while not impacting the output of your program. Again, having descriptive variable names only helps during development and has no purpose in production. Obviously, you want to continue using nice variable names and spaces in development, so you should have a script or tool that does the minification and uglification process for you as part of the build process. Lastly, one overlooked thing is minifying the HTML itself. This can give you a quick 10-15% file size reduction of your HTMl files. If you want a good example of all of this, you can go inspect the source of Google's homepage and see that it is completely incomprehensible. Google has implemented all of the above optimizations and if there's any page that should be optimized to the extreme, it's Google's homepage. Minified horse vs regular horseYou will notice on this page that my CSS class names are only one character long. I built a tool to analyze my CSS and shorten my class names, which is a serious micro-optimization that won't have a huge impact on performance and not something I would necessarily recommend. However, being extreme was the point of making this page, so it was necessary in this case.Overall, just remember to deliver the CSS and JavaScript to the page as quickly and efficiently as possible. Here are three easy ways to help do that: 1) Eliminate unused parts of CSS or JavaScript. 2) Inline small amounts of CSS and JavaScript. 3) Minify and uglify your CSS, JavaScript, and HTML.Other Interesting Ideas That I Did Not Implement There are so many more interesting ideas to explore that I did not have a chance to use on this site. The InstantClick library is one of those ideas. From what I understand, InstantClick will cause the browser to automatically begin fetching the contents of a page in the background if the user hovers over a link for a small period of time. That way, the browser is able to cache the results of that new page before the user even click's on the link. When the user actually does click the link, it will load much more quickly, as all the contents have been cached already. I think that is hilarious and a bit of a gimmick, but it's super interesting nonetheless. I think one or more popular browsers had implemented this feature natively but it was a bit controversial.Another idea, perhaps more legitimate, is the AMP Project from Google. AMP or Accelerated Mobile Pages Project is a special type of web page that imposes a series of restrictions (For example, all JavaScript must be async, all CSS must be inline, etc.). Essentially, it requires a lot of the ideas mentioned above. If your page qualifies for AMP, then there is actually a special cache called the Google AMP Cache, which is a content delivery network that ensures your document, your JavaScript, and your images all load from the same origin using HTTP 2.0 for minimal load times. The result is that pages load instantly with an almost native application feel to them. What using AMP feels likeAMP is a great idea that forces developers to stick to best practices. I think this website already implements a lof of the AMP requirements, so it probably would not be too difficult to convert it to an AMP page.Now What? And Some Metrics (Showing Off) After implementing all of these optimizations, it feels like the page is delivered in an instant. One of the biggest remaining bottleneck is the speed of light. Someone accessing this site in a very remote area might still experience average wait times due to the time it takes for electrons to flow on the wire from the CDN server location to their computer. Unfortunately, there's not much I can do about this because I depend on the CDN service I have chosen to do this for me. From here, I will continue researching and exploring new ways to cut corners and optimize this page even further. Here are some metrics Pingdom: This is why I joke about having the fastest page in the world. Testing from different locations such as Sweden, New York, or Australia gives nearly identical stats due to the Fastly CDN. And here are the metrics from Google PageSpeed Insights: I hope this page was informative or at least entertaining. Also, I hope it shows that proper frontend development involves much more than just editing CSS to change font sizes and colors.Keep learning and keep programming. Me typing this article",
            "depth": 2,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 13713.46875
            },
            "id": 3,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Me typing this article",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 360
            },
            "position": {
                "x": 41,
                "y": 13329.46875
            },
            "id": 4,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1473863792/cat.gif",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 13256.46875
            },
            "id": 5,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Keep learning and keep programming.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 128
            },
            "position": {
                "x": 41,
                "y": 13107.46875
            },
            "id": 6,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "I hope this page was informative or at least entertaining. Also, I hope it shows that proper frontend development involves much more than just editing CSS to change font sizes and colors.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "n",
            "size": {
                "width": 600,
                "height": 542
            },
            "position": {
                "x": 41,
                "y": 12520.46875
            },
            "id": 8,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531610858/metrics_insights.png",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "",
            "size": {
                "width": 600,
                "height": 64
            },
            "position": {
                "x": 41,
                "y": 12436.46875
            },
            "id": 9,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "And here are the metrics from Google PageSpeed Insights:",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 160
            },
            "position": {
                "x": 41,
                "y": 12255.46875
            },
            "id": 12,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "This is why I joke about having the fastest page in the world. Testing from different locations such as Sweden, New York, or Australia gives nearly identical stats due to the Fastly CDN.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "n",
            "size": {
                "width": 600,
                "height": 224
            },
            "position": {
                "x": 41,
                "y": 12007.46875
            },
            "id": 13,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531610522/metrics_pingdom_2.png",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "",
            "size": {
                "width": 600,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 11955.46875
            },
            "id": 14,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Here are some metrics Pingdom:",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 384
            },
            "position": {
                "x": 41,
                "y": 11550.46875
            },
            "id": 16,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "After implementing all of these optimizations, it feels like the page is delivered in an instant. One of the biggest remaining bottleneck is the speed of light. Someone accessing this site in a very remote area might still experience average wait times due to the time it takes for electrons to flow on the wire from the CDN server location to their computer. Unfortunately, there's not much I can do about this because I depend on the CDN service I have chosen to do this for me. From here, I will continue researching and exploring new ways to cut corners and optimize this page even further.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "h3",
            "className": "",
            "size": {
                "width": 600,
                "height": 64
            },
            "position": {
                "x": 41,
                "y": 11465.46875
            },
            "id": 17,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Now What? And Some Metrics (Showing Off)",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 128
            },
            "position": {
                "x": 41,
                "y": 11287.46875
            },
            "id": 18,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "AMP is a great idea that forces developers to stick to best practices. I think this website already implements a lof of the AMP requirements, so it probably would not be too difficult to convert it to an AMP page.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 11234.46875
            },
            "id": 19,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "What using AMP feels like",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 352
            },
            "position": {
                "x": 41,
                "y": 10858.46875
            },
            "id": 20,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531605779/flash.jpg",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 416
            },
            "position": {
                "x": 41,
                "y": 10401.46875
            },
            "id": 21,
            "parentId": "2",
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                22
            ],
            "text": "Another idea, perhaps more legitimate, is the AMP Project from Google. AMP or Accelerated Mobile Pages Project is a special type of web page that imposes a series of restrictions (For example, all JavaScript must be async, all CSS must be inline, etc.). Essentially, it requires a lot of the ideas mentioned above. If your page qualifies for AMP, then there is actually a special cache called the Google AMP Cache, which is a content delivery network that ensures your document, your JavaScript, and your images all load from the same origin using HTTP 2.0 for minimal load times. The result is that pages load instantly with an almost native application feel to them.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "a",
            "className": "",
            "size": {
                "width": 540,
                "height": 57
            },
            "position": {
                "x": 41,
                "y": 10404.46875
            },
            "id": 22,
            "parentId": "21",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "AMP Project from Google",
            "href": "https://www.ampproject.org/",
            "depth": 4,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 480
            },
            "position": {
                "x": 41,
                "y": 9900.46875
            },
            "id": 23,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "There are so many more interesting ideas to explore that I did not have a chance to use on this site. The InstantClick library is one of those ideas. From what I understand, InstantClick will cause the browser to automatically begin fetching the contents of a page in the background if the user hovers over a link for a small period of time. That way, the browser is able to cache the results of that new page before the user even click's on the link. When the user actually does click the link, it will load much more quickly, as all the contents have been cached already. I think that is hilarious and a bit of a gimmick, but it's super interesting nonetheless. I think one or more popular browsers had implemented this feature natively but it was a bit controversial.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "h3",
            "className": "",
            "size": {
                "width": 600,
                "height": 64
            },
            "position": {
                "x": 41,
                "y": 9815.46875
            },
            "id": 24,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Other Interesting Ideas That I Did Not Implement",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 192
            },
            "position": {
                "x": 41,
                "y": 9573.46875
            },
            "id": 25,
            "parentId": "2",
            "numChildren": 3,
            "borderRadius": "0px",
            "children": [
                26,
                27,
                28
            ],
            "text": "Overall, just remember to deliver the CSS and JavaScript to the page as quickly and efficiently as possible. Here are three easy ways to help do that: 1) Eliminate unused parts of CSS or JavaScript. 2) Inline small amounts of CSS and JavaScript. 3) Minify and uglify your CSS, JavaScript, and HTML.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "b",
            "className": "",
            "size": {
                "width": 25,
                "height": 25
            },
            "position": {
                "x": 449,
                "y": 9704.46875
            },
            "id": 26,
            "parentId": "25",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "3)",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "b",
            "className": "",
            "size": {
                "width": 25,
                "height": 25
            },
            "position": {
                "x": 526,
                "y": 9672.46875
            },
            "id": 27,
            "parentId": "25",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "2)",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "b",
            "className": "",
            "size": {
                "width": 25,
                "height": 25
            },
            "position": {
                "x": 588,
                "y": 9640.46875
            },
            "id": 28,
            "parentId": "25",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "1)",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 224
            },
            "position": {
                "x": 41,
                "y": 9328.46875
            },
            "id": 29,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "You will notice on this page that my CSS class names are only one character long. I built a tool to analyze my CSS and shorten my class names, which is a serious micro-optimization that won't have a huge impact on performance and not something I would necessarily recommend. However, being extreme was the point of making this page, so it was necessary in this case.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 9275.46875
            },
            "id": 30,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Minified horse vs regular horse",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 300
            },
            "position": {
                "x": 41,
                "y": 8951.46875
            },
            "id": 31,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531607529/horse.jpg",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 800
            },
            "position": {
                "x": 41,
                "y": 8110.46875
            },
            "id": 32,
            "parentId": "2",
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                33
            ],
            "text": "My final point about CSS and JavaScript is to make sure to minify and uglify your CSS and JavaScript. This is one of the easiest things you can do and will reduce your file sizes, allowing them to be downloaded faster. Minification is just removing spaces and newlines that have no effect on the semantics of the page. These spaces and newlines serve to simply make the code more readable, which has no purpose when the site is in production. Uglification serves a similar purpose in that it shortens variable names while not impacting the output of your program. Again, having descriptive variable names only helps during development and has no purpose in production. Obviously, you want to continue using nice variable names and spaces in development, so you should have a script or tool that does the minification and uglification process for you as part of the build process. Lastly, one overlooked thing is minifying the HTML itself. This can give you a quick 10-15% file size reduction of your HTMl files. If you want a good example of all of this, you can go inspect the source of Google's homepage and see that it is completely incomprehensible. Google has implemented all of the above optimizations and if there's any page that should be optimized to the extreme, it's Google's homepage.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "a",
            "className": "",
            "size": {
                "width": 207,
                "height": 25
            },
            "position": {
                "x": 273,
                "y": 8753.46875
            },
            "id": 33,
            "parentId": "32",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Google's homepage",
            "href": "https://www.google.com/",
            "depth": 4,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 833
            },
            "position": {
                "x": 41,
                "y": 7256.46875
            },
            "id": 34,
            "parentId": "2",
            "numChildren": 3,
            "borderRadius": "0px",
            "children": [
                35,
                36,
                37
            ],
            "text": "Now, I have mentioned all of this just to arrive at this point. You should eliminate any render-blocking resource altogether if possible. Take a step back and ask whether you really need to include a certain stylesheet or JavaScript file. Seriously, youmightnotneedjquery.com. If you only use a small part of a particular library, see if you can pull that functionality out and possibly inline it. By inlining, I mean putting the content of the CSS or JavaScript directly inside the HTML, rather than linking to a URL to download it from. This will eliminate the network request required to go fetch that resource and will allow the browser to begin parsing it much sooner. If you inspect the source of this page, you will see that I have inlined all of the CSS for the page in the <head> of the document. It's not a lot of CSS, which is even more reason to inline it. If my CSS is thousands of lines long, I would first ask myself if that's completely necessary and whether my CSS could be more disciplined (You lack discipline!). If it is necessary, then it's ok to link to an external stylesheet because it will greatly reduce your document size and the browser will cache it anyway after the first visit. If you have tons of JavaScript included on your page, make sure it is bundled as a single file (tools like Webpack will do this for you) so it can all be fetched in a single request.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 66,
                "height": 21
            },
            "position": {
                "x": 537,
                "y": 7710.46875
            },
            "id": 35,
            "parentId": "34",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "<head>",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "b",
            "className": "",
            "size": {
                "width": 68,
                "height": 25
            },
            "position": {
                "x": 366,
                "y": 7483.46875
            },
            "id": 36,
            "parentId": "34",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "inline",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "a",
            "className": "",
            "size": {
                "width": 302,
                "height": 25
            },
            "position": {
                "x": 41,
                "y": 7419.46875
            },
            "id": 37,
            "parentId": "34",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "youmightnotneedjquery.com",
            "href": "http://youmightnotneedjquery.com/",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 7203.46875
            },
            "id": 38,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Exaggeration to make a point",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 199
            },
            "position": {
                "x": 41,
                "y": 6980.46875
            },
            "id": 39,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531606868/slow.jpg",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 677
            },
            "position": {
                "x": 41,
                "y": 6262.46875
            },
            "id": 40,
            "parentId": "2",
            "numChildren": 7,
            "borderRadius": "0px",
            "children": [
                41,
                42,
                43,
                44,
                45,
                46,
                47
            ],
            "text": "In addition to CSS, any JavaScript resources in the <head> of the document without the async keyword on them will be also treated as a render-blocking resource. When linking to an external JavaScript resource in the <head> of the document, you should use some combination of the keywords async and defer on that JavaScript resource. If you use async, the browser will begin downloading the JavaScript file right away while the rest of the page content continues downloading. Once the JavaScript is fully downloaded, it will be executed immediately regardless of whether the document has been fully parsed yet. So, if you need to interact with the DOM in this JavaScript, you will also have to use the keyword defer, to tell the browser to only execute the script once the document has been fully processed (This is the equivalent of putting your JavaScript file at the end of the <body>, but comes with the benefit of starting the content download sooner). If you don't use async and you put the JavaScript resource in the <head>, it will be treated as a render-blocking resources and will hurt page performance.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 66,
                "height": 21
            },
            "position": {
                "x": 211,
                "y": 6880.46875
            },
            "id": 41,
            "parentId": "40",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "<head>",
            "depth": 4,
            "numSiblings": 6
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 66,
                "height": 21
            },
            "position": {
                "x": 380,
                "y": 6783.46875
            },
            "id": 42,
            "parentId": "40",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "<body>",
            "depth": 4,
            "numSiblings": 6
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 55,
                "height": 21
            },
            "position": {
                "x": 465,
                "y": 6430.46875
            },
            "id": 43,
            "parentId": "40",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "defer",
            "depth": 4,
            "numSiblings": 6
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 55,
                "height": 21
            },
            "position": {
                "x": 357,
                "y": 6430.46875
            },
            "id": 44,
            "parentId": "40",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "async",
            "depth": 4,
            "numSiblings": 6
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 66,
                "height": 21
            },
            "position": {
                "x": 41,
                "y": 6397.46875
            },
            "id": 45,
            "parentId": "40",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "<head>",
            "depth": 4,
            "numSiblings": 6
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 55,
                "height": 21
            },
            "position": {
                "x": 424,
                "y": 6300.46875
            },
            "id": 46,
            "parentId": "40",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "async",
            "depth": 4,
            "numSiblings": 6
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 66,
                "height": 21
            },
            "position": {
                "x": 41,
                "y": 6300.46875
            },
            "id": 47,
            "parentId": "40",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "<head>",
            "depth": 4,
            "numSiblings": 6
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 448
            },
            "position": {
                "x": 41,
                "y": 5793.46875
            },
            "id": 48,
            "parentId": "2",
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                49
            ],
            "text": "What is meant by 'render-blocking resource'? To understand this, we have to understand how the browser parses and interprets HTML and CSS. Before anything is rendered on a web page, the browser must go through a process to construct the CSSOM or the CSS object model. The reason for blocking the rendering is because a lot of websites would be completely unusable without CSS, and there would be a 'flash of unstyled content' while the browser is downloading and parsing CSS resources, which creates a poor user experience. Right away, I found a built-in system font that looked acceptable to me. This way, I avoided downloading an external font (Fonts are relatively large).",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "b",
            "className": "",
            "size": {
                "width": 89,
                "height": 25
            },
            "position": {
                "x": 453,
                "y": 5924.46875
            },
            "id": 49,
            "parentId": "48",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "CSSOM",
            "depth": 4,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "h3",
            "className": "",
            "size": {
                "width": 600,
                "height": 64
            },
            "position": {
                "x": 41,
                "y": 5708.46875
            },
            "id": 50,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Minimize or Eliminate Render-Blocking Resources",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 289
            },
            "position": {
                "x": 41,
                "y": 5369.46875
            },
            "id": 51,
            "parentId": "2",
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                52
            ],
            "text": "In a dynamic web application, the server will typically gzip the response before sending it out. With Node.js and Express, this can be done using an npm package called compression. This process of gzipping on the fly incurs some overhead. With a static web page, I can avoid this overhead by simply gzipping the file before uploading it. I installed the gzip program using Homebrew and simply ran it on the index.html file from the terminal, resulting in a smaller file size.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 121,
                "height": 21
            },
            "position": {
                "x": 111,
                "y": 5471.46875
            },
            "id": 52,
            "parentId": "51",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "compression",
            "depth": 4,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 5316.46875
            },
            "id": 53,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "hamsters.zip",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 274
            },
            "position": {
                "x": 41,
                "y": 5018.46875
            },
            "id": 54,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531604924/hamsters.jpg",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 224
            },
            "position": {
                "x": 41,
                "y": 4753.46875
            },
            "id": 55,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "There's a lot of preoptimization that goes into this site, before the file is even uploaded to S3. One of those optimizations is gzipping the main index.html. Gzipping is a form of data compression. In order to get the browser to recognize this format and decompress the response, I set the Content-Encoding header of the file to 'gzip' through the AWS management console.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "h3",
            "className": "",
            "size": {
                "width": 600,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 4700.46875
            },
            "id": 56,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Gzipping",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 544
            },
            "position": {
                "x": 41,
                "y": 4106.46875
            },
            "id": 57,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Right away, I had to decide whether this page would be static or dynamic. A static page simply serves static content, or content that doesn't change. This can be some combination of HTML, CSS, and JavaScript files. A dynamic web server such as Node.js + Express might involve some database queries to fetch some information, and some server side rendering to build up the templates before sending the response. This dynamic rendering involves some overhead in addition to the overhead of a framework like Express. This site is fully static, so I went with a static webpage hosted on Amazon Web Services S3 (Simple Storage Service). I chose S3 for the simplicity and the price (free, unless this page goes viral). Most people use S3 to store and serve static content such as images or scripts, but an S3 bucket can be easily configured to serve a static website as well.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "h3",
            "className": "",
            "size": {
                "width": 600,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 4053.46875
            },
            "id": 58,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Static vs Dynamic Website",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 64
            },
            "position": {
                "x": 41,
                "y": 3939.46875
            },
            "id": 59,
            "parentId": "2",
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                60
            ],
            "text": "Note: I am also uploading the images used on this site to Cloudinary, a CDN designed specifically for images.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "a",
            "className": "",
            "size": {
                "width": 118,
                "height": 25
            },
            "position": {
                "x": 69,
                "y": 3974.46875
            },
            "id": 60,
            "parentId": "59",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Cloudinary",
            "href": "https://cloudinary.com/",
            "depth": 4,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 317
            },
            "position": {
                "x": 41,
                "y": 3577.46875
            },
            "id": 61,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531605310/cache.jpg",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 610
            },
            "position": {
                "x": 41,
                "y": 2926.46875
            },
            "id": 62,
            "parentId": "2",
            "numChildren": 3,
            "borderRadius": "0px",
            "children": [
                63,
                64,
                65
            ],
            "text": "One of those important features is Varnish Cache. Varnish Cache is a caching HTTP reverse proxy. In simpler terms, once installed and configured, Varnish acts as a middle layer between each HTTP request and your server, caching the responses to those requests. That way, if the same request is made again, the client is served the cached version of the response. This will typically have a dramatic impact on time to first byte (Time to first byte or TTFB is simply the amount of time it takes for the first byte of data to arrive from the server after making the request). Luckily, Fastly had a sane Varnish configuration right out of the box, so no additional work was needed there. You can verify that the website is being served by Varnish by looking for Via: 1.1 varnish in the response headers for the document request. You can read more about Varnish in this introduction to varnish cache where it is mentioned that Varnish can result in a 30x-100x speed up in some cases.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "a",
            "className": "",
            "size": {
                "width": 317,
                "height": 25
            },
            "position": {
                "x": 88,
                "y": 3443.46875
            },
            "id": 63,
            "parentId": "62",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "introduction to varnish cache",
            "href": "https://varnish-cache.org/intro",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "span",
            "className": "l",
            "size": {
                "width": 121,
                "height": 21
            },
            "position": {
                "x": 79,
                "y": 3380.46875
            },
            "id": 64,
            "parentId": "62",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "1.1 varnish",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "b",
            "className": "m",
            "size": {
                "width": 38,
                "height": 19
            },
            "position": {
                "x": 41,
                "y": 3382.46875
            },
            "id": 65,
            "parentId": "62",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Via: ",
            "depth": 4,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 96
            },
            "position": {
                "x": 41,
                "y": 2809.46875
            },
            "id": 66,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "A serious image of a distributed network because there's nothing funny about using a CDN",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 362
            },
            "position": {
                "x": 41,
                "y": 2423.46875
            },
            "id": 67,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531606024/cdn.png",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 416
            },
            "position": {
                "x": 41,
                "y": 1966.46875
            },
            "id": 68,
            "parentId": "2",
            "numChildren": 2,
            "borderRadius": "0px",
            "children": [
                69,
                70
            ],
            "text": "One of the easiest and best performance improvements is to use a CDN or Content Delivery Network. A CDN takes your website and distributes it onto a network of servers located in different geographical regions. Then, when a user makes a request to view your site, that request is served by the closest physical server. This dramatically reduces the amount of time it takes for data to travel on the wire from the server to the client. This is a must-have, especially if you intend to serve global traffic. I looked into a few options and I settled on using the CDN service provided by Fastly because it had a free tier and also had other important features I needed.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "a",
            "className": "",
            "size": {
                "width": 64,
                "height": 25
            },
            "position": {
                "x": 455,
                "y": 2289.46875
            },
            "id": 69,
            "parentId": "68",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Fastly",
            "href": "https://www.fastly.com/",
            "depth": 4,
            "numSiblings": 1
        },
        {
            "isHidden": false,
            "tagName": "b",
            "className": "",
            "size": {
                "width": 307,
                "height": 25
            },
            "position": {
                "x": 245,
                "y": 2001.46875
            },
            "id": 70,
            "parentId": "68",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Content Delivery Network",
            "depth": 4,
            "numSiblings": 1
        },
        {
            "isHidden": false,
            "tagName": "h3",
            "className": "",
            "size": {
                "width": 600,
                "height": 64
            },
            "position": {
                "x": 41,
                "y": 1881.46875
            },
            "id": 71,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Content Delivery Network and Varnish Cache",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 256
            },
            "position": {
                "x": 41,
                "y": 1575.46875
            },
            "id": 72,
            "parentId": "2",
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                73
            ],
            "text": "I have witnessed an epidemic of websites with beautiful templates but poor performance. I believe what is under the hood is equally as beautiful as the exterior. A beautiful but slow website is like a supercar without an engine. I'm going to outline some of the techniques I used to make this website go very fast. I will start with bigger optimizations and then go into some micro-optimizations later on.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "i",
            "className": "",
            "size": {
                "width": 49,
                "height": 25
            },
            "position": {
                "x": 192,
                "y": 1610.46875
            },
            "id": 73,
            "parentId": "72",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "poor",
            "depth": 4,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "v",
            "size": {
                "width": 425,
                "height": 32
            },
            "position": {
                "x": 41,
                "y": 1522.46875
            },
            "id": 74,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "\"Gotta go fast!\"",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "",
            "size": {
                "width": 400,
                "height": 400
            },
            "position": {
                "x": 41,
                "y": 1098.46875
            },
            "id": 75,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531602828/sanic.png",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 352
            },
            "position": {
                "x": 41,
                "y": 705.46875
            },
            "id": 76,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "This is not a visually stunning website. There are no fancy fonts or images that fly in as you scroll down. There's nothing wrong with those things, but the purpose of this website is to show a different side of frontend development that focuses mainly on performance (By performance, I mean mostly the time to first byte and content download time. Performance after the page has fully loaded involves broader topics like writing efficient JavaScript). So, we will be focusing on delivering the site to the end user as quickly and as efficiently as possible.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "p",
            "className": "",
            "size": {
                "width": 600,
                "height": 320
            },
            "position": {
                "x": 41,
                "y": 364.46875
            },
            "id": 77,
            "parentId": "2",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Hello. This probably isn't the fastest website in the world. 'Fastest' is a broad term, and there's a lot more to consider besides just milliseconds (For example, page size). I probably should have titled this page: 'The Most Optimized Website' but that doesn't sound as cool and probably still wouldn't be true. I am a software developer working a lot on the frontend side of things. In this time, I have seen some alarming things in frontend development such as ignoring best practices and not implementing easy performance optimizations.",
            "depth": 3,
            "numSiblings": 50
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "f",
            "size": {
                "width": 600,
                "height": 111
            },
            "position": {
                "x": 41,
                "y": 213.46875
            },
            "id": 78,
            "parentId": "1",
            "numChildren": 3,
            "borderRadius": "0px",
            "children": [
                79,
                81,
                82
            ],
            "text": "  Arya Mohades ",
            "depth": 2,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "a",
            "className": "",
            "size": {
                "width": 26,
                "height": 25
            },
            "position": {
                "x": 328.5,
                "y": 299.46875
            },
            "id": 79,
            "parentId": "78",
            "numChildren": 1,
            "borderRadius": "0px",
            "children": [
                80
            ],
            "href": "https://www.github.com/aryamohades",
            "depth": 3,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "g",
            "size": {
                "width": 25,
                "height": 25
            },
            "position": {
                "x": 328.5,
                "y": 294.46875
            },
            "id": 80,
            "parentId": "79",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531465623/github.svg",
            "depth": 4,
            "numSiblings": 0
        },
        {
            "isHidden": false,
            "tagName": "div",
            "className": "",
            "size": {
                "width": 588,
                "height": 24
            },
            "position": {
                "x": 41,
                "y": 270.46875
            },
            "id": 81,
            "parentId": "78",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "Arya Mohades",
            "depth": 3,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "img",
            "className": "p",
            "size": {
                "width": 52,
                "height": 52
            },
            "position": {
                "x": 309,
                "y": 213.46875
            },
            "id": 82,
            "parentId": "78",
            "numChildren": 0,
            "borderRadius": "9999px",
            "children": [],
            "src": "https://res.cloudinary.com/taapesh/image/upload/v1531603805/me.jpg",
            "depth": 3,
            "numSiblings": 2
        },
        {
            "isHidden": false,
            "tagName": "h2",
            "className": "",
            "size": {
                "width": 600,
                "height": 66
            },
            "position": {
                "x": 41,
                "y": 124.234375
            },
            "id": 83,
            "parentId": "1",
            "numChildren": 0,
            "borderRadius": "0px",
            "children": [],
            "text": "My Journey to Build the Fastest Website in the World",
            "depth": 2,
            "numSiblings": 2
        }
    ]
}
</pre>
