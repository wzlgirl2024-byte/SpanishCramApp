// 动词分类数据 - 用于S2专项复习
const verbCategories = {
  // 第一变位 (-ar) 规则动词
  arRegular: [
    {
      infinitive: "hablar",
      meaning: "说话",
      conjugation: {
        yo: "hablo",
        tú: "hablas",
        él: "habla",
        nosotros: "hablamos",
        vosotros: "habláis",
        ellos: "hablan"
      }
    },
    {
      infinitive: "estudiar",
      meaning: "学习",
      conjugation: {
        yo: "estudio",
        tú: "estudias",
        él: "estudia",
        nosotros: "estudiamos",
        vosotros: "estudiáis",
        ellos: "estudian"
      }
    },
    {
      infinitive: "trabajar",
      meaning: "工作",
      conjugation: {
        yo: "trabajo",
        tú: "trabajas",
        él: "trabaja",
        nosotros: "trabajamos",
        vosotros: "trabajáis",
        ellos: "trabajan"
      }
    },
    {
      infinitive: "necesitar",
      meaning: "需要",
      conjugation: {
        yo: "necesito",
        tú: "necesitas",
        él: "necesita",
        nosotros: "necesitamos",
        vosotros: "necesitáis",
        ellos: "necesitan"
      }
    }
  ],
  
  // 第一变位 (-ar) 不规则动词 (词干变化)
  arIrregular: [
    {
      infinitive: "empezar",
      meaning: "开始",
      conjugation: {
        yo: "empiezo",
        tú: "empiezas",
        él: "empieza",
        nosotros: "empezamos",
        vosotros: "empezáis",
        ellos: "empiezan"
      },
      note: "e -> ie 词干变化 (除 nosotros, vosotros)"
    },
    {
      infinitive: "cerrar",
      meaning: "关",
      conjugation: {
        yo: "cierro",
        tú: "cierras",
        él: "cierra",
        nosotros: "cerramos",
        vosotros: "cerráis",
        ellos: "cierran"
      },
      note: "e -> ie 词干变化"
    }
  ],
  
  // 第二变位 (-er) 规则动词
  erRegular: [
    {
      infinitive: "comer",
      meaning: "吃",
      conjugation: {
        yo: "como",
        tú: "comes",
        él: "come",
        nosotros: "comemos",
        vosotros: "coméis",
        ellos: "comen"
      }
    },
    {
      infinitive: "beber",
      meaning: "喝",
      conjugation: {
        yo: "bebo",
        tú: "bebes",
        él: "bebe",
        nosotros: "bebemos",
        vosotros: "bebéis",
        ellos: "beben"
      }
    },
    {
      infinitive: "parecer",
      meaning: "好像",
      conjugation: {
        yo: "parezco",
        tú: "pareces",
        él: "parece",
        nosotros: "parecemos",
        vosotros: "parecéis",
        ellos: "parecen"
      },
      note: "不规则第一人称单数: parezco"
    }
  ],
  
  // 第二变位 (-er) 不规则动词
  erIrregular: [
    {
      infinitive: "tener",
      meaning: "有",
      conjugation: {
        yo: "tengo",
        tú: "tienes",
        él: "tiene",
        nosotros: "tenemos",
        vosotros: "tenéis",
        ellos: "tienen"
      },
      note: "e -> ie 词干变化, 第一人称不规则"
    },
    {
      infinitive: "hacer",
      meaning: "做",
      conjugation: {
        yo: "hago",
        tú: "haces",
        él: "hace",
        nosotros: "hacemos",
        vosotros: "hacéis",
        ellos: "hacen"
      },
      note: "第一人称不规则: hago"
    },
    {
      infinitive: "querer",
      meaning: "想要",
      conjugation: {
        yo: "quiero",
        tú: "quieres",
        él: "quiere",
        nosotros: "queremos",
        vosotros: "queréis",
        ellos: "quieren"
      },
      note: "e -> ie 词干变化"
    },
    {
      infinitive: "saber",
      meaning: "知道",
      conjugation: {
        yo: "sé",
        tú: "sabes",
        él: "sabe",
        nosotros: "sabemos",
        vosotros: "sabéis",
        ellos: "saben"
      },
      note: "第一人称不规则: sé"
    },
    {
      infinitive: "ver",
      meaning: "看",
      conjugation: {
        yo: "veo",
        tú: "ves",
        él: "ve",
        nosotros: "vemos",
        vosotros: "veis",
        ellos: "ven"
      },
      note: "不规则变位"
    }
  ],
  
  // 第三变位 (-ir) 规则动词
  irRegular: [
    {
      infinitive: "vivir",
      meaning: "居住",
      conjugation: {
        yo: "vivo",
        tú: "vives",
        él: "vive",
        nosotros: "vivimos",
        vosotros: "vivís",
        ellos: "viven"
      }
    },
    {
      infinitive: "escribir",
      meaning: "写",
      conjugation: {
        yo: "escribo",
        tú: "escribes",
        él: "escribe",
        nosotros: "escribimos",
        vosotros: "escribís",
        ellos: "escriben"
      }
    },
    {
      infinitive: "abrir",
      meaning: "打开",
      conjugation: {
        yo: "abro",
        tú: "abres",
        él: "abre",
        nosotros: "abrimos",
        vosotros: "abrís",
        ellos: "abren"
      }
    }
  ],
  
  // 第三变位 (-ir) 不规则动词
  irIrregular: [
    {
      infinitive: "venir",
      meaning: "来",
      conjugation: {
        yo: "vengo",
        tú: "vienes",
        él: "viene",
        nosotros: "venimos",
        vosotros: "venís",
        ellos: "vienen"
      },
      note: "e -> ie 词干变化, 第一人称不规则"
    },
    {
      infinitive: "decir",
      meaning: "说",
      conjugation: {
        yo: "digo",
        tú: "dices",
        él: "dice",
        nosotros: "decimos",
        vosotros: "decís",
        ellos: "dicen"
      },
      note: "e -> i 词干变化, 第一人称不规则"
    },
    {
      infinitive: "pedir",
      meaning: "请求",
      conjugation: {
        yo: "pido",
        tú: "pides",
        él: "pide",
        nosotros: "pedimos",
        vosotros: "pedís",
        ellos: "piden"
      },
      note: "e -> i 词干变化"
    },
    {
      infinitive: "preferir",
      meaning: "更喜欢",
      conjugation: {
        yo: "prefiero",
        tú: "prefieres",
        él: "prefiere",
        nosotros: "preferimos",
        vosotros: "preferís",
        ellos: "prefieren"
      },
      note: "e -> ie 词干变化"
    }
  ],
  
  // 完全不规则动词 (特殊变位)
  completelyIrregular: [
    {
      infinitive: "ser",
      meaning: "是",
      conjugation: {
        yo: "soy",
        tú: "eres",
        él: "es",
        nosotros: "somos",
        vosotros: "sois",
        ellos: "son"
      }
    },
    {
      infinitive: "ir",
      meaning: "去",
      conjugation: {
        yo: "voy",
        tú: "vas",
        él: "va",
        nosotros: "vamos",
        vosotros: "vais",
        ellos: "van"
      }
    },
    {
      infinitive: "estar",
      meaning: "在/处于",
      conjugation: {
        yo: "estoy",
        tú: "estás",
        él: "está",
        nosotros: "estamos",
        vosotros: "estáis",
        ellos: "están"
      }
    },
    {
      infinitive: "haber",
      meaning: "有(助动词)",
      conjugation: {
        yo: "he",
        tú: "has",
        él: "ha",
        nosotros: "hemos",
        vosotros: "habéis",
        ellos: "han"
      }
    }
  ]
};

// 将所有动词合并到一个数组中用于S2课程
const allVerbsForS2 = [
  ...verbCategories.arRegular,
  ...verbCategories.arIrregular,
  ...verbCategories.erRegular,
  ...verbCategories.erIrregular,
  ...verbCategories.irRegular,
  ...verbCategories.irIrregular,
  ...verbCategories.completelyIrregular
];

console.log(`总动词数: ${allVerbsForS2.length}`);
console.log("动词列表:");
allVerbsForS2.forEach(v => console.log(`- ${v.infinitive} (${v.meaning})`));