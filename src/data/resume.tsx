import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

// Import generated and override data
import generatedData from "./generated/linkedin.generated.json";
import overridesData from "./manual/overrides.json";

// Type-safe getter that handles null/undefined/TODO values
function getOverride<T>(override: T | null | undefined, fallback: T): T {
  if (override === null || override === undefined) return fallback;
  if (typeof override === 'string' && override.startsWith('TODO:')) return fallback;
  return override;
}

// Helper to get the right icon for a link type
function getLinkIcon(type: string) {
  const t = type.toLowerCase();
  if (t === 'github' || t === 'source') return <Icons.github className="size-3" />;
  if (t === 'linkedin') return <Icons.linkedin className="size-3" />;
  if (t === 'youtube' || t === 'video') return <Icons.youtube className="size-3" />;
  if (t === 'twitter' || t === 'x') return <Icons.x className="size-3" />;
  return <Icons.globe className="size-3" />;
}

// Get identity values with fallbacks
const fullName = getOverride(overridesData.identity?.fullName, generatedData.identity.fullName);
const headline = getOverride(overridesData.identity?.headline, generatedData.identity.headline);
const location = getOverride(overridesData.identity?.location, generatedData.identity.location);
const about = getOverride(overridesData.identity?.about, generatedData.identity.about);
const initials = getOverride(overridesData.identity?.initials, 'NM');
const url = getOverride(overridesData.identity?.url, 'https://nakulmandhre.com');
const locationLink = getOverride(overridesData.identity?.locationLink, 'https://www.google.com/maps/place/atlanta');
const avatarUrl = getOverride(overridesData.identity?.profilePhoto, '/me.png');

// Get social values with fallbacks
const linkedin = getOverride(overridesData.socials?.linkedin, generatedData.socials.linkedin);
const github = getOverride(overridesData.socials?.github, generatedData.socials.github);
const x = getOverride(overridesData.socials?.x, generatedData.socials.twitter);
const youtube = getOverride(overridesData.socials?.youtube, '');
const email = getOverride(overridesData.socials?.email, generatedData.socials.email);

// Get skills - prefer overrides if array provided
const overrideSkills = overridesData.skills as string[] | null;
const skills: readonly string[] = (overrideSkills && Array.isArray(overrideSkills) && overrideSkills.length > 0)
  ? overrideSkills
  : generatedData.skills;

// Experience type
type ExperienceEntry = {
  company: string;
  title: string;
  location: string;
  startDate?: string;
  endDate?: string;
  description: string;
  logoUrl: string;
  companyUrl?: string;
};

// Get experience - prefer overrides if non-empty
const overrideExperience = (overridesData.experience || []) as ExperienceEntry[];
const generatedExperience = generatedData.experience as ExperienceEntry[];
const experienceSource = overrideExperience.length > 0 ? overrideExperience : generatedExperience;

// Transform experience to template format
const work = experienceSource.map((exp) => ({
  company: exp.company,
  href: exp.companyUrl || '#',
  badges: [] as string[],
  location: exp.location,
  title: exp.title,
  logoUrl: exp.logoUrl,
  start: exp.startDate || '',
  end: exp.endDate || 'Present',
  description: exp.description,
}));

// Education type
type EducationEntry = {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  logoUrl: string;
  href?: string;
};

// Get education - prefer overrides if non-empty
const overrideEducation = (overridesData.education || []) as EducationEntry[];
const generatedEducation = generatedData.education as EducationEntry[];
const educationSource = overrideEducation.length > 0 ? overrideEducation : generatedEducation;

// Transform education to template format
const education = educationSource.map((edu) => ({
  school: edu.school,
  href: edu.href || '#',
  degree: edu.degree + (edu.fieldOfStudy ? ", " + edu.fieldOfStudy : ""),
  logoUrl: edu.logoUrl,
  start: edu.startDate || '',
  end: edu.endDate || '',
}));

// Project type for overrides
type ProjectOverride = {
  title: string;
  description: string;
  dates: string;
  href: string;
  video?: string;
  image?: string;
  technologies?: string[];
  active?: boolean;
  links?: Array<{ type: string; href: string }>;
};

// Hackathon type for overrides
type HackathonOverride = {
  title: string;
  dates: string;
  location: string;
  description: string;
  image?: string;
  win?: string;
  mlh?: string;
  links?: Array<{ title: string; href: string }>;
};

// Transform projects - filter out TODO items
const projectsData = (overridesData.projects || []) as ProjectOverride[];
const projects = projectsData
  .filter((p) => !p.title.startsWith('TODO:'))
  .map((project) => ({
    title: project.title,
    href: project.href,
    dates: project.dates,
    active: project.active ?? true,
    description: project.description,
    technologies: project.technologies || [],
    links: (project.links || []).map(link => ({
      type: link.type,
      href: link.href,
      icon: getLinkIcon(link.type),
    })),
    image: project.image || '',
    video: project.video || '',
  }));

// Transform hackathons - filter out TODO items
const hackathonsData = ((overridesData as { hackathons?: HackathonOverride[] }).hackathons || []);
const hackathons = hackathonsData
  .filter((h) => !h.title?.startsWith?.('TODO:'))
  .map((hackathon) => ({
    title: hackathon.title,
    dates: hackathon.dates,
    location: hackathon.location,
    description: hackathon.description,
    image: hackathon.image || '',
    win: hackathon.win,
    mlh: hackathon.mlh,
    links: (hackathon.links || []).map(link => ({
      title: link.title,
      href: link.href,
      icon: getLinkIcon(link.title || ''),
    })),
  }));

// Build social links with icons
const socialLinks = {
  GitHub: {
    name: "GitHub",
    url: github || '#',
    icon: Icons.github,
    navbar: !!github && !github.startsWith('TODO:'),
  },
  LinkedIn: {
    name: "LinkedIn",
    url: linkedin || 'https://linkedin.com',
    icon: Icons.linkedin,
    navbar: true,
  },
  X: {
    name: "X",
    url: x || '#',
    icon: Icons.x,
    navbar: !!x && !x.startsWith('TODO:'),
  },
  Youtube: {
    name: "Youtube",
    url: youtube || '#',
    icon: Icons.youtube,
    navbar: !!youtube && !youtube.startsWith('TODO:'),
  },
  email: {
    name: "Send Email",
    url: email && !email.startsWith('TODO:') ? "mailto:"+email : '#',
    icon: Icons.email,
    navbar: false,
  },
};

export const DATA = {
  name: fullName,
  initials,
  url,
  location,
  locationLink,
  description: headline,
  summary: about,
  avatarUrl,
  skills,
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: email && !email.startsWith('TODO:') ? email : 'hello@example.com',
    tel: "+1234567890",
    social: socialLinks,
  },
  work,
  education,
  projects,
  hackathons,
} as const;
