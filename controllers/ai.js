import { Configuration, OpenAIApi } from 'openai';
import Logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger('ai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Generate content with AI
export async function generateContent(req, res) {
  try {
    console.log('=== GENERATE CONTENT REQUEST ===');
    console.log('Request body:', req.body);
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    
    const { prompt, options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ msg: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      logger.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ msg: 'OpenAI API key not configured' });
    }

    const completion = await openai.createChatCompletion({
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer helping to create engaging blog posts.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000
    });

    const content = completion.data.choices[0].message.content;

    logger.info('Content generated successfully');

    res.json({
      status: 'success',
      content
    });
  } catch (err) {
    console.error('=== AI GENERATION ERROR ===');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error response:', err.response?.data);
    logger.error('AI generation error:', err);
    return res.status(500).json({ 
      msg: err.message,
      error: err.response?.data || 'AI generation failed'
    });
  }
}

// Improve existing content
export async function improveContent(req, res) {
  try {
    const { content, improvementType } = req.body;

    const prompts = {
      grammar: 'Improve the grammar and fix any spelling errors in this content:',
      clarity: 'Rewrite this content to make it clearer and more concise:',
      engagement: 'Rewrite this content to make it more engaging and compelling:',
      professional: 'Rewrite this content in a more professional tone:'
    };

    const systemPrompt = prompts[improvementType] || prompts.grammar;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const improvedContent = completion.data.choices[0].message.content;

    logger.info(`Content improved: ${improvementType}`);

    res.json({
      status: 'success',
      content: improvedContent
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Generate title suggestions
export async function generateTitles(req, res) {
  try {
    const { content, count = 5 } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Generate ${count} compelling, SEO-friendly blog post titles based on the following content. Return only the titles, one per line.`
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const titles = completion.data.choices[0].message.content
      .split('\n')
      .filter(title => title.trim())
      .map(title => title.replace(/^\d+\.\s*/, '').trim());

    logger.info(`Generated ${titles.length} title suggestions`);

    res.json({
      status: 'success',
      titles
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Generate outline
export async function generateOutline(req, res) {
  try {
    const { topic, depth = 'detailed' } = req.body;

    const depthPrompts = {
      simple: 'Create a simple 5-point outline',
      detailed: 'Create a detailed outline with main points and subpoints',
      comprehensive: 'Create a comprehensive outline with main sections, subsections, and key points'
    };

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `${depthPrompts[depth]} for a blog post about: ${topic}`
        },
        {
          role: 'user',
          content: `Please create the outline for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const outline = completion.data.choices[0].message.content;

    logger.info(`Outline generated for: ${topic}`);

    res.json({
      status: 'success',
      outline
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Expand content
export async function expandContent(req, res) {
  try {
    const { content, targetLength } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Expand the following content to approximately ${targetLength} words while maintaining the original message and adding valuable details.`
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const expandedContent = completion.data.choices[0].message.content;

    logger.info('Content expanded successfully');

    res.json({
      status: 'success',
      content: expandedContent
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Summarize content
export async function summarizeContent(req, res) {
  try {
    const { content, length = 'medium' } = req.body;

    const lengthInstructions = {
      short: 'in 2-3 sentences',
      medium: 'in 1 paragraph',
      long: 'in 2-3 paragraphs with key points'
    };

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Summarize the following content ${lengthInstructions[length]}`
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const summary = completion.data.choices[0].message.content;

    logger.info('Content summarized successfully');

    res.json({
      status: 'success',
      summary
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Translate content
export async function translateContent(req, res) {
  try {
    const { content, targetLanguage } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Translate the following content to ${targetLanguage}. Maintain the tone and style.`
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const translatedContent = completion.data.choices[0].message.content;

    logger.info(`Content translated to ${targetLanguage}`);

    res.json({
      status: 'success',
      content: translatedContent
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Generate social media posts
export async function generateSocialPosts(req, res) {
  try {
    const { content, platforms = ['twitter', 'linkedin', 'facebook'] } = req.body;

    const posts = {};

    for (const platform of platforms) {
      const platformInstructions = {
        twitter: 'Create a Twitter/X post (max 280 characters) promoting this content',
        linkedin: 'Create a LinkedIn post promoting this content in a professional tone',
        facebook: 'Create a Facebook post promoting this content in an engaging, friendly tone'
      };

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: platformInstructions[platform]
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      posts[platform] = completion.data.choices[0].message.content;
    }

    logger.info(`Social posts generated for ${platforms.join(', ')}`);

    res.json({
      status: 'success',
      posts
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Check grammar
export async function checkGrammar(req, res) {
  try {
    const { content } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Check this content for grammar, spelling, and punctuation errors. List any issues found and provide corrections.'
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const analysis = completion.data.choices[0].message.content;

    logger.info('Grammar check completed');

    res.json({
      status: 'success',
      analysis
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Get style suggestions
export async function getStyleSuggestions(req, res) {
  try {
    const { content, targetStyle } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analyze this content and provide suggestions to make it more ${targetStyle}. Include specific examples and recommendations.`
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const suggestions = completion.data.choices[0].message.content;

    logger.info(`Style suggestions generated: ${targetStyle}`);

    res.json({
      status: 'success',
      suggestions
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Generate meta tags
export async function generateMetaTags(req, res) {
  try {
    const { content } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Based on this content, generate: 1) A meta description (150-160 characters), 2) 5-7 relevant keywords, 3) An Open Graph title'
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const metaTags = completion.data.choices[0].message.content;

    logger.info('Meta tags generated');

    res.json({
      status: 'success',
      metaTags
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Extract key points
export async function extractKeyPoints(req, res) {
  try {
    const { content, count = 5 } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Extract the ${count} most important key points from this content. Return as a bulleted list.`
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const keyPoints = completion.data.choices[0].message.content;

    logger.info(`Extracted ${count} key points`);

    res.json({
      status: 'success',
      keyPoints
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Generate call-to-action
export async function generateCTA(req, res) {
  try {
    const { articleContext, goal } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Generate 3 compelling call-to-action options that encourage readers to ${goal}. Make them engaging and action-oriented.`
        },
        {
          role: 'user',
          content: articleContext
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    const ctas = completion.data.choices[0].message.content;

    logger.info('CTAs generated');

    res.json({
      status: 'success',
      ctas
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
