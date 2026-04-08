import type { Locale } from '@/lib/i18n/config';

export type HomeContent = {
  hero: {
    title: string[];
    body: string;
  };
  careIntro: {
    title: string[];
    subtitle: string;
  };
  careCards: Array<{
    icon: string;
    title: string;
    body: string;
  }>;
  howItWorks: {
    title: string[];
    subtitle: string;
    cards: Array<{
      title: string;
      body: string;
      ctaLabel: string;
      image: string;
      imageAlt: string;
      imageLeft?: boolean;
    }>;
  };
  pawPoints: {
    title: string[];
    eyebrow: string;
    body: string;
    image: string;
  };
  different: {
    title: string[];
    eyebrow: string;
    body: string;
    items: Array<{
      label: string;
      image: string;
      alt: string;
    }>;
  };
  blogs: {
    heading: string;
  };
  cta: {
    title: string[];
    subtitle: string;
  };
};

export type BlogContent = {
  slug: string;
  date: string;
  imageSrc: string;
  title: string;
  excerpt: string;
  readTime: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  otherBlogs: string;
};

export type BlogPostContent = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageSrc: string;
};

const homeContent: Record<Locale, HomeContent> = {
  en: {
    hero: {
      title: ['trusted', 'pet care from', 'people nearby'],
      body:
        'PawTaker helps pet owners connect with local pet lovers for walks, daytime care, overnight stays, and vacation support so finding help feels more personal, more reliable, and less stressful.',
    },
    careIntro: {
      title: ['pet owners', 'need more than', '"just another', 'sitter app"'],
      subtitle:
        'They need a dedicated community partner, not just a list, to ensure their beloved companion receives consistent, professional, and personalized care.',
    },
    careCards: [
      {
        icon: '/images/eye.svg',
        title: 'Trust is the biggest issue',
        body:
          'Leaving your pet with someone you barely know is stressful. Most owners want someone familiar, caring, and reliable - not a random stranger.',
      },
      {
        icon: '/images/clock.svg',
        title: 'Good help is hard to find',
        body:
          'When work runs late, plans change, or travel comes up, finding dependable pet care quickly can feel overwhelming.',
      },
      {
        icon: '/images/paw.svg',
        title: 'Pets do better with familiarity',
        body:
          'Many pets are more comfortable when care comes from people they have seen before and routines they already know.',
      },
      {
        icon: '/images/groupdots.svg',
        title: 'People want real connection, not just transaction',
        body:
          'Pet care feels better when it comes from a real community of pet lovers nearby.',
      },
    ],
    howItWorks: {
      title: ['how pawtaker', 'works'],
      subtitle:
        'Because pet care should feel like a neighbourly hand, not a corporate transaction. We are building a village where trust is the foundation and every pet is treated like family.',
      cards: [
        {
          title: 'Join your local pet care community',
          body:
            'Create your personalized profile today to seamlessly connect with nearby pet owners who need help and dedicated pet lovers eager to provide care, building a trusted community for your furry family.',
          ctaLabel: 'Explore community',
          image: '/images/feature-img-three.svg',
          imageAlt: 'Community illustration',
        },
        {
          title: 'Offer or request care',
          body:
            'From walks and playtime to overnight stays and vacation support, PawTaker helps people connect around real pet care needs.',
          ctaLabel: 'Get started',
          image: '/images/feature-img-two.svg',
          imageAlt: 'Care request illustration',
          imageLeft: true,
        },
        {
          title: 'Build trust over time',
          body:
            'Every act of care helps build your reputation in the community through activity, ratings, and visible Paw Points.',
          ctaLabel: 'Get started',
          image: '/images/no-review.svg',
          imageAlt: 'Trust and reviews illustration',
        },
        {
          title: "Know who's truly active and reliable",
          body:
            'Paw Points help show which users are engaged, dependable, and serious about helping others on the platform.',
          ctaLabel: 'Start now',
          image: '/images/feature-img-one.svg',
          imageAlt: 'Active community illustration',
          imageLeft: true,
        },
      ],
    },
    pawPoints: {
      title: ['what do', 'pawpoints mean?'],
      eyebrow: 'NUMBERS THAT SHOW TRUST NOT STATUS',
      body:
        'PawPoints are a simple way to show how active and committed someone is on PawTaker. They help other users quickly see who regularly shows up, helps others, and takes the community seriously. It is not about collecting points. It is about building confidence.',
      image: '/images/what-paw-points-mean.svg',
    },
    different: {
      title: ['why pawtaker', 'is different'],
      eyebrow: 'BUILT FOR TRUSTED LOCAL CARE',
      body:
        'PawTaker is designed to make pet care feel more human. Instead of endlessly searching through strangers, you can discover nearby people, build familiarity, and make better decisions based on real activity and community trust.',
      items: [
        {
          label: 'local pet care',
          image: '/images/local-pet-care.svg',
          alt: 'Local pet care badge',
        },
        {
          label: 'visible signs of reliability',
          image: '/images/visible-signs-of-reliability.svg',
          alt: 'Visible signs of reliability badge',
        },
        {
          label: 'familiar faces over time',
          image: '/images/familiar-face-over-time.svg',
          alt: 'Familiar faces over time badge',
        },
        {
          label: 'community built around real help',
          image: '/images/community-built-around-real-help.svg',
          alt: 'Community built around real help badge',
        },
      ],
    },
    blogs: {
      heading: 'our blogs',
    },
    cta: {
      title: ['find pet care', 'that feels more', 'personal'],
      subtitle: 'Join PawTaker and start building trusted local connections for your pet.',
    },
  },
  fr: {
    hero: {
      title: ['des soins', 'pour animaux', 'tout proches'],
      body:
        'PawTaker aide les proprietaires a se connecter avec des amoureux des animaux autour d eux pour les promenades, la garde de jour, les nuits et les vacances afin que trouver de l aide soit plus personnel, plus fiable et moins stressant.',
    },
    careIntro: {
      title: ['les proprietaires', "ont besoin de plus", 'qu une simple', 'appli de garde'],
      subtitle:
        'Ils ont besoin d un partenaire de confiance, pas seulement d une liste, pour offrir a leur compagnon des soins constants, professionnels et personnalises.',
    },
    careCards: [
      {
        icon: '/images/eye.svg',
        title: 'La confiance est le plus grand enjeu',
        body:
          'Laisser son animal a quelqu un que l on connait a peine est stressant. La plupart des proprietaires veulent quelqu un de familier, attentionne et fiable.',
      },
      {
        icon: '/images/clock.svg',
        title: 'Le bon coup de main est difficile a trouver',
        body:
          'Quand le travail deborde, que les plans changent ou qu un voyage arrive, trouver vite une aide fiable peut sembler ecrasant.',
      },
      {
        icon: '/images/paw.svg',
        title: 'Les animaux vont mieux avec la familiarite',
        body:
          'Beaucoup d animaux sont plus a l aise quand les soins viennent de personnes deja vues et de routines qu ils connaissent deja.',
      },
      {
        icon: '/images/groupdots.svg',
        title: 'Les gens veulent une vraie relation, pas juste une transaction',
        body:
          'La garde se vit mieux quand elle vient d une vraie communaute d amoureux des animaux a proximite.',
      },
    ],
    howItWorks: {
      title: ['comment pawtaker', 'fonctionne'],
      subtitle:
        'Parce que la garde devrait ressembler a un coup de main entre voisins, pas a une transaction froide. Nous construisons un village ou la confiance est la base.',
      cards: [
        {
          title: 'Rejoignez votre communaute locale',
          body:
            'Creez votre profil personnalise pour vous connecter facilement avec des proprietaires proches qui ont besoin d aide et des amoureux des animaux prets a prendre soin d eux.',
          ctaLabel: 'Explore community',
          image: '/images/feature-img-three.svg',
          imageAlt: 'Illustration communaute',
        },
        {
          title: 'Offrez ou demandez de l aide',
          body:
            'Des promenades aux gardes de nuit en passant par les vacances, PawTaker aide les personnes a se retrouver autour de vrais besoins de garde.',
          ctaLabel: 'Get started',
          image: '/images/feature-img-two.svg',
          imageAlt: 'Illustration demande de garde',
          imageLeft: true,
        },
        {
          title: 'Construisez la confiance avec le temps',
          body:
            'Chaque geste compte pour construire votre reputation dans la communaute grace a l activite, aux evaluations et aux Paw Points visibles.',
          ctaLabel: 'Get started',
          image: '/images/no-review.svg',
          imageAlt: 'Illustration confiance',
        },
        {
          title: 'Voyez qui est vraiment actif et fiable',
          body:
            'Les Paw Points montrent les personnes engagees, fiables et serieuses quand il s agit d aider les autres sur la plateforme.',
          ctaLabel: 'Start now',
          image: '/images/feature-img-one.svg',
          imageAlt: 'Illustration activite et fiabilite',
          imageLeft: true,
        },
      ],
    },
    pawPoints: {
      title: ['que veulent dire', 'les pawpoints ?'],
      eyebrow: 'DES CHIFFRES QUI MONTRENT LA CONFIANCE',
      body:
        'Les PawPoints montrent simplement a quel point une personne est active et engagee sur PawTaker. Ils aident les autres a voir rapidement qui aide regulierement et prend la communaute au serieux. Il ne s agit pas de collectionner des points, mais de creer de la confiance.',
      image: '/images/what-paw-points-mean.svg',
    },
    different: {
      title: ['pourquoi pawtaker', 'est different'],
      eyebrow: 'PENSE POUR UNE GARDE LOCALE DE CONFIANCE',
      body:
        'PawTaker rend la garde plus humaine. Au lieu de faire defiler des inconnus, vous decouvrez des personnes proches, gagnez en familiarite et prenez de meilleures decisions grace aux vrais signes d activite et de confiance.',
      items: [
        {
          label: 'garde locale',
          image: '/images/local-pet-care.svg',
          alt: 'Badge garde locale',
        },
        {
          label: 'signes visibles de fiabilite',
          image: '/images/visible-signs-of-reliability.svg',
          alt: 'Badge signes visibles de fiabilite',
        },
        {
          label: 'visages familiers avec le temps',
          image: '/images/familiar-face-over-time.svg',
          alt: 'Badge visages familiers',
        },
        {
          label: 'communaute construite autour d une aide reelle',
          image: '/images/community-built-around-real-help.svg',
          alt: 'Badge communaute entraide',
        },
      ],
    },
    blogs: {
      heading: 'nos blogs',
    },
    cta: {
      title: ['trouvez une garde', 'qui parait plus', 'personnelle'],
      subtitle:
        'Rejoignez PawTaker et commencez a creer des liens locaux de confiance pour votre animal.',
    },
  },
};

