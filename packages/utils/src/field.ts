import {
  createContextId,
  type ReadonlySignal,
  useComputed$,
  useContext,
  useContextProvider,
  useId,
} from '@builder.io/qwik';

/**
 * Field を構成する各パーツの要素 ID。
 * `Field.Root` で生成され、必要に応じて `options.ids` で個別に上書きされます（`adr/0024`）。
 */
export interface FieldIds {
  /** フォームコントロール要素の `id` */
  control: string;
  /** ラベル要素の `id`（`<label for="...">` や `aria-labelledby` に対応） */
  label: string;
  /** 説明文要素の `id`（`aria-describedby` に対応） */
  description: string;
  /** エラーメッセージ要素の `id`（バリデーションエラー時の `aria-describedby` に対応） */
  errorMessage: string;
}

/**
 * `Field.Root` が子孫コンポーネントに提供する Context の値（`adr/0024`）。
 */
export interface FieldContext {
  /** Field を構成する各要素の ID */
  ids: FieldIds;
  /** 無効（エラー）状態かどうかを示す Signal */
  invalid: ReadonlySignal<boolean>;
  /** 無効化（disabled）されているかどうかを示す Signal */
  disabled: ReadonlySignal<boolean>;
  /** 必須項目かどうかを示す Signal */
  required: ReadonlySignal<boolean>;
  /** 説明文要素が存在するかどうかを示す Signal */
  hasDescription: ReadonlySignal<boolean>;
}

/**
 * Field の状態と ID を共有するための Context ID。
 */
export const fieldContextId = createContextId<FieldContext>('leve-ui.field');

/**
 * `useFieldProvider` のオプション。
 */
export interface UseFieldProviderOptions {
  /** 各要素の ID を個別に上書きする場合に指定 */
  ids?: Partial<FieldIds>;
  /** 無効（エラー）状態かどうかを示す Signal */
  invalid: ReadonlySignal<boolean>;
  /** 無効化（disabled）されているかどうかを示す Signal */
  disabled: ReadonlySignal<boolean>;
  /** 必須項目かどうかを示す Signal */
  required: ReadonlySignal<boolean>;
  /** 説明文要素が存在するかどうかを示す Signal */
  hasDescription: ReadonlySignal<boolean>;
}

/**
 * `Field.Root` 向けに各パーツの ID を生成し、Field Context を提供（provide）します（`adr/0024`）。
 *
 * `useId()` でベース ID を採番し、`${base}-control`、`${base}-label`、`${base}-description`、`${base}-error-message`
 * を構築します。`options.ids` が渡された場合は各パーツの ID を個別に上書きします。
 *
 * @param options ID の上書き設定および Field 状態の Signal 群
 * @returns 子コンポーネントに provide された `FieldContext`
 *
 * @example
 * const context = useFieldProvider({
 *   ids: props.ids,
 *   invalid: invalidSignal,
 *   disabled: disabledSignal,
 *   required: requiredSignal,
 *   hasDescription: hasDescriptionSignal,
 * });
 */
export const useFieldProvider = (options: UseFieldProviderOptions): FieldContext => {
  const base = useId();
  const ids: FieldIds = {
    control: options.ids?.control ?? `${base}-control`,
    label: options.ids?.label ?? `${base}-label`,
    description: options.ids?.description ?? `${base}-description`,
    errorMessage: options.ids?.errorMessage ?? `${base}-error-message`,
  };
  const context: FieldContext = {
    ids,
    invalid: options.invalid,
    disabled: options.disabled,
    required: options.required,
    hasDescription: options.hasDescription,
  };
  useContextProvider(fieldContextId, context);
  return context;
};

/**
 * Field 内のパーツ（`Label`、`Description`、`ErrorMessage` など）から Field Context を取得します。
 * Field の外で呼び出された場合は `null` を返します。
 *
 * @returns 現在の `FieldContext`、または Field 外の場合は `null`
 *
 * @example
 * const field = useFieldContext();
 * const labelId = field ? field.ids.label : undefined;
 */
