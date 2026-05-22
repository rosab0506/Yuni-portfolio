const LOGO_BASE_URL = 'https://cdn.simpleicons.org/';

// Custom </> SVG icon matching the user's requested style
export const DEFAULT_LOGO = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIzMCIgZmlsbD0iIzBCMTMyMCIvPjxwYXRoIGQ9Ik0zMCA0MEwyMCA1MEwzMCA2ME03MCA0MEw4MCA1MEw3MCA2ME00NSA3MEw1NSAzMCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==`;

// Custom Chip/AI SVG icon (Microchip style) for generic AI terms where Simple Icons 404s
export const AI_LOGO = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHJ4PSIyIiByeT0iMiIvPjxyZWN0IHg9IjkiIHk9IjkiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48bGluZSB4MT0iOSIgeTE9IjEiIHgyPSI5IiB5Mj0iNCIvPjxsaW5lIHgxPSIxNSIgeTE9IjEiIHgyPSIxNSIgeTI9IjQiLz48bGluZSB4MT0iOSIgeTE9IjIwIiB4Mj0iOSIgeTI9IjIzIi8+PGxpbmUgeDE9IjE1IiB5MT0iMjAiIHgyPSIxNSIgeTI9IjIzIi8+PGxpbmUgeDE9IjIwIiB5MT0iOSIgeDI9IjIzIiB5Mj0iOSIvPjxsaW5lIHgxPSIyMCIgeTE9IjE0IiB4Mj0iMjMiIHkyPSIxNCIvPjxsaW5lIHgxPSIxIiB5MT0iOSIgeDI9IjQiIHkyPSI5Ii8+PGxpbmUgeDE9IjEiIHkxPSIxNCIgeDI9IjQiIHkyPSIxNCIvPjwvc3ZnPg==`;