const blogContent: Record<Locale, BlogContent> = {
  en: {
    slug: 'pack-mentality-community-care',
    date: '12 Apr 2026',
    imageSrc: 'https://www.figma.com/api/mcp/asset/d730062d-bb01-4ad8-86f9-2edd787540aa',
    title: 'The pack mentality: why community care beats corporate apps',
    excerpt:
      'Exploring the heart behind mutual pet sitting and how we are bringing "neighborly favors" into the digital age.',
    readTime: '',
    sections: [
      {
        heading: "The pet parent's dilemma",
        paragraphs: [
          'We have all been there. You have a weekend trip planned or a long day at the office ahead, but the options for your pet feel lacking. Boarding can feel cold, and big corporate apps can feel transactional.',
          'You do not just want a service provider with a background check. You want someone who actually loves pets and notices the little things that matter to your companion.',
          'That is exactly why we built PawTaker: to bridge the gap between awkward favors and impersonal platforms.',
        ],
      },
      {
        heading: 'Care, not commerce',
        paragraphs: [
          'The pack mentality is simple: pet owners are often the best people to care for other pets because they already understand routines, emotions, and everyday needs.',
          'By using PawPoints instead of cash, we remove the awkwardness. You are not hiring a stranger and you are not begging for help. You are taking part in a shared exchange with fellow pet lovers.',
        ],
      },
      {
        heading: 'How to join the pack',
        paragraphs: [
          'Start by creating a profile that shows your pet personality, favourite routines, and little details that help someone care well.',
          'Then help a neighbour first. Each walk, visit, or overnight stay builds your reputation and earns PawPoints you can later use when you need support yourself.',
          'When life gets busy, you can browse nearby Takers and choose someone who fits your pet energy and comfort level.',
        ],
      },
      {
        heading: 'Safe paws first',
        paragraphs: [
          'Trust is not a buzzword for us. It is the foundation of the product. That is why we emphasize verification, visibility, and real community familiarity.',
          'We also encourage a meet-and-greet before first-time exchanges so both people and pets can settle in with confidence.',
        ],
      },
    ],
    otherBlogs: 'other blogs',
  },
  fr: {
    slug: 'pack-mentality-community-care',
    date: '12 Apr 2026',
    imageSrc: 'https://www.figma.com/api/mcp/asset/d730062d-bb01-4ad8-86f9-2edd787540aa',
    title: 'La mentalite de meute : pourquoi la garde communautaire depasse les applis corporate',
    excerpt:
      'Une reflexion sur la garde mutuelle des animaux et sur notre facon de ramener les services entre voisins dans le monde numerique.',
    readTime: '',
    sections: [
      {
        heading: 'Le dilemme du proprietaire',
        paragraphs: [
          'On connait tous cela. Un voyage approche ou une longue journee de travail vous attend, et les solutions pour votre animal paraissent insuffisantes. Les pensions peuvent sembler froides et les grandes applis, trop transactionnelles.',
          'Vous ne voulez pas seulement un prestataire verifie. Vous voulez une personne qui aime vraiment les animaux et comprend les petits details qui comptent.',
          'C est exactement pour cela que PawTaker existe : combler le vide entre les services impersonnels et les faveurs parfois genantes a demander.',
        ],
      },
      {
        heading: 'Du soin, pas du commerce',
        paragraphs: [
          'La mentalite de meute est simple : les proprietaires sont souvent les mieux places pour prendre soin des autres animaux, parce qu ils comprennent deja les routines et les besoins quotidiens.',
          'Avec les PawPoints au lieu de l argent, on retire la gene. Vous ne recrutez pas un inconnu et vous ne demandez pas un service a sens unique. Vous participez a un echange entre amoureux des animaux.',
        ],
      },
      {
        heading: 'Comment rejoindre la meute',
        paragraphs: [
          'Commencez par creer un profil qui montre la personnalite de votre animal, ses habitudes et les details utiles pour bien s en occuper.',
          'Aidez ensuite un voisin. Chaque promenade, visite ou nuit de garde renforce votre reputation et vous fait gagner des PawPoints a utiliser plus tard.',
          'Quand votre planning se complique, vous pouvez parcourir les Takers proches de chez vous et choisir la bonne personne.',
        ],
      },
      {
        heading: 'La securite avant tout',
        paragraphs: [
          'Pour nous, la confiance n est pas un mot a la mode. C est la base du produit. C est pourquoi nous mettons l accent sur la verification, la visibilite et la familiarite communautaire.',
          'Nous encourageons aussi une premiere rencontre afin que les humains comme les animaux puissent se sentir a l aise.',
        ],
      },
    ],
    otherBlogs: 'autres blogs',
  },
};

