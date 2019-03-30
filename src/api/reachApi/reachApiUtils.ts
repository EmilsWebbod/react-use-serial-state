export function reachCreateError(
  code: number,
  message: string,
  details?: Response
) {
  return {
    code,
    message,
    details
  };
}
