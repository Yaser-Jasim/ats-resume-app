'use client'
import { useState } from 'react'
import { Languages } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/ui/BackButton'

const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
]

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  )
}

const CONTENT = {
  en: {
    title: 'Help Center',
    sections: [
      { title: 'Getting Started', items: [
        'Sign in with either "Continue with email" (confirm via the email we send you) or "Continue with Google" (no confirmation needed).',
        "Once logged in, you'll land on the main page — this is where every résumé starts.",
      ]},
      { title: 'Tailoring Your Résumé', items: [
        "Enter the position title and organization name you're applying to.",
        'Paste the full job description — the more complete it is, the better your result and score.',
        'Add your résumé by dragging in a PDF or DOCX file, or pasting the text directly.',
        'Click Generate. This takes a little while, since the AI is rewriting your summary, skills, and bullet points to match the job.',
        "You'll land on your results page automatically once it's done.",
      ]},
      { title: 'Understanding Your Scores', items: [
        "**ATS score** (green): an estimate of how well your résumé's keywords and structure match the job description, shown before and after tailoring.",
        '**Manager hit** (blue): an estimate of how compelling your résumé would be to a human hiring manager skimming it quickly.',
        "You'll also see which keywords were matched, and which are still missing — a guide for what to add if you have the real experience for it.",
        "These are AI-generated estimates to guide you, not a guarantee of how any specific employer's software will score your résumé.",
        'Click "Download the generated résumé" at the top of the results page to get your tailored résumé as a Word document.',
      ]},
      { title: 'Writing a Cover Letter', items: [
        'From your results page, click "Generate cover letter →".',
        'It writes itself automatically, using your tailored résumé and the job description.',
        'Download it as a Word document, or copy the text directly to paste elsewhere.',
      ]},
      { title: 'Drafting an Application Email', items: [
        'On your results page, click "Generate application email (optional)".',
        'This is a short, confident email you can send alongside your résumé — separate from a full cover letter.',
        'Click "Copy email" to copy the subject line and message, ready to paste into your email app.',
      ]},
      { title: 'Drafting a Reference Letter', items: [
        'On your results page, click "Draft a reference letter (optional)".',
        'Important: this is a starting draft for one of your real references to personalize and sign — not a finished, ready-to-submit letter.',
        "Download it and send it to your actual reference. They'll fill in their own name, title, company, and contact details (clearly marked in the document), and add at least one personal example of working with you.",
      ]},
      { title: 'Interview Prep', items: [
        'On your results page, click "Prep me for the interview (optional)".',
        'This builds a downloadable interview prep guide based on your tailored résumé and the job description — a suggested opening pitch, likely interview questions with example answers, behavioral (STAR method) scenario practice, smart questions to ask your interviewer, and tips for staying calm.',
        'Click "Download interview prep (.docx)" to get the full guide as a Word document.',
      ]},
      { title: 'Finding Past Résumés', items: [
        'Click "Search & Downloads" in the sidebar any time.',
        "You'll see every résumé you've generated, most recent first.",
        'Click "View" next to any entry to go back to that result page and re-download it.',
      ]},
      { title: 'Managing Your Account', items: [
        'Click your email at the bottom of the sidebar to open the account menu.',
        '"Account Information" — update your name or location, or see your current plan.',
        '"Location (Address)" — jumps straight to that field, which is used on your downloaded résumé.',
        '"Logout" — signs you out.',
      ]},
      { title: 'Subscription Plans & Credits', items: [
        'Click "Credit Usage" in the sidebar to see how many free résumés you have left.',
        'Free includes a limited number of tailored résumés. Pro gives unlimited résumés, cover letters, and emails.',
        'To upgrade, open the account menu → "Subscription Plans" → "Get Pro". If you have a promo code, there\'s a box for it on the checkout page.',
      ]},
      { title: 'For HR Managers & Recruiters', items: [
        "A separate tool for screening a candidate's résumé against a job posting — included with the HR / Recruiter plan.",
        'Click "For HR Managers" in the sidebar, enter the job details, and upload the candidate\'s résumé (required) and cover letter (optional).',
        'Click "Analyze Candidate" to get an ATS score, manager-fit score, recommendation, strengths, weaknesses, matched and missing requirements, and an education/experience check.',
        'Click "Download assessment (.docx)" to save the full report.',
      ]},
      { title: 'Sending Feedback', items: [
        'Open the account menu → "Send Feedback".',
        'Type your message and click Send — we read every one.',
      ]},
    ],
  },

  ar: {
    title: 'مركز المساعدة',
    sections: [
      { title: 'البدء', items: [
        'سجّل الدخول باستخدام "Continue with email" (قم بالتأكيد عبر البريد الإلكتروني الذي نرسله لك) أو "Continue with Google" (بدون الحاجة إلى تأكيد).',
        'بعد تسجيل الدخول، ستصل إلى الصفحة الرئيسية — وهنا تبدأ عملية كل سيرة ذاتية.',
      ]},
      { title: 'تخصيص سيرتك الذاتية', items: [
        'أدخل المسمى الوظيفي واسم المؤسسة التي تتقدم إليها.',
        'الصق الوصف الوظيفي كاملاً — فكلما كان أكثر اكتمالاً، كانت نتيجتك ودرجتك أفضل.',
        'أضف سيرتك الذاتية إما بسحب ملف PDF أو DOCX، أو بلصق النص مباشرة.',
        'انقر على "Generate". يستغرق هذا بعض الوقت لأن الذكاء الاصطناعي يعيد كتابة ملخصك ومهاراتك ونقاطك لتتوافق مع الوظيفة.',
        'ستصل تلقائيًا إلى صفحة النتائج بمجرد الانتهاء.',
      ]},
      { title: 'فهم درجاتك', items: [
        '**درجة ATS** (باللون الأخضر): تقدير لمدى تطابق الكلمات المفتاحية وبنية سيرتك الذاتية مع الوصف الوظيفي، معروضة قبل وبعد التخصيص.',
        '**مدى إعجاب المدير** (باللون الأزرق): تقدير لمدى إقناع سيرتك الذاتية لمدير توظيف بشري يطّلع عليها بسرعة.',
        'سترى أيضًا الكلمات المفتاحية التي تم العثور عليها، والتي لا تزال ناقصة — دليل لما يجب إضافته إذا كانت لديك الخبرة الفعلية.',
        'هذه تقديرات يولدها الذكاء الاصطناعي لإرشادك، وليست ضمانًا لكيفية تقييم برنامج أي جهة عمل محددة لسيرتك الذاتية.',
        'انقر على "Download the generated résumé" أعلى صفحة النتائج للحصول على سيرتك الذاتية المخصصة بصيغة Word.',
      ]},
      { title: 'كتابة خطاب تقديم', items: [
        'من صفحة النتائج، انقر على "Generate cover letter →".',
        'يتم كتابته تلقائيًا باستخدام سيرتك الذاتية المخصصة والوصف الوظيفي.',
        'حمّله بصيغة Word، أو انسخ النص مباشرة للصقه في مكان آخر.',
      ]},
      { title: 'صياغة بريد إلكتروني للتقديم', items: [
        'في صفحة النتائج، انقر على "Generate application email (optional)".',
        'هذه رسالة بريد إلكتروني قصيرة وواثقة يمكنك إرسالها مع سيرتك الذاتية — منفصلة عن خطاب التقديم الكامل.',
        'انقر على "Copy email" لنسخ العنوان والرسالة، جاهزين للصقهما في تطبيق البريد الإلكتروني الخاص بك.',
      ]},
      { title: 'صياغة خطاب توصية', items: [
        'في صفحة النتائج، انقر على "Draft a reference letter (optional)".',
        'مهم: هذه مسودة أولية لأحد المُزكّين الحقيقيين لديك ليقوم بتخصيصها والتوقيع عليها — وليست خطابًا نهائيًا جاهزًا للتقديم.',
        'حمّلها وأرسلها إلى المُزكّي الفعلي. سيحتاج إلى تعبئة اسمه ومنصبه وشركته وبيانات التواصل الخاصة به (موضحة بوضوح في المستند)، وإضافة مثال شخصي واحد على الأقل من عمله معك.',
      ]},
      { title: 'التحضير للمقابلة', items: [
        'في صفحة النتائج، انقر على "Prep me for the interview (optional)".',
        'يُنشئ هذا دليلاً قابلاً للتحميل للتحضير للمقابلة استناداً إلى سيرتك الذاتية المخصصة والوصف الوظيفي — يتضمن تقديماً مقترحاً عن نفسك، وأسئلة مقابلة متوقعة مع أمثلة على الإجابات، وتدريباً على سيناريوهات سلوكية بطريقة STAR، وأسئلة ذكية لطرحها على المُقابِل، ونصائح للحفاظ على هدوئك.',
        'انقر على "Download interview prep (.docx)" للحصول على الدليل الكامل بصيغة Word.',
      ]},
      { title: 'العثور على السير الذاتية السابقة', items: [
        'انقر على "Search & Downloads" في الشريط الجانبي في أي وقت.',
        'سترى جميع السير الذاتية التي أنشأتها، الأحدث أولاً.',
        'انقر على "View" بجانب أي إدخال للعودة إلى صفحة النتائج تلك وإعادة تحميلها.',
      ]},
      { title: 'إدارة حسابك', items: [
        'انقر على بريدك الإلكتروني أسفل الشريط الجانبي لفتح قائمة الحساب.',
        '"Account Information" — لتحديث اسمك أو موقعك، أو الاطلاع على خطتك الحالية.',
        '"Location (Address)" — للانتقال مباشرة إلى ذلك الحقل، المستخدم في سيرتك الذاتية المحمّلة.',
        '"Logout" — لتسجيل الخروج.',
      ]},
      { title: 'خطط الاشتراك والأرصدة', items: [
        'انقر على "Credit Usage" في الشريط الجانبي لمعرفة عدد السير الذاتية المجانية المتبقية لديك.',
        'تشمل الخطة المجانية عددًا محدودًا من السير الذاتية المخصصة. تمنحك خطة Pro سيرًا ذاتية وخطابات تقديم ورسائل بريد إلكتروني غير محدودة.',
        'للترقية، افتح قائمة الحساب ← "Subscription Plans" ← "Get Pro". إذا كان لديك رمز ترويجي، فهناك خانة مخصصة له في صفحة الدفع.',
      ]},
      { title: 'لمديري ومسؤولي التوظيف والموارد البشرية', items: [
        'أداة منفصلة لفحص سيرة ذاتية لمرشح مقابل إعلان وظيفي — مشمولة ضمن خطة HR / Recruiter.',
        'انقر على "For HR Managers" في الشريط الجانبي، وأدخل تفاصيل الوظيفة، ثم ارفع سيرة المرشح الذاتية (مطلوبة) وخطاب تقديمه (اختياري).',
        'انقر على "Analyze Candidate" للحصول على درجة ATS، ودرجة توافق مع المدير، وتوصية، ونقاط القوة والضعف، والمتطلبات المتوافقة والناقصة، وفحص للتعليم والخبرة.',
        'انقر على "Download assessment (.docx)" لحفظ التقرير الكامل.',
      ]},
      { title: 'إرسال ملاحظات', items: [
        'افتح قائمة الحساب ← "Send Feedback".',
        'اكتب رسالتك وانقر على Send — نقرأ كل رسالة تصلنا.',
      ]},
    ],
  },

  fr: {
    title: "Centre d'aide",
    sections: [
      { title: 'Premiers pas', items: [
        'Connectez-vous avec « Continue with email » (confirmez via l\'e-mail que nous vous envoyons) ou « Continue with Google » (aucune confirmation nécessaire).',
        "Une fois connecté(e), vous arrivez sur la page principale — c'est ici que commence chaque CV.",
      ]},
      { title: 'Adapter votre CV', items: [
        "Indiquez l'intitulé du poste et le nom de l'organisation pour lesquels vous postulez.",
        "Collez l'intégralité de la description du poste — plus elle est complète, meilleurs seront votre résultat et votre score.",
        'Ajoutez votre CV en glissant un fichier PDF ou DOCX, ou en collant directement le texte.',
        "Cliquez sur « Generate ». Cela prend un peu de temps, car l'IA réécrit votre résumé, vos compétences et vos points-clés pour correspondre au poste.",
        'Vous arrivez automatiquement sur votre page de résultats une fois terminé.',
      ]},
      { title: 'Comprendre vos scores', items: [
        "**Score ATS** (vert) : une estimation de la correspondance entre les mots-clés et la structure de votre CV et la description du poste, affichée avant et après l'adaptation.",
        "**Impact auprès du recruteur** (bleu) : une estimation de l'impact de votre CV sur un recruteur humain qui le parcourt rapidement.",
        "Vous verrez également quels mots-clés ont été trouvés, et lesquels manquent encore — un guide pour savoir quoi ajouter si vous avez l'expérience réelle correspondante.",
        "Ce sont des estimations générées par IA pour vous guider, pas une garantie de la façon dont le logiciel d'un employeur spécifique évaluera votre CV.",
        'Cliquez sur « Download the generated résumé » en haut de la page de résultats pour obtenir votre CV adapté au format Word.',
      ]},
      { title: 'Rédiger une lettre de motivation', items: [
        'Depuis votre page de résultats, cliquez sur « Generate cover letter → ».',
        "Elle se rédige automatiquement, à partir de votre CV adapté et de la description du poste.",
        'Téléchargez-la au format Word, ou copiez directement le texte pour le coller ailleurs.',
      ]},
      { title: "Rédiger un e-mail de candidature", items: [
        'Sur votre page de résultats, cliquez sur « Generate application email (optional) ».',
        "Il s'agit d'un e-mail court et confiant que vous pouvez envoyer avec votre CV — distinct d'une lettre de motivation complète.",
        "Cliquez sur « Copy email » pour copier l'objet et le message, prêts à être collés dans votre messagerie.",
      ]},
      { title: 'Rédiger une lettre de recommandation', items: [
        'Sur votre page de résultats, cliquez sur « Draft a reference letter (optional) ».',
        "Important : il s'agit d'une ébauche destinée à l'une de vos références réelles, qui devra la personnaliser et la signer — ce n'est pas une lettre finale prête à être soumise.",
        "Téléchargez-la et envoyez-la à votre référence. Elle devra compléter son propre nom, titre, entreprise et coordonnées (clairement indiqués dans le document), et ajouter au moins un exemple personnel de collaboration avec vous.",
      ]},
      { title: "Préparation à l'entretien", items: [
        'Sur votre page de résultats, cliquez sur « Prep me for the interview (optional) ».',
        "Cela crée un guide de préparation à l'entretien téléchargeable, basé sur votre CV adapté et la description du poste — une présentation d'ouverture suggérée, des questions d'entretien probables avec des exemples de réponses, des mises en situation comportementales (méthode STAR), des questions pertinentes à poser à votre interlocuteur, et des conseils pour rester calme.",
        'Cliquez sur « Download interview prep (.docx) » pour obtenir le guide complet au format Word.',
      ]},
      { title: 'Retrouver vos anciens CV', items: [
        'Cliquez sur « Search & Downloads » dans la barre latérale à tout moment.',
        'Vous verrez tous les CV que vous avez générés, du plus récent au plus ancien.',
        "Cliquez sur « View » à côté d'une entrée pour revenir à cette page de résultats et la retélécharger.",
      ]},
      { title: 'Gérer votre compte', items: [
        'Cliquez sur votre e-mail en bas de la barre latérale pour ouvrir le menu du compte.',
        '« Account Information » — modifiez votre nom ou votre localisation, ou consultez votre forfait actuel.',
        '« Location (Address) » — accède directement à ce champ, utilisé sur votre CV téléchargé.',
        '« Logout » — vous déconnecte.',
      ]},
      { title: 'Forfaits et crédits', items: [
        'Cliquez sur « Credit Usage » dans la barre latérale pour voir combien de CV gratuits il vous reste.',
        'Le forfait Free inclut un nombre limité de CV adaptés. Le forfait Pro offre des CV, lettres de motivation et e-mails illimités.',
        'Pour passer à un forfait supérieur, ouvrez le menu du compte → « Subscription Plans » → « Get Pro ». Si vous avez un code promo, une case lui est dédiée sur la page de paiement.',
      ]},
      { title: 'Pour les responsables RH et recruteurs', items: [
        "Un outil distinct pour évaluer le CV d'un candidat par rapport à une offre d'emploi — inclus avec le forfait HR / Recruiter.",
        'Cliquez sur « For HR Managers » dans la barre latérale, saisissez les détails du poste, puis téléchargez le CV du candidat (obligatoire) et sa lettre de motivation (facultatif).',
        "Cliquez sur « Analyze Candidate » pour obtenir un score ATS, un score d'adéquation avec le recruteur, une recommandation, les points forts, les points faibles, les exigences satisfaites et manquantes, ainsi qu'une vérification de la formation et de l'expérience.",
        'Cliquez sur « Download assessment (.docx) » pour enregistrer le rapport complet.',
      ]},
      { title: 'Envoyer un commentaire', items: [
        'Ouvrez le menu du compte → « Send Feedback ».',
        'Rédigez votre message et cliquez sur Send — nous lisons chaque message.',
      ]},
    ],
  },

  es: {
    title: 'Centro de ayuda',
    sections: [
      { title: 'Primeros pasos', items: [
        'Inicia sesión con "Continue with email" (confirma mediante el correo que te enviamos) o "Continue with Google" (sin necesidad de confirmación).',
        'Una vez conectado(a), llegarás a la página principal — aquí es donde comienza cada currículum.',
      ]},
      { title: 'Adaptar tu currículum', items: [
        'Ingresa el puesto y el nombre de la organización a la que estás postulando.',
        'Pega la descripción completa del puesto — cuanto más completa sea, mejor será tu resultado y puntuación.',
        'Agrega tu currículum arrastrando un archivo PDF o DOCX, o pegando el texto directamente.',
        'Haz clic en "Generate". Esto tarda un poco, ya que la IA reescribe tu resumen, habilidades y viñetas para que coincidan con el puesto.',
        'Llegarás automáticamente a tu página de resultados una vez terminado.',
      ]},
      { title: 'Cómo entender tus puntuaciones', items: [
        '**Puntuación ATS** (verde): una estimación de qué tan bien las palabras clave y la estructura de tu currículum coinciden con la descripción del puesto, mostrada antes y después de la adaptación.',
        '**Impacto en el reclutador** (azul): una estimación de qué tan convincente sería tu currículum para un reclutador humano que lo revisa rápidamente.',
        'También verás qué palabras clave coincidieron y cuáles faltan aún — una guía de qué agregar si tienes la experiencia real correspondiente.',
        'Estas son estimaciones generadas por IA para orientarte, no una garantía de cómo el software específico de un empleador calificará tu currículum.',
        'Haz clic en "Download the generated résumé" en la parte superior de la página de resultados para obtener tu currículum adaptado en formato Word.',
      ]},
      { title: 'Redactar una carta de presentación', items: [
        'Desde tu página de resultados, haz clic en "Generate cover letter →".',
        'Se redacta automáticamente, usando tu currículum adaptado y la descripción del puesto.',
        'Descárgala en formato Word, o copia el texto directamente para pegarlo en otro lugar.',
      ]},
      { title: 'Redactar un correo de solicitud', items: [
        'En tu página de resultados, haz clic en "Generate application email (optional)".',
        'Es un correo breve y seguro que puedes enviar junto con tu currículum — independiente de una carta de presentación completa.',
        'Haz clic en "Copy email" para copiar el asunto y el mensaje, listos para pegar en tu aplicación de correo.',
      ]},
      { title: 'Redactar una carta de recomendación', items: [
        'En tu página de resultados, haz clic en "Draft a reference letter (optional)".',
        'Importante: esto es un borrador inicial para que una de tus referencias reales lo personalice y firme — no es una carta final lista para entregar.',
        'Descárgala y envíasela a tu referencia real. Esa persona deberá completar su propio nombre, cargo, empresa y datos de contacto (claramente indicados en el documento), y agregar al menos un ejemplo personal de haber trabajado contigo.',
      ]},
      { title: 'Preparación para la entrevista', items: [
        'En tu página de resultados, haz clic en "Prep me for the interview (optional)".',
        'Esto crea una guía descargable de preparación para la entrevista, basada en tu currículum adaptado y la descripción del puesto — incluye una presentación inicial sugerida, preguntas probables de la entrevista con ejemplos de respuestas, práctica de escenarios de comportamiento (método STAR), preguntas inteligentes para hacerle a tu entrevistador y consejos para mantener la calma.',
        'Haz clic en "Download interview prep (.docx)" para obtener la guía completa en formato Word.',
      ]},
      { title: 'Encontrar currículums anteriores', items: [
        'Haz clic en "Search & Downloads" en la barra lateral en cualquier momento.',
        'Verás todos los currículums que has generado, del más reciente al más antiguo.',
        'Haz clic en "View" junto a cualquier entrada para volver a esa página de resultados y descargarla de nuevo.',
      ]},
      { title: 'Administrar tu cuenta', items: [
        'Haz clic en tu correo electrónico en la parte inferior de la barra lateral para abrir el menú de la cuenta.',
        '"Account Information" — actualiza tu nombre o ubicación, o consulta tu plan actual.',
        '"Location (Address)" — te lleva directamente a ese campo, usado en tu currículum descargado.',
        '"Logout" — cierra tu sesión.',
      ]},
      { title: 'Planes de suscripción y créditos', items: [
        'Haz clic en "Credit Usage" en la barra lateral para ver cuántos currículums gratuitos te quedan.',
        'El plan Free incluye un número limitado de currículums adaptados. El plan Pro ofrece currículums, cartas de presentación y correos ilimitados.',
        'Para actualizar, abre el menú de la cuenta → "Subscription Plans" → "Get Pro". Si tienes un código promocional, hay un campo para eso en la página de pago.',
      ]},
      { title: 'Para gerentes de RR. HH. y reclutadores', items: [
        'Una herramienta independiente para evaluar el currículum de un candidato frente a una oferta de empleo — incluida en el plan HR / Recruiter.',
        'Haz clic en "For HR Managers" en la barra lateral, ingresa los detalles del puesto y sube el currículum del candidato (obligatorio) y su carta de presentación (opcional).',
        'Haz clic en "Analyze Candidate" para obtener una puntuación ATS, una puntuación de adecuación para el gerente, una recomendación, fortalezas, debilidades, requisitos cumplidos y faltantes, y una verificación de educación y experiencia.',
        'Haz clic en "Download assessment (.docx)" para guardar el informe completo.',
      ]},
      { title: 'Enviar comentarios', items: [
        'Abre el menú de la cuenta → "Send Feedback".',
        'Escribe tu mensaje y haz clic en Send — leemos todos los mensajes.',
      ]},
    ],
  },

  pa: {
    title: 'ਮਦਦ ਕੇਂਦਰ',
    sections: [
      { title: 'ਸ਼ੁਰੂਆਤ ਕਰਨਾ', items: [
        '"Continue with email" (ਸਾਡੇ ਵੱਲੋਂ ਭੇਜੀ ਗਈ ਈਮੇਲ ਰਾਹੀਂ ਪੁਸ਼ਟੀ ਕਰੋ) ਜਾਂ "Continue with Google" (ਕਿਸੇ ਪੁਸ਼ਟੀ ਦੀ ਲੋੜ ਨਹੀਂ) ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ।',
        "ਇੱਕ ਵਾਰ ਲੌਗਇਨ ਹੋਣ ਤੋਂ ਬਾਅਦ, ਤੁਸੀਂ ਮੁੱਖ ਪੰਨੇ 'ਤੇ ਪਹੁੰਚੋਗੇ — ਇੱਥੋਂ ਹੀ ਹਰ ਰੈਜ਼ਿਊਮੇ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।",
      ]},
      { title: 'ਆਪਣੇ ਰੈਜ਼ਿਊਮੇ ਨੂੰ ਢਾਲਣਾ', items: [
        'ਜਿਸ ਅਹੁਦੇ ਅਤੇ ਸੰਸਥਾ ਲਈ ਤੁਸੀਂ ਅਰਜ਼ੀ ਦੇ ਰਹੇ ਹੋ, ਉਸਦਾ ਨਾਮ ਦਰਜ ਕਰੋ।',
        'ਪੂਰਾ ਨੌਕਰੀ ਵੇਰਵਾ ਪੇਸਟ ਕਰੋ — ਇਹ ਜਿੰਨਾ ਮੁਕੰਮਲ ਹੋਵੇਗਾ, ਤੁਹਾਡਾ ਨਤੀਜਾ ਅਤੇ ਸਕੋਰ ਓਨਾ ਹੀ ਬਿਹਤਰ ਹੋਵੇਗਾ।',
        'PDF ਜਾਂ DOCX ਫਾਈਲ ਖਿੱਚ ਕੇ ਜਾਂ ਸਿੱਧਾ ਟੈਕਸਟ ਪੇਸਟ ਕਰਕੇ ਆਪਣਾ ਰੈਜ਼ਿਊਮੇ ਸ਼ਾਮਲ ਕਰੋ।',
        '"Generate" \'ਤੇ ਕਲਿੱਕ ਕਰੋ। ਇਸ ਵਿੱਚ ਥੋੜ੍ਹਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ, ਕਿਉਂਕਿ AI ਤੁਹਾਡੇ ਸੰਖੇਪ, ਹੁਨਰਾਂ ਅਤੇ ਬਿੰਦੂਆਂ ਨੂੰ ਨੌਕਰੀ ਨਾਲ ਮੇਲ ਖਾਣ ਲਈ ਦੁਬਾਰਾ ਲਿਖਦਾ ਹੈ।',
        "ਪੂਰਾ ਹੋਣ 'ਤੇ ਤੁਸੀਂ ਆਪਣੇ ਆਪ ਨਤੀਜਿਆਂ ਵਾਲੇ ਪੰਨੇ 'ਤੇ ਪਹੁੰਚ ਜਾਓਗੇ।",
      ]},
      { title: 'ਆਪਣੇ ਸਕੋਰਾਂ ਨੂੰ ਸਮਝਣਾ', items: [
        '**ATS ਸਕੋਰ** (ਹਰਾ): ਇਹ ਅੰਦਾਜ਼ਾ ਕਿ ਤੁਹਾਡੇ ਰੈਜ਼ਿਊਮੇ ਦੇ ਕੀਵਰਡ ਅਤੇ ਢਾਂਚਾ ਨੌਕਰੀ ਵੇਰਵੇ ਨਾਲ ਕਿੰਨਾ ਮੇਲ ਖਾਂਦਾ ਹੈ, ਢਾਲਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਦਿਖਾਇਆ ਜਾਂਦਾ ਹੈ।',
        '**ਮੈਨੇਜਰ ਹਿੱਟ** (ਨੀਲਾ): ਇਹ ਅੰਦਾਜ਼ਾ ਕਿ ਤੁਹਾਡਾ ਰੈਜ਼ਿਊਮੇ ਇੱਕ ਮਨੁੱਖੀ ਹਾਇਰਿੰਗ ਮੈਨੇਜਰ ਨੂੰ ਤੇਜ਼ੀ ਨਾਲ ਦੇਖਦੇ ਹੋਏ ਕਿੰਨਾ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਲੱਗੇਗਾ।',
        'ਤੁਸੀਂ ਇਹ ਵੀ ਦੇਖੋਗੇ ਕਿ ਕਿਹੜੇ ਕੀਵਰਡ ਮੇਲ ਖਾਧੇ, ਅਤੇ ਕਿਹੜੇ ਅਜੇ ਵੀ ਗਾਇਬ ਹਨ — ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਅਸਲ ਤਜਰਬਾ ਹੈ ਤਾਂ ਕੀ ਸ਼ਾਮਲ ਕਰਨਾ ਹੈ, ਇਸ ਲਈ ਇੱਕ ਗਾਈਡ।',
        'ਇਹ AI ਦੁਆਰਾ ਤਿਆਰ ਕੀਤੇ ਅੰਦਾਜ਼ੇ ਹਨ ਜੋ ਤੁਹਾਡੀ ਅਗਵਾਈ ਲਈ ਹਨ, ਇਹ ਕੋਈ ਗਾਰੰਟੀ ਨਹੀਂ ਕਿ ਕਿਸੇ ਖਾਸ ਮਾਲਕ ਦਾ ਸਾਫਟਵੇਅਰ ਤੁਹਾਡੇ ਰੈਜ਼ਿਊਮੇ ਨੂੰ ਕਿਵੇਂ ਸਕੋਰ ਕਰੇਗਾ।',
        '"Download the generated résumé" ਬਟਨ ਨੂੰ ਨਤੀਜਿਆਂ ਵਾਲੇ ਪੰਨੇ ਦੇ ਸਿਖਰ \'ਤੇ ਕਲਿੱਕ ਕਰੋ ਤਾਂ ਜੋ Word ਦਸਤਾਵੇਜ਼ ਵਜੋਂ ਆਪਣਾ ਢਾਲਿਆ ਰੈਜ਼ਿਊਮੇ ਪ੍ਰਾਪਤ ਕਰ ਸਕੋ।',
      ]},
      { title: 'ਕਵਰ ਲੈਟਰ ਲਿਖਣਾ', items: [
        '"Generate cover letter →" ਬਟਨ \'ਤੇ ਆਪਣੇ ਨਤੀਜਿਆਂ ਵਾਲੇ ਪੰਨੇ ਤੋਂ ਕਲਿੱਕ ਕਰੋ।',
        'ਇਹ ਤੁਹਾਡੇ ਢਾਲੇ ਹੋਏ ਰੈਜ਼ਿਊਮੇ ਅਤੇ ਨੌਕਰੀ ਵੇਰਵੇ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਆਪਣੇ ਆਪ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।',
        'ਇਸਨੂੰ Word ਦਸਤਾਵੇਜ਼ ਵਜੋਂ ਡਾਊਨਲੋਡ ਕਰੋ, ਜਾਂ ਕਿਤੇ ਹੋਰ ਪੇਸਟ ਕਰਨ ਲਈ ਸਿੱਧਾ ਟੈਕਸਟ ਕਾਪੀ ਕਰੋ।',
      ]},
      { title: 'ਅਰਜ਼ੀ ਈਮੇਲ ਤਿਆਰ ਕਰਨਾ', items: [
        '"Generate application email (optional)" \'ਤੇ ਆਪਣੇ ਨਤੀਜਿਆਂ ਵਾਲੇ ਪੰਨੇ \'ਤੇ ਕਲਿੱਕ ਕਰੋ।',
        'ਇਹ ਇੱਕ ਛੋਟੀ, ਭਰੋਸੇਮੰਦ ਈਮੇਲ ਹੈ ਜੋ ਤੁਸੀਂ ਆਪਣੇ ਰੈਜ਼ਿਊਮੇ ਨਾਲ ਭੇਜ ਸਕਦੇ ਹੋ — ਇਹ ਪੂਰੇ ਕਵਰ ਲੈਟਰ ਤੋਂ ਵੱਖਰੀ ਹੈ।',
        '"Copy email" \'ਤੇ ਕਲਿੱਕ ਕਰੋ ਤਾਂ ਜੋ ਵਿਸ਼ਾ ਅਤੇ ਸੁਨੇਹਾ ਕਾਪੀ ਹੋ ਜਾਵੇ, ਜੋ ਤੁਹਾਡੀ ਈਮੇਲ ਐਪ ਵਿੱਚ ਪੇਸਟ ਕਰਨ ਲਈ ਤਿਆਰ ਹੈ।',
      ]},
      { title: 'ਸਿਫ਼ਾਰਸ਼ੀ ਪੱਤਰ ਤਿਆਰ ਕਰਨਾ', items: [
        '"Draft a reference letter (optional)" \'ਤੇ ਆਪਣੇ ਨਤੀਜਿਆਂ ਵਾਲੇ ਪੰਨੇ \'ਤੇ ਕਲਿੱਕ ਕਰੋ।',
        "ਜ਼ਰੂਰੀ: ਇਹ ਤੁਹਾਡੇ ਕਿਸੇ ਅਸਲ ਸਿਫ਼ਾਰਸ਼ਕਰਤਾ ਲਈ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਖਰੜਾ ਹੈ ਤਾਂ ਜੋ ਉਹ ਇਸਨੂੰ ਆਪਣੇ ਮੁਤਾਬਕ ਢਾਲ ਕੇ ਦਸਤਖਤ ਕਰ ਸਕਣ — ਇਹ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ ਤਿਆਰ ਅੰਤਿਮ ਪੱਤਰ ਨਹੀਂ ਹੈ।",
        "ਇਸਨੂੰ ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਆਪਣੇ ਅਸਲ ਸਿਫ਼ਾਰਸ਼ਕਰਤਾ ਨੂੰ ਭੇਜੋ। ਉਹਨਾਂ ਨੂੰ ਆਪਣਾ ਨਾਮ, ਅਹੁਦਾ, ਕੰਪਨੀ ਅਤੇ ਸੰਪਰਕ ਵੇਰਵੇ (ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਸਪੱਸ਼ਟ ਤੌਰ 'ਤੇ ਦਰਸਾਏ ਗਏ) ਭਰਨੇ ਹੋਣਗੇ, ਅਤੇ ਤੁਹਾਡੇ ਨਾਲ ਕੰਮ ਕਰਨ ਦੀ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਨਿੱਜੀ ਉਦਾਹਰਣ ਸ਼ਾਮਲ ਕਰਨੀ ਹੋਵੇਗੀ।",
      ]},
      { title: 'ਇੰਟਰਵਿਊ ਦੀ ਤਿਆਰੀ', items: [
        '"Prep me for the interview (optional)" \'ਤੇ ਆਪਣੇ ਨਤੀਜਿਆਂ ਵਾਲੇ ਪੰਨੇ \'ਤੇ ਕਲਿੱਕ ਕਰੋ।',
        'ਇਹ ਤੁਹਾਡੇ ਢਾਲੇ ਹੋਏ ਰੈਜ਼ਿਊਮੇ ਅਤੇ ਨੌਕਰੀ ਵੇਰਵੇ ਦੇ ਆਧਾਰ \'ਤੇ ਇੱਕ ਡਾਊਨਲੋਡ ਹੋਣ ਯੋਗ ਇੰਟਰਵਿਊ ਤਿਆਰੀ ਗਾਈਡ ਬਣਾਉਂਦਾ ਹੈ — ਇਸ ਵਿੱਚ ਇੱਕ ਸੁਝਾਈ ਗਈ ਸ਼ੁਰੂਆਤੀ ਜਾਣ-ਪਛਾਣ, ਉਦਾਹਰਣ ਜਵਾਬਾਂ ਦੇ ਨਾਲ ਸੰਭਾਵਿਤ ਇੰਟਰਵਿਊ ਸਵਾਲ, ਵਿਵਹਾਰ-ਆਧਾਰਿਤ (STAR ਵਿਧੀ) ਦ੍ਰਿਸ਼ਾਂ ਦਾ ਅਭਿਆਸ, ਤੁਹਾਡੇ ਇੰਟਰਵਿਊ ਲੈਣ ਵਾਲੇ ਨੂੰ ਪੁੱਛਣ ਲਈ ਸਮਝਦਾਰ ਸਵਾਲ, ਅਤੇ ਸ਼ਾਂਤ ਰਹਿਣ ਲਈ ਸੁਝਾਅ ਸ਼ਾਮਲ ਹਨ।',
        '"Download interview prep (.docx)" \'ਤੇ ਕਲਿੱਕ ਕਰੋ ਤਾਂ ਜੋ ਪੂਰੀ ਗਾਈਡ Word ਦਸਤਾਵੇਜ਼ ਵਜੋਂ ਮਿਲ ਸਕੇ।',
      ]},
      { title: 'ਪਿਛਲੇ ਰੈਜ਼ਿਊਮੇ ਲੱਭਣਾ', items: [
        '"Search & Downloads" \'ਤੇ ਸਾਈਡਬਾਰ ਵਿੱਚ ਕਿਸੇ ਵੀ ਸਮੇਂ ਕਲਿੱਕ ਕਰੋ।',
        'ਤੁਸੀਂ ਹੁਣ ਤੱਕ ਬਣਾਏ ਸਾਰੇ ਰੈਜ਼ਿਊਮੇ ਦੇਖੋਗੇ, ਸਭ ਤੋਂ ਨਵੇਂ ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ।',
        '"View" \'ਤੇ ਕਿਸੇ ਵੀ ਐਂਟਰੀ ਦੇ ਨਾਲ ਕਲਿੱਕ ਕਰੋ ਤਾਂ ਜੋ ਉਸ ਨਤੀਜਿਆਂ ਵਾਲੇ ਪੰਨੇ \'ਤੇ ਵਾਪਸ ਜਾ ਕੇ ਦੁਬਾਰਾ ਡਾਊਨਲੋਡ ਕੀਤਾ ਜਾ ਸਕੇ।',
      ]},
      { title: 'ਆਪਣਾ ਖਾਤਾ ਪ੍ਰਬੰਧਿਤ ਕਰਨਾ', items: [
        'ਖਾਤਾ ਮੀਨੂ ਖੋਲ੍ਹਣ ਲਈ ਸਾਈਡਬਾਰ ਦੇ ਹੇਠਾਂ ਆਪਣੀ ਈਮੇਲ \'ਤੇ ਕਲਿੱਕ ਕਰੋ।',
        '"Account Information" — ਆਪਣਾ ਨਾਮ ਜਾਂ ਟਿਕਾਣਾ ਅੱਪਡੇਟ ਕਰੋ, ਜਾਂ ਆਪਣੀ ਮੌਜੂਦਾ ਯੋਜਨਾ ਦੇਖੋ।',
        '"Location (Address)" — ਸਿੱਧਾ ਉਸ ਖੇਤਰ \'ਤੇ ਜਾਂਦਾ ਹੈ, ਜੋ ਤੁਹਾਡੇ ਡਾਊਨਲੋਡ ਕੀਤੇ ਰੈਜ਼ਿਊਮੇ \'ਤੇ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।',
        '"Logout" — ਤੁਹਾਨੂੰ ਸਾਈਨ ਆਊਟ ਕਰਦਾ ਹੈ।',
      ]},
      { title: 'ਸਬਸਕ੍ਰਿਪਸ਼ਨ ਯੋਜਨਾਵਾਂ ਅਤੇ ਕ੍ਰੈਡਿਟ', items: [
        'ਇਹ ਦੇਖਣ ਲਈ ਕਿ ਤੁਹਾਡੇ ਕੋਲ ਕਿੰਨੇ ਮੁਫ਼ਤ ਰੈਜ਼ਿਊਮੇ ਬਾਕੀ ਹਨ, "Credit Usage" \'ਤੇ ਸਾਈਡਬਾਰ ਵਿੱਚ ਕਲਿੱਕ ਕਰੋ।',
        'Free ਯੋਜਨਾ ਵਿੱਚ ਸੀਮਿਤ ਗਿਣਤੀ ਵਿੱਚ ਢਾਲੇ ਹੋਏ ਰੈਜ਼ਿਊਮੇ ਸ਼ਾਮਲ ਹਨ। Pro ਯੋਜਨਾ ਅਸੀਮਤ ਰੈਜ਼ਿਊਮੇ, ਕਵਰ ਲੈਟਰ ਅਤੇ ਈਮੇਲ ਦਿੰਦੀ ਹੈ।',
        'ਅੱਪਗ੍ਰੇਡ ਕਰਨ ਲਈ, ਖਾਤਾ ਮੀਨੂ → "Subscription Plans" → "Get Pro" ਖੋਲ੍ਹੋ। ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਪ੍ਰੋਮੋ ਕੋਡ ਹੈ, ਤਾਂ ਭੁਗਤਾਨ ਪੰਨੇ \'ਤੇ ਇਸ ਲਈ ਇੱਕ ਬਾਕਸ ਹੈ।',
      ]},
      { title: 'HR ਮੈਨੇਜਰਾਂ ਅਤੇ ਭਰਤੀਕਾਰਾਂ ਲਈ', items: [
        'ਕਿਸੇ ਉਮੀਦਵਾਰ ਦੇ ਰੈਜ਼ਿਊਮੇ ਨੂੰ ਨੌਕਰੀ ਦੀ ਪੋਸਟਿੰਗ ਨਾਲ ਜਾਂਚਣ ਲਈ ਇੱਕ ਵੱਖਰਾ ਟੂਲ — HR / Recruiter ਯੋਜਨਾ ਨਾਲ ਸ਼ਾਮਲ ਹੈ।',
        '"For HR Managers" \'ਤੇ ਸਾਈਡਬਾਰ ਵਿੱਚ ਕਲਿੱਕ ਕਰੋ, ਨੌਕਰੀ ਦੇ ਵੇਰਵੇ ਦਰਜ ਕਰੋ, ਅਤੇ ਉਮੀਦਵਾਰ ਦਾ ਰੈਜ਼ਿਊਮੇ (ਲਾਜ਼ਮੀ) ਅਤੇ ਕਵਰ ਲੈਟਰ (ਵਿਕਲਪਿਕ) ਅੱਪਲੋਡ ਕਰੋ।',
        '"Analyze Candidate" \'ਤੇ ਕਲਿੱਕ ਕਰੋ ਤਾਂ ਜੋ ATS ਸਕੋਰ, ਮੈਨੇਜਰ-ਫਿੱਟ ਸਕੋਰ, ਸਿਫ਼ਾਰਸ਼, ਤਾਕਤਾਂ, ਕਮਜ਼ੋਰੀਆਂ, ਮੇਲ ਖਾਂਦੀਆਂ ਅਤੇ ਗੁੰਮ ਲੋੜਾਂ, ਅਤੇ ਸਿੱਖਿਆ/ਤਜਰਬੇ ਦੀ ਜਾਂਚ ਮਿਲ ਸਕੇ।',
        '"Download assessment (.docx)" \'ਤੇ ਕਲਿੱਕ ਕਰੋ ਤਾਂ ਜੋ ਪੂਰੀ ਰਿਪੋਰਟ ਸੰਭਾਲੀ ਜਾ ਸਕੇ।',
      ]},
      { title: 'ਫੀਡਬੈਕ ਭੇਜਣਾ', items: [
        'ਖਾਤਾ ਮੀਨੂ → "Send Feedback" ਖੋਲ੍ਹੋ।',
        'ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ ਅਤੇ Send \'ਤੇ ਕਲਿੱਕ ਕਰੋ — ਅਸੀਂ ਹਰ ਸੁਨੇਹਾ ਪੜ੍ਹਦੇ ਹਾਂ।',
      ]},
    ],
  },

  zh: {
    title: '帮助中心',
    sections: [
      { title: '开始使用', items: [
        '使用 "Continue with email"（通过我们发送的邮件进行确认）或 "Continue with Google"（无需确认）登录。',
        '登录后，您将进入主页面——每份简历都从这里开始。',
      ]},
      { title: '定制您的简历', items: [
        '输入您申请的职位名称和公司名称。',
        '粘贴完整的职位描述——描述越完整，您的结果和分数就越好。',
        '通过拖入 PDF 或 DOCX 文件，或直接粘贴文本来添加您的简历。',
        '点击 "Generate"。这需要一点时间，因为 AI 正在重写您的个人简介、技能和要点，以匹配该职位。',
        '完成后，您将自动进入结果页面。',
      ]},
      { title: '了解您的分数', items: [
        '**ATS 分数**（绿色）：估算您简历的关键词和结构与职位描述的匹配程度，分别显示定制前和定制后的分数。',
        '**招聘经理匹配度**（蓝色）：估算招聘经理快速浏览时，您的简历会有多大吸引力。',
        '您还会看到哪些关键词已匹配，哪些仍然缺失——如果您具备相关的实际经验，这可以指导您添加哪些内容。',
        '这些是 AI 生成的估算值，用于为您提供参考，并不保证任何特定雇主的软件会如何为您的简历评分。',
        '点击结果页面顶部的 "Download the generated résumé"，即可获得 Word 格式的定制简历。',
      ]},
      { title: '撰写求职信', items: [
        '在结果页面，点击 "Generate cover letter →"。',
        '系统会根据您的定制简历和职位描述自动生成求职信。',
        '您可以下载 Word 文档，或直接复制文本粘贴到其他地方。',
      ]},
      { title: '撰写求职邮件', items: [
        '在结果页面，点击 "Generate application email (optional)"。',
        '这是一封简短、自信的邮件，可与您的简历一起发送——与完整的求职信不同。',
        '点击 "Copy email" 复制主题和正文，即可粘贴到您的邮件应用中。',
      ]},
      { title: '撰写推荐信', items: [
        '在结果页面，点击 "Draft a reference letter (optional)"。',
        '重要提示：这是一份初稿，供您的真实推荐人个性化修改并签署——并非可直接提交的最终推荐信。',
        '下载后发送给您的真实推荐人。对方需要填写自己的姓名、职位、公司和联系方式（文档中已明确标注），并至少添加一个与您共事的个人实例。',
      ]},
      { title: '面试准备', items: [
        '在结果页面，点击 "Prep me for the interview (optional)"。',
        '系统会根据您的定制简历和职位描述，生成一份可下载的面试准备指南——包括建议的开场自我介绍、可能会被问到的面试问题及示例回答、行为面试（STAR 方法）情景练习、可以向面试官提出的有见地的问题，以及缓解紧张情绪的技巧。',
        '点击 "Download interview prep (.docx)" 即可获得完整的 Word 格式指南。',
      ]},
      { title: '查找历史简历', items: [
        '随时点击侧边栏中的 "Search & Downloads"。',
        '您将看到所有已生成的简历，按最新到最旧排列。',
        '点击任意条目旁的 "View"，即可返回该结果页面并重新下载。',
      ]},
      { title: '管理您的账户', items: [
        '点击侧边栏底部的邮箱地址，打开账户菜单。',
        '"Account Information" —— 更新您的姓名或地址，或查看您当前的套餐。',
        '"Location (Address)" —— 直接跳转到该字段，此地址将用于您下载的简历中。',
        '"Logout" —— 退出登录。',
      ]},
      { title: '订阅套餐与额度', items: [
        '点击侧边栏中的 "Credit Usage"，查看您还剩多少免费简历次数。',
        '免费套餐包含有限次数的定制简历。Pro 套餐提供无限次数的简历、求职信和邮件。',
        '如需升级，请打开账户菜单 → "Subscription Plans" → "Get Pro"。如果您有优惠码，结账页面上有专门的输入框。',
      ]},
      { title: '面向人力资源经理与招聘人员', items: [
        '这是一个独立工具，用于根据职位发布筛选候选人简历——包含在 HR / Recruiter 套餐中。',
        '点击侧边栏中的 "For HR Managers"，输入职位详情，然后上传候选人的简历（必填）和求职信（选填）。',
        '点击 "Analyze Candidate"，即可获得 ATS 分数、招聘经理匹配度分数、推荐结论、优势、劣势、已匹配和缺失的要求，以及教育和经验核查结果。',
        '点击 "Download assessment (.docx)" 保存完整报告。',
      ]},
      { title: '发送反馈', items: [
        '打开账户菜单 → "Send Feedback"。',
        '输入您的留言并点击 Send —— 我们会阅读每一条反馈。',
      ]},
    ],
  },
}

export default function HelpPage() {
  const [lang, setLang] = useState('en')
  const current = CONTENT[lang]
  const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr'

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mx-auto p-8 max-w-2xl" dir={dir}>
        <BackButton />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">{current.title}</h1>
          <div className="relative">
            <Languages className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 pointer-events-none" />
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="border rounded pl-7 pr-3 py-1.5 text-sm bg-white"
              dir="ltr"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {current.sections.map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
              {section.items.map((item, j) => (
                <li key={j}>{parseBold(item)}</li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  )
}