/**
 * Frozen v1 content for the "Los artefactos" section — verbatim copy from
 * the single-file prototype. Plain data only; components import and map
 * over it. `tags` is an empty array (not omitted) for projects with no
 * chips, so `Projects.jsx` can rely on a consistent shape.
 */
export const projects = [
  {
    title: 'SplitPay',
    description:
      'App personal para dividir gastos compartidos. Frontend en React + TypeScript + ' +
      'Vite + Tailwind, como PWA. Backend en .NET 8 Minimal API con Clean Architecture, ' +
      'PostgreSQL y MediatR/CQRS. Usa la API de Claude para leer recibos.',
    tags: ['React', '.NET 8', 'PostgreSQL', 'Claude API'],
  },
  {
    title: 'Ren',
    description: 'Proyecto de ERP colaborativo, con módulos de CRM, LMS y financiero.',
    tags: ['CRM', 'LMS', 'Financiero'],
  },
  {
    title: 'Práctica para entrevistas',
    description:
      'Página web propia que genera preguntas aleatorias — lógica de programación, ' +
      'pseudocódigo, Docker, IA — para preparar procesos de selección.',
    tags: [],
  },
];
