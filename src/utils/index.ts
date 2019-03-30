export function reachQueryParam(params: string, param: string) {
  const regExp = new RegExp(`${param}=([^&]*)`, 'i');
  const _param = params.match(regExp);
  if (_param) {
    return _param[1];
  }
  return null;
}

export function goToRoot() {
  location.href = `${window.location.protocol}//${window.location.host}/`;
}
