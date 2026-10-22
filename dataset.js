/* ============================================================
   Mythe ou Fact ? — Octobre Rose
   Dataset des 12 cartes (7 mythes, 5 facts)

   Champs :
   - id          : numéro unique
   - statement   : l'affirmation affichée sur la carte
   - type        : "myth" ou "fact"
   - explanation : la vérité (si myth) ou le conseil à retenir (si fact)
   - source      : organisme / publication qui appuie l'information
   ============================================================ */

const CARDS = [
    {
        id: 1,
        statement: "Seules les femmes peuvent avoir un cancer du sein.",
        type: "myth",
        explanation: "Les hommes aussi peuvent en avoir : environ 0,5 à 1 % des cas touchent des hommes. C'est rare, mais tout changement inhabituel au niveau du sein doit être montré à un médecin, quel que soit le sexe.",
        source: "Feuille d'information sur le dépistage du cancer du sein, Gouvernement du Nunavut (2026)"
    },
    {
        id: 2,
        statement: "Porter un soutien-gorge à armatures peut provoquer un cancer du sein.",
        type: "myth",
        explanation: "Les études sérieuses n'ont trouvé aucun lien entre le fait de porter un soutien-gorge (même à armatures) et le cancer du sein. Choisis simplement ce qui est confortable pour toi !",
        source: "Cancer Epidemiology, Biomarkers & Prevention (2014)"
    },
    {
        id: 3,
        statement: "Détecté tôt, un cancer du sein a de bien meilleures chances d'être soigné.",
        type: "fact",
        explanation: "La détection précoce est l'un des meilleurs moyens de réduire la mortalité liée au cancer du sein. Apprends ce qui est normal pour tes seins et consulte vite si tu remarques un changement. Demande aussi à un professionnel de santé quand te faire dépister.",
        source: "Organisation mondiale de la Santé (OMS)"
    },
    {
        id: 4,
        statement: "Si personne dans ma famille n'a eu de cancer du sein, je ne risque rien.",
        type: "myth",
        explanation: "Près de la moitié des femmes touchées n'ont aucun facteur de risque identifiable en dehors de leur sexe et de leur âge. Les bons réflexes (connaître ses seins, consulter, se faire dépister) concernent toutes les femmes.",
        source: "Organisation mondiale de la Santé (OMS)"
    },
    {
        id: 5,
        statement: "Une boule n'est pas le seul signe qui doit alerter.",
        type: "fact",
        explanation: "Une masse dans le sein, mais aussi un changement de forme, un changement de la peau du sein ou un écoulement anormal doivent te pousser à consulter. Ne reste pas dans le doute : un avis médical rassure ou permet d'agir tôt.",
        source: "OMS ; Institut national du cancer (France)"
    },
    {
        id: 6,
        statement: "Les déodorants et antitranspirants causent le cancer du sein.",
        type: "myth",
        explanation: "Cette rumeur circule sur Internet depuis la fin des années 1990. Les chercheurs de l'Institut national du cancer des États-Unis ne connaissent aucune preuve solide d'un lien. Tu peux continuer à utiliser ton déodorant en toute sérénité.",
        source: "Institut national du cancer des États-Unis (NCI)"
    },
    {
        id: 7,
        statement: "Si je sens une boule dans mon sein, c'est forcément un cancer.",
        type: "myth",
        explanation: "La grande majorité des boules dans le sein sont bénignes (kystes, fibroadénomes…). Mais seul un médecin peut le confirmer : dès que tu sens quelque chose de nouveau ou qui change, fais-le vérifier sans attendre.",
        source: "Stony Brook Medicine ; Banner Health"
    },
    {
        id: 8,
        statement: "L'alcool, le tabac et le surpoids font partie des facteurs de risque du cancer du sein.",
        type: "fact",
        explanation: "Tu peux agir sur certains risques : limiter l'alcool, ne pas fumer et garder un poids santé aident à protéger ta santé. L'activité physique régulière et l'allaitement sont aussi associés à un risque plus faible.",
        source: "OMS ; Inserm (Médecine/Sciences, 2005)"
    },
    {
        id: 9,
        statement: "Les femmes qui ont de petits seins ont moins de risques d'avoir un cancer du sein.",
        type: "myth",
        explanation: "La taille du sein ne dit rien sur le risque. Ce qui compte davantage, c'est la densité du sein, qu'on ne peut pas voir ni sentir : seule une mammographie permet de la connaître. Tout le monde doit suivre les recommandations de dépistage, quelle que soit la taille.",
        source: "Gouvernement du Nouveau-Brunswick (Canada)"
    },
    {
        id: 10,
        statement: "La mammographie est la méthode la plus fiable pour détecter tôt un cancer du sein.",
        type: "fact",
        explanation: "C'est un examen du sein par rayons X de faible intensité. Parle à ton médecin de l'âge et du rythme du dépistage qui te conviennent, surtout si tu as des antécédents familiaux ou des questions.",
        source: "Gouvernement du Nouveau-Brunswick (Canada)"
    },
    {
        id: 11,
        statement: "Un cancer du sein, c'est toujours une condamnation.",
        type: "myth",
        explanation: "Détecté à un stade précoce, un cancer du sein peut être guéri dans la grande majorité des cas (plus de 90 %). C'est pour ça que le dépistage et la consultation rapide sont si importants.",
        source: "Institut national du cancer (France)"
    },
    {
        id: 12,
        statement: "Les hommes et les femmes qui sentent un changement dans leur sein doivent le faire examiner, même si ça ne fait pas mal.",
        type: "fact",
        explanation: "Un changement peut exister sans aucune douleur. Si quelque chose te paraît inhabituel (boule, peau, mamelon, écoulement), prends rendez-vous avec un professionnel de santé sans attendre.",
        source: "OMS ; Stony Brook Medicine"
    }
];