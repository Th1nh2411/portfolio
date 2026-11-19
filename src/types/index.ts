export interface Project {
  id: string
  title: string
  titleVi?: string
  description: string
  descriptionVi?: string
  detailDescriptions?: string[]
  detailDescriptionsVi?: string[]
  images: string[]
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  period: string
  featured?: boolean
  /** display order in the slider (ascending); unset goes last */
  order?: number
  details?: string
  detailsVi?: string
  responsibilities?: string[]
  responsibilitiesVi?: string[]
}

export interface Experience {
  id: string
  company: string
  role: string
  roleVi?: string
  period: string
  descriptions: string[]
  descriptionsVi?: string[]
  type: 'fulltime' | 'intern' | 'freelance'
}

export interface Skill {
  category: string
  categoryVi?: string
  items: string[]
}

export interface Profile {
  name: string
  title: string
  titleVi?: string
  bio: string
  bioVi?: string
  email: string
  phone: string
  location: string
  locationVi?: string
  github: string
  birthday: string
  avatar?: string
  tagline: string
  taglineVi?: string
  /** Optional CV link (e.g. Firebase Storage / Drive). Falls back to /cv.pdf. */
  cvUrl?: string
}

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}
