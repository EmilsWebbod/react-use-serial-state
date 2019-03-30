export function getKeyPathForObject(
  data: any,
  fields: string[],
  stepIndex: number,
  id: string
): string {
  let indexes = '';
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const arrIndex = getKeyPathForObject(d, fields, stepIndex, id);
      if (arrIndex !== '') {
        indexes += `${i},${arrIndex}`;
      }
    }
  } else if (fields[stepIndex] && data[fields[stepIndex]]) {
    const objIndex = getKeyPathForObject(
      data[fields[stepIndex]],
      fields,
      stepIndex + 1,
      id
    );
    if (objIndex) {
      indexes += `${fields[stepIndex]},${objIndex}`;
    }
  } else if (data._id && data._id === id) {
    return `true`;
  }
  return indexes;
}

export function updateDataFromKeyPath(
  path: string[],
  pathIndex: number,
  data: any,
  set: any
) {
  if (path[pathIndex] === 'true') {
    return set;
  }
  data[path[pathIndex]] = updateDataFromKeyPath(
    path,
    pathIndex + 1,
    data[path[pathIndex]],
    set
  );
  return data;
}
