# TypeScript、React、Next.jsコーディング規約

## 型

- TypeScriptの`strict`設定を維持します。
- `any`は使用せず、外部入力には`unknown`を使用して検証後に型を絞ります。
- 型だけを読み込む場合は`import type`を使用します。
- 型アサーションと非nullアサーションは、コード上で安全性を保証できる理由がある場合に限ります。
- コンポーネントのPropsは`Readonly`で定義し、`<ComponentName>Props`と命名します。
- Props型はコンポーネントと同じファイルへ置き、外部から利用する場合だけエクスポートします。
- 型は所有する処理の近くへ置き、再利用されていない型を共通ディレクトリへ移しません。

## ディレクトリと依存方向

- アプリケーションコードは`src`配下へ置きます。
- ルート固有のコンポーネントとロジックは、対応するRoute Segmentの`_components`と`_lib`へ置きます。
- Root Layoutが所有するUIとロジックは、必要になった時点で`src/app/_components`と`src/app/_lib`へ置きます。
- 複数の無関係なルートで利用するUIだけを`src/components`へ、UIを持たないロジックだけを`src/lib`へ移します。
- `features`、`hooks`、`types`、`utils`などのトップレベルディレクトリは、実際の必要性が生じるまで作りません。
- Route Groupは、URLを変えずにレイアウトやセクションを分ける必要がある場合だけ使用します。
- ルート固有コードは共通コードを読み込めますが、共通コードからルート固有コードを読み込みません。
- `src/components`は`src/lib`を読み込めますが、`src/lib`から`src/app`や`src/components`を読み込みません。
- 内部モジュールの読み込みには`@/`エイリアスを使用し、Barrel Exportは原則作りません。

## 命名

- 通常のディレクトリ、Route Segment、TypeScriptファイル、TSXファイルには`kebab-case`を使用します。
- Next.jsの予約ファイル、動的セグメント、Route Group、Private FolderはNext.jsの規則を優先します。
- Reactコンポーネントと型には`PascalCase`、関数、変数、引数には`camelCase`を使用します。
- 型名へ`I`や`T`など種類を表す接頭辞を付けません。
- カスタムHookは`use`に続けて目的を表す名前を付け、Hookを利用しない関数へ`use`を付けません。
- コンポーネントへ渡すイベントは`onSelect`、内部のイベント処理は`handleSelect`のように命名します。
- 真偽値は自然な場合に`is`、`has`、`can`、`should`から始めます。
- Route Componentは`<RouteName>Page`、Layoutは`<Scope>Layout`のように役割が分かる名前を付けます。

## React

- レンダリング中にProps、State、Context、外部変数を変更せず、同じ入力から同じJSXを返します。
- `React.FC`は使用せず、通常の関数と明示したProps型を使用します。
- 再利用、独立した責務、可読性の改善が必要になった場合だけコンポーネントを分割します。
- Propsや既存のStateから計算できる値をStateへ保存しません。
- PropsをStateへ複製しません。初期値としてだけ使うPropsは`initial`または`default`から始めます。
- Stateは利用する最も近い共通祖先に置き、共有・復元すべき状態はURLへ置きます。
- `useEffect`はブラウザーAPI、外部ライブラリ、購読などReact外部との同期にだけ使用します。
- ユーザー操作による処理はイベントハンドラーで実行し、必要なEffectはcleanupを返します。
- `useMemo`、`useCallback`、`memo`は、計測で問題を確認した場合または参照同一性が要件になる場合だけ使用します。

## Next.js

- Server Componentを既定とします。
- `"use client"`は、Server Componentから直接利用するClient Componentの入口だけに付けます。
- State、イベント、Effect、ブラウザーAPIが必要な最小範囲だけをClient Componentにします。
- Server ComponentからClient Componentへ渡すPropsはシリアライズ可能な値に限定します。
- Client ComponentからServer専用モジュールを読み込みません。
- `page.tsx`と`layout.tsx`は、データ取得と画面構成の調整を主な責務とします。小さな処理は形式的に分割しません。
- 再利用するコンポーネントは名前付きエクスポートとし、Next.jsが要求するRoute Fileではデフォルトエクスポートを使用します。
- Server Componentの処理はビルド時に完了できるものに限定します。
- 動的ルートはビルド時にパスを列挙し、Cookie、Header、書き換え、実行時Route HandlerなどStatic Exportで利用できない機能へ依存しません。
- `window`、`localStorage`、`navigator`はレンダリング中に直接参照せず、Client ComponentのイベントまたはEffectから利用します。
- Static Exportで利用可能か不明な機能は、導入前に現在の公式資料とビルドで確認します。

## 品質

- HTML要素は見た目ではなく意味で選びます。
- インタラクティブな要素はキーボード操作とフォーカス表示を維持します。
- 外部入力、Frontmatter、環境変数は利用前に検証します。