// Custom Globe/Web SVG icon for "Web Development"
export const WEB_LOGO = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzhiZGY4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48bGluZSB4MT0iMiIgeTE9IjEyIiB4Mj0iMjIiIHkyPSIxMiIvPjxwYXRoIGQ9Ik0xMiAyYTE1LjMgMTUuMyAwIDAgMSA0IDEwIDE1LjMgMTUuMyAwIDAgMS00IDEwIDE1LjMgMTUuMyAwIDAgMS00LTEwIDE1LjMgMTUuMyAwIDAgMSA0LTEweiIvPjwvc3ZnPg==`;

const toolLogoOverrides: Record<string, string> = {
  // --- Languages ---
  python: `${LOGO_BASE_URL}python`,
  javascript: `${LOGO_BASE_URL}javascript`,
  typescript: `${LOGO_BASE_URL}typescript`,
  java: `${LOGO_BASE_URL}openjdk`,
  csharp: `${LOGO_BASE_URL}csharp`,
  'c#': `${LOGO_BASE_URL}csharp`,
  cpp: `${LOGO_BASE_URL}cplusplus`,
  cplusplus: `${LOGO_BASE_URL}cplusplus`,
  'c++': `${LOGO_BASE_URL}cplusplus`,
  c: `${LOGO_BASE_URL}c`,
  go: `${LOGO_BASE_URL}go`,
  golang: `${LOGO_BASE_URL}go`,
  php: `${LOGO_BASE_URL}php`,
  ruby: `${LOGO_BASE_URL}ruby`,
  swift: `${LOGO_BASE_URL}swift`,
  kotlin: `${LOGO_BASE_URL}kotlin`,
  rust: `${LOGO_BASE_URL}rust`,
  dart: `${LOGO_BASE_URL}dart`,
  r: `${LOGO_BASE_URL}r`,
  matlab: `${LOGO_BASE_URL}mathworks`,
  scala: `${LOGO_BASE_URL}scala`,
  groovy: `${LOGO_BASE_URL}apachegroovy`,
  perl: `${LOGO_BASE_URL}perl`,
  lua: `${LOGO_BASE_URL}lua`,
  bash: `${LOGO_BASE_URL}gnubash`,
  shell: `${LOGO_BASE_URL}gnubash`,
  powershell: `${LOGO_BASE_URL}powershell`,
  haskell: `${LOGO_BASE_URL}haskell`,
  elixir: `${LOGO_BASE_URL}elixir`,
  clojure: `${LOGO_BASE_URL}clojure`,
  julia: `${LOGO_BASE_URL}julia`,
  solidity: `${LOGO_BASE_URL}solidity`,
  vba: `${LOGO_BASE_URL}visualbasic`,

  // --- Frontend ---
  html: `${LOGO_BASE_URL}html5`,
  html5: `${LOGO_BASE_URL}html5`,
  css: `${LOGO_BASE_URL}css`,
  css3: `${LOGO_BASE_URL}css`,
  react: `${LOGO_BASE_URL}react`,
  reactjs: `${LOGO_BASE_URL}react`,
  nextjs: `${LOGO_BASE_URL}nextdotjs`,
  next: `${LOGO_BASE_URL}nextdotjs`,
  vue: `${LOGO_BASE_URL}vuedotjs`,
  vuejs: `${LOGO_BASE_URL}vuedotjs`,
  angular: `${LOGO_BASE_URL}angular`,
  angularjs: `${LOGO_BASE_URL}angular`,
  svelte: `${LOGO_BASE_URL}svelte`,
  sveltekit: `${LOGO_BASE_URL}svelte`,
  solidjs: `${LOGO_BASE_URL}solid`,
  qwik: `${LOGO_BASE_URL}qwik`,
  preact: `${LOGO_BASE_URL}preact`,
  ember: `${LOGO_BASE_URL}emberdotjs`,
  backbone: `${LOGO_BASE_URL}backbone`,
  jquery: `${LOGO_BASE_URL}jquery`,
  tailwind: `${LOGO_BASE_URL}tailwindcss`,
  tailwindcss: `${LOGO_BASE_URL}tailwindcss`,
  bootstrap: `${LOGO_BASE_URL}bootstrap`,
  sass: `${LOGO_BASE_URL}sass`,
  less: `${LOGO_BASE_URL}less`,
  stylus: `${LOGO_BASE_URL}stylus`,
  materialui: `${LOGO_BASE_URL}mui`,
  mui: `${LOGO_BASE_URL}mui`,
  chakraui: `${LOGO_BASE_URL}chakraui`,
  chakra: `${LOGO_BASE_URL}chakraui`,
  antdesign: `${LOGO_BASE_URL}antdesign`,
  shadcnui: `${LOGO_BASE_URL}shadcnui`,
  shadcn: `${LOGO_BASE_URL}shadcnui`,
  redux: `${LOGO_BASE_URL}redux`,
  mobx: `${LOGO_BASE_URL}mobx`,
  zod: `${LOGO_BASE_URL}zod`,
  webpack: `${LOGO_BASE_URL}webpack`,
  vite: `${LOGO_BASE_URL}vite`,
  turbopack: `${LOGO_BASE_URL}vercel`,
  babel: `${LOGO_BASE_URL}babel`,
  npm: `${LOGO_BASE_URL}npm`,
  yarn: `${LOGO_BASE_URL}yarn`,
  pnpm: `${LOGO_BASE_URL}pnpm`,
  eslint: `${LOGO_BASE_URL}eslint`,
  prettier: `${LOGO_BASE_URL}prettier`,
  webassembly: `${LOGO_BASE_URL}webassembly`,
  wasm: `${LOGO_BASE_URL}webassembly`,

  // --- Backend ---
  node: `${LOGO_BASE_URL}nodedotjs`,
  nodejs: `${LOGO_BASE_URL}nodedotjs`,
  express: `${LOGO_BASE_URL}express`,
  expressjs: `${LOGO_BASE_URL}express`,
  nest: `${LOGO_BASE_URL}nestjs`,
  nestjs: `${LOGO_BASE_URL}nestjs`,
  fastify: `${LOGO_BASE_URL}fastify`,
  django: `${LOGO_BASE_URL}django`,
  flask: `${LOGO_BASE_URL}flask`,
  fastapi: `${LOGO_BASE_URL}fastapi`,
  rails: `${LOGO_BASE_URL}rubyonrails`,
  rubyonrails: `${LOGO_BASE_URL}rubyonrails`,
  laravel: `${LOGO_BASE_URL}laravel`,
  symfony: `${LOGO_BASE_URL}symfony`,
  codeigniter: `${LOGO_BASE_URL}codeigniter`,
  cakephp: `${LOGO_BASE_URL}cakephp`,
  spring: `${LOGO_BASE_URL}spring`,
  springboot: `${LOGO_BASE_URL}springboot`,
  aspnet: `${LOGO_BASE_URL}dotnet`,
  dotnet: `${LOGO_BASE_URL}dotnet`,
  dotnetcore: `${LOGO_BASE_URL}dotnet`,
  phoenix: `${LOGO_BASE_URL}phoenix`,
  graphql: `${LOGO_BASE_URL}graphql`,
  apollo: `${LOGO_BASE_URL}apollographql`,
  trpc: `${LOGO_BASE_URL}trpc`,
  prisma: `${LOGO_BASE_URL}prisma`,
  sequelize: `${LOGO_BASE_URL}sequelize`,
  mongoose: `${LOGO_BASE_URL}mongoose`,
  typeorm: `${LOGO_BASE_URL}typeorm`,

  // --- Databases ---
  postgresql: `${LOGO_BASE_URL}postgresql`,
  postgres: `${LOGO_BASE_URL}postgresql`,
  mysql: `${LOGO_BASE_URL}mysql`,
  mariadb: `${LOGO_BASE_URL}mariadb`,
  sqlite: `${LOGO_BASE_URL}sqlite`,
  sqlserver: `${LOGO_BASE_URL}mysql`, // Fallback
  mssql: `${LOGO_BASE_URL}mysql`, // Fallback
  microsoftsqlserver: `${LOGO_BASE_URL}mysql`, // Fallback
  oracle: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg', // Devicon Override
  oracledatabase: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg', // Devicon Override
  mongodb: `${LOGO_BASE_URL}mongodb`,
  couchdb: `${LOGO_BASE_URL}apachecouchdb`,
  cassandra: `${LOGO_BASE_URL}apachecassandra`,
  redis: `${LOGO_BASE_URL}redis`,
  elasticsearch: `${LOGO_BASE_URL}elasticsearch`,
  neo4j: `${LOGO_BASE_URL}neo4j`,
  dynamodb: `${LOGO_BASE_URL}amazondynamodb`,
  firestore: `${LOGO_BASE_URL}firebase`,
  firebase: `${LOGO_BASE_URL}firebase`,
  supabase: `${LOGO_BASE_URL}supabase`,
  planetscale: `${LOGO_BASE_URL}planetscale`,
  cockroachdb: `${LOGO_BASE_URL}cockroachlabs`,
  snowflake: `${LOGO_BASE_URL}snowflake`,
  databasedesign: `${LOGO_BASE_URL}postgresql`, // Generic DB icon

  // --- DevOps & Cloud ---
  aws: `${LOGO_BASE_URL}amazonaws`,
  amazonwebservices: `${LOGO_BASE_URL}amazonaws`,
  gcp: `${LOGO_BASE_URL}googlecloud`,
  googlecloud: `${LOGO_BASE_URL}googlecloud`,
  azure: `${LOGO_BASE_URL}microsoftazure`,
  digitalocean: `${LOGO_BASE_URL}digitalocean`,
  heroku: `${LOGO_BASE_URL}heroku`,
  vercel: `${LOGO_BASE_URL}vercel`,
  netlify: `${LOGO_BASE_URL}netlify`,
  docker: `${LOGO_BASE_URL}docker`,
  kubernetes: `${LOGO_BASE_URL}kubernetes`,
  k8s: `${LOGO_BASE_URL}kubernetes`,
  nginx: `${LOGO_BASE_URL}nginx`,
  apache: `${LOGO_BASE_URL}apache`,
  jenkins: `${LOGO_BASE_URL}jenkins`,
  gitlabci: `${LOGO_BASE_URL}gitlab`,
  circleci: `${LOGO_BASE_URL}circleci`,
  travisci: `${LOGO_BASE_URL}travisci`,
  githubactions: `${LOGO_BASE_URL}githubactions`,
  ansible: `${LOGO_BASE_URL}ansible`,
  terraform: `${LOGO_BASE_URL}terraform`,
  prometheus: `${LOGO_BASE_URL}prometheus`,
  grafana: `${LOGO_BASE_URL}grafana`,
  elk: `${LOGO_BASE_URL}elastic`,
  splunk: `${LOGO_BASE_URL}splunk`,
  datadog: `${LOGO_BASE_URL}datadog`,
  linux: `${LOGO_BASE_URL}linux`,
  ubuntu: `${LOGO_BASE_URL}ubuntu`,
  debian: `${LOGO_BASE_URL}debian`,
  centos: `${LOGO_BASE_URL}centos`,
  alpine: `${LOGO_BASE_URL}alpinelinux`,
  git: `${LOGO_BASE_URL}git`,
  github: `${LOGO_BASE_URL}github`,
  gitlab: `${LOGO_BASE_URL}gitlab`,
  bitbucket: `${LOGO_BASE_URL}bitbucket`,
  gitgithub: `${LOGO_BASE_URL}github`,

  // --- AI & ML ---
  tensorflow: `${LOGO_BASE_URL}tensorflow`,
  pytorch: `${LOGO_BASE_URL}pytorch`,
  keras: `${LOGO_BASE_URL}keras`,
  scikitlearn: `${LOGO_BASE_URL}scikitlearn`,
  sklearn: `${LOGO_BASE_URL}scikitlearn`,
  pandas: `${LOGO_BASE_URL}pandas`,
  numpy: `${LOGO_BASE_URL}numpy`,
  matplotlib: `${LOGO_BASE_URL}plotly`,
  seaborn: `${LOGO_BASE_URL}plotly`,
  plotly: `${LOGO_BASE_URL}plotly`,
  opencv: `${LOGO_BASE_URL}opencv`,
  huggingface: `${LOGO_BASE_URL}huggingface`,
  openai: AI_LOGO, // Use custom Chip logo
  langchain: `${LOGO_BASE_URL}langchain`,
  spacy: `${LOGO_BASE_URL}spacy`,
  nltk: `${LOGO_BASE_URL}python`,
  dialogflow: `${LOGO_BASE_URL}dialogflow`,
  jupyter: `${LOGO_BASE_URL}jupyter`,
  colab: `${LOGO_BASE_URL}googlecolab`,
  anaconda: `${LOGO_BASE_URL}anaconda`,
  kaggle: `${LOGO_BASE_URL}kaggle`,
  mlflow: `${LOGO_BASE_URL}mlflow`,
  wandb: `${LOGO_BASE_URL}weightsandbiases`,
  streamlit: `${LOGO_BASE_URL}streamlit`,

  // Mappings for generic AI terms
  appliedaiengineer: AI_LOGO, // Use custom Chip logo
  artificialintelligence: AI_LOGO, // Use custom Chip logo
  artificialintelligenceai: AI_LOGO, // Fix for "Artificial Intelligence (AI)"
  ai: AI_LOGO,

  explainableai: `${LOGO_BASE_URL}python`,
  xai: `${LOGO_BASE_URL}python`,
  explainableaixaishap: `${LOGO_BASE_URL}python`, // Fix for "Explainable AI (XAI / SHAP)"
  shap: `${LOGO_BASE_URL}python`,

  machinelearning: `${LOGO_BASE_URL}tensorflow`,
  deeplearning: `${LOGO_BASE_URL}keras`, // Distinct from PyTorch
  datascience: `${LOGO_BASE_URL}kaggle`,
  nlp: `${LOGO_BASE_URL}huggingface`,
  naturallanguageprocessing: `${LOGO_BASE_URL}huggingface`,
  naturallanguageprocessingnlp: `${LOGO_BASE_URL}huggingface`,
  computervision: `${LOGO_BASE_URL}opencv`,
  generativeai: AI_LOGO,
  llm: AI_LOGO,
  bert: `${LOGO_BASE_URL}huggingface`,
  banglabert: `${LOGO_BASE_URL}huggingface`,
  bertlanguagemodel: `${LOGO_BASE_URL}huggingface`,
  transformers: `${LOGO_BASE_URL}huggingface`,
  bilstm: `${LOGO_BASE_URL}pytorch`,

  // --- Mobile ---
  android: `${LOGO_BASE_URL}android`,
  ios: `${LOGO_BASE_URL}apple`,
  reactnative: `${LOGO_BASE_URL}react`,
  flutter: `${LOGO_BASE_URL}flutter`,
  ionic: `${LOGO_BASE_URL}ionic`,
  xamarin: `${LOGO_BASE_URL}xamarin`,
  expo: `${LOGO_BASE_URL}expo`,

  // --- Tools & Design ---
  vscode: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', // Devicon Override
  visualstudiocode: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', // Devicon Override
  visualstudio: `${LOGO_BASE_URL}visualstudio`,
  intellij: `${LOGO_BASE_URL}intellijidea`,
  pycharm: `${LOGO_BASE_URL}pycharm`,
  postman: `${LOGO_BASE_URL}postman`,
  insomnia: `${LOGO_BASE_URL}insomnia`,
  swagger: `${LOGO_BASE_URL}swagger`,
  jira: `${LOGO_BASE_URL}jira`,
  trello: `${LOGO_BASE_URL}trello`,
  slack: `${LOGO_BASE_URL}slack`,
  discord: `${LOGO_BASE_URL}discord`,
  notion: `${LOGO_BASE_URL}notion`,
  figma: `${LOGO_BASE_URL}figma`,
  adobephotoshop: `${LOGO_BASE_URL}adobephotoshop`,
  adobeillustrator: `${LOGO_BASE_URL}adobeillustrator`,
  adobexd: `${LOGO_BASE_URL}adobexd`,
  sketch: `${LOGO_BASE_URL}sketch`,
  invision: `${LOGO_BASE_URL}invision`,
  blender: `${LOGO_BASE_URL}blender`,

  // --- Concepts & General terms ---
  restapi: `${LOGO_BASE_URL}fastapi`,
  restfulapi: `${LOGO_BASE_URL}fastapi`,
  graphqlapi: `${LOGO_BASE_URL}graphql`,
  api: `${LOGO_BASE_URL}fastapi`,
  restapis: `${LOGO_BASE_URL}fastapi`,
  restapidevelopment: `${LOGO_BASE_URL}postman`,
  algorithms: `${LOGO_BASE_URL}leetcode`,
  datastructures: `${LOGO_BASE_URL}leetcode`,
  systemdesign: `${LOGO_BASE_URL}diagramsdotnet`,
  microservices: `${LOGO_BASE_URL}kubernetes`,
  distributed: `${LOGO_BASE_URL}kubernetes`,
  agile: `${LOGO_BASE_URL}jira`,
  scrum: `${LOGO_BASE_URL}jira`,
  kanban: `${LOGO_BASE_URL}trello`,
  agilesoftwaredevelopment: `${LOGO_BASE_URL}jira`,
  fullstack: `${LOGO_BASE_URL}codeigniter`,
  fullstackdevelopment: `${LOGO_BASE_URL}codeigniter`,
  frontend: `${LOGO_BASE_URL}html5`,
  backend: `${LOGO_BASE_URL}nodedotjs`,
  webdevelopment: WEB_LOGO, // Use custom Globe logo
  softwareengineering: `${LOGO_BASE_URL}codeigniter`,
  research: `${LOGO_BASE_URL}googlescholar`, // Note: googlescholar icon validity check needed, but keeping for now
  researchskills: `${LOGO_BASE_URL}googlescholar`,
  technicalwriting: `${LOGO_BASE_URL}medium`,
  seo: `${LOGO_BASE_URL}google`,
  uiux: `${LOGO_BASE_URL}figma`,
  productmanagement: `${LOGO_BASE_URL}jira`,
  projectmanagement: `${LOGO_BASE_URL}jira`,

  // Legacy mappings
  djangorestframework: `${LOGO_BASE_URL}django`,
  djangorestapi: `${LOGO_BASE_URL}django`,
  drf: `${LOGO_BASE_URL}django`,
};


const normalizeName = (name: string) => name.trim().toLowerCase();

const normalizeForLookup = (name: string) =>
  normalizeName(name)
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace(/_/g, '')
    .replace(/-/g, '')
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/&/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '');

const slugifySimpleIcon = (name: string) =>
  normalizeForLookup(name).replace(/[^a-z0-9]/g, '');

export const getToolLogoUrl = (name: string) => {
  const normalized = normalizeName(name);
  const normalizedKey = normalizeForLookup(name);

  // 1. Direct match in overrides (stripped key)
  if (toolLogoOverrides[normalizedKey]) return toolLogoOverrides[normalizedKey];

  // 2. Direct match in overrides (original normalized)
  if (toolLogoOverrides[normalized]) return toolLogoOverrides[normalized];

  // 3. Try Auto-Slug (Simple Icons match)
  const slug = slugifySimpleIcon(normalizedKey);

  // Note: We can't verify if a simple icon exists 100% without a request, 
  // but most common tools match their slug.
  // For safety, if it's a very common term, it might work.
  // BUT, to be safe, if we don't have an override, we return the slug URL.
  // If that fails (404), there's not much we can do client-side without checking.
  // However, the user asked for a GLOBAL fallback for undetected skills.
  // Implementation strategy: We will return the slug URL. The frontend <img onError> should handle the fallback.
  // BUT, since this function returns a string, we can't handle onError here.
  // The Best approach for "undetected" is to rely on the overrides being comprehensive.

  if (slug) return `${LOGO_BASE_URL}${slug}`;

  // 4. Global Fallback
  return DEFAULT_LOGO;
};
