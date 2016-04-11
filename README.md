# Computação Gráfica - EP1
Animação de um tetraedro em queda livre. Ao colidir com o chão, o tetraedro se divide até formar uma esfera

## Integrantes
- Rodrigo Alves Souza (6800149)
- Claudio Fernandes da Silva Filho (7158472)

## Guia do usuário
A animação é feita em WebGL dentro de um canvas HTML5 com o uso de jQuery para os controles da animação. Para controlar a animação basta mexer na interface no canto superior direito da tela. É possível pausar a animação, alterar a gravidade, o tipo de renderização e acompanhar o número de vértices do modelo.

## Componentes
- **jQuery 2.2** biblioteca javascript para controle da interface de animação
- **MV.js** funções auxiliares para manipulação de vetores e pontos no espaço
- **Shaders** no código fonte do index.html para renderização utilizando a GPU
- **main.css** CSS para criação de uma UI amigável na página
- **main.js** arquivo javascript principal da animação