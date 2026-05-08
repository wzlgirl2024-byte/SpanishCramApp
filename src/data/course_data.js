export const courseData = [
    {
        id: 1,
        title: "¿QUIÉN ERES?",
        subtitle: "你是谁？",
        vocab: [
            { spanish: "quién", chinese: "谁" },
            { spanish: "eres", chinese: "是(你)" },
            { spanish: "es", chinese: "是(他/她/您)" },
            { spanish: "él", chinese: "他" },
            { spanish: "Pepe", chinese: "贝贝" },
            { spanish: "sí", chinese: "是的" },
            { spanish: "Paco", chinese: "巴科" },
            { spanish: "ella", chinese: "她" },
            { spanish: "Ana", chinese: "安娜" },
            { spanish: "no", chinese: "不" },
            { spanish: "Ema", chinese: "埃玛" },
            { spanish: "y", chinese: "和" },
            { spanish: "ellas", chinese: "她们" },
            { spanish: "amigo, ga", chinese: "朋友" },
            { spanish: "ellos", chinese: "他们" },
            { spanish: "Lola", chinese: "劳拉" },
            { spanish: "¡Hola!", chinese: "你好!" },
            { spanish: "Buenos días", chinese: "早上好" },
            { spanish: "Manolo", chinese: "马诺罗" },
            { spanish: "soy", chinese: "是(我)" },
            { spanish: "tú", chinese: "你" },
            { spanish: "Elena", chinese: "埃莱娜" },
            { spanish: "somos", chinese: "是(我们)" },
            { spanish: "son", chinese: "是(他们/她们/您们)" },
            { spanish: "Mucho gusto", chinese: "很高兴认识你" },
            { spanish: "Encantado, da", chinese: "很高兴认识你" }
        ],
        grammar: {
            title: "名词的阴阳性与单复数 (I)",
            content: "1. 阴阳性：\n   - 以 -o 结尾通常为阳性：el libro, el chico。\n   - 以 -a 结尾通常为阴性：la mesa, la casa。\n   - 例外：el mapa (阳性), la mano (阴性), el día (阳性)。\n2. 复数：\n   - 元音结尾 +s：libro → libros, casa → casas。\n   - 辅音结尾 +es：profesor → profesores, ciudad → ciudades。\n   - 以 -z 结尾变 -ces：luz → luces。\n3. 主格人称代词：yo (我), tú (你), él (他), ella (她), usted (您), nosotros/as (我们), vosotros/as (你们), ellos/ellas/ustedes (他们/她们/您们)。\n4. 拓展词汇：\n   - 职业名词：estudiante (学生), profesor (老师), médico (医生)。\n   - 常见不规则复数：papá → papás, mamá → mamás。\n5. 常见错误：\n   - 混淆 'el' 和 'la'：记住 'el día' 是阳性。\n   - 复数形容词需与名词性数一致：los libros rojos。\n6. 例句：\n   - El libro es interesante. (这本书很有趣。)\n   - Las casas son grandes. (这些房子很大。)\n   - ¿Quién eres? – Soy Ana. (你是谁？– 我是安娜。)",
            quiz: [
                { question: "以下哪个单词是阴性？", options: ["libro", "chico", "casa", "teléfono"], answer: 2 },
                { question: "'profesor' 的复数？", options: ["profesors", "profesores", "profesoras", "profesora"], answer: 1 },
                { question: "你是谁？", options: ["¿Quién es?", "¿Quién eres?", "¿Quién soy?", "¿Quién son?"], answer: 1 }
            ]
        },
        reading: {
            text: "— ¡Hola! Buenos días.\n— Buenos días. ¿Quién eres?\n— Yo soy Ana. Soy estudiante. ¿Y usted?\n— Yo soy el profesor Luis. Mucho gusto.\n— Igualmente.",
            questions: [
                { question: "¿Quién es Ana?", options: ["Es profesora", "Es estudiante", "Es médica"], answer: 1 },
                { question: "¿Cómo se llama el profesor?", options: ["Ana", "Luis", "Pedro"], answer: 1 }
            ]
        },
        translation: [
            { q: "你是谁？", a: "¿Quién eres?", type: "zh-es" },
            { q: "我是学生。", a: "Soy estudiante.", type: "zh-es" },
            { q: "Buenos días.", a: "早上好", type: "es-zh" },
            { q: "¿Y usted?", a: "您呢？", type: "es-zh" },
            { q: "我叫安娜。", a: "Me llamo Ana.", type: "zh-es" }
        ],
        verbs: [
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
                infinitive: "llamarse",
                meaning: "叫...名字",
                conjugation: {
                    yo: "me llamo",
                    tú: "te llamas",
                    él: "se llama",
                    nosotros: "nos llamamos",
                    vosotros: "os llamáis",
                    ellos: "se llaman"
                }
            }
        ]
    },
    {
        id: 2,
        title: "¿QUÉ ES ÉL?",
        subtitle: "他是做什工作的？",
        vocab: [
            { spanish: "qué", chinese: "什么" },
            { spanish: "este, ta", chinese: "这个" },
            { spanish: "señor, ra", chinese: "先生/女士" },
            { spanish: "Manuel", chinese: "马努埃尔" },
            { spanish: "estudiante", chinese: "学生" },
            { spanish: "Raúl", chinese: "罗尔" },
            { spanish: "médico, ca", chinese: "医生" },
            { spanish: "David", chinese: "戴维" },
            { spanish: "aquel, lla", chinese: "那个" },
            { spanish: "señorita", chinese: "小姐" },
            { spanish: "empresario, ria", chinese: "企业家" },
            { spanish: "Susana", chinese: "苏珊娜" },
            { spanish: "secretario, ria", chinese: "秘书" },
            { spanish: "aquellos, llas", chinese: "那些" },
            { spanish: "joven", chinese: "年轻的/年轻人" },
            { spanish: "camarero, ra", chinese: "服务员" },
            { spanish: "enfermero, ra", chinese: "护士" },
            { spanish: "ésta", chinese: "这个(指代)" },
            { spanish: "la", chinese: "(阴性定冠词)" },
            { spanish: "escuela", chinese: "学校" },
            { spanish: "de", chinese: "的" },
            { spanish: "idioma", chinese: "语言" },
            { spanish: "Daniel", chinese: "丹尼尔" },
            { spanish: "usted", chinese: "您" },
            { spanish: "español, la", chinese: "西班牙语/人" },
            { spanish: "o", chinese: "或" },
            { spanish: "Me llamo...", chinese: "我叫..." },
            { spanish: "también", chinese: "也" },
            { spanish: "alemán, na", chinese: "德语/德国人" }
        ],
        grammar: {
            title: "指示形容词与名词复数 (II)",
            content: "1. 指示形容词：\n   - 单数：este (这个，阳), esta (这个，阴), esto (这个，中性)。\n   - 复数：estos (这些，阳), estas (这些，阴)。\n   - 用法：Este libro es mío. (这本书是我的。)\n2. 名词复数规则：\n   - 元音结尾 +s：mesa → mesas, libro → libros。\n   - 辅音结尾 +es：profesor → profesores, canción → canciones。\n   - 以 -z 结尾变 -ces：luz → luces, voz → voces。\n3. 不定冠词：un (一个，阳), una (一个，阴), unos (一些，阳), unas (一些，阴)。\n   - 例如：un médico, una enfermera, unos libros, unas casas。\n4. 拓展词汇：\n   - 职业名词：abogado (律师), secretario (秘书), empresario (企业家)。\n   - 国家与城市：España, Madrid, China, Pekín。\n5. 常见错误：\n   - 混淆 este/esta 的阴阳性：este casa (错误) → esta casa。\n   - 复数形式错误：cancións (错误) → canciones。\n6. 例句：\n   - Este es mi amigo Paco. (这是我的朋友 Paco。)\n   - Estas son mis amigas. (这些是我的女性朋友们。)\n   - Unos estudiantes van a la escuela. (一些学生去学校。)",
            quiz: [
                { question: "翻译：这位医生", options: ["Esta médico", "Este médico", "Esto médico", "Estes médico"], answer: 1 },
                { question: "复数形式错误的是？", options: ["mesas", "padres", "médicos", "cancións"], answer: 3 }
            ]
        },
        reading: {
            text: "Este es mi amigo Paco. Él es médico. Esta es mi amiga María. Ella es cantante. Ellos son muy buenos amigos. Sus padres son profesores.",
            questions: [
                { question: "¿Qué es Paco?", options: ["Estudiante", "Médico", "Cantante"], answer: 1 },
                { question: "¿Quién es cantante?", options: ["Paco", "María", "El profesor"], answer: 1 }
            ]
        },
        translation: [
            { q: "他是医生。", a: "Él es médico.", type: "zh-es" },
            { q: "这是我的朋友。", a: "Este es mi amigo.", type: "zh-es" },
            { q: "Ellos son cantantes.", a: "他们是歌手", type: "es-zh" },
            { q: "Ella es mi amiga.", a: "她是我的朋友", type: "es-zh" }
        ],
        verbs: []
    },
    {
        id: 3,
        title: "¿DE DÓNDE ERES?",
        subtitle: "你是哪儿人？",
        vocab: [
            { spanish: "dónde", chinese: "哪里" },
            { spanish: "China", chinese: "中国" },
            { spanish: "Bolivia", chinese: "玻利维亚" },
            { spanish: "La Paz", chinese: "拉巴斯" },
            { spanish: "abogado, da", chinese: "律师" },
            { spanish: "Juan", chinese: "胡安" },
            { spanish: "Argentina", chinese: "阿根廷" },
            { spanish: "Buenos Aires", chinese: "布宜诺斯艾利斯" },
            { spanish: "gerente", chinese: "经理" },
            { spanish: "Mario", chinese: "马里奥" },
            { spanish: "Cecilia", chinese: "塞西利亚" },
            { spanish: "Venezuela", chinese: "委内瑞拉" },
            { spanish: "Caracas", chinese: "加拉加斯" },
            { spanish: "funcionario, ria", chinese: "公务员" },
            { spanish: "Marcos", chinese: "马克斯" },
            { spanish: "¿Qué tal?", chinese: "你好吗?" },
            { spanish: "bien", chinese: "好" },
            { spanish: "muy", chinese: "很" },
            { spanish: "gracias", chinese: "谢谢" },
            { spanish: "Lucía", chinese: "卢西亚" },
            { spanish: "yo", chinese: "我" },
            { spanish: "Berlín", chinese: "柏林" },
            { spanish: "italiano, na", chinese: "意大利语/人" },
            { spanish: "Roma", chinese: "罗马" },
            { spanish: "éste", chinese: "这个" },
            { spanish: "Julio", chinese: "胡里奥" },
            { spanish: "francés, sa", chinese: "法语/人" },
            { spanish: "París", chinese: "巴黎" },
            { spanish: "Linda", chinese: "琳达" },
            { spanish: "inglés, sa", chinese: "英语/人" },
            { spanish: "Londres", chinese: "伦敦" },
            { spanish: "Madrid", chinese: "马德里" }
        ],
        grammar: {
            title: "Ser 变位与国籍形容词",
            content: "1. Ser (是) 变位：\n   - yo soy, tú eres, él/ella/usted es, nosotros/as somos, vosotros/as sois, ellos/ellas/ustedes son。\n   - 用法：表示身份、国籍、职业、特征等。\n2. 国籍形容词：\n   - 以 -o 结尾分阴阳：chino (男中国人) / china (女中国人)。\n   - 以辅音结尾通常 +a：español (男西班牙人) / española (女西班牙人)。\n   - 以 -ense 结尾不变：estadounidense (美国人), canadiense (加拿大人)。\n   - 以 -í 结尾不变：pakistaní (巴基斯坦人)。\n3. 询问国籍与籍贯：\n   - ¿De dónde eres? (你是哪儿人？)\n   - Soy de China. (我来自中国。)\n   - Soy chino. (我是中国人。)\n4. 拓展词汇：\n   - 国家：Argentina, Bolivia, Venezuela, Italia, Francia, Alemania。\n   - 城市：Buenos Aires, La Paz, Caracas, Roma, París, Berlín。\n5. 常见错误：\n   - 混淆 Ser 和 Estar：Ser 用于永久性特征，Estar 用于状态。\n   - 国籍形容词需与主语性数一致：Él es chino. Ella es china。\n6. 例句：\n   - Yo soy de China y soy chino.\n   - Ella es de España, es española.\n   - Nosotros somos estudiantes.",
            quiz: [
                { question: "我们是 (Ser)", options: ["soy", "somos", "son", "sois"], answer: 1 },
                { question: "你是哪儿人？", options: ["¿De dónde es?", " ¿De dónde eres?", "¿De dónde soy?", "¿De dónde son?"], answer: 1 }
            ]
        },
        reading: {
            text: "— ¿De dónde eres, Li Ming?\n— Soy de China. Soy chino. Vivo en Pekín. ¿Y tú?\n— Soy de España. Soy española. Vivo en Madrid.",
            questions: [
                { question: "¿De dónde es Li Ming?", options: ["España", "China", "Japón"], answer: 1 },
                { question: "Li Ming es...", options: ["español", "chino", "médico"], answer: 1 }
            ]
        },
        translation: [
            { q: "我是中国人。", a: "Soy chino.", type: "zh-es" },
            { q: "你是哪儿人？", a: "¿De dónde eres?", type: "zh-es" },
            { q: "Somos estudiantes.", a: "我们是学生", type: "es-zh" }
        ],
        verbs: [
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
            }
        ]
    },
    {
        id: 4,
        title: "¿CÓMO ESTÁS?",
        subtitle: "你怎么？",
        vocab: [
            { spanish: "cómo", chinese: "怎么样" },
            { spanish: "estar", chinese: "在/处于" },
            { spanish: "novio, via", chinese: "男朋友/女朋友" },
            { spanish: "alto, ta", chinese: "高的" },
            { spanish: "rubio, bia", chinese: "金黄色的" },
            { spanish: "guapo, pa", chinese: "漂亮的/英俊的" },
            { spanish: "alegre", chinese: "开朗的" },
            { spanish: "mal", chinese: "坏/糟糕" },
            { spanish: "enfermo, ma", chinese: "生病的" },
            { spanish: "casa", chinese: "家/房子" },
            { spanish: "grande", chinese: "大的" },
            { spanish: "dos", chinese: "二" },
            { spanish: "planta", chinese: "层/楼" },
            { spanish: "bonito, ta", chinese: "漂亮的" },
            { spanish: "en", chinese: "在...里" },
            { spanish: "el", chinese: "(阳性定冠词)" },
            { spanish: "centro", chinese: "中心" },
            { spanish: "ciudad", chinese: "城市" },
            { spanish: "marido", chinese: "丈夫" },
            { spanish: "pero", chinese: "但是" },
            { spanish: "cama", chinese: "床" },
            { spanish: "resfriado, da", chinese: "感冒" },
            { spanish: "habitación", chinese: "房间" },
            { spanish: "hermano, na", chinese: "兄弟/姐妹" },
            { spanish: "hoy", chinese: "今天" },
            { spanish: "mejor", chinese: "更好" },
            { spanish: "agradable", chinese: "令人愉快的" },
            { spanish: "ahora", chinese: "现在" },
            { spanish: "bastante", chinese: "相当" },
            { spanish: "desordenado, da", chinese: "凌乱的" },
            { spanish: "sólo", chinese: "只/仅仅" },
            { spanish: "siempre", chinese: "总是" },
            { spanish: "así", chinese: "这样" }
        ],
        grammar: {
            title: "Estar 变位与性数一致",
            content: "1. Estar (在/处于) 变位：\n   - yo estoy, tú estás, él/ella/usted está, nosotros/as estamos, vosotros/as estáis, ellos/ellas/ustedes están。\n2. 用法：\n   - 表示状态：Estoy cansado/a (我累了), Está enfermo/a (他生病了)。\n   - 表示位置：Estoy en casa (我在家), El libro está en la mesa (书在桌子上)。\n   - 表示临时性特征：Está guapo hoy (他今天很帅)。\n3. 形容词性数一致：\n   - 形容词必须与主语性数一致：La chica está cansada (女孩累了), Los chicos están cansados (男孩们累了)。\n   - 注意阴阳性变化：cansado (男) / cansada (女)。\n4. 与 Ser 的区别：\n   - Ser 用于永久性特征 (国籍、职业、本质)。\n   - Estar 用于状态、位置、临时情况。\n5. 拓展词汇：\n   - 状态形容词：alegre (开心), triste (悲伤), contento/a (满意), enfadado/a (生气)。\n   - 位置介词：en (在), sobre (在...上), debajo de (在...下), cerca de (靠近)。\n6. 常见错误：\n   - 混淆 Ser 和 Estar：'Soy cansado' (错误) → 'Estoy cansado'。\n   - 忘记性数一致：'La chica está cansado' (错误) → 'cansada'。\n7. 例句：\n   - Yo estoy muy bien, gracias.\n   - Ella está en la oficina.\n   - Nosotros estamos contentos con el resultado.",
            quiz: [
                { question: "La chica está ... (累)", options: ["cansado", "cansada", "cansados", "cansadas"], answer: 1 },
                { question: "选择正确的冠词：... libro", options: ["un", "una", "el", "la"], answer: 0 }
            ]
        },
        reading: {
            text: "— Hola María, ¿cómo estás?\n— Estoy muy bien, gracias. ¿Y tú?\n— Estoy un poco cansado. Hoy estoy muy ocupado en el trabajo.",
            questions: [
                { question: "¿Cómo está María?", options: ["Cansada", "Bien", "Enferma"], answer: 1 },
                { question: "¿Por qué está cansado él?", options: ["Está enfermo", "Está ocupado", "Es viejo"], answer: 1 }
            ]
        },
        translation: [
            { q: "你好吗？", a: "¿Cómo estás?", type: "zh-es" },
            { q: "我很好，谢谢。", a: "Estoy muy bien, gracias.", type: "zh-es" },
            { q: "Ella está muy cansada.", a: "她很累", type: "es-zh" }
        ],
        verbs: [
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
            }
        ]
    },
    {
        id: 5,
        title: "¡QUÉ BONITA ES LA CASA!",
        subtitle: "这个家真漂亮！",
        vocab: [
            { spanish: "haber", chinese: "有(hay)" },
            { spanish: "sala", chinese: "厅" },
            { spanish: "cocina", chinese: "厨房" },
            { spanish: "cuarto de baño", chinese: "卫生间" },
            { spanish: "pequeño, ña", chinese: "小的" },
            { spanish: "limpio, pia", chinese: "干净的" },
            { spanish: "televisión", chinese: "电视" },
            { spanish: "lámpara", chinese: "灯" },
            { spanish: "sofá", chinese: "沙发" },
            { spanish: "dormitorio", chinese: "卧室" },
            { spanish: "mi", chinese: "我的" },
            { spanish: "esposo, sa", chinese: "丈夫/妻子" },
            { spanish: "mesa", chinese: "桌子" },
            { spanish: "silla", chinese: "椅子" },
            { spanish: "armario", chinese: "衣柜" },
            { spanish: "ése", chinese: "那个" },
            { spanish: "nuestro, tra", chinese: "我们的" },
            { spanish: "hijo, ja", chinese: "儿子/女儿" },
            { spanish: "ordenado, da", chinese: "整齐的" },
            { spanish: "aquél", chinese: "那个" },
            { spanish: "estudio", chinese: "书房" },
            { spanish: "estantería", chinese: "书架" },
            { spanish: "mucho, cha", chinese: "很多" },
            { spanish: "libro", chinese: "书" },
            { spanish: "revista", chinese: "杂志" },
            { spanish: "interesante", chinese: "有趣的" },
            { spanish: "ya", chinese: "已经" },
            { spanish: "nuevo, va", chinese: "新的" },
            { spanish: "tiene", chinese: "有(他/她)" },
            { spanish: "jardín", chinese: "花园" },
            { spanish: "flor", chinese: "花" },
            { spanish: "un poco", chinese: "一点儿" },
            { spanish: "esto", chinese: "这个" },
            { spanish: "todo", chinese: "全部" },
            { spanish: "nudo chino", chinese: "中国结" }
        ],
        grammar: {
            title: "非重读物主形容词",
            content: "1. 非重读物主形容词形式：\n   - 单数：mi (我的), tu (你的), su (他/她/您/它的), nuestro/a (我们的), vuestro/a (你们的), su (他们/她们/您们的)。\n   - 复数：mis, tus, sus, nuestros/as, vuestros/as, sus。\n2. 用法：\n   - 放在名词前，表示所属关系：mi casa (我的房子), sus amigos (他的朋友们)。\n   - 必须与名词性数一致：nuestro libro (我们的书，阳性单数), nuestra casa (我们的房子，阴性单数)。\n3. 与重读物主形容词的区别：\n   - 非重读位于名词前，重读位于名词后 (如 'el libro mío')。\n4. 拓展词汇：\n   - 家庭词汇：padre (父亲), madre (母亲), hijo (儿子), hija (女儿)。\n   - 房屋词汇：sala (客厅), cocina (厨房), baño (卫生间), dormitorio (卧室)。\n5. 常见错误：\n   - 混淆 nuestro 的性数：'nuestro casas' (错误) → 'nuestras casas'。\n   - 误用 su：su 可表示他的、她的、您的、他们的，需根据上下文判断。\n6. 例句：\n   - Esta es mi casa y este es mi jardín.\n   - Nuestros hijos van a la escuela.\n   - ¿Dónde está tu libro? – Está en mi mochila.",
            quiz: [
                { question: "这是我的房子。", options: ["Esta es mi casa.", "Esta es mío casa.", "Esta es mis casa.", "Esta es tu casa."], answer: 0 },
                { question: "我们的书 (复数)", options: ["Nuestro libros", "Nuestros libros", "Nuestras libros", "Mis libros"], answer: 1 }
            ]
        },
        reading: {
            text: "Mi casa no es muy grande, pero es muy bonita. Tiene dos habitaciones, una cocina pequeña y un baño. El salón es muy luminoso y tiene un sofá cómodo.",
            questions: [
                { question: "¿Cómo es la casa?", options: ["Grande y fea", "Pequeña pero bonita", "Muy grande"], answer: 1 },
                { question: "¿Cuántas habitaciones tiene?", options: ["Una", "Dos", "Tres"], answer: 1 }
            ]
        },
        translation: [
            { q: "我的房子很漂亮。", a: "Mi casa es muy bonita.", type: "zh-es" },
            { q: "这是你的书吗？", a: "¿Es este tu libro?", type: "zh-es" },
            { q: "La cocina es pequeña.", a: "厨房很小", type: "es-zh" }
        ],
        verbs: []
    },
    {
        id: 6,
        title: "¿QUÉ HORA ES?",
        subtitle: "几点了？",
        vocab: [
            { spanish: "hora", chinese: "小时/时间" },
            { spanish: "día", chinese: "天" },
            { spanish: "lunes", chinese: "星期一" },
            { spanish: "mañana", chinese: "明天/上午" },
            { spanish: "martes", chinese: "星期二" },
            { spanish: "a", chinese: "在(时间/地点)" },
            { spanish: "julio", chinese: "七月" },
            { spanish: "veintidós", chinese: "二十二" },
            { spanish: "en punto", chinese: "整点" },
            { spanish: "tener", chinese: "有" },
            { spanish: "media", chinese: "半" },
            { spanish: "cuarto", chinese: "一刻钟" },
            { spanish: "miércoles", chinese: "星期三" },
            { spanish: "veintisiete", chinese: "二十七" },
            { spanish: "octubre", chinese: "十月" },
            { spanish: "reloj", chinese: "钟表" },
            { spanish: "clase", chinese: "课" },
            { spanish: "conversación", chinese: "谈话" },
            { spanish: "entonces", chinese: "那么" },
            { spanish: "todavía", chinese: "还" },
            { spanish: "para", chinese: "为了" },
            { spanish: "tomar", chinese: "喝/拿" },
            { spanish: "café", chinese: "咖啡" },
            { spanish: "bueno, na", chinese: "好" },
            { spanish: "deprisa", chinese: "快" },
            { spanish: "tiempo", chinese: "时间" },
            { spanish: "puntual", chinese: "准时的" }
        ],
        grammar: {
            title: "时间表示法与 Tener",
            content: "1. 询问时间：¿Qué hora es? / ¿Tiene(s) hora?\n2. 回答：Es la una (1点). Son las dos/tres... (2点+)。\n3. 分钟表达：\n   - y cuarto (一刻) → Son las tres y cuarto.\n   - y media (半) → Son las cinco y media.\n   - menos cuarto (差一刻) → Son las dos menos cuarto.\n   - menos diez (差十分) → Es la una menos diez.\n4. 时间段：de la mañana (上午), de la tarde (下午), de la noche (晚上)。\n5. 拓展词汇：reloj (钟), hora punta (高峰时间), hora exacta (准确时间)。\n6. Tener (有) 变位：tengo, tienes, tiene, tenemos, tenéis, tienen。\n7. 例句：\n   - Son las tres y cuarto de la tarde.\n   - Es la una menos diez de la mañana.\n   - Tengo clase a las ocho en punto.",
            quiz: [
                { question: "现在是下午三点。", options: ["Es la tres.", "Son las tres.", "Son tres.", "Es las tres."], answer: 1 },
                { question: "我有两节课。", options: ["Tengo dos clases.", "Tienes dos clases.", "Tiene dos clases.", "Tenemos dos clases."], answer: 0 },
                { question: "差一刻两点怎么说？", options: ["Son las dos y cuarto.", "Son las dos menos cuarto.", "Es la una y cuarto.", "Son las dos y media."], answer: 1 }
            ]
        },
        reading: {
            text: "— ¿Qué hora es?\n— Son las ocho de la mañana.\n— ¡Ay! Tengo clase a las ocho y media. Tengo que correr.\n— Tranquilo, tienes tiempo.",
            questions: [
                { question: "¿Qué hora es?", options: ["8:00 PM", "8:00 AM", "8:30 AM"], answer: 1 },
                { question: "¿A qué hora tiene clase?", options: ["A las ocho", "A las ocho y media", "A las nueve"], answer: 1 }
            ]
        },
        translation: [
            { q: "几点了？", a: "¿Qué hora es?", type: "zh-es" },
            { q: "我有时间。", a: "Tengo tiempo.", type: "zh-es" },
            { q: "Son las cinco y media.", a: "现在是五点半", type: "es-zh" }
        ],
        verbs: [
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
                }
            }
        ]
    },
    {
        id: 7,
        title: "¿QUÉ TIEMPO HACE?",
        subtitle: "天气怎么样？",
        vocab: [
            { spanish: "hacer", chinese: "做/天气..." },
            { spanish: "viento", chinese: "风" },
            { spanish: "calor", chinese: "热" },
            { spanish: "verano", chinese: "夏天" },
            { spanish: "invierno", chinese: "冬天" },
            { spanish: "frío", chinese: "冷" },
            { spanish: "llover", chinese: "下雨" },
            { spanish: "norte", chinese: "北方" },
            { spanish: "nevar", chinese: "下雪" },
            { spanish: "sur", chinese: "南方" },
            { spanish: "suave", chinese: "温和的" },
            { spanish: "clima", chinese: "气候" },
            { spanish: "duro, ra", chinese: "硬的/严酷的" },
            { spanish: "verdad", chinese: "事实" },
            { spanish: "país", chinese: "国家" },
            { spanish: "tanto", chinese: "如此" },
            { spanish: "estación", chinese: "季节" },
            { spanish: "año", chinese: "年" },
            { spanish: "España", chinese: "西班牙" },
            { spanish: "más", chinese: "更" },
            { spanish: "además", chinese: "此外" },
            { spanish: "otoño", chinese: "秋天" },
            { spanish: "sol", chinese: "太阳" },
            { spanish: "primavera", chinese: "春天" },
            { spanish: "a veces", chinese: "有时" }
        ],
        grammar: {
            title: "天气表达与无人称动词",
            content: "1. Hace + 名词：Hace sol (晴天), Hace calor (热), Hace frío (冷), Hace viento (有风), Hace buen/mal tiempo (好/坏天气)。\n2. 动词：Llueve (下雨), Nieva (下雪), Graniza (下冰雹)。\n3. Hay + 名词：Hay niebla (有雾), Hay nubes (多云), Hay tormenta (有暴风雨)。\n4. 季节词汇：primavera (春天), verano (夏天), otoño (秋天), invierno (冬天)。\n5. 温度表达：grados (度), bajo cero (零下), calor sofocante (闷热)。\n6. 拓展词汇：clima (气候), temperatura (温度), humedad (湿度), pronóstico del tiempo (天气预报)。\n7. 常见错误：\n   - 不说 'Es calor' 而说 'Hace calor'。\n   - 'Está lloviendo' (正在下雨) 与 'Llueve' (下雨) 可互换。\n8. 例句：\n   - En verano hace mucho calor en Madrid.\n   - Hoy hace sol y no hace viento.\n   - En invierno nieva en las montañas.\n   - ¿Qué tiempo hace hoy? – Hace buen tiempo.",
            quiz: [
                { question: "今天很冷。", options: ["Hace mucho frío.", "Es muy frío.", "Tiene frío.", "Está frío."], answer: 0 },
                { question: "正在下雨。", options: ["Hace lluvia.", "Llueve.", "Lluvia.", "Es lluvia."], answer: 1 },
                { question: "春天天气怎么样？", options: ["Hace calor.", "Hace frío.", "Hace buen tiempo.", "Nieva."], answer: 2 }
            ]
        },
        reading: {
            text: "En verano hace mucho calor en Madrid, a veces 40 grados. Pero en invierno hace frío y a veces nieva. Hoy hace buen tiempo, hace sol y no hace viento.",
            questions: [
                { question: "¿Qué tiempo hace en verano?", options: ["Frío", "Calor", "Viento"], answer: 1 },
                { question: "¿Qué tiempo hace hoy?", options: ["Nieva", "Hace sol", "Llueve"], answer: 1 }
            ]
        },
        translation: [
            { q: "天气怎么样？", a: "¿Qué tiempo hace?", type: "zh-es" },
            { q: "今天很热。", a: "Hoy hace mucho calor.", type: "zh-es" },
            { q: "Está nevando.", a: "在下雪", type: "es-zh" }
        ],
        verbs: []
    },
    {
        id: 8,
        title: "¿ADÓNDE VAS?",
        subtitle: "你去哪儿？",
        vocab: [
            { spanish: "adónde", chinese: "去哪里" },
            { spanish: "ir", chinese: "去" },
            { spanish: "correos", chinese: "邮局" },
            { spanish: "mercado", chinese: "市场" },
            { spanish: "banco", chinese: "银行" },
            { spanish: "supermercado", chinese: "超市" },
            { spanish: "tienda", chinese: "商店" },
            { spanish: "venir", chinese: "来" },
            { spanish: "oficina", chinese: "办公室" },
            { spanish: "trabajar", chinese: "工作" },
            { spanish: "fin de semana", chinese: "周末" },
            { spanish: "cine", chinese: "电影院" },
            { spanish: "¿Díga?", chinese: "喂?" },
            { spanish: "por la noche", chinese: "晚上" },
            { spanish: "por qué", chinese: "为什么" },
            { spanish: "cumpleaños", chinese: "生日" },
            { spanish: "dar", chinese: "给/举行" },
            { spanish: "fiesta", chinese: "聚会" },
            { spanish: "poder", chinese: "能" },
            { spanish: "por supuesto", chinese: "当然" },
            { spanish: "invitar", chinese: "邀请" },
            { spanish: "gente", chinese: "人们" },
            { spanish: "compañero, ra", chinese: "同伴" },
            { spanish: "trabajo", chinese: "工作" },
            { spanish: "otro, tra", chinese: "另一个" },
            { spanish: "ordenar", chinese: "整理/命令" },
            { spanish: "después", chinese: "然后" },
            { spanish: "comprar", chinese: "买" },
            { spanish: "bebida", chinese: "饮料" },
            { spanish: "comida", chinese: "食物" },
            { spanish: "tampoco", chinese: "也不" },
            { spanish: "Hasta mañana", chinese: "明天见" }
        ],
        grammar: {
            title: "动词 Ir 和 Venir",
            content: "1. Ir (去) 变位：\n   - yo voy, tú vas, él/ella/usted va, nosotros/as vamos, vosotros/as vais, ellos/ellas/ustedes van。\n2. Venir (来) 变位：\n   - yo vengo, tú vienes, él/ella/usted viene, nosotros/as venimos, vosotros/as venís, ellos/ellas/ustedes vienen。\n3. 结构：\n   - Ir a + 地点：Voy al cine (我去电影院), Vamos a la escuela (我们去学校)。\n   - Ir a + 动词原形 (表示将来打算)：Voy a estudiar (我打算学习), Vamos a comer (我们打算吃饭)。\n4. 方向介词：\n   - a (到), hacia (朝向), desde (从), hasta (直到)。\n5. 拓展词汇：\n   - 地点：correos (邮局), mercado (市场), banco (银行), supermercado (超市), tienda (商店)。\n   - 活动：trabajar (工作), estudiar (学习), cenar (吃晚饭), bailar (跳舞)。\n6. 常见错误：\n   - 混淆 Ir 和 Venir：Ir 表示离开说话者，Venir 表示来到说话者处。\n   - 忘记 'a' 的缩合：a + el = al, a + la = a la。\n7. 例句：\n   - ¿Adónde vas? – Voy al mercado a comprar fruta.\n   - Mis amigos vienen a mi casa esta noche.\n   - Vamos a trabajar mañana.",
            quiz: [
                { question: "我去电影院。", options: ["Voy el cine.", "Voy al cine.", "Ir al cine.", "Vengo al cine."], answer: 1 },
                { question: "我们打算吃东西。", options: ["Vamos comer.", "Vamos a comer.", "Comemos.", "Ir a comer."], answer: 1 }
            ]
        },
        reading: {
            text: "— ¿Adónde vas, Juan?\n— Voy a la biblioteca a estudiar. ¿Y tú?\n— Yo voy al cine con mis amigos. Vamos a ver una película nueva.",
            questions: [
                { question: "¿Adónde va Juan?", options: ["Al cine", "A la biblioteca", "A casa"], answer: 1 },
                { question: "¿Qué va a hacer Juan?", options: ["Ver una película", "Estudiar", "Comer"], answer: 1 }
            ]
        },
        translation: [
            { q: "你去哪儿？", a: "¿Adónde vas?", type: "zh-es" },
            { q: "我去学校。", a: "Voy a la escuela.", type: "zh-es" },
            { q: "Yo también voy.", a: "我也去", type: "es-zh" }
        ],
        verbs: [
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
                infinitive: "venir",
                meaning: "来",
                conjugation: {
                    yo: "vengo",
                    tú: "vienes",
                    él: "viene",
                    nosotros: "venimos",
                    vosotros: "venís",
                    ellos: "vienen"
                }
            }
        ]
    },
    {
        id: 9,
        title: "¿QUÉ ESTUDIAS?",
        subtitle: "你是学什么的？",
        vocab: [
            { spanish: "foto", chinese: "照片" },
            { spanish: "familia", chinese: "家庭" },
            { spanish: "abuelo, la", chinese: "祖父/母" },
            { spanish: "padre", chinese: "父亲" },
            { spanish: "tío, a", chinese: "叔叔/阿姨" },
            { spanish: "primo, ma", chinese: "表兄弟姐妹" },
            { spanish: "amable", chinese: "和蔼的" },
            { spanish: "empresa", chinese: "公司" },
            { spanish: "sino-español", chinese: "中西合资" },
            { spanish: "madre", chinese: "母亲" },
            { spanish: "cuidar", chinese: "照顾" },
            { spanish: "hombre", chinese: "男人" },
            { spanish: "mujer", chinese: "女人" },
            { spanish: "moreno, na", chinese: "黑发的" },
            { spanish: "simpático, ca", chinese: "可爱的" },
            { spanish: "estudiar", chinese: "学习" },
            { spanish: "chico, ca", chinese: "小伙子/姑娘" },
            { spanish: "sorpresa", chinese: "惊喜" },
            { spanish: "necesitar", chinese: "需要" },
            { spanish: "hablar", chinese: "说" },
            { spanish: "nivel", chinese: "水平" },
            { spanish: "elemental", chinese: "初级的" },
            { spanish: "aula", chinese: "教室" },
            { spanish: "al día", chinese: "每天" },
            { spanish: "empezar", chinese: "开始" },
            { spanish: "terminar", chinese: "结束" },
            { spanish: "recreo", chinese: "休息" },
            { spanish: "durante", chinese: "在...期间" },
            { spanish: "charlar", chinese: "聊天" },
            { spanish: "con", chinese: "和" },
            { spanish: "Hasta luego", chinese: "回头见" },
            { spanish: "Adiós", chinese: "再见" }
        ],
        grammar: {
            title: "第一变位规则动词 (-ar)",
            content: "1. 变位规则：\n   - 去掉词尾 -ar，根据人称添加：\n     yo: -o, tú: -as, él/ella/usted: -a, nosotros/as: -amos, vosotros/as: -áis, ellos/ellas/ustedes: -an。\n2. 常用动词：\n   - Hablar (说话): hablo, hablas, habla, hablamos, habláis, hablan。\n   - Estudiar (学习): estudio, estudias, estudia, estudiamos, estudiáis, estudian。\n   - Trabajar (工作): trabajo, trabajas, trabaja, trabajamos, trabajáis, trabajan。\n3. 发音注意：\n   - 重音落在倒数第二个音节：hablamos (ha-BLA-mos)。\n4. 拓展词汇：\n   - 学习相关：aula (教室), nivel (水平), elemental (初级的), recreo (休息)。\n   - 家庭关系：abuelo (祖父), padre (父亲), madre (母亲), primo (表兄弟)。\n5. 常见错误：\n   - 混淆 -ar 与 -er/-ir 变位：'hablo' 正确，'hablo' 不是 'habla'。\n   - 忘记重音符号：estudiáis (第二人称复数) 带重音。\n6. 例句：\n   - Yo hablo español y inglés.\n   - Ellos estudian mucho para el examen.\n   - Nosotros trabajamos en una empresa.",
            quiz: [
                { question: "我讲西班牙语。", options: ["Hablo español.", "Hablas español.", "Habla español.", "Hablar español."], answer: 0 },
                { question: "他们学习很多。", options: ["Estudian mucho.", "Estudiamos mucho.", "Estudias mucho.", "Estudio mucho."], answer: 0 }
            ]
        },
        reading: {
            text: "Me llamo Elena. Estudio español en la universidad. Hablo inglés y un poco de español. Mis amigos también estudian idiomas. Practicamos juntos todos los días.",
            questions: [
                { question: "¿Qué estudia Elena?", options: ["Inglés", "Español", "Chino"], answer: 1 },
                { question: "¿Qué idiomas habla?", options: ["Solo inglés", "Inglés y español", "Español y chino"], answer: 1 }
            ]
        },
        translation: [
            { q: "你是学什么的？", a: "¿Qué estudias?", type: "zh-es" },
            { q: "我讲中文。", a: "Hablo chino.", type: "zh-es" },
            { q: "Él trabaja con María.", a: "他和玛丽亚一起工作", type: "es-zh" }
        ],
        verbs: [
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
            }
        ]
    },
    {
        id: 10,
        title: "¿QUÉ HACEMOS ESTA NOCHE?",
        subtitle: "咱们今晚做什么？",
        vocab: [
            { spanish: "generalmente", chinese: "通常" },
            { spanish: "abierto, ta", chinese: "打开的" },
            { spanish: "todo, da", chinese: "所有的" },
            { spanish: "todos los días", chinese: "每天" },
            { spanish: "excepto", chinese: "除了" },
            { spanish: "horario", chinese: "时间表" },
            { spanish: "normal", chinese: "正常的" },
            { spanish: "por la tarde", chinese: "下午" },
            { spanish: "desde", chinese: "从" },
            { spanish: "hasta", chinese: "到" },
            { spanish: "sin embargo", chinese: "然而" },
            { spanish: "alguno, na", chinese: "一些" },
            { spanish: "almacenes", chinese: "商场" },
            { spanish: "continuo, nua", chinese: "连续的" },
            { spanish: "por la mañana", chinese: "上午" },
            { spanish: "entre", chinese: "在...之间" },
            { spanish: "cerrar", chinese: "关" },
            { spanish: "antes", chinese: "之前" },
            { spanish: "antes de", chinese: "在...之前" },
            { spanish: "periódico", chinese: "报纸" },
            { spanish: "sobre", chinese: "关于/在...上" },
            { spanish: "ver", chinese: "看" },
            { spanish: "cuándo", chinese: "什么时候" },
            { spanish: "película", chinese: "电影" },
            { spanish: "idea", chinese: "主意" },
            { spanish: "perdón", chinese: "对不起" },
            { spanish: "despistado, da", chinese: "糊涂的" },
            { spanish: "cenar", chinese: "吃晚饭" },
            { spanish: "hambre", chinese: "饿" }
        ],
        grammar: {
            title: "不定形容词与 Cuándo",
            content: "1. 不定形容词：\n   - Todo/a/os/as (所有的)：todo el día (整天), todos los días (每天)。\n   - Alguno/ninguno (一些/没有)：阳性单数名词前变为 algún/ningún (algún libro, ningún problema)。\n   - 阴性形式：alguna/ninguna (alguna casa, ninguna persona)。\n2. 疑问词 Cuándo (什么时候)：\n   - 用于询问时间：¿Cuándo vas? (你什么时候去？)\n   - 可与介词搭配：¿Para cuándo? (到什么时候？)\n3. 时间表达：\n   - 频率：siempre (总是), a veces (有时), nunca (从不)。\n   - 时间段：por la mañana (上午), por la tarde (下午), por la noche (晚上)。\n4. 拓展词汇：\n   - 日常活动：cenar (吃晚饭), ver la televisión (看电视), leer (阅读), descansar (休息)。\n   - 时间单位：hora (小时), minuto (分钟), segundo (秒)。\n5. 常见错误：\n   - 混淆 algún 和 alguno：algún 用于阳性单数名词前，alguno 用于单独使用。\n   - 错误使用 todo：'todo los días' (错误) → 'todos los días'。\n6. 例句：\n   - Todos los días estudio español.\n   - ¿Cuándo vienes a mi casa? – Voy algún día de la semana.\n   - No tengo ningún problema.",
            quiz: [
                { question: "我们每天都学习。", options: ["Estudiamos todo día.", "Estudiamos todos los días.", "Estudiamos algún día.", "Estudiamos nada día."], answer: 1 },
                { question: "你什么时候去？", options: ["¿Cómo vas?", "¿Dónde vas?", "¿Cuándo vas?", "¿Qué vas?"], answer: 2 }
            ]
        },
        reading: {
            text: "— ¿Qué hacemos esta noche?\n— Podemos ir a cenar y luego ir a una discoteca a bailar.\n— ¡Buena idea! ¿A qué hora quedamos?\n— A las nueve en mi casa.",
            questions: [
                { question: "¿Qué van a hacer?", options: ["Estudiar", "Cenar y bailar", "Ver la tele"], answer: 1 },
                { question: "¿Dónde van a bailar?", options: ["En casa", "En la escuela", "En una discoteca"], answer: 2 }
            ]
        },
        translation: [
            { q: "我们今晚做什么？", a: "¿Qué hacemos esta noche?", type: "zh-es" },
            { q: "我想看电视。", a: "Quiero ver la televisión.", type: "zh-es" },
            { q: "¿Cuándo vienes?", a: "你什么时候来？", type: "es-zh" }
        ],
        verbs: [
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
                }
            }
        ]
    },
    {
        id: 11,
        title: "¡FELIZ CUMPLEAÑOS!",
        subtitle: "生日快乐！",
        vocab: [
            { spanish: "papá", chinese: "爸爸" },
            { spanish: "periodista", chinese: "记者" },
            { spanish: "viajar", chinese: "旅行" },
            { spanish: "extranjero, ra", chinese: "外国的" },
            { spanish: "vez", chinese: "次" },
            { spanish: "escribir", chinese: "写" },
            { spanish: "artículo", chinese: "文章" },
            { spanish: "viaje", chinese: "旅行" },
            { spanish: "mamá", chinese: "妈妈" },
            { spanish: "ama de casa", chinese: "家庭主妇" },
            { spanish: "cocinar", chinese: "做饭" },
            { spanish: "limpieza", chinese: "清扫" },
            { spanish: "cuando", chinese: "当...时候" },
            { spanish: "libre", chinese: "自由的/空闲的" },
            { spanish: "leer", chinese: "读" },
            { spanish: "secundario, ria", chinese: "中等的" },
            { spanish: "deberes", chinese: "作业" },
            { spanish: "jugar", chinese: "玩" },
            { spanish: "fútbol", chinese: "足球" },
            { spanish: "agosto", chinese: "八月" },
            { spanish: "vacación", chinese: "假期" },
            { spanish: "pueblo", chinese: "村镇" },
            { spanish: "tranquilo, la", chinese: "安静的" },
            { spanish: "regalo", chinese: "礼物" },
            { spanish: "felicidad", chinese: "幸福" },
            { spanish: "abrir", chinese: "打开" },
            { spanish: "paquete", chinese: "包裹" },
            { spanish: "florero", chinese: "花瓶" },
            { spanish: "de nada", chinese: "没关系" },
            { spanish: "poner", chinese: "放" },
            { spanish: "saber", chinese: "知道" },
            { spanish: "encima", chinese: "在上面" },
            { spanish: "a propósito", chinese: "顺便说" },
            { spanish: "conocer", chinese: "认识" },
            { spanish: "entrar", chinese: "进入" },
            { spanish: "casado, da", chinese: "已婚的" },
            { spanish: "feliz", chinese: "幸福的" }
        ],
        grammar: {
            title: "第二、三变位规则动词",
            content: "1. 第二变位 (-er) 规则：\n   - 去掉 -er，添加：yo -o, tú -es, él -e, nosotros -emos, vosotros -éis, ellos -en。\n   - 例如 Comer (吃): como, comes, come, comemos, coméis, comen。\n2. 第三变位 (-ir) 规则：\n   - 去掉 -ir，添加：yo -o, tú -es, él -e, nosotros -imos, vosotros -ís, ellos -en。\n   - 例如 Vivir (居住): vivo, vives, vive, vivimos, vivís, viven。\n3. 区别：\n   - Nosotros 形式：-emos (第二变位) vs -imos (第三变位)。\n   - Vosotros 形式：-éis (第二变位) vs -ís (第三变位)。\n4. 常用动词：\n   - Beber (喝): bebo, bebes, bebe, bebemos, bebéis, beben。\n   - Escribir (写): escribo, escribes, escribe, escribimos, escribís, escriben。\n5. 拓展词汇：\n   - 食物：tarta (蛋糕), vino (葡萄酒), comida (食物), bebida (饮料)。\n   - 活动：viajar (旅行), leer (阅读), jugar (玩), cocinar (烹饪)。\n6. 常见错误：\n   - 混淆 -er 和 -ir 变位：'vivemos' (错误) → 'vivimos'。\n   - 忘记重音符号：coméis, bebéis。\n7. 例句：\n   - Yo como una manzana cada día.\n   - Ellos viven en un pueblo tranquilo.\n   - Nosotros bebemos agua.",
            quiz: [
                { question: "我住在北京。", options: ["Vivo en Pekín.", "Vives en Pekín.", "Vivimos en Pekín.", "Viven en Pekín."], answer: 0 },
                { question: "你们吃什么？", options: ["¿Qué comes?", "¿Qué comen?", "¿Qué coméis?", "¿Qué comemos?"], answer: 2 }
            ]
        },
        reading: {
            text: "Hoy es el cumpleaños de Ana. Ella da una fiesta en su casa. Invita a todos sus amigos. Comemos tarta, bebemos vino y cantamos 'Cumpleaños Feliz'.",
            questions: [
                { question: "¿De quién es el cumpleaños?", options: ["De Ana", "De Pedro", "De mí"], answer: 0 },
                { question: "¿Qué hacen en la fiesta?", options: ["Estudian", "Comen tarta y beben", "Duermen"], answer: 1 }
            ]
        },
        translation: [
            { q: "生日快乐！", a: "¡Feliz cumpleaños!", type: "zh-es" },
            { q: "我住在西班牙。", a: "Vivo en España.", type: "zh-es" },
            { q: "Comes mucho.", a: "你吃很多", type: "es-zh" }
        ],
        verbs: [
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
            }
        ]
    },
    {
        id: 12,
        title: "¡BIENVENIDO A CHINA!",
        subtitle: "欢迎来中国！",
        vocab: [
            { spanish: "intérprete", chinese: "译员" },
            { spanish: "estancia", chinese: "逗留" },
            { spanish: "asistir", chinese: "参加" },
            { spanish: "congreso", chinese: "会议" },
            { spanish: "luego", chinese: "然后" },
            { spanish: "aprovechar", chinese: "利用" },
            { spanish: "turismo", chinese: "旅游" },
            { spanish: "programa", chinese: "日程" },
            { spanish: "mirar", chinese: "看" },
            { spanish: "querer", chinese: "想要" },
            { spanish: "amar", chinese: "爱" },
            { spanish: "repartir", chinese: "分发" },
            { spanish: "parque industrial", chinese: "工业园" },
            { spanish: "nada", chinese: "没有什么" },
            { spanish: "esperar", chinese: "等待" },
            { spanish: "hall", chinese: "大厅" },
            { spanish: "bienvenido, da", chinese: "受欢迎的" },
            { spanish: "próximo, ma", chinese: "下一个" },
            { spanish: "llave", chinese: "钥匙" },
            { spanish: "tuyo, ya", chinese: "你的" },
            { spanish: "cuál", chinese: "哪一个" },
            { spanish: "encontrar", chinese: "找到" },
            { spanish: "buscar", chinese: "寻找" },
            { spanish: "recepcionista", chinese: "接待员" },
            { spanish: "No importa", chinese: "没关系" },
            { spanish: "mío, a", chinese: "我的" },
            { spanish: "lado", chinese: "边" }
        ],
        grammar: {
            title: "Cuál vs Qué 和 直接宾语",
            content: "1. Qué 与 Cuál 的区别：\n   - Qué + 名词：询问种类或性质 (¿Qué libro lees? 你读什么书？)。\n   - Cuál + ser：在有限选项中选择 (¿Cuál es tu libro? 哪本书是你的？)。\n2. 直接宾语代词：\n   - 单数：me (我), te (你), lo (他/它，阳), la (她/它，阴)。\n   - 复数：nos (我们), os (你们), los (他们/它们，阳), las (她们/它们，阴)。\n3. 位置：\n   - 通常放在变位动词前：Lo veo (我看见他)。\n   - 与动词原形连用时，可附着在动词后：Voy a verlo (我打算去看他)。\n4. 拓展词汇：\n   - 旅行相关：intérprete (译员), estancia (逗留), congreso (会议), turismo (旅游)。\n   - 酒店相关：recepcionista (接待员), llave (钥匙), habitación (房间)。\n5. 常见错误：\n   - 混淆 lo/la 与 le：直接宾语用 lo/la，间接宾语用 le。\n   - 错误使用 qué/cuál：'¿Qué es tu nombre?' (错误) → '¿Cuál es tu nombre?'。\n6. 例句：\n   - ¿Cuál es tu maleta? – La azul.\n   - Lo compro en la tienda.\n   - Nos ven en el parque.",
            quiz: [
                { question: "你的电话号码是多少？", options: ["¿Qué es tu número?", "¿Cuál es tu número?", "¿Cómo es tu número?", "¿Dónde es tu número?"], answer: 1 },
                { question: "我买这本书。(用代词替换)", options: ["La compro.", "Lo compro.", "Le compro.", "Me compro."], answer: 1 }
            ]
        },
        reading: {
            text: "— ¡Bienvenido a China, Señor García!\n— Muchas gracias. Estoy muy contento de estar aquí, pero el viaje es largo y estoy cansado.\n— El taxi está fuera. Vamos al hotel.",
            questions: [
                { question: "¿Cómo está el Señor García?", options: ["Triste", "Cansado pero contento", "Enfermo"], answer: 1 },
                { question: "¿Adónde van ahora?", options: ["Al aeropuerto", "A casa", "Al hotel"], answer: 2 }
            ]
        },
        translation: [
            { q: "欢迎来中国。", a: "Bienvenido a China.", type: "zh-es" },
            { q: "你的箱子是哪一个？", a: "¿Cuál es tu maleta?", type: "zh-es" },
            { q: "Lo veo.", a: "我看见他了", type: "es-zh" }
        ],
        verbs: []
    },
    {
        id: 13,
        title: "¿QUÉ DESEA USTED?",
        subtitle: "您想要点什么？",
        vocab: [
            { spanish: "la Ciudad de México", chinese: "墨西哥城" },
            { spanish: "limpiar", chinese: "打扫" },
            { spanish: "mercado", chinese: "市场" },
            { spanish: "porque", chinese: "因为" },
            { spanish: "hacer compras", chinese: "购物" },
            { spanish: "lejos", chinese: "远" },
            { spanish: "verdura", chinese: "蔬菜" },
            { spanish: "fresco, ca", chinese: "新鲜的" },
            { spanish: "ambiente", chinese: "气氛" },
            { spanish: "preferir", chinese: "更喜欢" },
            { spanish: "precio", chinese: "价格" },
            { spanish: "escrito, ta", chinese: "写出来的" },
            { spanish: "tarjeta de crédito", chinese: "信用卡" },
            { spanish: "zapatería", chinese: "鞋店" },
            { spanish: "llegar", chinese: "到达" },
            { spanish: "dependiente, ta", chinese: "售货员" },
            { spanish: "ayudar", chinese: "帮助" },
            { spanish: "cliente, ta", chinese: "顾客" },
            { spanish: "par", chinese: "双" },
            { spanish: "zapato", chinese: "鞋" },
            { spanish: "color", chinese: "颜色" },
            { spanish: "negro, gra", chinese: "黑色" },
            { spanish: "marrón", chinese: "褐色" },
            { spanish: "último, ma", chinese: "最后的" },
            { spanish: "de moda", chinese: "时髦" },
            { spanish: "pasar", chinese: "递/过" },
            { spanish: "numeración", chinese: "号码" },
            { spanish: "probarse", chinese: "试穿" },
            { spanish: "quedar", chinese: "合适/剩下" },
            { spanish: "euro", chinese: "欧元" },
            { spanish: "caro, ra", chinese: "贵的" },
            { spanish: "gustar", chinese: "喜欢" },
            { spanish: "tener que", chinese: "必须" },
            { spanish: "pagar", chinese: "付款" },
            { spanish: "caja", chinese: "收款台" },
            { spanish: "cajero, ra", chinese: "收银员" },
            { spanish: "cambio", chinese: "零钱" }
        ],
        grammar: {
            title: "间接宾语与比较级",
            content: "1. 间接宾语代词：\n   - 单数：me (给我), te (给你), le (给他/她/您)。\n   - 复数：nos (给我们), os (给你们), les (给他们/她们/您们)。\n2. 用法：\n   - 表示动作的接受者：Le doy el libro (我给他这本书)。\n   - 与动词 gustar 等连用：Me gusta (我喜欢)。\n3. 比较级：\n   - 更高：más + adj + que (más alto que 更高)。\n   - 更低：menos + adj + que (menos caro que 更便宜)。\n   - 同等：tan + adj + como (tan grande como 一样大)。\n4. 拓展词汇：\n   - 购物：dependiente (售货员), cliente (顾客), precio (价格), tarjeta de crédito (信用卡)。\n   - 颜色：negro (黑色), marrón (褐色), azul (蓝色), blanco (白色)。\n5. 常见错误：\n   - 混淆直接宾语和间接宾语：'Le veo' (我看见他) 应为 'Lo veo' (直接宾语)。\n   - 忘记 'que'：'más caro eso' (错误) → 'más caro que eso'。\n6. 例句：\n   - Te doy un regalo.\n   - Esta camisa es más bonita que esa.\n   - Le gusta el color azul.",
            quiz: [
                { question: "我给你一本书。", options: ["Te doy un libro.", "Me das un libro.", "Le doy un libro.", "Lo doy un libro."], answer: 0 },
                { question: "这件衬衫比那件贵。", options: ["Esta camisa es más cara que esa.", "Esta camisa es tan cara como esa.", "Esta camisa es menos cara que esa.", "Esta camisa es cara que esa."], answer: 0 }
            ]
        },
        reading: {
            text: "— Buenos días, ¿qué desea?\n— Quiero comprar una camisa blanca.\n— Tenemos estas. Son muy bonitas y baratas.\n— Me gusta esta. ¿Puedo probármela?",
            questions: [
                { question: "¿Qué quiere comprar?", options: ["Un pantalón", "Una camisa", "Unos zapatos"], answer: 1 },
                { question: "¿De qué color?", options: ["Negra", "Blanca", "Azul"], answer: 1 }
            ]
        },
        translation: [
            { q: "您想要什么？", a: "¿Qué desea?", type: "zh-es" },
            { q: "我想买一件衣服。", a: "Quiero comprar ropa.", type: "zh-es" },
            { q: "Este es más grande que ese.", a: "这个比那个大", type: "es-zh" }
        ],
        verbs: [
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
                }
            }
        ]
    },
    {
        id: 14,
        title: "TIENES QUE LEVANTARTE",
        subtitle: "你该起床了",
        vocab: [
            { spanish: "levantarse", chinese: "起床" },
            { spanish: "biblioteca", chinese: "图书馆" },
            { spanish: "nacional", chinese: "国家的" },
            { spanish: "novela", chinese: "小说" },
            { spanish: "decir", chinese: "说" },
            { spanish: "pedir", chinese: "请求/借" },
            { spanish: "contemporáneo, a", chinese: "当代的" },
            { spanish: "acostarse", chinese: "睡下" },
            { spanish: "no...hasta", chinese: "直到...才" },
            { spanish: "eso", chinese: "那" },
            { spanish: "prestar", chinese: "借出" },
            { spanish: "bicicleta", chinese: "自行车" },
            { spanish: "parecer", chinese: "好像" },
            { spanish: "efectivamente", chinese: "确实" },
            { spanish: "bibliotecario, ria", chinese: "图书管理员" },
            { spanish: "atender", chinese: "接待" },
            { spanish: "leído, da", chinese: "读过的" },
            { spanish: "devolver", chinese: "归还" },
            { spanish: "lavarse", chinese: "洗" },
            { spanish: "minuto", chinese: "分钟" },
            { spanish: "por favor", chinese: "请" },
            { spanish: "llevar", chinese: "带去" },
            { spanish: "levantado, da", chinese: "起床了的" },
            { spanish: "aeropuerto", chinese: "机场" },
            { spanish: "avión", chinese: "飞机" },
            { spanish: "rápido", chinese: "快" },
            { spanish: "afeitarse", chinese: "刮胡子" },
            { spanish: "arreglar", chinese: "收拾" },
            { spanish: "incluso", chinese: "甚至" },
            { spanish: "preparar", chinese: "准备" },
            { spanish: "planchar", chinese: "熨" },
            { spanish: "camisa", chinese: "衬衫" },
            { spanish: "dejar", chinese: "放下/离开" }
        ],
        grammar: {
            title: "自复动词与义务表达",
            content: "1. 自复动词 (动词 + se)：\n   - 表示动作作用于主语自身：levantarse (起床), lavarse (洗), acostarse (睡下)。\n   - 变位：me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan。\n2. 义务表达：\n   - Tener que + 动词原形 (必须)：Tengo que estudiar (我必须学习)。\n   - Hay que + 动词原形 (必须，无人称)：Hay que levantarse temprano (必须早起)。\n3. 时间表达：\n   - 频率：todos los días (每天), a veces (有时), nunca (从不)。\n   - 具体时间：a las siete (在七点), por la mañana (早上)。\n4. 拓展词汇：\n   - 日常活动：afeitarse (刮胡子), ducharse (淋浴), vestirse (穿衣), prepararse (准备)。\n   - 家务：limpiar (打扫), planchar (熨), arreglar (收拾)。\n5. 常见错误：\n   - 忘记自复代词：'Levanto a las siete' (错误) → 'Me levanto a las siete'。\n   - 混淆 tener que 和 deber：Tener que 强调客观必须，deber 强调道义应该。\n6. 例句：\n   - Me levanto a las siete todos los días.\n   - Tienes que lavarte las manos antes de comer.\n   - Se acuesta a las once de la noche.",
            quiz: [
                { question: "我每天七点起床。", options: ["Levanto a las siete.", "Me levanto a las siete.", "Te levantas a las siete.", "Se levanta a las siete."], answer: 1 },
                { question: "你必须学习。", options: ["Tienes estudiar.", "Tienes que estudiar.", "Tener que estudiar.", "Debes de estudiar."], answer: 1 }
            ]
        },
        reading: {
            text: "Todos los días me levanto a las siete. Me ducho, desayuno y voy a la escuela. Tengo que llegar antes de las ocho. Por la noche, me acuesto a las once.",
            questions: [
                { question: "¿A qué hora se levanta?", options: ["A las seis", "A las siete", "A las ocho"], answer: 1 },
                { question: "¿Qué hace después de levantarse?", options: ["Come", "Se ducha", "Duerme"], answer: 1 }
            ]
        },
        translation: [
            { q: "我必须要走了。", a: "Tengo que irme.", type: "zh-es" },
            { q: "你几点起床？", a: "¿A qué hora te levantas?", type: "zh-es" },
            { q: "Me levanto muy temprano.", a: "我起得很早", type: "es-zh" }
        ],
        verbs: [
            {
                infinitive: "levantarse",
                meaning: "起床",
                conjugation: {
                    yo: "me levanto",
                    tú: "te levantas",
                    él: "se levanta",
                    nosotros: "nos levantamos",
                    vosotros: "os levantáis",
                    ellos: "se levantan"
                }
            }
        ]
    },
    {
        id: 15,
        title: "NECESITAMOS UN PISO",
        subtitle: "我们需要一个住处",
        vocab: [
            { spanish: "línea", chinese: "线路", gender: "f." },
            { spanish: "volver a", chinese: "重新，重又", gender: "" },
            { spanish: "Oiga", chinese: "喂", gender: "" },
            { spanish: "difícil", chinese: "困难的", gender: "adj." },
            { spanish: "central", chinese: "总机；中心的", gender: "f. adj." },
            { spanish: "ocupado, da", chinese: "被占用的", gender: "p.p." },
            { spanish: "entender", chinese: "懂，明白，理解", gender: "tr." },
            { spanish: "colgar", chinese: "挂", gender: "tr." },
            { spanish: "teléfono", chinese: "电话", gender: "m." },
            { spanish: "derecho", chinese: "权利", gender: "m." },
            { spanish: "trabajo", chinese: "论文，作品", gender: "m." },
            { spanish: "página", chinese: "页", gender: "f." },
            { spanish: "entrada", chinese: "入场券，门票", gender: "f." },
            { spanish: "concierto", chinese: "音乐会", gender: "m." },
            { spanish: "lástima", chinese: "遗憾", gender: "f." },
            { spanish: "café", chinese: "咖啡，咖啡馆", gender: "m." },
            { spanish: "seguramente", chinese: "肯定，可能", gender: "adv." },
            { spanish: "Vale", chinese: "(表示赞同)行，好", gender: "" },
            { spanish: "Gijón", chinese: "西洪咖啡厅(文中)", gender: "" },
            { spanish: "de acuerdo", chinese: "同意", gender: "" },
            { spanish: "piso", chinese: "楼层；(楼房内的)套间", gender: "m." },
            { spanish: "calle", chinese: "街", gender: "f." },
            { spanish: "cuarto", chinese: "第四", gender: "num." },
            { spanish: "cerca", chinese: "挨近，靠近", gender: "adv." },
            { spanish: "piscina", chinese: "游泳池", gender: "f." },
            { spanish: "alquiler", chinese: "租金", gender: "m." },
            { spanish: "¡Huy!", chinese: "嗬！", gender: "interj." },
            { spanish: "costar", chinese: "值……钱", gender: "intr." },
            { spanish: "barato, ta", chinese: "便宜的", gender: "adj." },
            { spanish: "tercero", chinese: "第三的", gender: "num." },
            { spanish: "circunvalación", chinese: "环路", gender: "f." },
            { spanish: "frigorífico", chinese: "冰箱", gender: "m." },
            { spanish: "gas", chinese: "煤气", gender: "m." },
            { spanish: "luz", chinese: "光，灯", gender: "f." },
            { spanish: "aparte", chinese: "另外，单独", gender: "adv." }
        ],
        grammar: {
            title: "绝对最高级与形容词从句",
            content: "1. 绝对最高级：\n   - 构成：形容词 + -ísimo/a/os/as (去掉词尾元音后添加)。\n   - 例如：grande → grandísimo (非常大), guapo → guapísimo (非常帅)。\n   - 不规则：bueno → buenísimo, malo → malísimo。\n2. 形容词从句：\n   - 用 que 引导，修饰名词。\n   - 如果名词是确定的，从句用陈述式：El piso que es tranquilo (那个安静的公寓)。\n   - 如果名词是不确定的，从句用虚拟式：Busco un piso que sea tranquilo (我要找一个安静的公寓)。\n3. 拓展词汇：\n   - 房屋相关：piso (公寓), calle (街道), cuarto (房间), piscina (游泳池), alquiler (租金)。\n   - 家电：frigorífico (冰箱), gas (煤气), luz (灯)。\n4. 常见错误：\n   - 最高级拼写错误：'grandisimo' (错误) → 'grandísimo' (带重音)。\n   - 混淆陈述式和虚拟式：'Busco un piso que es' (错误，应用虚拟式)。\n5. 例句：\n   - Este apartamento es carísimo.\n   - Necesito un piso que tenga tres habitaciones.\n   - La casa que compramos es grandísima.",
            quiz: [
                { question: "这个房子非常大 (最高级)。", options: ["Esta casa es muy grande.", "Esta casa es grandísima.", "Esta casa es más grande.", "Esta casa es grande."], answer: 1 },
                { question: "我要找一个安静的公寓。", options: ["Busco un piso que es tranquilo.", "Busco un piso tranquilo.", "Busco piso tranquilo.", "Busco el piso tranquilo."], answer: 1 }
            ]
        },
        reading: {
            text: "Busco un piso para alquilar. Necesito un piso que esté en el centro, pero que sea tranquilo. Los pisos en el centro son carísimos y a veces ruidosos.",
            questions: [
                { question: "¿Qué busca?", options: ["Una casa", "Un piso", "Un hotel"], answer: 1 },
                { question: "¿Cómo son los pisos en el centro?", options: ["Baratos", "Tranquilos", "Carísimos"], answer: 2 }
            ]
        },
        translation: [
            { q: "我们需要一个公寓。", a: "Necesitamos un piso.", type: "zh-es" },
            { q: "这个非常贵。", a: "Es carísimo.", type: "zh-es" },
            { q: "Quiero vivir en el centro.", a: "我想住在市中心", type: "es-zh" }
        ],
        verbs: [
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
        ]
    },
    {
        id: 16,
        title: "REPASO GENERAL",
        subtitle: "综合复习 (L1-L15)",
        vocab: [], // Will be populated dynamically in App
        grammar: {
            title: "综合语法测试",
            content: "涵盖 L1-L15 所有语法点：\n1. 动词变位 (Ser, Estar, Tener, 规则动词, Ir, Venir)。\n2. 代词 (主格, 直接宾语, 间接宾语)。\n3. 形容词性数一致与比较级。",
            quiz: [
                { question: "L5: 我们的书 (复数)", options: ["Nuestro libros", "Nuestros libros", "Nuestras libros", "Mis libros"], answer: 1 },
                { question: "L8: 我去电影院。", options: ["Voy el cine.", "Voy al cine.", "Ir al cine.", "Vengo al cine."], answer: 1 },
                { question: "L14: 我每天七点起床。", options: ["Levanto a las siete.", "Me levanto a las siete.", "Te levantas a las siete.", "Se levanta a las siete."], answer: 1 },
                { question: "L12: 我看见他了 (Lo)。", options: ["Lo veo.", "La veo.", "Le veo.", "Me veo."], answer: 0 },
                { question: "L10: 你什么时候来？", options: ["¿Cómo vienes?", "¿Dónde vienes?", "¿Cuándo vienes?", "¿Qué vienes?"], answer: 2 }
            ]
        },
        reading: {
            text: "Hola, me llamo Pedro. Soy español y vivo en Madrid. Soy médico y trabajo en un hospital grande. Todos los días me levanto a las siete, desayuno café y pan, y voy al trabajo en coche. Me gusta mucho mi trabajo. Los fines de semana, salgo con mis amigos al cine o a cenar.",
            questions: [
                { question: "¿De dónde es Pedro?", options: ["China", "España", "Francia"], answer: 1 },
                { question: "¿Qué es Pedro?", options: ["Profesor", "Médico", "Estudiante"], answer: 1 },
                { question: "¿A qué hora se levanta?", options: ["A las seis", "A las siete", "A las ocho"], answer: 1 },
                { question: "¿Qué hace los fines de semana?", options: ["Trabaja", "Duerme", "Sale con amigos"], answer: 2 }
            ]
        },
        translation: [
            { q: "你是谁？", a: "¿Quién eres?", type: "zh-es" },
            { q: "我是学生。", a: "Soy estudiante.", type: "zh-es" },
            { q: "今天很热。", a: "Hoy hace mucho calor.", type: "zh-es" },
            { q: "我去学校。", a: "Voy a la escuela.", type: "zh-es" },
            { q: "我必须要走了。", a: "Tengo que irme.", type: "zh-es" },
            { q: "Buenos días.", a: "早上好", type: "es-zh" },
            { q: "Me levanto muy temprano.", a: "我起得很早", type: "es-zh" }
        ],
        verbs: []
    },
    {
        id: 17,
        title: "S2——动词变位专项复习",
        subtitle: "动词变位分类练习",
        vocab: [],
        grammar: {
            title: "动词变位分类",
            content: "本专项复习包含1-15课所有动词的变位，分为四个板块：\n1. 第一变位 (-ar) 动词：规则动词和不规则动词\n2. 第二变位 (-er) 动词：规则动词和不规则动词\n3. 第三变位 (-ir) 动词：规则动词和不规则动词\n4. 完全不规则动词：特殊变位动词\n\n每个动词都提供了完整的六个人称变位形式。",
            quiz: [
                { question: "第一变位动词的词尾是什么？", options: ["-ar", "-er", "-ir", "-or"], answer: 0 },
                { question: "以下哪个动词属于第二变位？", options: ["hablar", "comer", "vivir", "ser"], answer: 1 },
                { question: "动词 'tener' 属于哪种不规则类型？", options: ["e->ie 词干变化", "o->ue 词干变化", "e->i 词干变化", "完全规则"], answer: 0 },
                { question: "动词 'ir' 的 'yo' 形式是什么？", options: ["voy", "vas", "va", "vamos"], answer: 0 },
                { question: "动词 'decir' 的 'ellos' 形式是什么？", options: ["dicen", "dices", "dice", "decimos"], answer: 0 }
            ]
        },
        reading: {
            text: "动词变位是西班牙语学习的核心。掌握动词变位能帮助你正确表达时态、人称和语气。本专项复习整理了1-15课中出现的所有动词，按照变位类型进行分类，方便系统学习和记忆。",
            questions: [
                { question: "动词变位为什么重要？", options: ["帮助表达时态和人称", "增加词汇量", "提高阅读速度", "学习语法规则"], answer: 0 },
                { question: "本专项复习包含多少课的内容？", options: ["1-10课", "1-15课", "1-5课", "所有课程"], answer: 1 }
            ]
        },
        translation: [],
        verbs: [
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
            },
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
                }
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
                }
            },
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
                }
            },
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
                }
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
                }
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
                }
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
                }
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
                }
            },
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
            },
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
                }
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
                }
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
                }
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
                }
            },
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
    }
];
