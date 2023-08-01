export const articleTempltes = [
{id: 0,
name: 'techPost',
markdown:
`# Basics of Markdown
Markdown is the most popular markup language that can be used to format documents. It can be used to create *websites*,*ebooks*,*email*,*chats in discussions forums*.

## Topics
1. Paragraphs 

    MD expects a full line space to show texts in a different line else it joins text in the same line.
2.  Text decorations

    MD can write **bold** texts, ~~italiic~~ *italic*  texts
3. Headings
    No of #'s represent the type of heading. Github will automatically add id's to headings, so the text will be automatically linked. 
    ## This is h2
    ### This is h3
4. Links

[My Github](https://github.com/bhupendra1011 "all repos") account.[Bhupendra][1] github repo.

5. Images
    Images can be used just like links. ![Alt txt](img url)

    !["cat Img"](http://placekitten.com/200/200)

    Thumbnails images can also be used which links to larger image 
    [<img src="http://placekitten.com/20/20">](http://placekitten.com/200/200)

6. Ordered and Unordered Lists

    Coding Best Practices:

    * Keep code DRY
    * Writing Unit Test cases
    * Checking cross-browser support

    Steps to merge branch:

    1. Create a branch from feature
    1. commit your changes
    1. push your changes
    1. raise a pull request

7. Code Blocks

    This is super helpful when posting any code snippet


    \`\`\`js
    const fn = () => alert("some fn");
    \`\`\`




    \`\`\`
    .hide {
        display:none
    }
    \`\`\`


    Also can show code difference


    \`\`\`
    var x = 10;
    - const counter = 0;
    + let counter = 0
    \`\`\`



8. Tables 

    Tables can be generated with headings and text alignment option

    |Stocks|Price|
    |:-----:|------:|
    |TCS|230|
    |YES Bank|500|



Cool Tips 

* [Grammarly](https://marketplace.visualstudio.com/items?itemName=znck.grammarly) extension can eliminate typo and grammar mistakes
* [ScreenTOGif](https://www.screentogif.com/) to record videos in GIF format
* Upload GIF's to [giphy](https://giphy.com/) to embed them into blog posts.
* [Stackedit](https://stackedit.io/) for Markdown Editing in Browser.
`},
{id: 1,
name: 'generalBlogPost',
markdown:
`# My First Blog Post

Published on: 2022-07-01

Welcome to my _new blog_ about learning Astro! Here, I will share my learning journey as I build a new website.

## What I've accomplished

1. **Installing Astro**: First, I created a new Astro project and set up my online accounts.

2. **Making Pages**: I then learned how to make pages by creating new \`.astro\` files and placing them in the \`src/pages/\` folder.

3. **Making Blog Posts**: This is my first blog post! I now have Astro pages and Markdown posts!

## What's next

I will finish the Astro tutorial, and then keep adding more posts. Watch this space for more to come.`},
{id: 2,
name: 'sampleMarkdown',
markdown:
`---
__Advertisement :)__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

You will like those projects!

---

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
1. bar


## Code

Inline \`code\`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


## Plugins

The killer feature of \`markdown-it\` is very effective support of
[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.


### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O


### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++


### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==Marked text==


### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

### [Custom containers](https://github.com/markdown-it/markdown-it-container)

::: warning
*here be dragons*
:::
`},
{id: 3,
name: 'sampleBlog',
markdown:
`Hello World
===========

June 30, 2018

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur dolor metus, in semper purus tempus nec. Nunc porta maximus nisi eget tempus. Maecenas tellus ligula, porttitor ut ligula vitae, porta malesuada libero.

Fusce at pharetra diam. Sed eget erat nibh. Nulla condimentum eros a nisi placerat, nec ultrices arcu dictum. Vestibulum nec elementum mi, id tempor ligula. Etiam ut lectus ac quam facilisis sodales. Donec laoreet justo id diam aliquet aliquet. Vivamus arcu est, varius in erat non, pharetra pulvinar magna. Fusce quis elementum nulla.

Nullam tristique ante quis gravida aliquet. Donec elementum, leo eu interdum mattis, erat quam vestibulum nunc, nec convallis eros risus ut enim. Sed maximus odio tincidunt velit congue molestie. Nunc in pharetra eros, id pulvinar justo. Pellentesque quis accumsan leo. Praesent efficitur magna a posuere viverra. Morbi sit amet tincidunt mauris. Vestibulum sed maximus felis. Proin in tellus eu nisi dictum posuere eu id felis. Donec eget mi sit amet neque efficitur suscipit ut ut neque. Vivamus egestas, augue vitae vestibulum feugiat, lorem elit lobortis nulla, eget ornare arcu ipsum ac lacus. Proin a suscipit ligula, non facilisis nibh. Nunc et eros magna.

> Aenean quis nisi eros. Praesent a libero et ante sagittis dictum eget id ipsum. Duis sit amet bibendum justo. Morbi faucibus vehicula bibendum. Praesent ornare hendrerit commodo. Praesent sit amet nisi mauris. Aenean maximus pharetra lacinia. Praesent efficitur erat id dolor laoreet rhoncus. Cras eu efficitur arcu. Nunc pretium, nunc sit amet rutrum molestie, arcu nisi tempus ligula, eu dapibus leo tortor in quam.

Vivamus viverra id ipsum nec hendrerit. Fusce mollis enim et ultricies varius. Nam at dictum augue, id dictum augue. Fusce laoreet purus id iaculis cursus. Donec non velit est. Integer pellentesque viverra sapien, id rhoncus ipsum dictum ac. Aliquam vel maximus tortor, vitae interdum turpis. Etiam egestas elementum massa, id dictum magna suscipit vel. Curabitur mi tellus, pharetra eget nisi vitae, blandit vulputate nibh. Aenean tincidunt purus eu feugiat pulvinar. Maecenas quis laoreet lorem, a molestie urna. Cras iaculis justo elit, nec venenatis ante sollicitudin a. Cras eu pellentesque arcu, sit amet auctor felis.

    $(document).ready(function() {
        console.log('Welcome!');
    })

Curabitur non blandit dui. Maecenas in ipsum nec leo pellentesque sodales et nec quam. Ut ut facilisis metus, sit amet aliquam nibh. Quisque blandit dui quis augue dictum vehicula.

Share This Post
---------------

[](https://www.facebook.com/sharer/sharer.php?u=https://ryanfitzgerald.github.io/devblog/hello-world/)[](https://twitter.com/intent/tweet?text=Hello%20World&url=https://ryanfitzgerald.github.io/devblog/hello-world/)[](https://www.linkedin.com/shareArticle?mini=true&url=https://ryanfitzgerald.github.io/devblog/hello-world/&title=Hello%20World)[](mailto:?subject=Hello%20World&body=https://ryanfitzgerald.github.io/devblog/hello-world/)

[← My Second Post!](/devblog/another-new-post/)[Welcome to the Blog! →](/devblog/welcome-to-the-blog/)
`}
]