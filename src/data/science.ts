/** Published research supports individual principles, not a validated FoveaRx device. */
export const scienceReferences = [
  {
    title: "Adaptive liquid crystal lens with large focal length tunability",
    authors: "Hongwen Ren; Shin-Tson Wu",
    year: 2006,
    doi: "10.1364/OE.14.011292",
    url: "https://pubmed.ncbi.nlm.nih.gov/19529544/",
    finding:
      "Demonstra uma lente de cristal líquido com gradiente de índice induzido eletricamente. Na configuração com ar, a distância focal variou do infinito a aproximadamente 96 cm.",
    limitation:
      "Experimento óptico com geometria específica de vidro e eletrodos. Não demonstra óculos completos, rastreamento do olhar ou desempenho clínico do FoveaRx.",
  },
  {
    title: "Autofocals: Evaluating gaze-contingent eyeglasses for presbyopes",
    authors: "Nitish Padmanaban; Robert Konrad; Gordon Wetzstein",
    year: 2019,
    doi: "10.1126/sciadv.aav6187",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6598771/",
    finding:
      "Combina rastreamento binocular, câmera de profundidade e lentes líquidas ajustáveis. Em testes com 19 usuários, houve ganhos de acuidade e desempenho de refoco em condições avaliadas.",
    limitation:
      "Protótipo ligado a equipamento externo, com lentes líquidas diferentes da camada de cristal líquido proposta aqui. Peso, conforto e calibração limitavam o uso cotidiano.",
  },
  {
    title:
      "Dynamic presbyopia correction in the macular field of view by using a liquid crystal lens",
    authors: "Louis Bégel; Tigran Galstian",
    year: 2025,
    doi: "10.1364/BOE.557747",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12265476/",
    finding:
      "Uma matriz de lentes locais de cristal líquido apresentou ajuste de 0 a 2,5 D e resposta otimizada de 0,5 s em laboratório. Testes preliminares com sete participantes avaliaram acuidade visual.",
    limitation:
      "Os testes não integraram eye tracking; o alinhamento foi previamente definido. Temperatura, campo de visão e integração portátil exigem estudos adicionais.",
  },
  {
    title:
      "Dynamic control of defocus, astigmatism, and tilt aberrations with a large area foveal liquid crystal lens",
    authors: "Louis Bégel; Tigran Galstian",
    year: 2024,
    doi: "10.1364/AO.517797",
    url: "https://opg.optica.org/ao/abstract.cfm?uri=ao-63-11-2798",
    finding:
      "O resumo descreve controle independente de astigmatismo, eixo e inclinação da frente de onda por quatro eletrodos, além de lentes negativas locais com cristal líquido de dupla frequência.",
    limitation:
      "Evidência de controle óptico. A verificação disponível abrange o resumo editorial; não comprova correção clínica ou integração dessas funções no FoveaRx.",
  },
] as const;

export const scienceTopics = [
  {
    title: "Uma arquitetura proposta",
    body: "O FoveaRx One combina, em conceito, lente-base, cristal líquido, eye tracking, sensor de distância e processamento. Os estudos citados demonstram partes dessa ideia em sistemas distintos. A integração FoveaRx ainda não foi fabricada ou validada clinicamente.",
  },
  {
    title: "A prescrição começa na lente-base",
    body: "Na primeira geração proposta, uma lente convencional forneceria a correção principal de esfera e astigmatismo. A camada eletrônica complementaria essa prescrição. Alterações maiores do grau exigiriam avaliação profissional e possível substituição da lente-base.",
  },
  {
    title: "Foco sem deformação macroscópica",
    body: "Um campo elétrico pode orientar as moléculas do cristal líquido e alterar o índice de refração efetivo. Uma distribuição espacial desse índice — GRIN — modifica a frente de onda e o foco, sem precisar dobrar a lente.",
  },
  {
    title: "Uma zona que acompanha o olhar",
    body: "A região ativa projetada de 6–8 mm é uma meta do conceito. Seu alinhamento deve considerar direção do olhar, posição do olho, pupila, distância olho–lente e geometria da armação. A posição da pupila, sozinha, não determina toda a área óptica necessária.",
  },
  {
    title: "Direção estimada. Calibração necessária.",
    body: "O eye tracking infravermelho proposto observaria características oculares para estimar a direção do olhar. A calibração individual deve relacionar essa direção à lente e à cena. Deslizamento da armação e erros de rastreamento precisam ser tratados antes de controlar o foco.",
  },
  {
    title: "Distância exige contexto",
    body: "Um sensor ToF/LiDAR proposto forneceria estimativas de distância. O sistema ainda precisaria associar essas medidas ao alvo observado. Objetos sobrepostos, transparências, movimento e erros de medição podem tornar ambígua a escolha da profundidade.",
  },
  {
    title: "Olhar → medir → calcular → ajustar",
    body: "O processamento proposto fundiria direção e distância, estimaria um complemento à prescrição e comandaria os eletrodos. As demonstrações do site ilustram esse fluxo. Não calculam uma receita médica nem representam resposta medida de um dispositivo físico.",
  },
  {
    title: "±1,5 D é uma meta",
    body: "A faixa eletrônica de ±1,5 dioptria é um objetivo inicial, sem demonstração integrada no FoveaRx. Ela não substitui automaticamente toda prescrição nem equivale a corrigir qualquer alteração visual. O ajuste depende do projeto óptico e da avaliação do usuário.",
  },
  {
    title: "Astigmatismo: pesquisa e proposta",
    body: "Há pesquisa publicada sobre controle eletrônico de astigmatismo e eixo em lentes foveais. Para o FoveaRx inicial, essas correções permaneceriam na lente-base. Um futuro controle de esfera, cilindro e eixo dependeria de desenvolvimento e validação específicos.",
  },
  {
    title: "Sem energia, um estado a validar",
    body: "Preservar apenas o grau-base quando a bateria acaba exige uma camada eletrônica com estado óptico neutro adequado. Esse comportamento é um requisito de projeto ainda não validado no FoveaRx. Desligar a eletrônica não garante, por si só, neutralidade óptica.",
  },
  {
    title: "Da bancada ao uso diário",
    body: "Espessura, eletrodos transparentes, aberrações, polarização, campo de visão, resposta temporal e consumo precisam funcionar em conjunto. Calibração, conforto, fabricação, manutenção, segurança ocular e validação clínica são etapas necessárias antes de qualquer aplicação médica.",
  },
  {
    title: "Metas de design, sem desempenho medido",
    body: "55 g, autonomia de 10–12 h, zona ativa de 6–8 mm e ajuste de ±1,5 D são metas conceituais. Nenhum dos artigos comprova esse conjunto integrado. O FoveaRx One é uma proposta educacional, sem certificação médica ou aprovação regulatória declarada.",
  },
] as const;
