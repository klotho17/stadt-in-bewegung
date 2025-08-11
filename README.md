# Audiovisuelles Kulturerbe der Städte in Bewegung 1977-1994

A public web application built with **[Next.js](https://nextjs.org)** (App Router, v15.3.1), deployed on **[Vercel](https://vercel.com/)**. The source code is openly available in this repository.

### The Webapp is available here: [https://stadt-in-bewegung.vercel.app/](https://stadt-in-bewegung.vercel.app/)

## Technical Stack

- **Framework:** [Next.js](https://nextjs.org) (React-based)
- **Deployment:** [Vercel](https://vercel.com/)
- **Language:** JavaScript (no TypeScript)
- **Styling:** Vanilla CSS (no Tailwind)
- **Font Optimization:** [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with [Geist](https://vercel.com/font)
- **Code Quality:** [ESLint](https://eslint.org/) for static analysis
- **Package Manager:** [npm](https://www.npmjs.com/)

## Project Structure

- Uses Next.js App Router (`/app` directory)
- Modular organization of components, pages, and API routes
- Metadata is fetched from the public API of [Memobase](https://memobase.ch/de/recordSet/soz-016)

## Getting Started

Prerequesites: 
- Node.js 18.18 or higher
- npm

To run the project locally install dependencies and start local developement server:

```bash
npm install
npm run dev
```

## Deployment

The application is automatically deployed via Vercel's GitHub integration.

## Security & Privacy
- No sensitive data (API keys, passwords, or tokens) is stored in the repository
- Build artifacts (.next/ directory) are excluded via .gitignore


## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Memobase API](https://memobase.ch/de/recordSet/soz-016)
- [Database Bild + Ton](https://www.bild-video-ton.ch/bestand/signatur/F_Videos)
- Buit with the help of ChatGPT 4o, DeepSeek V3 and R, and GitHub Copilot (Model ChatGPT 4.1)
- All metadata is sourced from Memobase. Media assets (stills/videos) are provided by the Bild + Ton database
of Schweizerisches Sozialarchiv.

## Pages and Navigation
```mermaid
  flowchart LR
    A[User] --> B[StartPage]
    B -->|click topic| C[TopicPage 1]
    B -->|footer link| D[ProjectPage]
    C -->|click object| F[ObjectPage 1]
    C -->|click topic| E[TopicPage N]
    C -->|breadcrumb| B
    C -->|footer link| D
    D -->|home link| B
    E -->|click object| G[ObjectPage N]
    E -->|click object| F
    E -->|click topic| C
    E -->|footer link| D
    E -->|nav link| B
    F -->|breadcrumb| C
    F -->|click topic| E
    F -->|nav link| B
    F -->|footer link| D
    G -->|click topic| E
    G -->|click topic| C
    G -->|footer link| D
    G -->|nav link| B
```


*(Outgoing links are left out in this chart.)*

## Data Flow and Functionality





---
© Moira Walter, 2025, Digital Humanities Universität Basel



```mermaid
flowchart TD
    A[User] --> B[StartPage]
    B --> C[useEffect: loadData]
    C --> D[getAllObjects API]
    D --> E[API Request to Memobase]
    E --> F[objects array]
    F --> G[prepareTreemapData]
    G --> H[initialData]
    H --> I[setInitialData/setMaxTotalValue]
    
    B --> J[YearRangeSlider]
    J --> K[User changes year range]
    K --> L[setYearRange]
    
    L --> M[useEffect: filter by year]
    M --> N[prepareTreemapData]
    N --> O[setTreemapData]
    
    O --> P[useEffect: render treemap]
    P --> Q[createTreemap D3.js]
    Q --> R[SVG Output]
    
    L --> S[debounced useEffect]
    S --> T[getTreemapImages]
    T --> U[fetchImage]
    U --> V[setTopicImages]
    
    R --> W[User clicks topic]
    W --> X[router.push to themen/topic]
  ```



```mermaid
flowchart TD
    A[(Memobase API)] --> B[getAllObjects]
    A --> C[getRecordList]
    A --> D[getRecord]
    
    B --> E[prepareTreemapData.js]
    E --> F[treemapData state]
    F --> G[treemap.js]
    G --> H[D3 Visualization]
    
    C --> I[filteredItems state]
    I --> J[...Gallery Component]
    I --> K[...getTreemapImages.js]
    K --> L[...topicImages state]
    
    D --> M[entry state]
    M --> N[SingleObject Component]
    
    K --> O[imageurl.js]
    O --> P[...Cloudinary Transformations]
    D --> Q[videourl.js]
    Q --> R[Video Embed]
```

```mermaid
flowchart TD
    A[User] --> B[StartPage app/page.js]
    B --> C[getAllObjects app/api/get-record-all.js]
    C --> D[API Request to Memobase]
    D --> E[API Response: objects array]
    E --> F[prepareTreemapData app/utils/treemapdata.js]
    F --> G[createTreemap app/utils/treemap.js]
    G --> H[D3 Treemap Visualization]

    B --> I[YearRangeSlider app/components/YearRangeSlider.js]
    I --> J[User changes year range]
    J --> F

    B --> K[User clicks topic]
    K --> L[TopicPage app/themen/*topic*/page.js]
    L --> M[getRecordList app/api/get-record-list.js]
    M --> N[API Request to Memobase]
    N --> O[API Response: topic objects]
    O --> P[filteredItems state]
    P --> Q[Gallery/List Rendering]

    Q --> R[User clicks object]
    R --> S[ObjectPage app/objekt/*id*/page.js]
    S --> T[getRecord app/api/get-record.js]
    T --> U[API Request to Memobase]
    U --> V[API Response: single object]
    V --> W[Object Details Rendering]
```

```mermaid
flowchart TD
    subgraph API
      A1[get-record-all.js] 
      A2[get-record-list.js]
      A3[get-record.js]
    end

    A1 --> B1[All objects array]
    B1 --> C1[prepareTreemapData.js]
    C1 --> D1[treemapData state]
    D1 --> E1[treemap.js]
    E1 --> F1[D3 Treemap Visualization]
    F1 --> G1[YearRangeSlider filter]
    G1 -.-> D1

    A2 --> B2[Topic objects array]
    B2 --> C2[filteredItems state]
    C2 --> D2[Gallery/List Rendering]
    C2 --> E2[getTreemapImages.js]
    E2 --> F2[topicImages state]

    A3 --> B3[Single object]
    B3 --> C3[SingleObject Component]
    B3 --> D3[videourl.js]
    D3 --> E3[Video Embed]
    E2 --> F3[imageurl.js]
    F3 --> G3[Cloudinary Transformations]
```