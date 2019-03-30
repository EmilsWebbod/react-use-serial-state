import { FormEvent, useEffect, useRef, useState } from 'react';
import { ReachContentTypes, ReachError } from '../interface';
import { reachApi } from '../api';

interface Functions<T> {
  onEdit?: (data: T) => void;
  onDelete?: () => void;
  onCreate?: (data: T) => void;
  onSuccess?: (data?: T) => void;
}

interface Props<T extends Object> extends Functions<T> {
  url: string;
  id?: string;
  idKey?: keyof T;
  data?: Partial<T>;
  edit?: Partial<ReachEdit<T>>;
  initLoad?: boolean;
  autoSave?: ReachCrudMethods;
}

interface State<T extends Object> {
  body: Partial<T>;
  edit: ReachEdit<Partial<T>>;
  busy: boolean;
  hasData?: boolean;
  error?: ReachError;
  initLoad: boolean;
}

interface Options {
  value: string;
  label: string;
}

export type ReachEditOptions<T extends any = any> = {
  type: string;
  label?: string;
  edit?: boolean;
  placeholder?: string;
  required?: boolean;
  options?: Array<Options>;
  value?: T;
  alwaysPost?: boolean;
};

export type ReachCrudGetFn<T> = <K extends keyof T>(key: K) => ReachEditOptions;
export type ReachCrudSetFn<T> = <K extends keyof T>(key: K) => (e: any) => void;

export interface ReachActions<T extends Object> {
  state: State<T>;
  get: ReachCrudGetFn<T>;
  set: ReachCrudSetFn<T>;
  read: () => void;
  POST: () => Promise<undefined | T>;
  PUT: () => Promise<undefined | T>;
  PATCH: () => Promise<undefined | T>;
  DELETE: (autoConfirm?: boolean | any) => Promise<undefined | T> | undefined;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export type ReachEdit<T> = { [key in keyof T]: ReachEditOptions };

interface Object {
  _id?: string;

