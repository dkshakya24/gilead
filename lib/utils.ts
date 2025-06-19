import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL =
  'https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev'
export const FEEDBACK_API =
  'https://wnpwxjhzvc.execute-api.us-east-1.amazonaws.com/dev/'
export const SUGGESTION_API =
  'https://gwmitkqkl6.execute-api.us-east-1.amazonaws.com/dev/'
export const WEBSOCKET =
  'wss://7x4ndqse6e.execute-api.us-east-1.amazonaws.com/dev'
export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME
export const PPT_GENERATE_API =
  'https://jnjldv2wrroq4d2yvxst5p7kki0basvl.lambda-url.us-east-1.on.aws/'
export const PPT_DOWNLOAD_API =
  'https://11vzxy3g5g.execute-api.us-east-1.amazonaws.com/dev/gilead_download_ppt_chat'
// export const AUTH_MICROSOFT_ENTRA_ID_ID =
//   process.env.NEXT_PUBLIC_AUTH_MICROSOFT_ENTRA_ID_ID
// export const AUTH_MICROSOFT_ENTRA_ID_SECRET =
//   process.env.NEXT_PUBLIC_AUTH_MICROSOFT_ENTRA_ID_SECRET
// export const AUTH_MICROSOFT_ENTRA_ID_ISSUER =
//   process.env.NEXT_PUBLIC_AUTH_MICROSOFT_ENTRA_ID_ISSUER

export const OKTA_CLIENT_ID = process.env.NEXT_PUBLIC_OKTA_CLIENT_ID
export const OKTA_CLIENT_SECRET = process.env.NEXT_PUBLIC_OKTA_CLIENT_SECRET
export const OKTA_ISSUER = process.env.NEXT_PUBLIC_OKTA_ISSUER

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return 'Invalid credentials!'
    case ResultCode.InvalidSubmission:
      return 'Invalid submission, please try again!'
    case ResultCode.UserAlreadyExists:
      return 'User already exists, please log in!'
    case ResultCode.UserCreated:
      return 'User created, welcome!'
    case ResultCode.UnknownError:
      return 'Something went wrong, please try again!'
    case ResultCode.UserLoggedIn:
      return 'Logged in!'
  }
}

export const esmoText = `
> **The key findings across 25 abstracts** focus on cancer treatment, immunotherapy, and targeted therapies.  

Studies on **immune checkpoint inhibitors (ICI)** show that **antibiotic (ATB) use before or after ICI initiation negatively affects treatment outcomes** due to gut microbiome disruptions, reducing **progression-free survival (PFS) and overall survival (OS)**.  

The **HERTHENA-PanTumor01 study** evaluates **HER3-DXd**, an **HER3-targeted antibody-drug conjugate (ADC)**, in multiple solid tumors, including melanoma and gastric cancers.  

The **platinum chemotherapy shortage in the U.S.** led to a **3.6% decline in its use** but showed **no significant impact on racial or socioeconomic disparities** in treatment access.  

The **STAMPEDE2 trial** explores **PARP inhibitors like Niraparib with Abiraterone Acetate for BRCA-mutated prostate cancer**, aiming to **improve survival outcomes**.  

**[177Lu]-PSMA-617, a radioligand therapy, is being tested in hormone-sensitive prostate cancer**, with accelerated schedules to enhance efficacy.  

**Tivozanib (VEGFR-TKI) in the TIVO-3 study** demonstrated **longer progression-free survival compared to sorafenib in renal cell carcinoma (RCC), particularly in CPI-resistant cases**.  

The **JAVELIN Bladder 100 trial** confirms that **avelumab maintenance therapy significantly improves survival for urothelial carcinoma patients post-chemotherapy**.  

Overall, the research emphasizes the **advancement of targeted therapies, immunotherapy combinations, and personalized treatment approaches in oncology**.
`

export const ascoText2024 = `
**Astellas, Merck (MSD), Pfizer**  
Enfortumab vedotin (EV) + pembrolizumab (P) greatly improved survival and slowed disease progression in untreated advanced urothelial cancer compared to standard chemo.

**Bristol Myers Squibb (BMS)**  
Nivolumab + chemo improved survival and response (57.6%) in untreated advanced urothelial cancer.

**ALX Oncology**  
Evorpacept + EV showed a 63% response rate in advanced urothelial cancer after prior treatments, with no major safety issues.

**Exelixis**  
Cabozantinib + EV had an 88.9% response rate in advanced urothelial cancer with a safe profile.

**Gilead**  
Sacituzumab govitecan (SG) after EV had a low 10% response rate and short survival in advanced urothelial cancer.

**Innovative Cellular Therapeutics**  
GCC19CART, a CAR-T therapy, had a 40% response rate in hard-to-treat colorectal cancer with manageable side effects.

**Pierre Fabre**  
Encorafenib + cetuximab improved progression-free survival in BRAF-mutant colorectal cancer in Chinese patients.

**Servier**  
Trifluridine/tipiracil + capecitabine + bevacizumab had a 72.7% response rate in untreated colorectal cancer patients unfit for strong chemo.

**Takeda**  
Fruquintinib + TAS-102 gave 6.46 months progression-free survival in third-line colorectal cancer with mild side effects.

**Merck (MSD)**  
Pembrolizumab improved progression-free survival in untreated colorectal cancer with specific gene defects, with more patients starting treatment after Australian funding.

**Brenus Pharma**  
STC-1010 vaccine is being tested in advanced colorectal cancer to improve survival, with good early lab results.

**Guardant Health**  
After EGFR treatment in colorectal cancer, new mutations suggest a mechanism that could guide new therapies.

**AstraZeneca**  
Trastuzumab deruxtecan in pretreated HER2-expressing urothelial cancer had a 39% response rate, with manageable safety.

**Bicycle Therapeutics**  
Testing BT8009 (nectin-4-targeted therapy) ± pembrolizumab vs. chemo in advanced urothelial cancer to evaluate survival and response.
`

