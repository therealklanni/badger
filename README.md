# Badger

![Build Status](https://travis-ci.org/therealklanni/badger.png?branch=master)

A simple app for creating and printing out custom **[Ingress](http://ingress.com) Agent identification badges**. An end-user can set their codename and level, add a community logo, and a QR code (e.g. a link to their community for recruitment), then print the page out and laminate it.

## Demo

[http://azenl.com/badger/](http://azenl.com/badger/)

## Community customization

The template can be customized to your community to simplify badge creation for your community members.

### Instructions

Fork or clone this repository

```
git clone https://github.com/therealklanni/badger
```

Replace the `??.default-logo.png` and `??.default-qr.png` images with your own default images in the `dist/` directory

```html
<!-- Overwrite this image with your own default, or change the src to point to your image location -->
<img src="images/31a07d21.default-logo.png" alt="" class="editable badge-logo">

...

<!-- Overwrite this image with your own default, or change the src to point to your image location -->
<img src="images/77ee982d.default-qr.png" alt="" class="editable badge-qr">
```

Locate and modify the following lines in the `dist/index.html` file as follows

```html
<!-- Replace the ID (numbers) below with your G+ Page ID, do not use your community ID -->
<link href="https://plus.google.com/108910164412297335014" rel="publisher">
```

```html
<!-- Change the link here to your community link (shortened links such as goo.gl or tinyurl.com will not work here) -->
<div class="g-plusone" data-annotation="inline" data-width="225" data-href="http://therealklanni.github.io/badger/"></div>
```

```html
<!-- cut -->
<div class="span3">

	<!-- Replace the ID (numbers) below with your G+ Page ID
	     optionally delete everything between the "cut" comments to remove -->
	<div class="g-page" data-width="180" data-href="//plus.google.com/108910164412297335014"></div>

</div>
<!-- cut -->
```

```html
<!-- Replace the ID (numbers) below with your G+ Community ID -->
<div class="g-community" data-width="180" data-showtagline="true" data-href="//plus.google.com/communities/115566167479601650426"></div>
```

```html
<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script>
	var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
```

Finally, set your default values ...

```html
<script>
	// EDIT THIS PORTION FOR CUSTOM COMMUNITY DEFAULTS
	var community_defaults = {
		// Set your community name, e.g. "My Awesome Community"
		community: "COMMUNITY",
		// Set your community link, e.g. "goo.gl/xyzabc"
		link: "goo.gl/link",
		// Set to false to default to Resistance
		enlightened: true
	}
</script>
```

and upload everything from the `dist/` folder to your web hosting.

That's it, you're done!

## Contribute!

**Merge requests are encouraged and appreciated!**

You can also help out by testing the develop branch and report any bugs you find.

### Getting started

In the directory where you have cloned this repository, run

`npm install && bower install`

to get started. Please work in `develop` and make changes only in the `app` directory.

Use `grunt server` to test your work.

Please only submit pull requests to the `develop` branch. I will do the builds in master after merging from develop.

## Brought to you by

**[Open Your Mind](http://goo.gl/ResXD)** - Phoenix, Arizona's Enlightened, opening minds in the valley since 2012!

## Authors

* Kevin Lanni ([@therealklanni](http://github.com/therealklanni))

Special thanks for assistance and contributions:

[Brandon Graham](https://plus.google.com/u/0/106362086604476183109), [Nathan Brandt](https://plus.google.com/u/0/111026822348045714976), [@akkatracker](https://github.com/akkatracker), [@Neofyt](https://github.com/Neofyt), [@stillru](https://github.com/stillru)

## License

Copyright (C) 2013 Kevin Lanni

Licensed under the MIT License
