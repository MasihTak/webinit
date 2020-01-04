<p align="center">
  <img src="https://masihtak.com/portfolio/projects/webinit/banner.png" alt="webinit">
</p>

<p align="center">Initialize the scaffolding of a web project.</p>
<p align="center">
  <img alt="NPM version" src="https://img.shields.io/npm/v/@masihtak/webinit.svg?colorB=blue&style=flat-square">
  <img alt="License" src="https://img.shields.io/github/license/masihtak/webinit.svg?style=flat-square">
</p>
<br>

This generates the basic structure of a static website for you. It will create assets folder as well as a blank CSS file, JavaScript file, and an `index.html` with a basic setup, configured how you choose, including CSS Frameworks and some CSS Libraries, as well as jQuery. It also address the [subresource integrity](https://w3c.github.io/webappsec-subresource-integrity/) which is a standard that mitigates this by ensuring that an exact representation of a resource, and only that representation, loads and executes. 

```
Projectroot:.
│   index.html
│
└───assets
    ├───css
    │       style.css
    │
    ├───img
    └───js
            script.js
```

Installation
------------

```bash
# with npm
npm install @masihtak/webinit -g

# or with Yarn
yarn global add @masihtak/webinit
```
Usage
-----
```bash
webinit
```

Demo
-------
![webinit](https://masihtak.com/portfolio/projects/webinit/demo.gif)


Credits
-------
Special thanks to [Michael Hulet](https://github.com/raysarebest)

License
-------
MIT
