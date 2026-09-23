/**
 * Tempo mínimo com a splash visível. 800ms evitam o piscar em aparelhos rápidos; os 2s extras são
 * escolha de produto, para a marca ficar em tela antes da seleção de perfil.
 */
export const SPLASH_MIN_DURATION_MS = 2800;

/**
 * Tempo máximo esperando as condições de readiness. Estourado, a splash sai mesmo assim e o
 * `useSplash` reporta `timedOut` com as condições pendentes. Nunca deixa o app preso.
 */
export const SPLASH_ESCAPE_TIMEOUT_MS = 8000;

/**
 * Se a imagem da splash em JS não sinalizar carregamento neste prazo, a splash nativa é escondida
 * de qualquer forma (a camada JS já está pintada com a cor de fundo).
 */
export const SPLASH_NATIVE_HIDE_FALLBACK_MS = 1000;