  [key: string]: any;
}

export type ReachCrudMethods = 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ReachCrudEdit<T> = Partial<ReachEdit<T>>;

export function useCrud<T extends Object>(props: Props<T>): ReachActions<T> {
  const {
    url,
    id,
    idKey = '_id',
    data = {},
    edit = {},
    initLoad,
    autoSave,
    ...functions
  } = props;

  const init = useRef(false);
  const [state, setState] = useState<State<T>>({
    body: data,
    edit: createEditBody(edit, data, Boolean(init.current)),
    busy: false,
    initLoad: false,
    hasData: Object.keys(data).length > 0
  });

  async function fetchData() {
    try {
      // @ts-ignore
      const dataId = id || data[idKey];
      const body = await reachApi(`${url}/${dataId}`);
      setState({
        ...state,
        body,
        edit: resetEdit(state.edit),
        busy: false,
        initLoad: true,
        hasData: true
      });
    } catch (e) {
      setState({ ...state, error: e, busy: false, initLoad: true });
    }
  }

  useEffect(() => {
    if (initLoad && !state.initLoad) {
      fetchData().then();
    }
  });

  async function read() {
    try {
      // @ts-ignore
      const dataId = id || data[idKey];
      setState({ ...state, busy: true });
      const body = await reachApi(`${url}/${dataId}`);
      setState({ ...state, body, edit: resetEdit(state.edit), busy: false });
    } catch (e) {
      setState({ ...state, error: e, busy: false });
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dataId = state.body[idKey];
    postData(dataId ? 'PATCH' : 'POST')();
  }

  function DELETE(autoConfirm = false) {
    if (autoConfirm || confirm('Er du sikker?')) {
      return postData('DELETE')();
    }
  }

  function postData(method: ReachCrudMethods) {
    return async function() {
      if (state.busy) {
        return;
      }
      let dataId = state.body[idKey];

      if (method === 'POST') {
        dataId = undefined;
      } else {
        if (!dataId) {
          throw new Error('Cant PUT PATCH or DELETE without id');
        }
      }

      try {
        const body = setBody(method, state);

        if (method === 'PUT' || method === 'POST') {
          if (body) {
            delete body[idKey];
          }
        }

        setState({ ...state, busy: true });
        let type: ReachContentTypes | undefined = undefined;

        if (body && (body.file || body.files)) {
          type = 'multipart/form-data';
        }

        let reachUrl = url + (dataId ? `/${dataId}` : '');
        const response = await reachApi<T>(reachUrl, { method, body, type });

        setState({
          ...state,
          edit: resetEdit(state.edit),
          body: { ...state.body, ...response },
          busy: false,
          error: undefined
        });

        handleSuccess(method, functions, response);
        return response;
      } catch (e) {
        setState({ ...state, error: e, busy: false });
        throw e;
      }
    };
  }

  function get<K extends keyof T>(key: K): ReachEditOptions {
    return {
      ...state.edit[key],
      ...(state.body[key] ? { value: state.body[key] } : {})
    };
  }

  function set<K extends keyof T>(key: K) {
    return async function(e: T[K] | any) {
      const value: T[K] =
        e && typeof e === 'object' && 'target' in e
          ? e.target && (e.target.value as T[K])
          : e;

      if (state.body[key] === value) {
        return;
      }

      state.body[key] = value;
      if (!state.edit[key]) {
        state.edit[key] = {
          ...state.edit[key],
          edit: true
        };
      } else {
        const isEqual = state.edit[key].value === value;
        const isNull = !state.edit[key].value && (!value || value === '');
        state.edit[key].edit = !(isEqual || isNull);
      }

      await setState({ ...state });
      if (autoSave) {
        await postData(autoSave)();
      }
    };
  }

  init.current = true;
  return {
    state,
    get,
    set,
    read,
    POST: postData('POST'),
    PUT: postData('PUT'),
    PATCH: postData('PATCH'),
    DELETE,
    onSubmit
  };
}

function createEditBody<T extends object>(
  edit: Partial<ReachEdit<T>>,
  body: T,
  init?: boolean
) {
  if (init) {
    return edit as ReachEdit<T>;
  }
  const obj: Partial<ReachEdit<T>> = edit;
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      if (!obj[key] || !('edit' in obj[key])) {
        // @ts-ignore
        obj[key] = {
          ...(obj[key] ? obj[key] : {}),
          edit: false,
          value: ''
        };
      }
    }
  }
  return obj as ReachEdit<T>;
}

function resetEdit<T extends object>(edit: ReachEdit<T>) {
  for (const key in edit) {
    if (edit.hasOwnProperty(key)) {
      edit[key].edit = false;
    }
  }
  return edit;
}

function setBody<T extends object>(method: ReachCrudMethods, state: State<T>) {
  let body;

  if (method === 'PUT' || method === 'POST') {
    body = { ...state.body };
  } else if (method === 'PATCH') {
    body = getEditedBody(state);
  }

  return body;
}

function getEditedBody<T extends object, K extends keyof T>(state: State<T>) {
  const retBody: Partial<T> = getDefaultBody(state);
  for (const key in state.body) {
    if (
      state.body.hasOwnProperty(key) &&
      state.edit[key] &&
      state.edit[key].edit
    ) {
      retBody[key] = state.body[key] || state.edit[key].value;
    }
  }
  return retBody;
}

function getDefaultBody<T extends object, K extends keyof T>(state: State<T>) {
  let body: Partial<T> = {};
  for (const key in state.edit) {
    if (state.edit.hasOwnProperty(key) && state.edit[key].alwaysPost) {
      body[key] = state.body[key] || state.edit[key].value;
    }
  }
  return body;
}

function handleSuccess<T>(
  method: ReachCrudMethods,
  functions: Functions<T>,
  res: T
) {
  const { onEdit, onCreate, onDelete, onSuccess } = functions;
  switch (method) {
    case 'PUT':
    case 'PATCH':
      if (typeof onEdit === 'function') {
        onEdit(res);
      }
      break;
    case 'POST':
      if (typeof onCreate === 'function') {
        onCreate(res);
      }
      break;
    case 'DELETE':
      if (typeof onDelete === 'function') {
        onDelete();
      }
  }

  if (typeof onSuccess === 'function') {
    onSuccess(res);
  }
}