export const useFieldContext = (): FieldContext | null => {
  return useContext(fieldContextId, null);
};

/**
 * `useFieldControl` のオプション。
 * フォームコントロールに渡された props（リアクティブなプロキシオブジェクト）をそのまま渡します。
 */
export interface UseFieldControlOptions {
  /** コントロール自身の `id`。Field 外のときに優先され、Field 内では Root の `ids.control` が優先されます */
  id?: string;
  /** コントロール単体での無効（エラー）フラグ */
  invalid?: boolean;
  /** コントロール単体での無効化フラグ */
  disabled?: boolean;
  /** コントロール単体での必須フラグ */
  required?: boolean;
  /** 利用者が直接指定した `aria-describedby` */
  'aria-describedby'?: string;
}

/**
 * `useFieldControl` が計算して返すフォームコントロールの解決済み状態。
 */
export interface FieldControlState {
  /** コントロール要素に設定する解決済み `id` */
  id: string;
  /** Field 内のラベル要素の ID。Field 外では `undefined`（非ネイティブのコントロールが `aria-labelledby` に利用） */
  labelId: string | undefined;
  /** 解決済みの `aria-describedby`。利用者の指定・Description・ErrorMessage（囲む Field が invalid の場合のみ）を空白で連結。空の場合は `undefined` */
  describedBy: string | undefined;
  /** 無効（エラー）状態（`options.invalid || field.invalid`） */
  invalid: boolean;
  /** 無効化状態（`options.disabled || field.disabled`） */
  disabled: boolean;
  /** 必須状態（`options.required || field.required`） */
  required: boolean;
}

/**
 * フォームコントロール（Checkbox、Switch、Input 等）で Field Context を購読し、
 * `id`、`aria-describedby`、`invalid`、`disabled`、`required` などを解決します（`adr/0024`）。
 *
 * - `useId()` と `useContext(fieldContextId, null)` を無条件に呼び出し、フックの実行順序を固定します。
 * - `options` プロパティは `useComputed$` 内で参照するため、Qwik の props プロキシをそのまま渡せます。
 * - Field 内では `field.ids.control` が優先され、Field 外では `options.id ?? generatedId` が使われます。
 * - `describedBy` は利用者の `aria-describedby`、説明文（`hasDescription` 時）、エラーメッセージ（囲む Field が invalid の時）を空白区切りで結合します。空の場合は `undefined` になります。
 *
 * @param options フォームコントロールの props
 * @returns 解決済み状態を保持する `ReadonlySignal<FieldControlState>`
 *
 * @example
 * const controlState = useFieldControl(props);
 * return (
 *   <input
 *     id={controlState.value.id}
 *     aria-describedby={controlState.value.describedBy}
 *     aria-invalid={controlState.value.invalid}
 *     disabled={controlState.value.disabled}
 *     required={controlState.value.required}
 *   />
 * );
 */
export const useFieldControl = (
  options: UseFieldControlOptions,
): ReadonlySignal<FieldControlState> => {
  const generatedId = useId();
  const field = useContext(fieldContextId, null);

  return useComputed$<FieldControlState>(() => {
    const id = field ? field.ids.control : (options.id ?? generatedId);
    const labelId = field?.ids.label;

    const invalid = Boolean(options.invalid) || Boolean(field?.invalid.value);
    const disabled = Boolean(options.disabled) || Boolean(field?.disabled.value);
    const required = Boolean(options.required) || Boolean(field?.required.value);

    const hasDescription = Boolean(field?.hasDescription.value);
    const ids = field?.ids;

    const rawDescribedBy = [
      options['aria-describedby'],
      hasDescription ? ids?.description : undefined,
      field?.invalid.value ? ids?.errorMessage : undefined,
    ];

    const parts = rawDescribedBy
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part));

    const describedBy = parts.length > 0 ? parts.join(' ') : undefined;

    return {
      id,
      labelId,
      describedBy,
      invalid,
      disabled,
      required,
    };
  });
};
