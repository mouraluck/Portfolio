// Source: LinkedIn profile export (Profile.pdf), November 2026, plus what Lucas added since.
import type { Lang } from '@/lib/i18n'

export const profile = {
  name: 'Lucas Moura',
  links: {
    linkedin: 'https://www.linkedin.com/in/mouraluck',
    github: 'https://github.com/mouraluck',
  },
}

export type CvItem = {
  period: string
  title: string
  org?: string
  /** word joining title and org: "at" in English; "na" / "no" in Portuguese */
  at?: string
  url?: string
  text?: string
  tags?: string[]
}

type CvContent = {
  role: string
  location: string
  back: string
  educationTitle: string
  volunteeringTitle: string
  experience: CvItem[]
  education: CvItem[]
  volunteering: CvItem[]
}

const tags = {
  doji: ['Go', 'Kotlin', 'AI', 'GCP'],
  zitec: ['C#', '.NET', 'EF Core', 'AWS S3', 'Docker'],
  intern: ['C#', 'ASP.NET', 'SQL Server'],
  po: ['Scrum', 'Postman', 'SQL'],
}

export const cv: Record<Lang, CvContent> = {
  en: {
    role: 'Software Engineer',
    location: 'São Paulo, Brazil',
    back: 'Back to home',
    educationTitle: 'Education',
    volunteeringTitle: 'Volunteering',
    experience: [
      {
        period: '2026 — Now',
        title: 'Junior Software Engineer',
        org: 'Doji',
        url: 'https://doji.com.br',
        text: 'C2B squad. Technical lead of the UsadoStore project, where I take part in refinement, planning and code, from the first spec to production.',
        tags: tags.doji,
      },
      {
        period: '2025 — 2026',
        title: 'Junior Software Engineer',
        org: 'Zitec',
        url: 'https://zitec.ai',
        text: 'Backend for financial asset management. Cut the daily processing of ~R$ 500k in billing operations from 20 minutes to 15 seconds, with no operational errors. Laid the foundation of ZiGestão with DDD, CQRS and Clean Architecture, and built the receivables approval flow and the QCertifica integration.',
        tags: tags.zitec,
      },
      {
        period: '2025',
        title: 'Software Engineering Intern',
        org: 'Zitec',
        url: 'https://zitec.ai',
        text: 'Web applications and REST APIs in C# and ASP.NET, persistence on SQL Server and front-end integration, in a Kanban team.',
        tags: tags.intern,
      },
      {
        period: '2024 — 2025',
        title: 'Product Owner Intern',
        org: 'Zitec',
        url: 'https://zitec.ai',
        text: 'Backlog prioritization in Scrum, acceptance criteria in Redmine, API validation with Postman and Swagger, UI prototypes and the visual identity of new products.',
        tags: tags.po,
      },
      { period: '2024', title: 'Administrative Apprentice', org: 'Vento Sul Engenharia' },
    ],
    education: [
      { period: '2026 — 2029', title: 'B.S. in Information Systems', org: 'IFSP' },
      { period: '2022 — 2025', title: 'Integrated Technical Course in Informatics', org: 'IFSP' },
    ],
    volunteering: [
      {
        period: '2023',
        title: 'Volunteer',
        org: 'Instituto Dom Bosco',
        text: 'Social service. Worked with the team to keep the institution running and support life with the students, across administration, the library, the children’s sector and the pastoral team.',
      },
    ],
  },
  pt: {
    role: 'Engenheiro de Software',
    location: 'São Paulo, Brasil',
    back: 'Voltar para a home',
    educationTitle: 'Formação',
    volunteeringTitle: 'Voluntariado',
    experience: [
      {
        period: '2026 — Atual',
        title: 'Engenheiro de Software Júnior',
        org: 'Doji',
        at: 'na',
        url: 'https://doji.com.br',
        text: 'Squad de C2B. Responsável técnico pelo projeto da UsadoStore, participando de refinement, planning e código, da primeira especificação até a produção.',
        tags: tags.doji,
      },
      {
        period: '2025 — 2026',
        title: 'Engenheiro de Software Júnior',
        org: 'Zitec',
        at: 'na',
        url: 'https://zitec.ai',
        text: 'Backend para gestão de ativos financeiros. Reduzi o processamento diário de ~R$ 500 mil em boletas de 20 minutos para 15 segundos, sem erros operacionais. Construí a base do ZiGestão com DDD, CQRS e Clean Architecture, além do fluxo de aprovação de recebíveis e da integração com a QCertifica.',
        tags: tags.zitec,
      },
      {
        period: '2025',
        title: 'Estagiário de Engenharia de Software',
        org: 'Zitec',
        at: 'na',
        url: 'https://zitec.ai',
        text: 'Aplicações web e APIs REST em C# e ASP.NET, persistência em SQL Server e integração com o front-end, num time Kanban.',
        tags: tags.intern,
      },
      {
        period: '2024 — 2025',
        title: 'Estagiário de Product Owner',
        org: 'Zitec',
        at: 'na',
        url: 'https://zitec.ai',
        text: 'Priorização de backlog em Scrum, critérios de aceite no Redmine, validação de APIs com Postman e Swagger, protótipos de interface e a identidade visual de novos produtos.',
        tags: tags.po,
      },
      { period: '2024', title: 'Jovem Aprendiz Administrativo', org: 'Vento Sul Engenharia', at: 'na' },
    ],
    education: [
      { period: '2026 — 2029', title: 'Bacharelado em Sistemas de Informação', org: 'IFSP', at: 'no' },
      { period: '2022 — 2025', title: 'Curso Técnico Integrado em Informática', org: 'IFSP', at: 'no' },
    ],
    volunteering: [
      {
        period: '2023',
        title: 'Voluntário',
        org: 'Instituto Dom Bosco',
        at: 'no',
        text: 'Serviço social. Atuei em equipe para o bom funcionamento da instituição e a convivência dos educandos, em administração, biblioteca, setor infantil e pastoral.',
      },
    ],
  },
}
