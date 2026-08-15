export const postModules = import.meta.glob("./posts/*.mdx", {
  base: "../../content",
  import: "default",
});
