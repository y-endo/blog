# SCSSコーディング規約

## ファイル構成

- コンポーネント固有のスタイルには、所有するTSXと同じ基底名の`*.module.scss`を使用します。
- デザイントークンは`src/styles/_tokens.scss`へまとめます。
- 共通関数は`src/styles/_functions.scss`へ置きます。
- 共通Mixinは`src/styles/_mixins.scss`へ置きます。
- ResetとHTML要素の基礎スタイルは`src/styles/foundation`配下へ置きます。
- コンポーネント単位のディレクトリは、付随ファイルが増えるまで作りません。

## Sass Moduleと依存方向

- `@use`では既定の名前空間を使用し、`as *`と不要な短縮Aliasは使用しません。
- `@use`はファイルの先頭へ置き、`@import`は使用しません。
- `_functions.scss`はSass組み込みModuleだけに依存できます。
- `_tokens.scss`は共通関数、`_mixins.scss`は共通関数とTokenに依存できます。
- FoundationとCSS Moduleは共通関数、Token、Mixinを利用できます。
- 共通SCSSからFoundationやCSS Moduleを読み込みません。
- CSS Module同士を読み込みません。共有する見た目はReactコンポーネントとして共有します。
- `@forward`による集約ファイルは、必要性が生じるまで作りません。

```scss
@use "../styles/functions";
@use "../styles/mixins";
@use "../styles/tokens";

.card {
  font-size: functions.rem(16);
  padding: tokens.$space-4;

  @include mixins.tablet {
    padding: tokens.$space-6;
  }

  @include mixins.pc {
    padding: tokens.$space-8;
  }
}
```

## スコープとセレクター

- `globals.scss`はRoot Layoutから一度だけ読み込み、`:root`、Reset、HTML要素の基礎スタイルだけを定義します。
- コンポーネント固有のクラスをグローバルへ置きません。
- `:global()`は、外部ライブラリなどローカルクラスでは指定できない場合だけ使用します。
- CSS Moduleのクラス名には`camelCase`を使用し、BEMは使用しません。
- IDセレクターをスタイリングに使用しません。
- HTML構造をそのまま深くネストせず、疑似クラス、疑似要素、状態、所有関係が明確な子要素だけをネストします。
- クラスには見た目ではなく役割を表す名前を付けます。
- Universal SelectorはFoundationの`box-sizing` Resetだけに使用できます。

## Tokenと値

- 複数箇所で共有する色、余白、書体、ブレークポイントをTokenとして定義します。
- コンポーネント固有の一度しか使わない値は、先回りしてToken化しません。
- Sass変数はビルド時の共有値と計算に使用します。
- CSS Custom Propertiesはカスケード、テーマ、実行時の上書きが必要な値に使用します。
- `0`、`transparent`、`currentColor`、`inherit`など、CSS自体が意味を持つ値はToken化しません。
- SCSS変数、関数、Mixin、CSS Custom Propertiesには`kebab-case`を使用します。

## 単位とタイポグラフィ

- `font-size`の値は`functions.rem()`で定義し、単位なしのpx相当値を渡します。
- `line-height`には単位なしの値を使用します。
- 余白には既存のSpacing Tokenを優先します。
- 1pxの境界線など拡大させるべきでない値には`px`を使用できます。
- 書字方向に追従すべき余白やサイズにはLogical Propertiesを使用し、左右を固定する意図がある場合はPhysical Propertiesを使用できます。

## レスポンシブ対応

- スマートフォンレイアウトをメディアクエリーのない基準スタイルとして実装します。
- Viewport基準の変更には`mixins.tablet`と`mixins.pc`を使用し、対象セレクターの宣言ブロック内へ入れ子で記述します。
- コンポーネント自身の幅に応じた変更が必要な場合だけContainer Queryを検討します。
- `hover`は対応端末に限定し、タッチ操作だけに依存しません。
- `vh`を無条件に使わず、目的に応じて`svh`または`dvh`を選びます。

## FocusとMotion

- `outline: none`だけでフォーカス表示を消しません。
- 独自のフォーカス表示には`:focus-visible`を使用します。
- Hoverで示す操作状態には、キーボード操作時の同等状態を用意します。
- 単純な状態変化にはCSS Transitionを使用し、`transition: all`は使用しません。
- アニメーションには原則として`opacity`と`transform`を使用します。
- 不要な動きは`mixins.reduced-motion`で個別に停止または簡略化します。
- GSAPはCSSだけでは扱いにくい時系列制御が必要な場合だけ使用します。
