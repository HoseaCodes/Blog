import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema({
    headerImg: {
        type: Object,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    context: {
        type: String,
        required: true,
    },
    img: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: true,
    },
    objectives: {
        type: String,
        required: true,
    },
    subHeading: {
        type: String,
        required: true,
    },
    prototype: {
        type: String,
        required: true,
    },
    source: {
        type: [String],
        required: true,
    },
    websites: {
        type: [String],
        required: true,
    },
    app: {
        type: [String],
        required: true,
    },
    design: {
        type: String,
        required: true,
    },
    designImg: {
        type: String,
        required: true,
    },
    designColor: {
        type: Object,
        required: true,
    },
    typography: {
        type: Object,
        required: true,
    },
    uiDesignImg: {
        type: [String],
        required: true,
    },
    userFlows: {
        type: String,
        required: true,
    },
    mainFunctions: {
        type: [String],
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    version: {
        type: String,
        required: true,
    },
    tags: {
      type: [String]
    },
    date: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

export default CaseStudy;
