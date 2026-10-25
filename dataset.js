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
        statement: "Un cancer du sein, c'est toujours une condamnation.",
        type: "myth",
        explanation: "Détecté à un stade précoce, un cancer du sein peut être guéri dans la grande majorité des cas (plus de 90 %). C'est pour ça que le dépistage et la consultation rapide sont si importants.",
        source: "Institut national du cancer (France)"
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
        statement: "L'alcool, le tabac et le surpoids font partie des facteurs de risque du cancer du sein.",
        type: "fact",
        explanation: "Tu peux agir sur certains risques : limiter l'alcool, ne pas fumer et garder un poids santé aident à protéger ta santé. L'activité physique régulière et l'allaitement sont aussi associés à un risque plus faible.",
        source: "OMS ; Inserm (Médecine/Sciences, 2005)"
    },
    {
        id: 12,
        statement: "Les mammographies sont dangereuses parce qu'elles provoquent un cancer.",
        type: "myth",
        explanation: "La dose de rayons d'une mammographie est très faible. Pour les personnes concernées par le dépistage, les bénéfices sont considérés comme bien plus importants que ce risque. Pose toutes tes questions à ton médecin.",
        source: "OMS ; Institut national du cancer (France)"
        
    },
        {
        id: 13,
        statement: "Le cancer du sein est le cancer le plus fréquent chez les femmes dans le monde.",
        type: "fact",
        explanation: "C'est pour ça que la sensibilisation compte autant : le cancer du sein touche des millions de femmes chaque année. Plus il est repéré tôt, plus les traitements sont efficaces.",
        source: "Organisation mondiale de la Santé (OMS)"
    },
    {
        id: 14,
        statement: "L'âge et le rythme du dépistage dépendent de ton pays et de ton profil de risque.",
        type: "fact",
        explanation: "Il n'y a pas une règle unique pour tout le monde. Demande à un médecin ou à un professionnel de santé à partir de quand et à quelle fréquence te faire dépister, surtout si tu as des antécédents familiaux.",
        source: "OMS ; Institut national du cancer (France)"
    },
    {
        id: 15,
        statement: "Faire une activité physique régulière aide à réduire le risque de cancer du sein.",
        type: "fact",
        explanation: "Bouger régulièrement (marche, vélo, sport...) fait partie des habitudes associées à un risque plus faible. Ça ne supprime pas le risque, mais c'est bon pour ta santé en général.",
        source: "OMS ; Institut national du cancer (France)"
    },
    {
        id: 16,
        statement: "La majorité des cancers du sein ne sont pas héréditaires.",
        type: "fact",
        explanation: "Seule une petite partie des cancers du sein est liée à une mutation génétique transmise dans la famille (comme BRCA1 ou BRCA2). Si plusieurs proches ont eu un cancer du sein ou de l'ovaire, parles-en à ton médecin.",
        source: "Institut national du cancer (France) ; Institut national du cancer des États-Unis (NCI)"
    },
    {
        id: 17,
        statement: "La mammographie peut repérer un cancer avant même qu'on puisse le sentir.",
        type: "fact",
        explanation: "Certaines anomalies sont trop petites pour être senties avec les doigts, mais visibles à la mammographie. C'est un des grands intérêts du dépistage régulier.",
        source: "OMS ; Institut national du cancer (France)"
    },
    {
        id: 18,
        statement: "Il existe plusieurs traitements du cancer du sein, choisis selon chaque situation.",
        type: "fact",
        explanation: "Chirurgie, radiothérapie, chimiothérapie, hormonothérapie, thérapies ciblées : l'équipe médicale choisit selon le type de cancer, son stade et la patiente. Chaque parcours est différent.",
        source: "Institut national du cancer (France) ; OMS"
    },
    {
        id: 19,
        statement: "Connaître l'aspect habituel de tes seins t'aide à repérer plus vite un changement.",
        type: "fact",
        explanation: "En regardant et en sentant régulièrement tes seins, tu sais ce qui est normal pour toi. Si tu remarques quelque chose de nouveau, ne l'ignore pas : consulte un professionnel de santé.",
        source: "OMS"
    },
    {
        id: 20,
        statement: "Le risque de cancer du sein augmente avec l'âge.",
        type: "fact",
        explanation: "Plus on avance en âge, plus le risque est élevé. C'est une des raisons pour lesquelles le dépistage est recommandé à partir d'un certain âge. Mais l'âge n'est pas le seul facteur à connaître.",
        source: "OMS ; Institut national du cancer des États-Unis (NCI)"
    },
    {
        id: 21,
        statement: "Après un traitement, un suivi médical régulier reste important.",
        type: "fact",
        explanation: "Même après la fin des traitements, des consultations et des examens de contrôle sont prévus pour surveiller la santé et repérer tôt un éventuel problème. Il ne faut pas les abandonner.",
        source: "Institut national du cancer (France)"
    },
    {
        id: 22,
        statement: "Un traitement contre le cancer du sein fait toujours tomber les cheveux.",
        type: "myth",
        explanation: "Cela dépend du traitement. Certaines chimiothérapies font tomber les cheveux, mais d'autres traitements non. Chaque patiente reçoit un traitement adapté, demande à l'équipe médicale ce qui t'attend.",
        source: "Institut national du cancer (France)"
    },
    {
        id: 23,
        statement: "Le cancer du sein est contagieux.",
        type: "myth",
        explanation: "Faux. On ne peut pas « attraper » un cancer en touchant, embrassant ou en vivant avec une personne malade. Elle a surtout besoin de soutien et de présence.",
        source: "Institut national du cancer des États-Unis (NCI)"
    },
    {
        id: 24,
        statement: "Les hommes et les femmes qui sentent un changement dans leur sein doivent le faire examiner, même si ça ne fait pas mal.",
        type: "fact",
        explanation: "Un changement peut exister sans aucune douleur. Si quelque chose te paraît inhabituel (boule, peau, mamelon, écoulement), prends rendez-vous avec un professionnel de santé sans attendre.",
        source: "OMS ; Stony Brook Medicine"
    },
    {
        id: 25,
        statement: "Un coup ou une blessure au sein peut provoquer un cancer.",
        type: "myth",
        explanation: "Il n'y a aucune preuve qu'un choc ou un traumatisme cause un cancer du sein. Par contre, un coup peut causer un hématome ou une boule : si ça ne disparaît pas, fais-le vérifier.",
        source: "Institut national du cancer des États-Unis (NCI)"
    },
    {
        id: 26,
        statement: "Avec des implants mammaires, on ne peut plus se faire dépister.",
        type: "myth",
        explanation: "Le dépistage reste possible avec des implants, avec des techniques adaptées. Pense simplement à le dire au professionnel de santé avant l'examen.",
        source: "Institut national du cancer des États-Unis (NCI)"
    },
    {
        id: 27,
        statement: "Le stress est la cause directe du cancer du sein.",
        type: "myth",
        explanation: "Il n'existe pas de preuve solide que le stress provoque directement un cancer du sein. Cela dit, prendre soin de sa santé mentale reste important pour toi, avec ou sans maladie.",
        source: "Institut national du cancer des États-Unis (NCI)"
    },
    {
        id: 28,
        statement: "Le cancer du sein ne touche que les femmes âgées.",
        type: "myth",
        explanation: "Le risque augmente avec l'âge, mais des femmes plus jeunes peuvent aussi être touchées. Peu importe ton âge, un changement inhabituel dans ton sein mérite un avis médical.",
        source: "OMS ; Institut national du cancer (France)"
    },
    {
        id: 29,
        statement: "Avoir une mutation génétique BRCA veut dire qu'on aura forcément un cancer du sein.",
        type: "myth",
        explanation: "Une mutation BRCA augmente le risque, mais ce n'est pas une certitude. Des suivis renforcés et des options de prévention existent : une consultation d'oncogénétique permet d'en discuter.",
        source: "Institut national du cancer (France) ; NCI"
    },
    {
        id: 30,
        statement: "Un cancer du sein signifie toujours qu'on doit enlever le sein.",
        type: "myth",
        explanation: "Non. Selon la taille et le type de tumeur, il est souvent possible de ne retirer que la tumeur (chirurgie conservatrice). La décision se prend avec l'équipe médicale, au cas par cas.",
        source: "Institut national du cancer (France)"
    },
    {
        id: 31,
        statement: "Si ma dernière mammographie était normale, je n'ai plus besoin de me faire contrôler.",
        type: "myth",
        explanation: "Un examen normal aujourd'hui ne garantit pas que tout sera normal dans quelques années. Le dépistage se répète au rythme conseillé par ton médecin, et tu dois consulter dès qu'un signe apparaît.",
        source: "OMS ; Institut national du cancer (France)"
    },
    {
        id: 32,
        statement: "Les plantes et les remèdes naturels peuvent remplacer le traitement médical.",
        type: "myth",
        explanation: "Aucun remède naturel n'a prouvé qu'il pouvait guérir un cancer du sein. Remplacer ou retarder les traitements peut être dangereux. Parle toujours à ton équipe médicale avant de prendre un produit complémentaire.",
        source: "Institut national du cancer (France) ; NCI"
    }
];