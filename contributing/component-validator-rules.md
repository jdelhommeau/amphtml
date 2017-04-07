# Contributing Validator Rules for an AMP Extended Component

This doc describes how to create a basic validator ruleset for a new [AMP
Extended Component](https://www.ampproject.org/docs/reference/components). It
does not describe every possible validator feature, but rather goes over some
of the most common rules used when creating a new AMP Extended Component.

## Example

As a concrete example, imagine you are creating an extended component that
displays an image of a cat inside an AMP document. This extended component
loads one of a set of 3 different pre-built cat images, so that the user
doesn't need to host the images on their server. Each image has a cat name:

 - Oscar
 - Chloe
 - Bella

Common usage of this extended component might look like:

```
<!-- Display the cat named 'oscar' -->
<amp-cat data-selected-cat="oscar" width=50 height=50></amp-cat>

<!-- Display a random cat -->
<amp-cat width=50 height=50></amp-cat>
```

Your first step will be writing the extended component JavaScript code. The
code will be placed in the amphtml src tree at the location of
`amphtml/extensions/amp-cat/0.1/`. However, this document only describes how to
specify validation rules for an extended component - it does not cover
implementing its runtime behavior. For the latter, see the codelab [Creating
your first AMP
Component](https://codelabs.developers.google.com/codelabs/creating-your-first-amp-component/).

## Validation Rules

Once you have built the extended component JavaScript, you are ready to submit validator
rules. This can be done in the same Pull Request, or a later Pull Request for
simplicity.

You will be creating a rules file as well as two test files. The paths for
these files, using the `<amp-cat>` example above, would be:

**Rules File**
<pre>
amphtml/extensions/<b>amp-cat</b>/0.1/validator-<b>amp-cat</b>.protoascii
</pre>

**Test Files**
<pre>
amphtml/extensions/<b>amp-cat</b>/0.1/test/validator-<b>amp-cat</b>.html
amphtml/extensions/<b>amp-cat</b>/0.1/test/validator-<b>amp-cat</b>.out
</pre>

Start with a rules file, `validator-amp-cat.protoascii`. First, a complete rules
file, followed by line-by-line explanations of what's inside.

```
#
# Copyright 2017 The AMP HTML Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the license.
#

tags: {  # amp-cat
  html_format: AMP
  tag_name: "SCRIPT"
  satisfies: "amp-cat extension .js script"
  requires: "amp-cat"
  extension_spec: {
    name: "amp-cat"
    allowed_versions: "0.1"
    allowed_versions: "latest"
  }
  attr_lists: "common-extension-attrs"
}

tags: {  # <amp-cat>
  html_format: AMP
  tag_name: "AMP-CAT"
  satisfies: "amp-cat"
  requires: "amp-cat extension .js script"
  attrs: {
    name: "data-selected-cat"
    value_regex_casei: "(oscar|chloe|bella)"
  }
  attr_lists: "extended-amp-global"
  spec_url: "https://www.ampproject.org/docs/reference/components/amp-cat"
  amp_layout: {
    supported_layouts: FILL
    supported_layouts: FIXED
    supported_layouts: FIXED_HEIGHT
    supported_layouts: FLEX_ITEM
    supported_layouts: NODISPLAY
    supported_layouts: RESPONSIVE
  }
}
```

This rules file specifies the rules for two tags:

 1. A script tag for including the `amp-cat` extended component code.
 2. The `<amp-cat>` tag itself.

Let's see it broken down:

```
#
# Copyright 2017 The AMP HTML Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the license.
#
```

This is the AMP HTML license statement required at the top of every AMP
file.

### amp-cat extended component

```
tags: {  # amp-cat extended component
```
This tells the validator that we want to define a new tag. In this case, we want
to validate a tag that looks something like the following:

> `<script async custom-element='amp-cat'`
> `        src='https://cdn.ampproject.org/v0/amp-cat-0.1.js'></script>`

```
  html_format: AMP
```

This tells the validator that this tag
should be valid in AMP format documents. Tags can also be valid in `AMP4ADS`
format documents, if the tag should be used in an ad format. If you are unsure,
leave the tag as an `AMP` format tag only for now. Additional formats can be
added later.

```
  tag_name: "SCRIPT"
```

This tells the validator that we are defining a tag with the `<script>` name.

```
  satisfies: "amp-cat extension .js script"
  requires: "amp-cat"
```

The presence of certain tags can add additional validation requirements to the
document. The presence of other tags can satisfy validation requirements. These
requirements are indicated as arbitrary strings such as the ones in these
fields. The strings are used in validation error messages to developers
debugging their amp documents.

In this case, these fields indicate that the presence of the amp-cat script tag
adds a requirement of `"amp-cat"` which as we will see below is satisfied by the
`<amp-cat>` tag. This amp-cat script tag also satisfies the requirement for
`"amp-cat extension .js script"` which will be a requirement of the `<amp-cat>`
tag below.

In this way, these two tags must both be present or neither be present on a
valid amp page. We need the `<script>` tag present if the `<amp-cat>` tag is on
the page so that the amp runtime can render the `<amp-cat>` tag. Similarly, we
require the `<amp-cat>` tag on the page if the `<script>` tag is present so that
pages don't include extra JavaScript that isn't used, ensuring a fast loading
experience.

The following fields describe the HTML Tag attributes we expect for this
`<script>` tag to be valid:

```
  extension_spec: {
    name: "amp-cat"
```
The `extension_spec` field indicates that this `<script>` tag is a new amp
extension with the "amp-cat" name. This will add requirements for the
`custom-element=amp-cat` attribute, specific values for the `src` attribute,
as well as a link to documentation on ampproject.org for all error messages.

```
    allowed_versions: "0.1"
    allowed_versions: "latest"
  }
```
These fields define a list of all allowed version numbers. Currently, almost all
extended components are at version `0.1`, and we also allow `latest` to be specified.

The combination of the `allowed_versions` and `name` fields of the
`extension_spec` define the allowed values of the `src` attribute in the
script tag, for example `src=https://cdn.ampproject.org/v0/amp-cat-0.1.js`.

```
  attr_lists: "common-extension-attrs"
}
```

That's all for the extended component script tag. Now let's look at the actual
`<amp-cat>` tag:

### `<amp-cat>` tag

```
tags: {  # <amp-cat>
```
This tells the validator that we want to define a new tag. In this case, we want
to validate a tag that looks something like the following:

> `<amp-cat data-selected-cat="oscar" width=50 height=50></amp-cat>`

```
  html_format: AMP
```
Same as the extended component tag above, this tells the validator that this tag is only
valid for AMP format documents.
```
  tag_name: "AMP-CAT"
```
This tells the validator that the html tag name is 'AMP-CAT'.

```
  satisfies: "amp-cat"
  requires: "amp-cat extension .js script"

```
These are the opposite pair of satisfy/requires as in the extended component above. In
this case we specify that this tag requires the extended component and satisfies the use
of the extended component, "amp-cat" in this case.

```
  attrs: {
    name: "data-selected-cat"
    value_regex_casei: "(oscar|chloe|bella)"
  }
```

Here we specify the rules for validating the `data-selected-cat` attribute. In
our case, we tell the validator that we want the attribute value to
case-insensitively match the regular expression of "(oscar|chloe|bella)" which
essentially means the value must be one of those 3 options.

```
  attr_lists: "extended-amp-global"
```

This adds the `media` and `noloading` attributes which are allowed on all amp
tags.

```
  spec_url: "https://www.ampproject.org/docs/reference/components/amp-cat"
```

This URL is used in validation errors to point the user debugging issues to the
reference document for this tag. For all amp-tags, the documentation URLs
will follow the above structure. Feel free to insert the URL even if it is not
yet live.

```
  amp_layout: {
    supported_layouts: FILL
    supported_layouts: FIXED
    supported_layouts: FIXED_HEIGHT
    supported_layouts: FLEX_ITEM
    supported_layouts: NODISPLAY
    supported_layouts: RESPONSIVE
  }
}
```

This section adds validation rules for the various layout options available to
amp tags. See
[AMP HTML Layout System](https://github.com/ampproject/amphtml/blob/master/spec/amp-html-layout.md)
to determine which options make sense for your tag.


### Attribute Validation Options

We saw a very simple example of an attribute validation rule above:

```
  attrs: {
    name: "data-selected-cat"
    value_regex_casei: "(oscar|chloe|bella)"
  }
```

There are many other rule types for attribute validation, some of which we will
explore here.

```
attrs: {
  name: "data-selected-cat"
}
```
By specifying no value rules, any value is allowed for this attribute.

If your code expects certain values, it is best to specify them here it will
produce helpful error messages for developers trying to debug their tag.

```
  value_regex: "(oscar|chloe|bella)"
```

Similar to `value_regex_casei`, but case-sensitive.


```
value: "oscar"
```
```
value_casei: "oscar"
```
Specifies that only "oscar" is an allowed value, as case-sensitive and
case-insensitive variants.


```
value_url: {
  allow_empty: true
  allow_relative: true
  allowed_protocol: "https"
  allowed_protocol: "http"
}
```
This specifies that the attribute value must be a valid URL or an empty string.
If an URL, it may be either "http" or "https" and may be relative. Note that in
many cases, you may only want to allow "https" as non-secure resources will
generate mixed-mode warnings when displayed from the AMP Cache.

Only one of:

 - `value`
 - `value_casei`
 - `value_regex`
 - `value_regex_casei`
 - `value_url`

may be specified for a single attribute.

Unless specified, attributes are all optional. To specify that an attribute is
mandatory, use the `mandatory` field:

```
attrs: {
  name: "data-selected-cat"
  mandatory: true
}
```

You may also specify that exactly one of a set of attributes is present:

```
attrs: {
  name: "data-selected-cat"
  mandatory_oneof: "['data-selected-cat', 'img-src']"
}
attrs: {
  name: "img-src"
  mandatory_oneof: "['data-selected-cat', 'img-src']"
  value_url: {
    allowed_protocol: "https"
  }
}
```

## Final Note on Rules

This document attempts to summarize some of the more commonly used rules for
creating validator extended components. More complex rules are possible and new rule
types can even be added as needed. If your goals are not met by the rules in
this document, [don't hesitate to
contact](https://github.com/ampproject/amphtml/blob/master/CONTRIBUTING.md#discussion-channels) the AMP developers and ask for suggestions.