function formatReadTime(locale: Locale, minutes: number): string {
  return locale === 'fr' ? `${minutes} min de lecture` : `${minutes} min read`;
}

function calculateReadTime(locale: Locale, sections: BlogContent['sections']): string {
  const wordCount = sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return formatReadTime(locale, minutes);
}

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale] ?? homeContent.en;
}

export function getBlogContent(locale: Locale): BlogContent {
  const content = blogContent[locale] ?? blogContent.en;
  return {
    ...content,
    readTime: calculateReadTime(locale, content.sections),
  };
}

export function getBlogPosts(locale: Locale): BlogPostContent[] {
  const featuredPost = getBlogContent(locale);

  if (locale === 'fr') {
    return [
      {
        slug: featuredPost.slug,
        title: featuredPost.title,
        excerpt: featuredPost.excerpt,
        date: featuredPost.date,
        readTime: featuredPost.readTime,
        imageSrc: featuredPost.imageSrc,
      },
      {
        slug: 'confiance-locale-pour-les-animaux',
        title: 'Pourquoi la confiance locale rend la garde plus sereine',
        excerpt:
          'Quand on reconnait les personnes autour de soi, trouver de l aide pour son animal devient plus simple et plus rassurant.',
        date: '10 Apr 2026',
        readTime: formatReadTime(locale, 3),
        imageSrc: featuredPost.imageSrc,
      },
      {
        slug: 'la-garde-devient-plus-personnelle',
        title: 'Comment PawTaker rend la garde plus personnelle',
        excerpt:
          'Des profils visibles, des habitudes partagees et une communaute active changent la facon de choisir une aide fiable.',
        date: '8 Apr 2026',
        readTime: formatReadTime(locale, 4),
        imageSrc: featuredPost.imageSrc,
      },
      {
        slug: 'des-signes-qui-comptent',
        title: 'Les signes d activite qui comptent vraiment',
        excerpt:
          'Au lieu des promesses vagues, PawTaker met en avant les gestes concrets, la regularite et la presence dans la communaute.',
        date: '5 Apr 2026',
        readTime: formatReadTime(locale, 3),
        imageSrc: featuredPost.imageSrc,
      },
    ];
  }

  return [
    {
      slug: featuredPost.slug,
      title: featuredPost.title,
      excerpt: featuredPost.excerpt,
      date: featuredPost.date,
      readTime: featuredPost.readTime,
      imageSrc: featuredPost.imageSrc,
    },
    {
      slug: 'building-trust-with-local-pet-lovers',
      title: 'Why local trust changes the way pet care feels',
      excerpt:
        'When help comes from nearby pet lovers you can recognize, asking for support feels easier and far less stressful.',
      date: '10 Apr 2026',
      readTime: formatReadTime(locale, 3),
      imageSrc: featuredPost.imageSrc,
    },
    {
      slug: 'making-pet-care-feel-personal-again',
      title: 'How PawTaker makes pet care feel personal again',
      excerpt:
        'Visible routines, shared familiarity, and a more human exchange help owners make better care decisions.',
      date: '8 Apr 2026',
      readTime: formatReadTime(locale, 4),
      imageSrc: featuredPost.imageSrc,
    },
    {
      slug: 'what-trust-looks-like-on-pawtaker',
      title: 'What trust actually looks like on PawTaker',
      excerpt:
        'Active participation, repeat care, and community visibility matter more than polished profiles when pets are involved.',
      date: '5 Apr 2026',
      readTime: formatReadTime(locale, 3),
      imageSrc: featuredPost.imageSrc,
    },
  ];
}
