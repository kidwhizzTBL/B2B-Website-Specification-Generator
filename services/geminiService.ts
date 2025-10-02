
import { GoogleGenAI } from "@google/genai";
import { SpecFormData, WebsiteSection } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatSections = (sections: WebsiteSection[]): string => {
  return sections.map(section => `
### ${section.title}
${section.description}
`).join('');
};

export const generateWebsiteSpec = async (formData: SpecFormData): Promise<string> => {
  const prompt = `
    You are an expert web development consultant and project manager. Your task is to generate a comprehensive, professional website specification document based on the following client requirements. The document must be well-structured, clear, and actionable for a web development team.

    Use Markdown for formatting. Ensure the output is detailed and covers all aspects of the project.

    ---

    ## **Client & Project Brief**

    *   **Client Name:** ${formData.clientName}
    *   **Industry:** ${formData.industry}
    *   **Design Aesthetic Keywords:** ${formData.designAesthetic}

    ---

    ## **1. Project Overview & Core Objectives**

    The primary goal is to develop a professional, lead-generating website for ${formData.clientName}. The website must serve as a digital flagship, establishing credibility and authority in the competitive Dubai market.

    **Key business objectives are:**
    ${formData.objectives.map(obj => `*   ${obj}`).join('\n')}

    ---

    ## **2. Target Audience**

    The website must be designed and written to appeal to the following audience segments:
    *   ${formData.targetAudience.replace(/, /g, '\n*   ')}

    ---

    ## **3. Site Architecture & Sitemap**

    Based on the required sections, here is a proposed sitemap:

    *   **/ (Homepage)**
    *   **/services** (Main services overview page)
        ${formData.sections.find(s => s.title.toLowerCase().includes('services'))?.description.match(/\(([^)]+)\)/)?.[1].split(', ').map(service => `*   /services/${service.toLowerCase().replace(/ /g, '-')}`).join('\n        ') || ''}
    *   **/why-dubai**
    *   **/case-studies**
    *   **/insights** (Blog/Articles main page)
        *   /insights/[article-slug] (Individual article page)
    *   **/about-us**
    *   **/contact-us** (With a free consultation form)
    *   **/privacy-policy**
    *   **/terms-of-service**

    ---

    ## **4. Page-by-Page Feature Breakdown**

    Below is a detailed breakdown of the content, features, and call-to-actions (CTAs) for each key page.

    ${formatSections(formData.sections)}

    ---

    ## **5. Functional & Technical Requirements**

    This section outlines the non-page-specific technical requirements for the project.

    ${formData.techRequirements.map(req => `*   **${req.split(':')[0]}**: ${req.split(': ')[1] || 'Details to be specified.'}`).join('\n')}
    *   **Analytics:** Integration with Google Analytics 4 for traffic analysis and conversion tracking.
    *   **SEO:** Implementation of SEO best practices including semantic HTML, meta tags, structured data (Schema.org), and an auto-generated sitemap.xml.
    *   **Security:** Standard security measures including HTTPS, protection against common vulnerabilities (XSS, CSRF), and secure handling of form data.

    ---

    ## **6. Design & UX/UI Guidelines**

    *   **Color Palette:** A corporate and trustworthy palette. Suggested: Deep Navy Blue (#0A2342), Gold Accent (#D4AF37), Light Gray (#F5F5F5), and Crisp White (#FFFFFF).
    *   **Typography:** A clean, sans-serif font pairing. E.g., 'Inter' or 'Poppins' for headings and 'Open Sans' for body text.
    *   **Imagery:** High-quality, professional photography of Dubai's business districts (DIFC, Downtown), modern office interiors, and diverse teams. Avoid generic stock photos.
    *   **Layout:** A clean, grid-based layout with ample white space to convey sophistication and readability. The layout must be fully responsive and optimized for all screen sizes, from mobile to large desktops.

    ---

    ## **7. Recommended Technology Stack**

    *   **Frontend:** React (with Next.js) for high performance, SEO benefits, and a modern development experience.
    *   **Styling:** Tailwind CSS for a utility-first, highly customizable, and maintainable design system.
    *   **Content Management:** A Headless CMS (e.g., Sanity, Contentful, or Strapi) to allow the client to easily update content for services, case studies, and blog posts without developer intervention.
    *   **Deployment:** Vercel or Netlify for seamless CI/CD, scalability, and performance.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating website spec:", error);
    throw new Error("Failed to generate specification. Please check your API key and network connection.");
  }
};
