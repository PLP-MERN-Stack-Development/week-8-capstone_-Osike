import ConstitutionArticle from '../models/ConstitutionArticle.js';
import LegalTopic from '../models/LegalTopic.js';
import FAQ from '../models/FAQ.js';
import LegalAidProvider from '../models/LegalAidProvider.js';

// Main chatbot response generation service
export const generateChatResponse = async (userMessage, session, language = 'en') => {
  try {
    const message = userMessage.toLowerCase().trim();
    
    // Initialize response object
    const response = {
      text: '',
      confidence: 0,
      matchedTopics: [],
      referencedArticles: [],
      suggestions: []
    };

    // Check for FAQ matches first
    const faqMatch = await findFAQMatch(message, language);
    if (faqMatch && faqMatch.confidence > 0.7) {
      response.text = faqMatch.answer;
      response.confidence = faqMatch.confidence;
      response.referencedArticles = faqMatch.relatedArticles;
      response.suggestions = generateSuggestions(faqMatch.category, language);
      return response;
    }

    // Check for constitution article queries
    const constitutionMatch = await findConstitutionMatch(message, language);
    if (constitutionMatch && constitutionMatch.confidence > 0.6) {
      response.text = constitutionMatch.response;
      response.confidence = constitutionMatch.confidence;
      response.referencedArticles = constitutionMatch.articles;
      response.matchedTopics = ['constitution'];
      response.suggestions = generateConstitutionSuggestions(language);
      return response;
    }

    // Check for legal topic matches
    const topicMatch = await findLegalTopicMatch(message, language);
    if (topicMatch && topicMatch.confidence > 0.6) {
      response.text = topicMatch.response;
      response.confidence = topicMatch.confidence;
      response.matchedTopics = [topicMatch.category];
      response.referencedArticles = topicMatch.relatedArticles;
      response.suggestions = generateTopicSuggestions(topicMatch.category, language);
      return response;
    }

    // Check for legal aid queries
    const legalAidMatch = await findLegalAidMatch(message, language);
    if (legalAidMatch && legalAidMatch.confidence > 0.6) {
      response.text = legalAidMatch.response;
      response.confidence = legalAidMatch.confidence;
      response.matchedTopics = ['legal-aid'];
      response.suggestions = generateLegalAidSuggestions(language);
      return response;
    }

    // Default response for unmatched queries
    response.text = generateDefaultResponse(message, language);
    response.confidence = 0.3;
    response.suggestions = generateGeneralSuggestions(language);

    return response;

  } catch (error) {
    console.error('Chatbot service error:', error);
    return {
      text: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our legal aid partners for immediate assistance.",
      confidence: 0,
      matchedTopics: [],
      referencedArticles: [],
      suggestions: []
    };
  }
};

