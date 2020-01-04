#!/usr/bin/env node
'use strict';

// Import modules
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const url = require('url');
const inquirer = require('inquirer');
const util = require('util');

const write = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

url.appendPathToFileURL = (child, locator) => {
  return url.pathToFileURL(path.join(url.fileURLToPath(locator), child));
};


// Global variables
let rootDir;
let assetsDir;
const assets = ['css', 'js', 'img'];


function setProjectRoot(root){
  if(root instanceof url.URL){
    rootDir = root;
  }
  else if(path.normalize(root).startsWith(process.cwd())){
    rootDir = url.pathToFileURL(root);
  }
  else{
    rootDir = url.pathToFileURL(path.join(process.cwd(), root));
  }
  assetsDir = url.appendPathToFileURL("assets", rootDir);
}

setProjectRoot(process.cwd());

const jQuery = {
  v1: { link: new url.URL("https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"),
        hash: "sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ"
      },
  v2: { link: new url.URL("https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"),
        hash: "sha384-rY/jv8mMhqDabXSo+UCggqKtdmBfd3qC2/KvyTDNQ6PcUJXaxK1tMepoQda4g5vB"
      },
  v3: { link: new url.URL("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"),
        hash: "sha384-vk5WoKIaW/vJyUAd9n/wmopsmNhiy+L2Z+SBxGYnUkunIxVxAv/UtMOhba/xskxh"
      }
};

class CSSStuff{
  constructor({name, cssURL, cssHash, jsURL, jsHash}){
    function toURL(link){
      if(link instanceof url.URL){
        return link;
      }
      else if(link){
        return new url.URL(link);
      }
      else{
        return jsURL;
      }
    }

    this.name = name;
    this.css = toURL(cssURL);
    this.cssHash = cssHash;
    this.js = toURL(jsURL);
    this.jsHash = jsHash;
  }

  static [Symbol.hasInstance](obj){
    return typeof obj.name === "string" && obj.css instanceof url.URL;
  }
}


const possibleCSSFrameworks = [
  new CSSStuff({
    name: "Normalize",
    cssURL: "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css",
    cssHash: "sha384-9Z9AuAj0Xi0z7WFOSgjjow8EnNY9wPNp925TVLlAyWhvZPsf5Ks23Ex0mxIrWJzJ"
  }),
  new CSSStuff({
    name: "Bootstrap",
    cssURL: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css",
    cssHash: "sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh",
    jsURL: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/js/bootstrap.min.js",
    jsHash: "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
  }),
  new CSSStuff({
    name: "Foundation",
    cssURL: "https://cdnjs.cloudflare.com/ajax/libs/foundation/6.6.1/css/foundation.min.css",
    cssHash: "sha384-Bu0ub28kcl6HYTYOztakXlHnFhxLf10qnQMFk/g5oZwiD8eZSJrUNMB7mrGE84CZ",
    jsURL: "https://cdnjs.cloudflare.com/ajax/libs/foundation/6.6.1/js/foundation.min.js",
    jsHash: "sha384-46eXV2Ed7LP2gkns6dBJ6ad4omSsK+vm5LFatoAxiUQmuC7xQqrL5cv2cwR5YNKX"
  })
];

const possibleCSSLibraries = [
  new CSSStuff({
    name: "Font-Awesome",
    cssURL: "https://use.fontawesome.com/releases/v5.11.2/css/all.css",
    cssHash: "sha384-KA6wR/X5RY4zFAHpv/CnoG2UW1uogYfdnP67Uv7eULvTveboZJg0qUpmJZb5VqzN"
  }),
  new CSSStuff({
    name: "Ionicons",
    cssURL: "https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/css/ionicons.min.css",
    cssHash: "sha384-JCf+anPNwYp5BqNmVMsMjKdnOVw97S9+Nvk/aFibMIN2xxHQxFrtgk4selJXjrQe"
  }),
  new CSSStuff({
    name: "Animate",
    cssURL: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css",
    cssHash: "sha384-7/Tl0k65OTvDSvtuq7aPR7aa0aCz7ZKqHsbMRLxhzueldW+9MZpCe9LB1c5UBuNS"
  })
];




// Clear the terminal screen
clear();

// Banner
console.log(
  chalk.blue(
    figlet.textSync('Webinit', {
      font: 'Graffiti',
      horizontalLayout: 'full'
    })
  )
);

// Copyright
console.log(
  chalk.green('© 2019 MasihTak')
);
console.log('');


