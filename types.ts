
export type StatutEnvoi = 'Non envoyé' | 'En préparation' | 'Envoyé';
export type ReponseOfficielle = '-' | 'En attente' | 'Positive' | 'Négative';

export interface Universite {
  id: number;
  nom: string;
  ville: string;
  statut: StatutEnvoi;
  reponse: ReponseOfficielle;
  observation: string;
}

export interface Stats {
  total: number;
  envoyes: number;
  reponses: number;
}
