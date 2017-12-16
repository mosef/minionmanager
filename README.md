<h1>Minion Manager</h1>
<p><a href="https://sheltered-coast-97878.herokuapp.com/">Minion Manager</a> is a responsive full-stack app made for Table-Top coordinators to keep track of player information between
sessions</p>

## Getting started
### Installing
```
>   git clone https://github.com/mosef/minionmanager.git
>   cd minionm-v1
>   npm install
```
### Launching
```
>   npm start
```
Then open [`localhost:8000`](http://localhost:8000) in a browser.
```
>   Demo Log In:
username: demouser
password: demo12345
```
### Testing
```
>   npm test
```

<h2>Introduction</h2>
<p>Minion Manager's focus is on retaining information from players between sessions. This app is meant to be used alongside
other applications or pen/paper methods. The app provides an 'at a glance' representation of the most important information players have to offer while removing
their ability to tamper with the data between sessions.</p>

<h2>How it Works</h2>
<h3>Record Player Data</h3>
<p>For each member of the campaign there's a block with their player name, statsheet link, email address, session number, experience, and current loot. Fill in the fields and update them when needed.</p>
<h3>Keep track of progress</h3>
<p>A sneaky rouge claims an item is in their inventory after the last session. It's been a few weeks so you can't remember if they're telling the truth. 
With Minion Manager you can quickly check their playersheet through the link they've given you, OR in the 'Current Loot' section see if you've placed it last time. 
Things like session count, exp tracking, and email addresses all provide a quick method of getting player information without providing 
players an open method of manipulating the data between sessions.</p>

<h2>Wireframes & Mockups</h2>
<a href="https://www.figma.com/file/EsVpgEAbosvr2GwXxWoZUueV/MinionManager-Mock-Up">Design Board</a>
<p>Initial wireframes were created for each page. Following that I began color scheming and developing the logo along with the landing page.</p>

<h2>Technology</h2>
<h3>Front End</h3>
<ul>
  <li>HTML5</li>
  <li>CSS3</li>
  <li>JavaScript</li>
  <li>jQuery</li>
</ul>
<h3>Back End</h3>
<ul>
  <li>Node.js + Express.js (web server)</li>
  <li>MongoDB (database)</li>
  <li><a href="https://mochajs.org/">Mocha</a> + <a href="http://chaijs.com/">Chai</a> (testing)</li>
  <li>Continuous integration and deployment with <a href="https://travis-ci.org/">Travis CI</a></li>
</ul>
<h3>Responsive</h3>
<ul>
  <li>The app is fully responsive and quickly adapts to all mobile, tablet, and desktop viewports.</li>
</ul>
<h3>Security</h3>
<ul>
  <li>User passwords are encrypted using <a href="https://github.com/dcodeIO/bcrypt.js">bcrypt.js</a>.</li>
  <li><a href="http://passportjs.org/">Passport</a> is used to control endpoints from unauthorized users.</li>
</ul>