// Check whether directory exist
async function createDirectories() {
  if (fs.existsSync(assetsDir)) {
    console.log(
      chalk.yellow(`${assetsDir} already exists!`)
    );
  } else {
    // Create assets directory
    console.log(
      chalk.gray('Creating project scaffold...')
    );

    try{
      await mkdir(assetsDir);
      console.log(
        chalk.gray("Project scaffold created successfully!")
      );
    }
    catch(error){
      console.error(error);
    }

    // creating assets direcorys
    for (const asset of assets) {
      try{
        await mkdir(url.appendPathToFileURL(asset, assetsDir));
        console.log(
          chalk.gray(asset + " directory created successfully!")
        );
      }
      catch(error){
        console.error(error);
      }
    }
  }
}


async function createHTMLFile(name, framework, libraries, jQuery) {
  if (fs.existsSync(url.appendPathToFileURL('index.html', rootDir))) {
    console.log(
      chalk.yellow('index.html already exists!')
    );
  } else if(framework instanceof CSSStuff){
    let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="${framework.css.href}" integrity="${framework.cssHash}" crossorigin="anonymous">`;

  if(Array.isArray(libraries)) {
    for(const lib of libraries){
      if(lib instanceof CSSStuff){
          content += `\n  <link rel="stylesheet" href="${lib.css.href}" integrity="${lib.cssHash}" crossorigin="anonymous">`;
      }
    }
  }

content +=`
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="container">

  </div>`;

    if(jQuery.link instanceof url.URL){
      content += `\n  <script type="text/javascript" src="${jQuery.link.href}" integrity="${jQuery.hash}" crossorigin="anonymous"></script>`;
    }
    if(framework.js) {
      content += `\n  <script type="text/javascript" src="${framework.js.href}" integrity="${framework.jsHash}" crossorigin="anonymous"></script>`;
    }

    content +=`
  <script type="text/javascript" src="assets/js/script.js"></script>
</body>
</html>`;

    // Create index.html file
    try{
      await write(url.appendPathToFileURL("index.html", rootDir), content);
      console.log(
        chalk.gray('index.html created successfully!')
      );
    }
    catch(error){
      console.error(error);
    }
  }
  else{
    throw new Error(`Expected CSSFramework instance, but got ${framework}`);
  }
}

async function createFiles() {
  try{
    const CSSPath = path.join("css", "style.css");
    await write(url.appendPathToFileURL(CSSPath, assetsDir), "");
    console.log(
      chalk.gray(path.join('assets', CSSPath) + ' created successfully!')
    );
    const jsPath = path.join("js", "script.js");
    await write(url.appendPathToFileURL(jsPath, assetsDir), "");
    console.log(
      chalk.gray(path.join('assets', jsPath) + ' created successfully!')
    );
  }
  catch(error){
    console.error(error);
  }
}

const projectQuestion = {
      name: 'projectName',
      type: 'input',
      message: 'What is the name of your project?',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a name for your project.';
        }
      }
    };

const CSSFrameworks = {
      name: 'cssFramework',
      type: 'list',
      message: 'Select a CSS framework',
      choices: possibleCSSFrameworks.map((framework) => framework.name),
      defualt: 'Normalize'
    };

const CSSLibraries = {
      name: 'cssLibraries',
      type: 'checkbox',
      message: 'Choose CSS Libraries',
      choices: possibleCSSLibraries.map((library) => library.name)
    };

const jqueryVersion = {
      name: 'jQueryVer',
      type: 'list',
      message: 'Which version of jQuery do you want?',
      choices: ['v1', 'v2', 'v3', "I don't want to use jQuery"],
      defualt: 'v3'
    };


(async () => {
  const {projectName} = await inquirer.prompt(projectQuestion);
  await createDirectories();
  await createFiles();
  const {cssFramework} = await inquirer.prompt(CSSFrameworks);
  const {cssLibraries} = await inquirer.prompt(CSSLibraries);
  const {jQueryVer} = await inquirer.prompt(jqueryVersion);

  const libraryNames = [];

  for (const cssLibrary of cssLibraries) {
    libraryNames.push(cssLibrary);
  }

  await createHTMLFile(projectName, possibleCSSFrameworks.find((element) => element.name === cssFramework), libraryNames.map((name) => possibleCSSLibraries.find((lib) => lib.name == name)), jQuery[jQueryVer]);
})();
