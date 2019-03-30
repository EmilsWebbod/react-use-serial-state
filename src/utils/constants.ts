interface IERROR {
  STATUS: { [key: number]: string };
}

export const ERROR: IERROR = {
  STATUS: {
    400: 'Ikke godkjent. Dette skyldes en feil i systemet',
    401: 'Ikke autorisert',
    402: 'Du har ikke tilgang til denne funksjonen',
    403: 'Forbudt',
    404: 'Fant ikke det du lette etter',
    408: 'Server tidsavbrudd',
    410: 'Dataen du er ute etter eksisterer ikke lenger',
    451: 'Utilgjengelig av juridiske årsaker (RFC 7725)'
  }
};
