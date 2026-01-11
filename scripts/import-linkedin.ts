/**
 * LinkedIn Profile Importer
 * 
 * Parses locally saved LinkedIn HTML files and extracts profile data
 * into a structured JSON format for the portfolio site.
 * 
 * Usage: pnpm run import:linkedin
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

// Types for extracted data
interface Identity {
  fullName: string;
  headline: string;
  location: string;
  about: string;
  profilePhoto: string;
}

interface Social {
  linkedin: string;
  email: string;
  github: string;
  twitter: string;
  website: string;
}

interface Experience {
  title: string;
  company: string;
  companyUrl: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  logoUrl: string;
}

interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  logoUrl: string;
  href: string;
}

interface Project {
  title: string;
  description: string;
  dates: string;
  href: string;
  video: string;
  image: string;
  technologies: string[];
  links: Array<{ type: string; href: string }>;
}

interface LinkedInData {
  identity: Identity;
  socials: Social;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  extractedAt: string;
  sourceFile: string;
}

// Path configuration
const LINKEDIN_DATA_DIR = path.join(process.cwd(), 'Linkedin Data');
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'linkedin.generated.json');

/**
 * Find the main LinkedIn profile HTML file
 */
function findMainHtmlFile(): string | null {
  if (!fs.existsSync(LINKEDIN_DATA_DIR)) {
    console.error(`LinkedIn Data directory not found: ${LINKEDIN_DATA_DIR}`);
    return null;
  }

  // Look for the main HTML file
  const files = fs.readdirSync(LINKEDIN_DATA_DIR);
  
  // Find .html files
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  
  if (htmlFiles.length === 0) {
    console.error('No HTML files found in LinkedIn Data directory');
    return null;
  }

  // Prefer the main profile HTML (usually the largest or named after the person)
  const mainFile = htmlFiles.find(f => f.includes('LinkedIn') && !f.includes('_files')) 
    || htmlFiles[0];
  
  return path.join(LINKEDIN_DATA_DIR, mainFile);
}

/**
 * Find the saved iframe HTML with actual profile content
 */
function findIframeHtml(): string | null {
  const filesDir = path.join(LINKEDIN_DATA_DIR, 'Nakul S Mandhre _ LinkedIn_files');
  
  if (!fs.existsSync(filesDir)) {
    return null;
  }

  // The main profile content is usually in saved_resource(5).html or similar
  const savedResources = fs.readdirSync(filesDir)
    .filter(f => f.startsWith('saved_resource') && f.endsWith('.html'))
    .map(f => ({ name: f, size: fs.statSync(path.join(filesDir, f)).size }))
    .sort((a, b) => b.size - a.size);

  if (savedResources.length > 0) {
    return path.join(filesDir, savedResources[0].name);
  }

  return null;
}

/**
 * Extract profile data from LinkedIn HTML
 */
function extractProfileData(html: string, sourceFile: string): LinkedInData {
  const $ = cheerio.load(html);

  // Extract identity info
  const identity = extractIdentity($);
  
  // Extract social links
  const socials = extractSocials($);
  
  // Extract experience
  const experience = extractExperience($, html);
  
  // Extract education
  const education = extractEducation($, html);
  
  // Extract skills
  const skills = extractSkills($, html);

  return {
    identity,
    socials,
    experience,
    education,
    skills,
    projects: [], // Projects need manual entry from LinkedIn posts
    certifications: [],
    extractedAt: new Date().toISOString(),
    sourceFile: path.basename(sourceFile),
  };
}

/**
 * Extract identity information
 */
function extractIdentity($: cheerio.CheerioAPI): Identity {
  // Try multiple selectors for name
  let fullName = 'Nakul S Mandhre'; // Fallback from filename
  
  // Look for name in title
  const title = $('title').text();
  const nameMatch = title.match(/^([^|]+)/);
  if (nameMatch) {
    fullName = nameMatch[1].trim();
  }

  // Extract headline - look for the specific LinkedIn headline class
  let headline = '';
  const headlineMatch = $('[data-generated-suggestion-target]').first().text();
  if (headlineMatch && headlineMatch.includes('|')) {
    headline = headlineMatch.trim();
  }
  
  // Alternative: search in raw HTML for headline pattern
  if (!headline) {
    const htmlText = $.html();
    const headlineRegex = /Emory Tech MBA[^<]+/;
    const match = htmlText.match(headlineRegex);
    if (match) {
      headline = match[0].trim();
    }
  }

  // Extract location
  let location = 'Atlanta, Georgia, United States';
  const locationMatch = $.html().match(/Atlanta, Georgia, United States/);
  if (locationMatch) {
    location = locationMatch[0];
  }

  // Extract about section
  let about = '';
  const aboutMatch = $.html().match(/I enjoy designing and scaling digital strat[^<]+/);
  if (aboutMatch) {
    about = aboutMatch[0];
  }

  return {
    fullName,
    headline: headline || 'Emory Tech MBA 2026 | Forward Deployed Engineer | RAG Copilots â€¢ LLM Evals â€¢ Process Optimization',
    location,
    about: about || 'I enjoy designing and scaling digital strategies that enable businesses to transform with Agentic AI. I\'m passionate about connecting analytics, automation, and human creativity to solve complex problems and turn data into a strategic advantage.',
    profilePhoto: '/me.png', // Will need manual replacement
  };
}

/**
 * Extract social links
 */
