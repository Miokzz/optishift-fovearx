import type { ComponentInfo } from "./types";

export const componentInfo: ComponentInfo[] = [
  {
    id: "frame",
    name: "Armação frontal",
    description:
      "Estrutura de sustentação proposta para o conjunto óptico, com bordas chanfradas e alojamento das lentes.",
    material: "Titânio grafite",
  },
  {
    id: "bridge",
    name: "Ponte",
    description:
      "Conecta as duas armações e acomoda o módulo central de estimativa de distância.",
    material: "Titânio",
  },
  {
    id: "nosepads",
    name: "Narigueiras",
    description: "Apoios ajustáveis para distribuir a carga sobre o nariz.",
    material: "Silicone e titânio",
  },
  {
    id: "lens-left",
    name: "Lente-base esquerda",
    description:
      "Elemento de prescrição passiva. A correção de base permanece presente quando a eletrônica está desligada.",
    material: "Polímero óptico",
  },
  {
    id: "lens-right",
    name: "Lente-base direita",
    description:
      "Elemento de prescrição passiva, separado da camada óptica adaptativa.",
    material: "Polímero óptico",
  },
  {
    id: "lc-left",
    name: "Camada adaptativa esquerda",
    description:
      "Representação conceitual de uma célula de cristal líquido para ajuste óptico controlado eletricamente.",
    material: "Cristal líquido entre substratos ópticos",
  },
  {
    id: "lc-right",
    name: "Camada adaptativa direita",
    description:
      "Camada óptica adaptativa proposta. A visualização de cor indica um estado simulado, sem demonstrar potência óptica real.",
    material: "Cristal líquido entre substratos ópticos",
  },
  {
    id: "electrodes",
    name: "Eletrodos transparentes",
    description:
      "Substratos condutores representados como uma camada separada do conjunto óptico.",
    material: "Óxido condutor transparente",
  },
  {
    id: "ir",
    name: "Módulos infravermelhos",
    description:
      "Módulos miniaturizados propostos para estimar direção do olhar. Não há coleta de dados neste protótipo digital.",
    material: "Vidro óptico e silício",
  },
  {
    id: "tof",
    name: "Sensor ToF",
    description:
      "Módulo proposto para estimar distância e informar o controle óptico. A integração no FoveaRx é conceitual.",
    material: "Vidro óptico e silício",
  },
  {
    id: "processor",
    name: "Processador",
    description:
      "Unidade proposta para integrar estimativas dos sensores e calcular o comando de ajuste das lentes.",
    material: "Silício e encapsulamento cerâmico",
  },
  {
    id: "circuits",
    name: "Placas de circuito",
    description:
      "Placas e componentes separados, alojados dentro das hastes. O circuito é uma representação de arquitetura.",
    material: "FR-4, cobre e componentes SMD",
  },
  {
    id: "battery",
    name: "Bateria",
    description:
      "Célula recarregável proposta no interior da haste direita. Dimensões e capacidade não foram validadas em fabricação.",
    material: "Célula de íons de lítio",
  },
  {
    id: "temple-left",
    name: "Haste esquerda",
    description:
      "Carcaça com canal interno para a eletrônica e uma ponta curvada para apoio atrás da orelha.",
    material: "Titânio e elastômero",
  },
  {
    id: "temple-right",
    name: "Haste direita",
    description:
      "Carcaça com alojamento para bateria, conector e botão físico.",
    material: "Titânio e elastômero",
  },
  {
    id: "hinges",
    name: "Dobradiças",
    description:
      "Articulação mecânica entre a frente e as hastes, com barris, eixos e fixadores distintos.",
    material: "Aço inoxidável e titânio",
  },
  {
    id: "buttons",
    name: "Botões físicos",
    description:
      "Comandos propostos para ligar o sistema e permitir ajustes manuais.",
    material: "Titânio anodizado",
  },
  {
    id: "usb",
    name: "Porta USB-C",
    description:
      "Conector de recarga alojado na haste direita, com moldura, cavidade e lingueta interna.",
    material: "Aço e polímero técnico",
  },
  {
    id: "covers",
    name: "Tampas de serviço",
    description:
      "Painéis removíveis separados das carcaças. Sua retirada expõe a montagem interna.",
    material: "Titânio grafite",
  },
  {
    id: "connections",
    name: "Conexões flexíveis",
    description:
      "Interconexões propostas entre módulos, placas e conjunto óptico.",
    material: "Poliimida e cobre",
  },
];