export const amwcText = `
> **The AMWC 2024 Abstracts** highlight advancements in aesthetic medicine, regenerative therapies, and anti-aging research. Global trends in **full-face rejuvenation** emphasize achieving natural results using injectables, while **Bonsai Aesthetics from Japan** promotes facial harmony.  

**Red Light Therapy** shows promise in reducing herpes labialis severity, and **exosomes** are emerging for skin and genital restoration.  

Anti-aging research focuses on **molecular aging mechanisms**, with **collagen biostimulators** and **fat grafting for breast augmentation** gaining traction. **Glycans are being explored as biomarkers for aging**, and **mTOR modulation with Rapamycin** is being studied for longevity.  

Innovations in **laser and ultrasound technologies** improve skin tightening, while **microwave-based facial tightening** offers new non-invasive solutions.  

In **aesthetic gynecology**, **oxytocin gel** and **hyaluronic acid injections** show potential for treating vaginal atrophy, while a **novel PRP and botulinum toxin combination** is being tested for erectile dysfunction.  

Aesthetic medicine is also expanding for **gender-diverse patients**, offering personalized facial harmonization techniques.  

**Needleless injections using high-pressure hyaluronic acid** present a promising alternative for those with needle phobia.  

**NAD+ restoration is being explored to reverse biological aging**, and **Edelweiss extract** has demonstrated **anti-aging benefits by preventing fibroblast senescence**.  

The conference also highlights the **underdiagnosed condition of lipedema**, the role of **epigenetics in attraction**, and the shift towards **personalized and regenerative aesthetic medicine** for holistic patient care.
`
export const imcasText = `
> ** The Ultrasound in Aesthetic Medicine** document discusses the importance of ultrasound technology in facial aesthetic procedures, particularly for **filler placement, complication management, and anatomical assessment**. It emphasizes that ultrasound can **help identify filler misplacement, prevent vascular complications, and optimize treatment planning**.  

Pre-treatment scanning is highlighted as a crucial step in **avoiding vascular structures** and ensuring accurate filler placement, reducing the risk of **vascular occlusion and malar edema**.  

The document showcases **ultrasound-guided dissolving techniques**, enabling precise **hyaluronidase injections** for filler removal, especially in cases of nodules or migration. It also explores the **depth and distribution of facial fat layers**, aiding in customized filler injections based on **patient-specific fat volume and anatomical variations**.  

Moreover, ultrasound assists in identifying **vascular structures such as arteries and veins**, minimizing complications like **vascular occlusion and bruising**. It further underscores **the role of ultrasound in managing vascular adverse events**, enabling the detection of **ischemic areas** and guiding targeted treatment with **hyaluronidase**.  

Additionally, the document highlights the use of ultrasound for **evaluating bio-stimulatory fillers**, which are non-dissolvable and require strategic placement.  

It concludes by advocating for **ultrasound training in aesthetic medicine**, helping practitioners refine injection techniques, improve patient safety, and enhance treatment outcomes.
`

export const ascoText = `
> **The ASCO Genitourinary Cancers Symposium 2025 abstracts** document highlights several key findings from recent studies and clinical trials on advanced urothelial carcinoma (UC).  

A **Phase 1 study on SHR-A2102**, a nectin-4 targeted antibody-drug conjugate (ADC), demonstrated **promising anti-tumor activity**, particularly in patients who had failed prior ADC therapy, with an **overall response rate (ORR) of 38.4%** and manageable safety.  

The **CheckMate 274 trial** confirmed that **adjuvant nivolumab (NIVO) improved disease-free survival (DFS) and overall survival (OS) in high-risk muscle-invasive urothelial carcinoma (MIUC)**, particularly in patients with **PD-L1 â‰¥ 1%**.  

The **NIAGARA trial** showed that **perioperative durvalumab (D) plus neoadjuvant chemotherapy significantly reduced the risk of metastases and death from bladder cancer**, with patients achieving **pathological complete response (pCR) showing better long-term outcomes**.  

The **FORAGER-1 study** on LY3866288, an FGFR3 inhibitor, indicated **robust clinical activity in FGFR3-altered solid tumors**, including those refractory to prior FGFR inhibitors.  

The **EV-302/KEYNOTE-A39 trial** demonstrated **superior progression-free survival (PFS) and OS for enfortumab vedotin plus pembrolizumab (EV+P) compared to chemotherapy**, reinforcing it as a **first-line standard of care** for locally advanced/metastatic UC.  

The **ADAPT-BLADDER trial** found that **durvalumab combined with intravesical gemcitabine/docetaxel led to a high complete response rate (89%) in BCG-unresponsive non-muscle invasive bladder cancer (NMIBC)**.  

Additionally, **genomic studies revealed distinct biomarker profiles in young-onset and older UC patients**, which could influence personalized treatment strategies.  

Finally, **real-world analyses showed no significant racial disparities in survival outcomes for advanced UC patients** but suggested that **females had inferior progression-free survival (PFS) compared to males when treated with immunotherapy**.  

These findings support ongoing advancements in **targeted therapies, immunotherapies, and personalized treatment approaches** for urothelial carcinoma.
`
