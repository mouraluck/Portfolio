// Content for the home page in both languages. Facts come from the LinkedIn export (see cv.ts),
// what Lucas said about his current role and side projects, and his public repositories.
import type { Lang } from '@/lib/i18n'

export const contact = {
  email: 'pf.lucasmoura@gmail.com',
}

export type Work = { title: string; meta: string; text: string; result?: string; tags: string[]; url?: string }
export type SideProject = { year: string; title: string; text: string; url: string }

type HomeContent = {
  nav: { label: string; location: string; links: string; readCv: string }
  hero: { subtitle: string; scroll: string }
  sections: { about: string; work: string; side: string; stack: string; contact: string }
  about: { lead: string; body: string; facts: { label: string; value: string }[] }
  work: Work[]
  sideProjects: SideProject[]
  stack: { group: string; items: string[] }[]
  contact: { lines: string[]; text: string; email: string; cv: string; backToTop: string }
}

const urls = {
  usadostore: 'https://vender.usadostore.com.br',
  mymed: 'https://github.com/Hyperion-IFSP',
  amplia: 'https://ampliaorg.com.br/',
  garimpo: 'https://github.com/mouraluck/garimpo',
  doceConta: 'https://mouraluck.github.io/doce-conta/',
}

export const home: Record<Lang, HomeContent> = {
  en: {
    nav: { label: 'Engineer', location: 'São Paulo, Brazil', links: 'Links', readCv: 'read cv' },
    hero: { subtitle: 'software engineer', scroll: 'scroll' },
    sections: { about: 'About', work: 'Selected work', side: 'Side projects', stack: 'Stack', contact: 'Contact' },
    about: {
      lead: 'I build backend systems that move real money and real products, and I like owning them end to end, from refinement to production.',
      body: 'I’m a software engineer in São Paulo. Today I’m on the C2B squad at Doji, as technical lead of the UsadoStore project. Before that I spent a year and a half at Zitec, writing backend for financial asset management in C# and .NET, after starting there as a product owner intern. I’m also studying Information Systems at IFSP.',
      facts: [
        { label: 'Currently', value: 'Doji · C2B squad' },
        { label: 'Studying', value: 'Information Systems, IFSP' },
        { label: 'Based in', value: 'São Paulo, Brazil' },
      ],
    },
    work: [
      {
        title: 'UsadoStore',
        meta: 'Doji · 2026 — Now',
        text: 'Technical lead of the sell-your-phone site of Doji’s C2B channel. I take part in refinement, planning and code, from the first spec to production.',
        tags: ['Go', 'Kotlin', 'GCP', 'AI'],
        url: urls.usadostore,
      },
      {
        title: 'Billing routine',
        meta: 'Zitec · 2025',
        text: 'Rewrote the daily processing of about R$ 500k in billing operations (boletas) and removed the operational errors along the way.',
        result: '20 min → 15 s',
        tags: ['C#', '.NET', 'SQL Server'],
      },
      {
        title: 'ZiGestão',
        meta: 'Zitec · 2025 — 2026',
        text: 'Foundation of a new asset-management product with DDD, CQRS and Clean Architecture, including the receivables approval flow and the QCertifica integration.',
        tags: ['C#', '.NET', 'EF Core', 'AWS S3'],
      },
    ],
    sideProjects: [
      { year: '2025', title: 'MyMed', text: 'Health app built with the Hyperion team at IFSP, with a Java backend and a TypeScript front end.', url: urls.mymed },
      { year: '2026', title: 'Amplia', text: 'Platform that connects NGOs, volunteers and companies, with traceable donations and verified volunteering.', url: urls.amplia },
      { year: '2026', title: 'Garimpo', text: 'Curated affiliate storefront, built with three.js, GSAP and Motion.', url: urls.garimpo },
      { year: '2026', title: 'Doce Conta', text: 'Pricing sheet for confectioners: ingredients, packaging, labor and margin, down to the price per unit.', url: urls.doceConta },
    ],
    stack: [
      { group: 'Languages', items: ['Go', 'Kotlin', 'C#', 'Java', 'TypeScript', 'SQL'] },
      { group: 'Backend', items: ['.NET / ASP.NET', 'Spring Boot', 'REST APIs', 'DDD · CQRS', 'Clean Architecture'] },
      { group: 'Data & cloud', items: ['GCP', 'AWS S3', 'SQL Server', 'MySQL', 'Docker'] },
      { group: 'Domain', items: ['FIDC', 'Receivables', 'Asset management', 'C2B', 'Trade-in'] },
      { group: 'Way of working', items: ['Refinement & planning', 'Scrum · Kanban', 'Postman · Swagger', 'Git'] },
    ],
    contact: {
      lines: ['let’s', 'talk'],
      text: 'Open to conversations about backend, product engineering and teams that ship. The fastest way to reach me is email.',
      email: 'Send an email',
      cv: 'Read CV',
      backToTop: 'back to top',
    },
  },
  pt: {
    nav: { label: 'Engenheiro', location: 'São Paulo, Brasil', links: 'Links', readCv: 'ler cv' },
    hero: { subtitle: 'engenheiro de software', scroll: 'role' },
    sections: { about: 'Sobre', work: 'Trabalhos', side: 'Projetos paralelos', stack: 'Stack', contact: 'Contato' },
    about: {
      lead: 'Construo sistemas de backend que movimentam dinheiro e produtos de verdade, e gosto de cuidar deles de ponta a ponta, do refinement à produção.',
      body: 'Sou engenheiro de software em São Paulo. Hoje estou no squad de C2B da Doji, como responsável técnico pelo projeto da UsadoStore. Antes, passei um ano e meio na Zitec escrevendo backend para gestão de ativos financeiros em C# e .NET, depois de começar lá como estagiário de product owner. Também estudo Sistemas de Informação no IFSP.',
      facts: [
        { label: 'Atualmente', value: 'Doji · squad de C2B' },
        { label: 'Estudando', value: 'Sistemas de Informação, IFSP' },
        { label: 'Moro em', value: 'São Paulo, Brasil' },
      ],
    },
    work: [
      {
        title: 'UsadoStore',
        meta: 'Doji · 2026 — Atual',
        text: 'Responsável técnico pelo site de venda de celulares do canal C2B da Doji. Participo de refinement, planning e código, da primeira especificação até a produção.',
        tags: ['Go', 'Kotlin', 'GCP', 'IA'],
        url: urls.usadostore,
      },
      {
        title: 'Rotina de boletas',
        meta: 'Zitec · 2025',
        text: 'Reescrevi o processamento diário de cerca de R$ 500 mil em boletas e eliminei os erros operacionais no caminho.',
        result: '20 min → 15 s',
        tags: ['C#', '.NET', 'SQL Server'],
      },
      {
        title: 'ZiGestão',
        meta: 'Zitec · 2025 — 2026',
        text: 'Base de um novo produto de gestão de ativos com DDD, CQRS e Clean Architecture, incluindo o fluxo de aprovação de recebíveis e a integração com a QCertifica.',
        tags: ['C#', '.NET', 'EF Core', 'AWS S3'],
      },
    ],
    sideProjects: [
      { year: '2025', title: 'MyMed', text: 'App de saúde feito com o time Hyperion no IFSP, com backend em Java e front-end em TypeScript.', url: urls.mymed },
      { year: '2026', title: 'Amplia', text: 'Plataforma que conecta ONGs, voluntários e empresas, com doações rastreáveis e voluntariado verificado.', url: urls.amplia },
      { year: '2026', title: 'Garimpo', text: 'Vitrine de afiliados com curadoria própria, feita com three.js, GSAP e Motion.', url: urls.garimpo },
      { year: '2026', title: 'Doce Conta', text: 'Planilha de precificação para confeiteiros: ingredientes, embalagem, mão de obra e margem, até o preço por unidade.', url: urls.doceConta },
    ],
    stack: [
      { group: 'Linguagens', items: ['Go', 'Kotlin', 'C#', 'Java', 'TypeScript', 'SQL'] },
      { group: 'Backend', items: ['.NET / ASP.NET', 'Spring Boot', 'APIs REST', 'DDD · CQRS', 'Clean Architecture'] },
      { group: 'Dados e nuvem', items: ['GCP', 'AWS S3', 'SQL Server', 'MySQL', 'Docker'] },
      { group: 'Domínio', items: ['FIDC', 'Recebíveis', 'Gestão de ativos', 'C2B', 'Trade-in'] },
      { group: 'Forma de trabalho', items: ['Refinement e planning', 'Scrum · Kanban', 'Postman · Swagger', 'Git'] },
    ],
    contact: {
      lines: ['vamos', 'conversar'],
      text: 'Aberto a conversas sobre backend, engenharia de produto e times que entregam. O jeito mais rápido de falar comigo é por e-mail.',
      email: 'Mandar um e-mail',
      cv: 'Ler CV',
      backToTop: 'voltar ao topo',
    },
  },
}