// Find FAQ matches
const findFAQMatch = async (message, language = 'en') => {
  try {
    const faqs = await FAQ.find({ is_active: true })
      .populate('related_articles', 'article_number title');

    let bestMatch = null;
    let highestScore = 0;

    for (const faq of faqs) {
      const questionField = language === 'sw' ? 'question_sw' : 'question';
      const answerField = language === 'sw' ? 'answer_sw' : 'answer';
      const keywordsField = language === 'sw' ? 'keywords_sw' : 'keywords';
      
      const question = faq[questionField] || faq.question;
      const answer = faq[answerField] || faq.answer;
      const keywords = faq[keywordsField] || faq.keywords;
      
      const score = calculateTextSimilarity(message, question.toLowerCase());
      
      // Also check keywords
      const keywordScore = keywords.reduce((acc, keyword) => {
        return message.includes(keyword.toLowerCase()) ? acc + 0.2 : acc;
      }, 0);

      const totalScore = Math.min(score + keywordScore, 1);

      if (totalScore > highestScore && totalScore > 0.5) {
        highestScore = totalScore;
        bestMatch = {
          answer: answer,
          confidence: totalScore,
          category: faq.category,
          relatedArticles: faq.related_articles.map(a => a.article_number)
        };
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('FAQ matching error:', error);
    return null;
  }
};

// Find constitution article matches
const findConstitutionMatch = async (message, language = 'en') => {
  try {
    // Check for specific article number mentions
    const articleNumberMatch = message.match(/article\s+(\d+)/i);
    if (articleNumberMatch) {
      const articleNumber = parseInt(articleNumberMatch[1]);
      const article = await ConstitutionArticle.findOne({ article_number: articleNumber });
      
      if (article) {
        return {
          response: formatArticleResponse(article, language),
          confidence: 0.9,
          articles: [articleNumber]
        };
      }
    }

    // Check for Bill of Rights queries
    const billOfRightsKeywords = language === 'sw' 
      ? ['haki za kimsingi', 'haki za binadamu', 'haki za msingi']
      : ['bill of rights', 'human rights', 'fundamental rights'];
      
    if (billOfRightsKeywords.some(keyword => message.includes(keyword))) {
      const billOfRightsArticles = await ConstitutionArticle.findBillOfRightsArticles()
        .limit(5);
      
      return {
        response: formatBillOfRightsResponse(billOfRightsArticles, language),
        confidence: 0.8,
        articles: billOfRightsArticles.map(a => a.article_number)
      };
    }

    // Search for keyword matches in constitution
    const searchResults = await ConstitutionArticle.searchArticles(message, { limit: 3, language });
    
    if (searchResults.length > 0) {
      const topResult = searchResults[0];
      return {
        response: formatArticleResponse(topResult, language),
        confidence: 0.7,
        articles: [topResult.article_number]
      };
    }

    return null;
  } catch (error) {
    console.error('Constitution matching error:', error);
    return null;
  }
};

// Find legal topic matches
const findLegalTopicMatch = async (message, language) => {
  try {
    const topics = await LegalTopic.find({ review_status: 'approved' })
      .populate('constitution_articles', 'article_number title');

    let bestMatch = null;
    let highestScore = 0;

    for (const topic of topics) {
      let score = 0;

      // Check title similarity
      score += calculateTextSimilarity(message, topic.title.toLowerCase()) * 0.4;

      // Check keyword matches
      const keywordScore = topic.keywords.reduce((acc, keyword) => {
        return message.includes(keyword.toLowerCase()) ? acc + 0.15 : acc;
      }, 0);
      score += keywordScore;

      // Check summary similarity
      score += calculateTextSimilarity(message, topic.summary.toLowerCase()) * 0.2;

      if (score > highestScore && score > 0.5) {
        highestScore = score;
        bestMatch = {
          response: formatTopicResponse(topic),
          confidence: score,
          category: topic.category,
          relatedArticles: topic.constitution_articles.map(a => a.article_number)
        };
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('Legal topic matching error:', error);
    return null;
  }
};

// Find legal aid matches
const findLegalAidMatch = async (message, language) => {
  try {
    const legalAidKeywords = [
      'legal aid', 'free lawyer', 'pro bono', 'legal help', 'legal assistance',
      'kituo cha sheria', 'nlas', 'legal advice', 'lawyer', 'attorney'
    ];

    const isLegalAidQuery = legalAidKeywords.some(keyword => 
      message.includes(keyword.toLowerCase())
    );

    if (!isLegalAidQuery) return null;

    // Get Mombasa providers
    const mombasaProviders = await LegalAidProvider.findMombasaProviders()
      .limit(5);

    return {
      response: formatLegalAidResponse(mombasaProviders),
      confidence: 0.8
    };
  } catch (error) {
    console.error('Legal aid matching error:', error);
    return null;
  }
};

// Text similarity calculation (simplified)
const calculateTextSimilarity = (text1, text2) => {
  const words1 = text1.split(' ').filter(word => word.length > 2);
  const words2 = text2.split(' ').filter(word => word.length > 2);
  
  let matches = 0;
  words1.forEach(word => {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  });

  return words1.length > 0 ? matches / words1.length : 0;
};

// Response formatters
const formatArticleResponse = (article, language = 'en') => {
  const title = language === 'sw' && article.title_sw ? article.title_sw : article.title;
  const summary = language === 'sw' && article.summary_sw ? article.summary_sw : article.summary;
  const fullText = language === 'sw' && article.full_text_sw ? article.full_text_sw : article.full_text;
  
  const billOfRightsText = language === 'sw' 
    ? '📜 Kifungu hiki ni sehemu ya Haki za Kimsingi.'
    : '📜 This article is part of the Bill of Rights.';
    
  const moreInfoText = language === 'sw'
    ? 'Kwa maandishi kamili na taarifa zaidi, unaweza kuvinjari sehemu ya Katiba ya tovuti hii.'
    : 'For the complete text and more information, you can browse the Constitution section of this website.';
    
  const needHelpText = language === 'sw'
    ? '**Unahitaji msaada wa kisheria?** Wasiliana na:'
    : '**Need legal help?** Contact:';

  return `**${language === 'sw' ? 'Kifungu' : 'Article'} ${article.article_number}: ${title}**

${summary || fullText.substring(0, 500) + '...'}

${article.is_bill_of_rights_article ? billOfRightsText : ''}

${moreInfoText}

${needHelpText}
• Kituo Cha Sheria Mombasa: 041-2316185
• NLAS Hotline: 0800-720-440`;
};

const formatBillOfRightsResponse = (articles, language = 'en') => {
  const title = language === 'sw' 
    ? '**Haki za Kimsingi (Sura ya 4 ya Katiba)**'
    : '**The Bill of Rights (Chapter 4 of the Constitution)**';
    
  const intro = language === 'sw'
    ? 'Haki za Kimsingi zina haki zako za msingi na uhuru. Hapa kuna baadhi ya vifungu muhimu:'
    : 'The Bill of Rights contains your fundamental rights and freedoms. Here are some key articles:';
    
  const articleList = articles.slice(0, 3).map(a => 
    `• ${language === 'sw' ? 'Kifungu' : 'Article'} ${a.article_number}: ${language === 'sw' && a.title_sw ? a.title_sw : a.title}`
  ).join('\n');

  const rightsTitle = language === 'sw' ? '**Haki zako ni pamoja na:**' : '**Your rights include:**';
  const rightsText = language === 'sw' 
    ? `• Haki ya maisha na usalama
• Usawa na uhuru kutoka ubaguzi
• Uhuru wa kujieleza na kukusanyika
• Haki ya huduma za afya, makazi, na elimu
• Usikilizaji wa haki na upatikanaji wa haki`
    : `• Right to life and security
• Equality and freedom from discrimination  
• Freedom of expression and assembly
• Right to healthcare, housing, and education
• Fair hearing and access to justice`;

  const violationTitle = language === 'sw' ? '**Ikiwa haki zako zimekiukwa:**' : '**If your rights are violated:**';
  const violationText = language === 'sw'
    ? `• Wasiliana na KNCHR Coast Office: 041-2230496
• Tafuta msaada wa kisheria: Kituo Cha Sheria 041-2316185
• Wasilisha ombi la kikatiba mahakamani`
    : `• Contact KNCHR Coast Office: 041-2230496
• Seek legal aid: Kituo Cha Sheria 041-2316185
• File a constitutional petition in court`;

  const browseText = language === 'sw'
    ? 'Vinjari sehemu ya Haki za Kimsingi kwa taarifa kamili.'
    : 'Browse the Bill of Rights section for complete information.';

  return `${title}

${intro}

${articleList}

${rightsTitle}
${rightsText}

${violationTitle}
${violationText}

${browseText}`;
};

const formatTopicResponse = (topic) => {
  const practicalSteps = topic.practical_steps.slice(0, 3).map((step, index) => 
    `${index + 1}. ${step.description}`
  ).join('\n');

  return `**${topic.title}**

${topic.summary}

**What you can do:**
${practicalSteps}

${topic.mombasa_specific_info?.local_contacts?.length > 0 ? 
  `**Local Mombasa contacts:**
${topic.mombasa_specific_info.local_contacts.slice(0, 2).map(c => 
  `• ${c.organization}: ${c.phone}`
).join('\n')}` : ''}

**Constitutional basis:** ${topic.relevant_constitution_articles.length > 0 ? 
  `Articles ${topic.relevant_constitution_articles.slice(0, 3).join(', ')}` : 
  'General legal principles'}

For detailed guidance, consult with a legal professional.`;
};

const formatLegalAidResponse = (providers) => {
  const providerList = providers.slice(0, 3).map(p => 
    `• **${p.name}**
  Phone: ${p.primary_phone || 'Contact via website'}
  Address: ${p.location.address}
  Services: ${p.focus_areas.slice(0, 2).join(', ')}`
  ).join('\n\n');

  return `**Free Legal Aid in Mombasa County**

Here are legal aid organizations that can help you:

${providerList}

**Emergency Legal Help:**
• NLAS Hotline: 0800-720-440 (Free)
• Police Emergency: 999 or 112

**Your Constitutional Right:** Article 48 guarantees access to justice for all!

Visit our Legal Aid Resources page for the complete directory.`;
};

// Generate default response
const generateDefaultResponse = (message, language = 'en') => {
  if (language === 'sw') {
    const responses = [
      `Naelewa unauliza kuhusu "${message}". Ingawa ninaweza kutoa taarifa za jumla za kisheria, ningependekeza:

• Kuvinjari sehemu yetu ya Katiba kwa vifungu vinavyohusiana
• Kuangalia Rasilimali zetu za Msaada wa Kisheria kwa msaada wa kitaalamu
• Kuwasiliana na NLAS kwa 0800-720-440 kwa msaada wa haraka

**Kumbuka:** Hii ni taarifa ya jumla tu, si ushauri wa kisheria.`,

      `Asante kwa swali lako. Kwa mwongozo maalum wa kisheria kuhusu "${message}", tafadhali:

• Wasiliana na Kituo Cha Sheria Mombasa: 041-2316185
• Piga simu NLAS Legal Aid Hotline: 0800-720-440  
• Vinjari sehemu yetu ya Haki za Kimsingi kwa haki zako za msingi

Je, unaweza kuwa maalum zaidi kuhusu swali lako la kisheria?`,

      `Naona unauliza kuhusu "${message}". Hapa ni jinsi ninavyoweza kukusaidia:

• Kutafuta hifadhidata yetu ya Katiba
• Kutoa taarifa kuhusu haki zako
• Kukuunganisha na rasilimali za msaada wa kisheria

Kwa ushauri wa kisheria wa kibinafsi, wasiliana na wakili aliyeidhinishwa au shirika la msaada wa kisheria.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  const responses = [
    `I understand you're asking about "${message}". While I can provide general legal information, I'd recommend:

• Browsing our Constitution section for relevant articles
• Checking our Legal Aid Resources for professional help
• Contacting NLAS at 0800-720-440 for immediate assistance

**Remember:** This is general information only, not legal advice.`,

    `Thank you for your question. For specific legal guidance on "${message}", please:

• Contact Kituo Cha Sheria Mombasa: 041-2316185
• Call NLAS Legal Aid Hotline: 0800-720-440  
• Browse our Bill of Rights section for your fundamental rights

Could you be more specific about your legal question?`,

    `I see you're asking about "${message}". Here's how I can help:

• Search our Constitution database
• Provide information about your rights
• Connect you with legal aid resources

For personalized legal advice, contact a qualified lawyer or legal aid organization.`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// Suggestion generators
const generateSuggestions = (category, language = 'en') => {
  if (language === 'sw') {
    const suggestions = {
      'constitution': [
        "Kifungu cha 27 kuhusu usawa ni nini?",
        "Niambie kuhusu Haki za Kimsingi",
        "Haki zangu ni zipi ikiwa nitakamatwa?"
      ],
      'criminal-law': [
        "Ninawezaje kuripoti uhalifu?",
        "Haki zangu ni zipi ninapokamatwa?",
        "Ninawezaje kupata msaada wa kisheria kwa kesi za jinai?"
      ],
      'landlord-tenant': [
        "Ninaweza kufanya nini kuhusu kufukuzwa kinyume cha sheria?",
        "Mmiliki wa nyumba anafaa kunipa notisi ya muda gani?",
        "Wapi ninaweza kuwasilisha mgogoro wa mmiliki-mpangaji?"
      ],
      'legal-aid': [
        "Wapi ninaweza kupata msaada wa bure wa kisheria Mombasa?",
        "Huduma ya pro-bono ya kisheria ni nini?",
        "Ninawezaje kuwasiliana na NLAS?"
      ]
    };
    return suggestions[category] || generateGeneralSuggestions(language);
  }
  
  const suggestions = {
    'constitution': [
      "What is Article 27 about equality?",
      "Tell me about the Bill of Rights",
      "What are my rights if arrested?"
    ],
    'criminal-law': [
      "How do I report a crime?",
      "What are my rights when arrested?",
      "How do I get legal aid for criminal cases?"
    ],
    'landlord-tenant': [
      "What can I do about illegal eviction?",
      "How much notice should my landlord give?",
      "Where can I file a landlord-tenant dispute?"
    ],
    'legal-aid': [
      "Where can I get free legal help in Mombasa?",
      "What is pro-bono legal service?",
      "How do I contact NLAS?"
    ]
  };

  return suggestions[category] || generateGeneralSuggestions();
};

const generateConstitutionSuggestions = (language = 'en') => {
  if (language === 'sw') {
    return [
      "Haki za Kimsingi ni nini?",
      "Niambie kuhusu Kifungu cha 43 kuhusu haki za kiuchumi",
      "Kifungu cha 50 kinasema nini kuhusu usikilizaji wa haki?",
      "Ninawezaje kuwasilisha ombi la kikatiba?"
    ];
  }
  return [
    "What is the Bill of Rights?",
    "Tell me about Article 43 on economic rights",
    "What does Article 50 say about fair hearing?",
    "How do I file a constitutional petition?"
  ];
};

const generateTopicSuggestions = (category, language = 'en') => {
  if (language === 'sw') {
    return [
      "Wapi ninaweza kupata msaada wa kisheria?",
      "Taratibu za mahakama ni zipi?",
      "Msaada wa kisheria unagharamu kiasi gani?",
      "Ninahitaji hati zipi?"
    ];
  }
  return [
    "Where can I get legal help?",
    "What are the court procedures?",
    "How much does legal assistance cost?",
    "What documents do I need?"
  ];
};

const generateLegalAidSuggestions = (language = 'en') => {
  if (language === 'sw') {
    return [
      "Kituo Cha Sheria kinatoa huduma zipi?",
      "Ninawezaje kustahili msaada wa bure wa kisheria?",
      "Ofisi ya msaada wa kisheria iliyo karibu iko wapi?",
      "Nambari ya simu ya NLAS ni ipi?"
    ];
  }
  return [
    "What services does Kituo Cha Sheria offer?",
    "How do I qualify for free legal aid?",
    "Where is the nearest legal aid office?",
    "What is the NLAS hotline number?"
  ];
};

const generateGeneralSuggestions = (language = 'en') => {
  if (language === 'sw') {
    return [
      "Haki zangu za kikatiba ni zipi?",
      "Ninawezaje kupata msaada wa kisheria Mombasa?",
      "Nifanye nini ikiwa nitakamatwa?",
      "Ninawezaje kuwasilisha kesi katika Mahakama ya Madai Madogo?"
    ];
  }
  return [
    "What are my constitutional rights?",
    "How do I access legal aid in Mombasa?",
    "What should I do if arrested?",
    "How do I file a case in Small Claims Court?"
  ];
};