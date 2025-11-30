// src/config.js (ou onde você salvou)

// AQUI VOCÊ MUDA O IP UMA VEZ E REFLETE EM TUDO
const MEU_IP = '192.168.15.77'; 
const PORTA = '3001';

// Base geral (opcional, ajuda se quiser montar urls na mão)
const BASE = `http://${MEU_IP}:${PORTA}/api`;

// Exportamos as URLs específicas para cada tela usar
export const API_PETS = `${BASE}/pets`;
export const API_SERVICOS = `${BASE}/servicos`;
export const API_AUTH = `${BASE}/auth`; // Já deixando pronto pra login