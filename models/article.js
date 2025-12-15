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
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    description: {
        type: String,
    },
    images: {
        type: Object,
        required: false,
        default: { url: "https://i.imgur.com/19i5Whc.png" },
    },
    categories: {
        type: [String],
        required: false   
    },
    archived: {
        type: Boolean,
        default: false,
    },
    draft: {
        type: Boolean,
        default: false,
    },
    published: {
        type: Boolean,
        default: false,
    },
    scheduled: {
        type: Boolean,
        default: false,
    },
    scheduledDateTime: {
        type: Date,
        default: null
    },
    checked: {
        type: Boolean,
        default: false,
    },
    linkedin: {
        type: Boolean,
        default: false,
    },
    linkedinContent: {
        type: String,
        default: null,
    },
    markdown: {
        type: String,
        required: false,
        default: ''
    },
    likes: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        required: false
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [{
        text: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comments'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    sanitizedHtml: {
        type: String,
        required: false
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

// When your application starts up, Mongoose automatically calls createIndex for each defined index 
// in your schema. Mongoose will call createIndex for each index sequentially, and emit an 'index' 
// event on the model when all the createIndex calls succeeded or when there was an error. While 
// nice for development, it is recommended this behavior be disabled in production since index creation 
// can cause a significant performance impact. Disable the behavior by setting the autoIndex option of 
// your schema to false, or globally on the connection by setting the option autoIndex to false.
// Articles.createIndexes();

export default Articles;
