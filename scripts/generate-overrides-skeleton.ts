/**
 * Generate Overrides Skeleton
 * 
 * Creates or updates the manual overrides.json file with missing fields
 * marked as "TODO" placeholders.
 * 
 * Usage: pnpm run generate:overrides
 */

import * as fs from 'fs';
import * as path from 'path';

const GENERATED_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'linkedin.generated.json');
const OVERRIDES_PATH = path.join(process.cwd(), 'src', 'data', 'manual', 'overrides.json');

interface OverridesSchema {
  identity?: {
    fullName?: string;
    headline?: string;
    location?: string;
    about?: string;
    profilePhoto?: string;
    initials?: string;
    url?: string;
    locationLink?: string;
  };
  socials?: {
    linkedin?: string;
    email?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  experience?: Array<{
    title?: string;
    company?: string;
    companyUrl?: string;
    employmentType?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    logoUrl?: string;
    badges?: string[];
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    logoUrl?: string;
    href?: string;
  }>;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    dates: string;
    href: string;
    video: string;
    image: string;
    technologies: string[];
    active: boolean;
    links: Array<{ type: string; href: string }>;
  }>;
  hackathons?: Array<{
    title: string;
    dates: string;
    location: string;
    description: string;
    image: string;
    links: Array<{ title: string; href: string }>;
  }>;
}

function createDefaultOverrides(): OverridesSchema {
  return {
    identity: {
      fullName: null as unknown as string, // Use generated
      headline: null as unknown as string, // Use generated
      location: null as unknown as string, // Use generated
      about: null as unknown as string, // Use generated
      profilePhoto: 'TODO: Add your profile photo to /public/me.png',
      initials: 'NM',
      url: 'TODO: Your portfolio URL (e.g., https://nakulmandhre.com)',
      locationLink: 'https://www.google.com/maps/place/atlanta',
    },
    socials: {
      linkedin: null as unknown as string, // Use generated
      email: 'TODO: your.email@example.com',
      github: 'TODO: https://github.com/yourusername',
      twitter: 'TODO: https://twitter.com/yourusername',
      youtube: '',
      website: '',
    },
    experience: [
      // Override specific experience entries here
      // Example:
      // {
      //   company: 'Candescent',
      //   description: '• Built RAG-powered copilots for enterprise clients\n• Led technical implementation of LLM evaluation frameworks\n• Reduced deployment time by 40% through process automation',
      // }
    ],
    education: [
      // Override specific education entries here
    ],
    skills: null as unknown as string[], // Use generated skills, or override with custom list
    projects: [
      {
        title: 'TODO: Project 1',
        description: 'TODO: Brief description of the project',
        dates: 'TODO: Jan 2024 - Present',
        href: 'TODO: https://project-url.com',
        video: '',
        image: '',
        technologies: ['Next.js', 'TypeScript', 'OpenAI'],
        active: true,
        links: [
          { type: 'Website', href: 'TODO: https://project-url.com' },
        ],
      },
      {
        title: 'TODO: Project 2',
        description: 'TODO: Brief description of the project',
        dates: 'TODO: Jun 2023 - Dec 2023',
        href: 'TODO: https://project-url.com',
        video: '',
        image: '',
        technologies: ['Python', 'LangChain', 'RAG'],
        active: true,
        links: [
          { type: 'Website', href: 'TODO: https://project-url.com' },
        ],
      },
      {
        title: 'TODO: Project 3',
        description: 'TODO: Brief description of the project',
        dates: 'TODO: Mar 2023 - May 2023',
        href: 'TODO: https://project-url.com',
        video: '',
        image: '',
        technologies: ['React', 'Node.js', 'MongoDB'],
        active: true,
        links: [
          { type: 'Website', href: 'TODO: https://project-url.com' },
        ],
      },
      {
        title: 'TODO: Project 4',
        description: 'TODO: Brief description of the project',
        dates: 'TODO: Jan 2023 - Feb 2023',
        href: 'TODO: https://project-url.com',
        video: '',
        image: '',
        technologies: ['Python', 'Azure', 'Docker'],
        active: true,
        links: [
          { type: 'Website', href: 'TODO: https://project-url.com' },
        ],
      },
    ],
    hackathons: [
      // Add hackathon entries here if applicable
      // {
      //   title: 'Hackathon Name',
      //   dates: 'Month Day, Year',
      //   location: 'City, State',
      //   description: 'What you built',
      //   image: '/hackathon-image.png',
      //   links: [{ title: 'GitHub', href: 'https://github.com/...' }],
      // },
    ],
  };
}

function main() {
  console.log('🔧 Overrides Skeleton Generator');
  console.log('================================\n');

  // Check if generated data exists
  if (!fs.existsSync(GENERATED_PATH)) {
    console.log('⚠️  Generated data not found. Run import:linkedin first.\n');
    console.log('Creating default overrides skeleton...\n');
  } else {
    console.log('📄 Found generated data\n');
  }

  // Check if overrides already exists
  let existingOverrides: Partial<OverridesSchema> = {};
  if (fs.existsSync(OVERRIDES_PATH)) {
    console.log('📋 Found existing overrides.json - preserving manual edits\n');
    existingOverrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8'));
  }

  // Create default skeleton
  const skeleton = createDefaultOverrides();

  // Merge with existing (preserve manual edits)
  const merged = deepMerge(skeleton, existingOverrides);

  // Write output
  const outputDir = path.dirname(OVERRIDES_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(merged, null, 2));
  console.log(`✅ Written: ${OVERRIDES_PATH}\n`);

  console.log('📝 Next steps:');
  console.log('   1. Open src/data/manual/overrides.json');
  console.log('   2. Replace all "TODO:" values with your actual data');
  console.log('   3. Add your profile photo to /public/me.png');
  console.log('   4. Add company logos to /public/ folder');
  console.log('   5. Add your projects with descriptions and links');
  console.log('   6. Run pnpm dev to see your changes');
}

/**
 * Deep merge two objects, with source overriding target
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  for (const key of Object.keys(source)) {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];
    
    if (sourceValue === undefined || sourceValue === null) {
      continue;
    }
    
    if (Array.isArray(sourceValue) && sourceValue.length > 0) {
      // For arrays, use source if it has content
      (output as Record<string, unknown>)[key] = sourceValue;
    } else if (typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      // For objects, recursively merge
      (output as Record<string, unknown>)[key] = deepMerge(
        (targetValue || {}) as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else if (sourceValue !== null) {
      // For primitives, use source
      (output as Record<string, unknown>)[key] = sourceValue;
    }
  }
  
  return output;
}

main();
