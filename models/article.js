import mongoose from 'mongoose';
import marked from 'marked';
// const slugify = require('slug');
import createDomPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    article_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    images: {
        type: Object,
        required: true,
        default: "https://i.imgur.com/19i5Whc.png",
    },
    category: {
        type: [String],
    },
    archived: {
        type: Boolean,
        default: false,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    markdown: {
        type: String,
        required: true
    },
    // slug: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sanitizedHtml: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

articleSchema.pre('validate', function (next) {
    // if (this.title) {
    //     this.slug = slugify(this.title, {
    //         lower: true,
    //         strict: true
    //     })
    // }
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

const Articles = mongoose.model('Articles', articleSchema);

Articles.createIndexes();

export default Articles;