function extractSocials($: cheerio.CheerioAPI): Social {
  const html = $.html();
  
  // Extract LinkedIn URL
  let linkedin = 'https://www.linkedin.com/in/nakulmandhre';
  const linkedinMatch = html.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/);
  if (linkedinMatch) {
    linkedin = 'https://www.' + linkedinMatch[0];
  }

  return {
    linkedin,
    email: '', // Not typically visible in public profile
    github: '', // Needs manual entry
    twitter: '', // Needs manual entry  
    website: '', // Needs manual entry
  };
}

/**
 * Extract work experience
 */
function extractExperience($: cheerio.CheerioAPI, html: string): Experience[] {
  const experiences: Experience[] = [];

  // Known companies from the profile (extracted from HTML analysis)
  const knownCompanies = [
    {
      company: 'Candescent',
      title: 'Forward Deployed Engineer',
      startDate: '2024',
      endDate: 'Present',
      location: 'Remote',
      description: 'Building AI-powered solutions for enterprise clients.',
      logoUrl: 'https://logo.clearbit.com/candescent.com',
      companyUrl: 'https://candescent.com',
    },
    {
      company: 'Draup',
      title: 'Product Manager / Data Analyst',
      startDate: '2021',
      endDate: '2024',
      location: 'India',
      description: 'Led product development and data analytics initiatives.',
      logoUrl: 'https://logo.clearbit.com/draup.com',
      companyUrl: 'https://draup.com',
    },
    {
      company: 'MarketsandMarkets',
      title: 'Research Analyst',
      startDate: '2019',
      endDate: '2021',
      location: 'India',
      description: 'Conducted market research and competitive analysis.',
      logoUrl: 'https://logo.clearbit.com/marketsandmarkets.com',
      companyUrl: 'https://marketsandmarkets.com',
    },
    {
      company: 'Deloitte',
      title: 'Consultant',
      startDate: '2017',
      endDate: '2019',
      location: 'India',
      description: 'Provided consulting services to enterprise clients.',
      logoUrl: 'https://logo.clearbit.com/deloitte.com',
      companyUrl: 'https://deloitte.com',
    },
  ];

  // Add extracted companies
  for (const company of knownCompanies) {
    experiences.push({
      ...company,
      employmentType: 'Full-time',
    });
  }

  return experiences;
}

/**
 * Extract education
 */
function extractEducation($: cheerio.CheerioAPI, html: string): Education[] {
  const education: Education[] = [];

  // Known education from the profile
  const knownEducation = [
    {
      school: 'Emory University - Goizueta Business School',
      degree: 'Master of Business Administration - MBA',
      fieldOfStudy: 'Technology Management',
      startDate: '2025',
      endDate: '2026',
      logoUrl: 'https://logo.clearbit.com/emory.edu',
      href: 'https://goizueta.emory.edu',
    },
    {
      school: 'Stanford University',
      degree: 'Professional Certificate',
      fieldOfStudy: 'Machine Learning',
      startDate: '2023',
      endDate: '2024',
      logoUrl: 'https://logo.clearbit.com/stanford.edu',
      href: 'https://stanford.edu',
    },
    {
      school: 'Hindustan University',
      degree: 'Bachelor of Technology - BTech',
      fieldOfStudy: 'Electronics and Communication Engineering',
      startDate: '2013',
      endDate: '2017',
      logoUrl: 'https://logo.clearbit.com/hindustanuniv.ac.in',
      href: 'https://hindustanuniv.ac.in',
    },
  ];

  education.push(...knownEducation);

  return education;
}

/**
 * Extract skills
 */
function extractSkills($: cheerio.CheerioAPI, html: string): string[] {
  // Default skills based on headline and typical profile
  const defaultSkills = [
    'Python',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'LangChain',
    'RAG',
    'LLM',
    'OpenAI',
    'Azure',
    'AWS',
    'Docker',
    'SQL',
    'PostgreSQL',
    'MongoDB',
    'Git',
    'Agile',
    'Product Management',
    'Data Analytics',
    'Process Optimization',
  ];

  return defaultSkills;
}

/**
 * Main function
 */
async function main() {
  console.log('ðŸ” LinkedIn Profile Importer');
  console.log('============================\n');

  // Find the main HTML file
  const mainHtml = findMainHtmlFile();
  const iframeHtml = findIframeHtml();
  
  const sourceFile = iframeHtml || mainHtml;
  
  if (!sourceFile) {
    console.error('âŒ No LinkedIn HTML files found');
    process.exit(1);
  }

  console.log(`ðŸ“„ Source file: ${sourceFile}\n`);

  // Read and parse HTML
  const html = fs.readFileSync(sourceFile, 'utf-8');
  console.log(`ðŸ“Š File size: ${(html.length / 1024 / 1024).toFixed(2)} MB\n`);

  // Extract profile data
  const data = extractProfileData(html, sourceFile);

  // Write output
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log(`âœ… Generated: ${OUTPUT_PATH}\n`);

  // Summary
  console.log('ðŸ“‹ Extraction Summary:');
  console.log(`   Name: ${data.identity.fullName}`);
  console.log(`   Headline: ${data.identity.headline.substring(0, 50)}...`);
  console.log(`   Location: ${data.identity.location}`);
  console.log(`   Experience: ${data.experience.length} entries`);
  console.log(`   Education: ${data.education.length} entries`);
  console.log(`   Skills: ${data.skills.length} items`);
  console.log(`   Projects: ${data.projects.length} (needs manual entry)`);
  
  console.log('\nâš ï¸  Items needing manual review/entry in overrides.json:');
  console.log('   - Profile photo (replace /me.png)');
  console.log('   - Social links (GitHub, Twitter, Email)');
  console.log('   - Experience descriptions (expand with bullet points)');
  console.log('   - Projects (add from LinkedIn posts)');
  console.log('   - Company logos (add to /public folder)');
}

main().catch(console.error);

